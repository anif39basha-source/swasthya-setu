
# 🏥 SwasthyaSetu

## Rural Healthcare Access & Smart Referral Platform

SwasthyaSetu is a web-based healthcare access and care-coordination platform designed to help rural citizens connect with healthcare facilities, health workers, and essential healthcare services.

The platform brings healthcare facility discovery, appointment booking, medicine availability, referral tracking, patient management, and healthcare administration together in one place. It aims to improve continuity of care and make healthcare information more accessible to rural communities.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Features](#-features)
- [System Workflow](#-system-workflow)
- [Technology Stack](#️-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Database Setup](#️-database-setup)
- [Environment Configuration](#-environment-configuration)
- [Security](#-security)
- [Future Enhancements](#-future-enhancements)
- [Disclaimer](#️-disclaimer)
- [License](#-license)

---

## 🌟 Project Overview

Rural communities may face challenges accessing healthcare due to long travel distances, limited specialist availability, fragmented medical information, delayed referrals, and insufficient information about available medicines and healthcare facilities.

SwasthyaSetu provides a centralized digital platform that connects citizens, health workers, healthcare facilities, and administrators.

The application is designed with multilingual access, responsive interfaces, and offline-friendly functionality to support users in different environments.

## 🎯 Problem Statement

Rural and underserved communities may experience:

- Limited awareness of nearby healthcare facilities and services.
- Difficulties finding appropriate healthcare facilities.
- Delays in appointment booking and referrals.
- Limited visibility of medicine availability.
- Fragmented patient information across healthcare facilities.
- Challenges coordinating follow-up care.
- Language and connectivity barriers.
- Additional travel and waiting time when services are unavailable locally.

## 🎯 Objectives

- Improve access to healthcare information.
- Help citizens discover suitable healthcare facilities.
- Simplify appointment booking and tracking.
- Improve visibility of medicine availability.
- Support patient and referral management.
- Assist frontline health workers with healthcare coordination.
- Provide centralized administrative management and analytics.
- Improve accessibility through multilingual and offline-friendly features.
>>>>>>> c1fad74 (Update SwasthyaSetu README)

---

## 🌟 Features

<<<<<<< HEAD
### 👨‍👩‍👧 For Citizens

- 🏥 Find nearby healthcare facilities
- 🤖 AI Health Assistant for general health guidance
- 📅 Book healthcare appointments
- 💊 Check medicine availability
- 🚑 Find emergency healthcare facilities
- 📋 Track referrals
- 📱 Offline support through PWA
- 🌐 Multilingual interface
- 🗺️ Map-based healthcare facility search

---

### 👩‍⚕️ For Health Workers

- 👥 Register and manage patients
- 📅 Manage patient appointments
- 📋 Create and track referrals
- 💊 Manage medicine availability
- 📊 View healthcare worker dashboard
- 🏥 Access healthcare facility information
- 🔄 Manage assigned patient services

---

### 🛡️ For Administrators

- 📊 Analytics dashboard
- 👥 User management
- 🏥 Healthcare facility management
- 👨‍⚕️ Doctor management
- 💊 Medicine inventory management
- 📈 View system statistics and reports

---

## 🌐 Multilingual Support

SwasthyaSetu supports multiple languages to make the platform easier to use for rural communities.

Currently supported:

- 🇬🇧 English
- 🇮🇳 Hindi (हिन्दी)
- 🇮🇳 Kannada (ಕನ್ನಡ)

The selected language is maintained across the application so users can continue using the platform in their preferred language.

---
=======
### 👨‍👩‍👧 1. Citizen Portal

Citizens can access healthcare services through a dedicated dashboard.

- View the citizen dashboard.
- Find healthcare facilities.
- View facility information.
- Book appointments.
- View and track appointments.
- Search medicine availability.
- Access the AI Health Assistant.
- View referral information.
- Access emergency healthcare information.
- Manage language preferences through Settings.
>>>>>>> c1fad74 (Update SwasthyaSetu README)

### 🏥 2. Healthcare Facility Finder

The facility discovery module helps users find registered healthcare facilities.

- Search healthcare facilities.
- View facility details and contact information.
- Explore healthcare locations using map-based interfaces.
- Discover available facilities such as PHCs, CHCs, and hospitals when registered in the system.

### 🤖 3. AI Health Assistant

The AI Health Assistant provides general health-related information and guidance.

- Accept health-related questions.
- Provide general informational guidance.
- Help users understand healthcare information.
- Support access to healthcare guidance through the application.

The assistant is intended for informational purposes and does not replace professional medical evaluation.

### 📅 4. Appointment Management

Citizens can book appointments and track their status.

- Select a healthcare facility.
- Select an available doctor or department.
- Choose an appointment date and time.
- View appointment details.
- Track appointment status.

Health workers can review appointments and update their status through the Health Worker Portal.

### 💊 5. Medicine Availability

The medicine module helps users search for medicines and check their availability at registered facilities.

- Search medicines by name.
- View medicine availability.
- Identify facilities with available stock.
- View stock-related information where available.
- Support inventory management by authorized users.

### 📋 6. Referral Management

The referral module supports referral creation and tracking.

- Create patient referrals through the health-worker workflow.
- View referral information.
- Track referral status.
- Support coordination between healthcare services.

### 👩‍⚕️ 7. Health Worker Portal

The Health Worker Portal supports patient and healthcare operations.

- View the health-worker dashboard.
- Manage patient information.
- View and manage appointments.
- Create and track referrals.
- Access healthcare facility information.
- Update medicine inventory where authorized.
- Review relevant patient and service information.

### 🚑 8. Emergency Information

The emergency module helps users access emergency healthcare information and locate relevant healthcare facilities.

Users should contact the appropriate emergency services immediately in a medical emergency.

### 🌐 9. Multilingual Interface

SwasthyaSetu supports the following languages:

- English
- Hindi (हिन्दी)
- Kannada (ಕನ್ನಡ)

Language preferences are maintained through the application's language settings.

### 📱 10. Progressive Web App and Offline Support

The application includes Progressive Web App functionality.

- Service Worker support.
- Application resource caching.
- Responsive layouts.
- Mobile-friendly interfaces.
- Offline-friendly access to supported cached resources.

Availability of live data and server-dependent features requires network connectivity.

### 🛡️ 11. Administrator Portal

The administrator dashboard supports centralized management of the application.

**Dashboard and Analytics**
- View system statistics.
- Review appointment-related information.
- View available analytics and charts.

**User Management**
- View registered users.
- Review user roles.
- Manage user records.

**Doctor Management**
- Add and update doctor information.
- Associate doctors with facilities.
- Manage doctor availability.

**Facility Management**
- Add healthcare facilities.
- Update facility information.
- Manage facility records.

**Medicine Management**
- Manage medicine records.
- Review medicine inventory.
- Update stock information.
- Identify low-stock items.

---

## 🔄 System Workflow

### Citizen Workflow

```text
Citizen Registration / Login
           |
           v
    Citizen Dashboard
           |
           v
  Find Healthcare Facility
           |
           v
  View Facility Information
           |
           v
    Book Appointment
           |
           v
   Track Appointment
           |
           v
  Search Medicine Availability
           |
           v
   View Referral Information
```

### Health Worker Workflow

```text
Health Worker Login
         |
         v
Health Worker Dashboard
         |
         v
   Manage Patients
         |
         v
 Manage Appointments
         |
         v
  Create / Track Referrals
         |
         v
 Update Medicine Inventory
```

### Administrator Workflow

```text
     Admin Login
          |
          v
    Admin Dashboard
          |
          v
   View Analytics
          |
          v
   Manage Users
          |
          v
   Manage Doctors
          |
          v
  Manage Facilities
          |
          v
  Manage Medicines
```

---

## 🛠️ Technology Stack

### Frontend

- **React.js 18** — User interface.
- **React Router** — Client-side navigation.
- **Tailwind CSS** — Styling and responsive layouts.
- **Zustand** — Application state management.
- **Leaflet** — Map-based facility discovery.
- **Recharts** — Dashboard charts and visualizations.
- **Framer Motion** — UI animations.
- **React Hot Toast** — User notifications.

### Backend

- **Node.js** — JavaScript runtime.
- **Express.js** — Backend API framework.
- **PostgreSQL** — Relational database.
- **JWT** — Authentication.
- **bcrypt** — Password hashing.

### Application Technologies

- REST API
- Progressive Web App (PWA)
- Service Worker
- Role-based access control
- Multilingual interface

---

## 🏗️ System Architecture

```text
+------------------+  +------------------+  +------------------+
|     Citizen      |  |   Health Worker  |  |  Administrator   |
+--------+---------+  +--------+---------+  +--------+---------+
         |                     |                     |
         +---------------------+---------------------+
                               |
                               v
                   +------------------------+
                   |    React Frontend      |
                   |  Responsive Web App    |
                   +-----------+------------+
                               |
                               | REST API
                               |
                               v
                   +------------------------+
                   |    Node.js / Express   |
                   |       Backend          |
                   +-----------+------------+
                               |
                               v
                   +------------------------+
                   |      PostgreSQL        |
                   |        Database        |
                   +------------------------+
```

---

## 📁 Project Structure

```text
swasthya-setu/
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   ├── swasthya-logo-192.png
│   │   └── swasthya-logo-512.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   ├── translations.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── scripts/
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── database/
│   └── schema.sql
│
├── .gitignore
├── .gitattributes
└── README.md
```

---

## 🚀 Installation and Setup

### Prerequisites
<<<<<<< HEAD

Make sure the following are installed:

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

## 🗄️ Database Setup

### 1. Create the PostgreSQL database

```sql
CREATE DATABASE swasthya_setu;
=======

Install the following software before running the project:

- Node.js 18 or later.
- npm.
- PostgreSQL 14 or later.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/anif39basha-source/swasthya-setu.git
cd swasthya-setu
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure the Backend

Create a `.env` file inside the `backend` directory using `.env.example` as your reference.

Configure the database connection, authentication secret, port, and other required variables according to the existing backend configuration.

### 4. Start the Backend

```bash
npm run dev
```

The backend is configured to run on:

```text
http://localhost:5000
```

### 5. Install Frontend Dependencies

Open a separate terminal from the project root:

```bash
cd frontend
npm install
```

### 6. Configure the Frontend

Create `frontend/.env` with the appropriate backend API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 7. Start the Frontend

```bash
npm start
```

The frontend is available at:

```text
http://localhost:3000
```

---

## 🗄️ Database Setup

SwasthyaSetu uses PostgreSQL to store application data.

The database schema is included in:

```text
database/schema.sql
```

If you are setting up the project on a new computer, create a PostgreSQL database:

```sql
CREATE DATABASE swasthya_setu;
```

From the project root, apply the schema:

```bash
psql -U postgres -d swasthya_setu -f database/schema.sql
```

Configure the database connection in `backend/.env` according to the variables expected by `backend/src/config/database.js`.

If you already have a working local database, you can continue using it. You do not need to create another database for GitHub.

**Note:** The schema file contains database structure and setup instructions; it does not automatically include the contents of your local PostgreSQL database.

---

## 🔐 Environment Configuration

The project uses environment variables for local configuration.

Relevant files include:

```text
backend/.env.example
backend/.env
frontend/.env
```

- `backend/.env.example` provides a configuration template.
- `backend/.env` contains your local backend configuration.
- `frontend/.env` contains your local frontend API URL.

Do not commit actual passwords, database credentials, JWT secrets, API keys, or other sensitive values to GitHub.

---

## 🔒 Security

The application uses security mechanisms including:

- JWT-based authentication.
- Role-based access control.
- Password hashing.
- Protected API routes.
- Input validation.
- Rate limiting.
- CORS configuration.
- Environment-based configuration.

Security settings should be reviewed before deploying the application for real-world use.

---

## 🎯 Expected Benefits

SwasthyaSetu aims to support rural healthcare access through:

- Easier discovery of healthcare facilities.
- Improved appointment coordination.
- Better visibility of medicine availability.
- More organized referral tracking.
- Support for health workers managing patients.
- Centralized facility and doctor management.
- Multilingual access to healthcare information.
- Better usability in low-connectivity environments.

Actual improvements in travel time, waiting time, referral completion, and healthcare outcomes would need to be measured through real-world testing.

---

## 🚀 Future Enhancements

Potential future enhancements include:

- Assisted teleconsultation.
- Queue and waiting-time management.
- Diagnostic service availability coordination.
- Follow-up reminders for high-risk patients.
- Improved offline data synchronization.
- Integration with approved interoperable health-record standards.
- Enhanced facility capacity and service availability information.
- Additional regional language support.
- Expanded healthcare analytics.

These are potential extensions and may require additional implementation and integration.

---

## ⚠️ Disclaimer

SwasthyaSetu is a healthcare access and coordination project.

The AI Health Assistant provides general informational guidance and does not replace professional medical advice, diagnosis, or treatment.

Users should consult qualified healthcare professionals for medical concerns. In a medical emergency, contact the appropriate emergency services immediately.

---

## 📄 License

No license has been specified for this project yet.

If you intend to distribute the source code as open source, choose and add an appropriate license file before describing the project as open source.

---

## ❤️ About SwasthyaSetu

SwasthyaSetu aims to connect citizens, frontline health workers, and healthcare facilities through an accessible digital platform.

**Making rural healthcare information more accessible, connected, and easier to navigate.**
>>>>>>> c1fad74 (Update SwasthyaSetu README)
