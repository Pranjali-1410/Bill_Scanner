
# Bill Processing Application

This application provides OCR-based utility bill processing and storage.

## Project Structure

- `src/`: Frontend React code
- `backend/`: Python Flask backend for OCR processing

## Setup Instructions

### 1. Frontend Setup

1. Install Node.js and npm if not already installed
2. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-folder>
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the frontend development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:8080

### 2. Backend Setup

1. Navigate to the backend folder:
   ```
   cd backend
   ```

2. Create a Python virtual environment:
   ```
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the requirements:
   ```
   pip install -r requirements.txt
   ```

4. Create a PostgreSQL database:
   - Open pgAdmin
   - Create a new database named `bill_db`
   - Or use an existing database by setting environment variables

5. (Optional) Set environment variables:
   ```
   # Windows
   set DB_NAME=bill_db
   set DB_USER=postgres
   set DB_PASSWORD=your_password
   set DB_HOST=localhost
   set DB_PORT=5432

   # Mac/Linux
   export DB_NAME=bill_db
   export DB_USER=postgres
   export DB_PASSWORD=your_password
   export DB_HOST=localhost
   export DB_PORT=5432
   ```

6. Create an 'uploads' folder:
   ```
   mkdir uploads
   ```

7. Install Tesseract OCR:
   - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki
   - Mac: `brew install tesseract`
   - Linux: `sudo apt-get install tesseract-ocr`

8. Start the backend server:
   ```
   python server.py
   ```
   The API will be available at http://localhost:5000

## Testing the Application

1. Make sure both frontend and backend servers are running
2. Navigate to http://localhost:8080 in your browser
3. Upload a utility bill file (PDF, JPG, PNG)
4. Process the file with the OCR scanner
5. View the extracted data
6. Save the data to the database
7. View all records in the database table

## Troubleshooting

- If the backend connection fails, ensure the Flask server is running on port 5000
- If the database connection fails, check your PostgreSQL credentials and database existence
- For Tesseract OCR issues, verify it's correctly installed and accessible in your PATH

## Technology Stack

- Frontend: React, TypeScript, Tailwind CSS, shadcn-ui
- Backend: Flask, OpenCV, Pytesseract, PostgreSQL
