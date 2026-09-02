# 🏥 SwasthyaSetu - Rural Healthcare Access & Smart Referral Platform

> Smart India Hackathon 2024 Project

A modern, responsive web application connecting rural citizens to government healthcare facilities through a seamless platform.

## 🌟 Features

### For Citizens
- 🏥 Find nearby healthcare facilities (PHCs, CHCs, District Hospitals)
- 🤖 AI Health Assistant for general health guidance
- 📅 Book appointments online
- 💊 Check medicine availability
- 🚑 Emergency services locator
- 📋 Track referrals
- 📱 Offline support (PWA)

### For Health Workers (ASHA)
- 👥 Patient registration & management
- 📅 Appointment management
- 📋 Create & track referrals
- 💊 Medicine inventory updates
- 📊 Dashboard with patient statistics

### For Administrators
- 🛡️ Analytics dashboard
- 🏥 Facility management
- 👨‍⚕️ Doctor management
- 📈 Statistics & reports
- 💊 Medicine inventory oversight

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Database Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE swasthya_setu;
```

2. Run schema:
```bash
cd database
psql -U postgres -d swasthya_setu -f schema.sql
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Seed demo data
npm run seed

# Start server
npm run dev
```

Backend runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

Frontend runs on: `http://localhost:3000`

## 🔑 Demo Accounts

| Role | Phone | Password |
|------|-------|----------|
| Citizen | 9876543210 | citizen123 |
| Health Worker | 8877665544 | healthworker123 |
| Admin | 9966554433 | admin123 |

## 📱 Demo Flow

1. **Login as Citizen** → Dashboard
2. **Use AI Assistant** → Enter symptoms
3. **Find Healthcare** → View nearby PHCs/CHCs
4. **Check Medicine** → Search for Paracetamol
5. **Book Appointment** → Select facility & time
6. **View Referrals** → Track referral status

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router
- Zustand (State)
- Leaflet (Maps)
- Recharts (Charts)
- Framer Motion (Animations)

### Backend
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Socket.io (Real-time)

### Deployment
- Frontend: Vercel
- Backend: Render/Railway
- Database: Supabase/Neon

## 📁 Project Structure

```
swasthya-setu/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/       # API service
│   │   ├── store/         # Zustand store
│   │   └── ...
│   ├── public/
│   │   ├── sw.js          # Service Worker
│   │   └── manifest.json   # PWA manifest
│   └── ...
├── backend/
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── config/        # Database config
│   │   ├── middleware/     # Auth middleware
│   │   └── services/      # AI service
│   └── ...
├── database/
│   ├── schema.sql         # Database schema
│   └── seed.sql           # Demo data
└── README.md
```

## 🔒 Security Features

- JWT Authentication
- Role-based access control (RBAC)
- Input validation
- Password hashing (bcrypt)
- Rate limiting
- CORS protection

## 📱 PWA Features

- Offline support
- Service Worker caching
- App-like experience
- Responsive design
- Touch-friendly UI

## 🎯 SIH Impact

- Reduced unnecessary travel
- Faster healthcare access
- Better medicine visibility
- Improved referral tracking
- Rural healthcare coordination
- Low-connectivity support

## ⚠️ Disclaimer

> This application is for demonstration purposes (SIH). It does NOT provide medical diagnoses. Always consult healthcare professionals for medical advice. In emergencies, call 108/112 immediately.

## 📄 License

MIT License - Smart India Hackathon 2024

---

Built with ❤️ for Rural Healthcare Access
