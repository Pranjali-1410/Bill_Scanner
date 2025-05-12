
@echo off
echo Starting KPMG Bill Processing Application...

echo Starting the Python backend...
start cmd /k "cd backend && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python server.py"

echo Starting the React frontend...
start cmd /k "npm install && npm run dev"

echo Application startup initiated. Please wait a few moments for both servers to start.
echo Frontend will be available at: http://localhost:8080
echo Backend will be available at: http://localhost:5000
