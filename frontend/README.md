CampusGuide AI – College Information Chatbot

A smart, PDF-powered college information assistant built using Flask, Gemini AI, and a clean frontend interface.
This chatbot can answer questions about your college, departments, fees, timings, curriculum, and other details by reading PDF documents provided in the backend.
It can also answer general questions using AI reasoning.

Features


PDF-based Question Answering
Extracts information from multiple PDFs for accurate college-related responses.

AI Chatbot (Gemini 2.0 Flash)
Handles natural conversations and general knowledge questions.

Session Memory
Maintains chat history within each session for smoother interactions.

Date & Time Detection
Automatically responds to date/time-related queries.

CORS-enabled Flask Backend
Clean API structure with a single /chat endpoint.

Responsive Frontend Chat UI
Works in any browser and supports real-time messaging.

Project Structure
Clg_Agent-main/
│── BACKEND_PYTHON/
│   ├── app.py
│   ├── college.pdf
│   ├── bb.pdf
│   ├── SHIFT 1 UG & PG.pdf
│   ├── .env
│   ├── requirements.txt
│
└── FRONTEND/
    ├── index.html
    ├── style.css
    └── script.js

Tech Stack
Backend

Python 3

Flask

Flask-CORS

PyPDF2

google-generativeai

python-dotenv

Frontend

HTML

CSS

JavaScript

How to Run the Project
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME/BACKEND_PYTHON

2. Install Dependencies
pip install -r requirements.txt

3. Add Environment Variables

Create a .env file inside the BACKEND_PYTHON folder:

GEMINI_API_KEY=your_key_here

4. Start the Flask Backend
python app.py


The server will run at:

http://127.0.0.1:4000

5. Run the Frontend

Open FRONTEND/index.html in any browser
or use Live Server in VS Code.

API Endpoint
POST /chat

Request Body (JSON):

{
  "message": "Your question here",
  "sessionId": "unique-session-id"
}


Response:

{
  "reply": "AI response here"
}

Security Notes

Do not upload your .env file to GitHub.

The .gitignore prevents sensitive files from being committed.

API keys must always be stored in backend only.

Future Improvements

Add vector embeddings for more accurate responses

Admin panel for uploading new PDFs

Deploy backend (Render/Railway)

Deploy frontend (Vercel/Netlify)

Add student login system

Author

Mustansir Sunelwala
Final Year Project – College Information Chatbot
