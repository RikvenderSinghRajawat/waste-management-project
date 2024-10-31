# waste-management-project
Waste Management System 
The **Waste Management System** project is a web-based platform aimed at efficiently managing waste-related activities within a community. It allows users to register, log in, and access features such as submitting waste collection records, filing complaints, and viewing waste trends. After logging in, users see a dashboard with three primary options: view complaints, submit waste collection data, and check waste trends. The system encourages users to upload complaints, which are visible to all users, helping to identify and address waste-related issues. Additionally, the platform displays a collection of waste images and provides visual data on waste trends across different categories like plastic, organic, metal, and glass, aiding in understanding waste management's impact and patterns over time. The system is designed with a clean, professional interface, making it easy to use and visually appealing, with separate CSS for each page to enhance responsiveness and functionality.

waste-management-system/
├── backend/
│   ├── templates/               # HTML files
│   │   ├── index.html           # Login/Registration page
│   │   ├── dashboard.html       # User dashboard page
│   │   ├── complaints.html      # Complaints page for logged-in users
│   │   ├── waste_collection.html# Waste collection submission page
│   │   └── waste_trends.html    # Waste trends visualization page
│   ├── app.py                   # Main Flask application file
│   ├── requirements.txt         # Python dependencies
│   ├── __init__.py              # For package initialization
│   ├── config.py                # Configuration file for database settings
│   ├── static/
│   │   ├── css/                 # Separate CSS files for each HTML page
│   │   │   ├── style.css        # General styling
│   │   │   ├── dashboard.css    # Styling for the dashboard page
│   │   │   ├── complaints.css   # Styling for complaints page
│   │   │   ├── waste_collection.css # Styling for waste collection page
│   │   │   └── waste_trends.css # Styling for waste trends page
│   │   ├── js/                  # JavaScript files for each HTML page
│   │   │   ├── main.js          # General scripts
│   │   │   ├── dashboard.js     # Scripts for dashboard page
│   │   │   ├── complaints.js    # Scripts for complaints page
│   │   │   ├── waste_collection.js # Scripts for waste collection page
│   │   │   └── waste_trends.js  # Scripts for waste trends page
│   │   └── images/              # Image assets (backgrounds, logos, etc.)
│

│
├── database/
│   ├── waste_management.sql     # SQL file for creating necessary tables
│   └── migrations/              # Folder for database migration files
│       └── initial.sql          # Initial database migration script
│
├── README.md                    # Documentation about the project
└── .gitignore                   # Git ignore file to exclude unnecessary files
