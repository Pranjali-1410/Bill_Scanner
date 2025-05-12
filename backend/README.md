
# Bill Processing Backend

This Flask backend provides OCR and database services for processing utility bill documents.

## Setup Instructions

1. Install Python 3.8 or higher if not already installed

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`

4. Install the dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Install Tesseract OCR:
   - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - Mac: `brew install tesseract`
   - Linux: `sudo apt-get install tesseract-ocr`

6. Install PostgreSQL and create a database named "bill_db"

7. Set environment variables (optional):
   ```
   export TESSERACT_CMD=/path/to/tesseract
   export DB_NAME=bill_db
   export DB_USER=your_user
   export DB_PASSWORD=your_password
   export DB_HOST=localhost
   export DB_PORT=5432
   ```

8. Create an uploads folder:
   ```
   mkdir uploads
   ```

9. Run the server:
   ```
   python server.py
   ```

The server will be available at http://localhost:5000.

## API Endpoints

- `GET /`: Check if API is running
- `POST /upload`: Upload a file (PDF, JPG, JPEG, PNG)
- `POST /scan`: Process an uploaded file
- `POST /upload-bill`: Save extracted data to the database
- `GET /get-all-bills`: Retrieve all bills from the database
