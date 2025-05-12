
#!/bin/bash
echo "Starting KPMG Bill Processing Application..."

# Start the Python backend
echo "Starting the Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py &
cd ..

# Start the React frontend
echo "Starting the React frontend..."
npm install
npm run dev

echo "Application startup initiated. Please wait a few moments for both servers to start."
echo "Frontend will be available at: http://localhost:8080"
echo "Backend will be available at: http://localhost:5000"
