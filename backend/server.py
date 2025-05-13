
from flask import Flask, request, jsonify
from flask_cors import CORS
from pdf2image import convert_from_path
import cv2, numpy as np, pytesseract, re, os
import logging
import psycopg2
from contextlib import closing
import datetime

app = Flask(__name__)
# Enable CORS for all routes and origins with additional configurations
CORS(app, resources={r"/*": {"origins": "*", "supports_credentials": True, "expose_headers": ["Content-Type", "X-CSRFToken"]}})

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Tesseract configuration - make it work on different OS
if os.name == 'nt':  # Windows
    pytesseract.pytesseract.tesseract_cmd = os.getenv(
        'TESSERACT_CMD', r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    )
else:  # Mac/Linux
    pytesseract.pytesseract.tesseract_cmd = os.getenv('TESSERACT_CMD', r'/usr/bin/tesseract')

# Database credentials from environment variables with safe defaults
DB_NAME = os.getenv('DB_NAME', 'bill_db')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')

# Database connection function
def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        logger.info("Database connection successful")
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise

# Try connecting to the database
try:
    conn = get_db_connection()
    cursor = conn.cursor()
    logger.info("Database connection successful.")
    
    # Create table if it doesn't exist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS bill_data (
        Stand_No TEXT,
        Street_No TEXT,
        Stand_valuation TEXT,
        ACC_No BIGINT PRIMARY KEY,
        Route_No TEXT,
        Deposit TEXT,
        Guarantee TEXT,
        Acc_Date TEXT,
        Improvements TEXT,
        Payments_up_to TEXT,
        VAT_Reg_No TEXT,
        Balance_B_F TEXT,
        Payments TEXT,
        Sub_total TEXT,
        Month_total TEXT,
        Total_due TEXT,
        Over_90 TEXT,
        Ninety_days TEXT,
        Sixty_days TEXT,
        Thirty_days TEXT,
        Current TEXT,
        Due_Date TEXT
    );
    """)
    
    conn.commit()
    cursor.close()
    logger.info("Table schema updated successfully!")
    
    conn.close()
    logger.info("Table schema verified successfully!")
except Exception as e:
    logger.error(f"Database error: {e}")
    logger.error("Please make sure PostgreSQL is running and the 'bill_db' database exists")

# ... keep existing code (OCR & Extraction Logic and process_invoice function)

# === Routes ===
@app.route('/')
def home():
    # Add CORS headers to the response to allow cross-origin requests
    response = jsonify({'message': 'API is running'})
    return response, 200

@app.route('/upload-bill', methods=['POST', 'OPTIONS'])
def upload_bill():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
        return response
        
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        logger.info(f"Received data: {data}")
            
        # Extract account number to use as primary key
        acc_no = data.get('ACC_No')
        if not acc_no:
            return jsonify({'error': 'Missing ACC_No field'}), 400
            
        # Convert acc_no to integer for database
        try:
            acc_no = int(acc_no)
        except ValueError:
            return jsonify({'error': 'ACC_No must be a number'}), 400
            
        # Prepare field values for database
        fields = [
            'Stand_No', 'Street_No', 'Stand_valuation', 'ACC_No', 'Route_No',
            'Deposit', 'Guarantee', 'Acc_Date', 'Improvements', 'Payments_up_to',
            'VAT_Reg_No', 'Balance_B_F', 'Payments', 'Sub_total', 'Month_total',
            'Total_due', 'Over_90', 'Ninety_days', 'Sixty_days', 'Thirty_days',
            'Current', 'Due_Date'
        ]
        
        # Create placeholders for SQL query
        placeholders = ', '.join(['%s'] * len(fields))
        columns = ', '.join(fields)
        
        # Get values from the incoming data
        values = [data.get(field) for field in fields]
        
        logger.info(f"Fields: {fields}")
        logger.info(f"Values: {values}")
        
        # Insert into database
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                query = f"""
                    INSERT INTO bill_data ({columns})
                    VALUES ({placeholders})
                    ON CONFLICT (ACC_No) 
                    DO UPDATE SET 
                    {', '.join([f"{field} = EXCLUDED.{field}" for field in fields if field != 'ACC_No'])};
                """
                logger.info(f"Executing query: {query}")
                cursor.execute(query, values)
                conn.commit()
                logger.info("Data inserted/updated successfully")
                
        return jsonify({'message': 'Bill data saved to database successfully'}), 200
        
    except Exception as e:
        logger.error(f"Error saving bill data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/get-all-bills', methods=['GET', 'OPTIONS'])
def get_all_bills():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
        return response
        
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM bill_data")
                columns = [desc[0] for desc in cursor.description]
                
                # Convert column names to title case for better readability
                formatted_columns = [col for col in columns]
                
                logger.info(f"Query columns: {formatted_columns}")
                
                # Fetch all rows and convert to dictionaries with proper column names
                rows = cursor.fetchall()
                results = []
                
                for row in rows:
                    # Create a dictionary that maps column names to row values
                    row_dict = dict(zip(formatted_columns, row))
                    results.append(row_dict)
                
                logger.info(f"Fetched {len(results)} records from database")
                
                response = jsonify({'success': True, 'data': results})
                return response, 200
    except Exception as e:
        logger.error(f"Error fetching bills: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/upload', methods=['POST', 'OPTIONS'])
def upload_pdf():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
        return response
        
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)
    logger.info(f"File saved at {file_path}")

    return jsonify({'message': 'File uploaded successfully', 'filePath': file_path})

@app.route('/scan', methods=['POST', 'OPTIONS'])
def scan_pdf():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
        return response
        
    data = request.get_json()
    file_path = data.get('filePath')

    if not file_path or not os.path.exists(file_path):
        return jsonify({'error': 'Invalid or missing file path'}), 400
        
    logger.info(f"Scanning file: {file_path}")
    result = process_invoice(file_path)
    return jsonify(result)

@app.route('/recent-files', methods=['GET', 'OPTIONS'])
def recent_files():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
        return response
        
    try:
        # Get list of files in the uploads directory
        files = []
        for filename in os.listdir(UPLOAD_FOLDER):
            if os.path.isfile(os.path.join(UPLOAD_FOLDER, filename)):
                file_path = os.path.join(UPLOAD_FOLDER, filename)
                # Get file creation time
                creation_time = os.path.getctime(file_path)
                creation_date = datetime.datetime.fromtimestamp(creation_time)
                days_old = (datetime.datetime.now() - creation_date).days
                
                # Add file to the list
                files.append({
                    'name': filename,
                    'createdDays': days_old if days_old > 0 else 1
                })
                
        # Sort files by creation date (newest first)
        files.sort(key=lambda x: x['createdDays'])
        
        # Return the 10 most recent files
        return jsonify({'success': True, 'files': files[:10]}), 200
        
    except Exception as e:
        logger.error(f"Error getting recent files: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/delete-bills', methods=['DELETE', 'OPTIONS'])
def delete_bills():
    if request.method == 'OPTIONS':
        # Handle preflight request
        response = app.make_default_options_response()
        return response
        
    try:
        data = request.get_json()
        account_numbers = data.get('accountNumbers', [])
        
        if not account_numbers:
            return jsonify({'error': 'No account numbers provided'}), 400
            
        logger.info(f"Deleting bills with account numbers: {account_numbers}")
        
        # Convert any string account numbers to integers 
        account_numbers = [int(acc_no) if isinstance(acc_no, str) else acc_no for acc_no in account_numbers]
        
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                # Use parameterized query for security
                placeholders = ', '.join(['%s'] * len(account_numbers))
                query = f"DELETE FROM bill_data WHERE ACC_No IN ({placeholders})"
                
                logger.info(f"Executing delete query with account numbers: {account_numbers}")
                cursor.execute(query, account_numbers)
                deleted_count = cursor.rowcount
                conn.commit()
                
                logger.info(f"Deleted {deleted_count} records from database")
                
                return jsonify({
                    'success': True, 
                    'message': f'Successfully deleted {deleted_count} records'
                }), 200
                
    except Exception as e:
        logger.error(f"Error deleting bills: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server on http://localhost:5000")
    print("Make sure you have PostgreSQL running with a database named 'bill_db'")
    app.run(debug=True, port=5000, host='0.0.0.0')  # Update to listen on all interfaces
