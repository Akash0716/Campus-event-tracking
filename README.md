# Campus-event-tracking
Campus Event Tracker
The Campus Event Tracker is a full-stack web application designed to streamline event discovery and management within a college ecosystem. It allows students to securely authenticate, browse upcoming activities, and stay engaged with campus life in real-time.

🚀 Key Features
Student Authentication: Secure Signup and Login functionality powered by Firebase.

Real-Time Event Dashboard: A dynamic interface where students can view and track live campus events.

Persistent Data Storage: Robust backend integration using Cloud Firestore to ensure data integrity.

Responsive Templating: Utilizes EJS (Embedded JavaScript) for server-side rendering of dynamic content.

🛠️ Tech Stack
Frontend: HTML5, CSS3, EJS Templates.

Backend: Node.js, Express.js.

Database & Auth: Firebase Admin SDK.

Security: .gitignore and environment variable support to prevent credential leaks.

📁 Project Architecture
Plaintext
CAMPUS-EVENT-TRACKER/
├── public/                # Static assets (client-side JS, CSS, index.html)
├── views/                 # EJS view templates (dashboard, login, signup)
├── db.js                  # Database connection and Firebase initialization
├── index.js               # Main Express server entry point
├── package.json           # Node.js project metadata and dependencies
├── .gitignore             # Essential for preventing sensitive data uploads
└── serviceAccountKey.json # Private Firebase credentials (Git-ignored)
⚙️ Installation & Setup
Clone the Repository:

Bash
git clone <your-github-repo-url>
cd CAMPUS-EVENT-TRACKER
Install Dependencies:

Bash
npm install
Firebase Configuration:
Place your serviceAccountKey.json file in the root directory. Ensure it is listed in your .gitignore to keep it off public repositories.

Run the Application:

Bash
node index.js
