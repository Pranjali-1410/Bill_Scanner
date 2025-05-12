
from flask import Flask, request, jsonify
from flask_cors import CORS
from pdf2image import convert_from_path
import cv2, numpy as np, pytesseract, re, os
import logging
import psycopg2
from contextlib import closing

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Tesseract configuration
pytesseract.pytesseract.tesseract_cmd = os.getenv(
    'TESSERACT_CMD', r'C:\Program Files\Tesseract-OCR\tesseract.exe'
)

# Database credentials from environment variables
DB_NAME = os.getenv('DB_NAME', 'bill_db')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'Soumyadev@11')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')

# Database connection function
def get_db_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )

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

# === OCR & Extraction Logic ===
def process_invoice(pdf_path):
    try:
        # 1. Convert PDF to images
        pages = convert_from_path(pdf_path, dpi=300)
        cv_images = [cv2.cvtColor(np.array(p), cv2.COLOR_RGB2BGR) for p in pages]
        invoice = cv2.vconcat(cv_images)

        # 2. Preprocess
        gray = cv2.cvtColor(invoice, cv2.COLOR_BGR2GRAY)
        gray = cv2.bilateralFilter(gray, 9, 75, 75)
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 21, 10
        )

        # 3. OCR
        ocr_raw = pytesseract.image_to_string(thresh, lang='eng')
        lines = [L.strip() for L in ocr_raw.splitlines() if L.strip()]
        full_text = re.sub(r'\s+', ' ', ocr_raw)

        # 4. Identify header/footer
        ix = next((i for i, L in enumerate(lines) if 'Stand No' in L), len(lines))
        first_5_customer = lines[:min(ix, 5)]
        f_ix = next((i for i, L in enumerate(lines) if 'Phone:' in L), None)
        footer_block = (lines[max(f_ix - 6, 0):f_ix + 1] if f_ix is not None else [])

        # 5. Patterns
        patterns = {
            'Stand_No': r'Stand\s*No[:\s\-]*([A-Za-z0-9\*]+)',
            'Street_No': r'Street\s*No.*?([A-Za-z0-9,\s]+?)\s{2,}',
            'Stand_valuation': r'Valuation.*?(\d[\d,\.]*)',
            'ACC_No': r'Acc\s*No.*?(\d{6,})',
            'Route_No': r'Route\s*No.*?([A-Za-z0-9-]+)',
            'Deposit': r'Deposit.*?(\d[\d,\.]*)',
            'Guarantee': r'Guarantee.*?(\d[\d,\.]*)',
            'Acc_Date': r'Acc\s*Date.*?([A-Za-z]+\s+\d{4})',
            'Improvements': r'Improvements.*?(\d[\d,\.]*)',
            'Payments_up_to': r'Payments\s*up to.*?([\d/]{6,10})',
            'VAT_Reg_No': r'VAT\s*REG.*?(\d+)',
            'Balance_B_F': r'Balance\s*B\/F.*?([-\d,\.]+)',
            'Payments': r'Payments(?!\s*up to).*?([-\d,\.]+)',
            'Sub_total': r'Sub\s*total.*?([-\d,\.]+)',
            'Month_total': r'Month\s*total.*?([-\d,\.]+)',
            'Total_due': r'Total\s*due.*?([-\d,\.]+)',
            'Over_90': r'Over\s*90.*?([0-9,\.]+)',
            'Ninety_days': r'90\s*Days.*?([0-9,\.]+)',
            'Sixty_days': r'60\s*Days.*?([0-9,\.]+)',
            'Thirty_days': r'30\s*Days.*?([0-9,\.]+)',
            'Current': r'Current.*?([0-9,\.]+)',
            'Due_Date': r'Due\s*Date.*?([\d\/]+)',
            
        }

        # 6. Extract fields
        results = {key: (re.search(rx, full_text, re.IGNORECASE | re.DOTALL).group(1).strip()
                         if re.search(rx, full_text, re.IGNORECASE | re.DOTALL)
                         else None)
                   for key, rx in patterns.items()}

        # Add extra results
        results['First 5 Customer Rows'] = first_5_customer
        results['Footer Block'] = footer_block

        return {'success': True, 'results': results}

    except Exception as e:
        return {'success': False, 'error': str(e)}

# === Routes ===
@app.route('/')
def home():
    return jsonify({'message': 'API is running'}), 200

@app.route('/upload-bill', methods=['POST'])
def upload_bill():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
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
                cursor.execute(query, values)
                conn.commit()
                
        return jsonify({'message': 'Bill data saved to database successfully'}), 200
        
    except Exception as e:
        logger.error(f"Error saving bill data: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/get-all-bills', methods=['GET'])
def get_all_bills():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM bill_data")
                columns = [desc[0] for desc in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
                return jsonify({'success': True, 'data': results}), 200
    except Exception as e:
        logger.error(f"Error fetching bills: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    return jsonify({'message': 'File uploaded successfully', 'filePath': file_path})

@app.route('/scan', methods=['POST'])
def scan_pdf():
    data = request.get_json()
    file_path = data.get('filePath')

    if not file_path or not os.path.exists(file_path):
        return jsonify({'error': 'Invalid or missing file path'}), 400

    result = process_invoice(file_path)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
