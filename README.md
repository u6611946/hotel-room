# 🏨 Luxury Hotel Booking System

A full-stack hotel room booking web application built with Next.js and MongoDB.

## 🔗 Links

- **Live Demo:** https://hotel-room-xs7m.vercel.app
- **GitHub Repository:** https://github.com/u6611946/hotel-room

---

## 📋 Features

### Guest Features
- Browse available hotel rooms with images and pricing
- Search rooms by check-in date, check-out date, and number of guests
- User registration and login
- Book rooms with guest details
- View and manage personal bookings (cancel bookings)
- Update profile information

### Admin Features
- Admin dashboard at `/admin`
- View all bookings across all users
- Confirm or cancel bookings
- Delete bookings
- View all rooms

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB Atlas |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/u6611946/hotel-room.git
cd hotel-room
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
MONGODB_URI="mongodb+srv://Phyo:Phyo280803@cluster0.6xfy2ui.mongodb.net/?appName=Cluster0"
NEXT_PUBLIC_API_URL="/api"
```

4. **Seed the database**
```bash
node --env-file=.env scripts/seedRooms.js
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard
│   │   ├── bookings/       # Manage bookings
│   │   └── rooms/          # Manage rooms
│   ├── api/                # API routes
│   │   ├── auth/           # Login & Register
│   │   ├── booking/        # Booking CRUD
│   │   └── rooms/          # Rooms CRUD
│   ├── booking/            # Booking page
│   └── rooms/              # Rooms listing page
├── components/
│   ├── auth/               # Login, Register, Profile modals
│   ├── layout/             # Navbar
│   └── ui/                 # Reusable UI components
├── lib/
│   └── mongodb.js          # MongoDB connection
└── scripts/
    └── seedRooms.js        # Database seeding script
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | Get all available rooms |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/booking` | Get all bookings |
| POST | `/api/booking` | Create new booking |
| PATCH | `/api/booking/:id` | Update booking status |
| DELETE | `/api/booking/:id` | Delete booking |

---

## 👤 Admin Access

The admin dashboard is accessible at:
```
/admin
```
Or via the **"Admin Dashboard"** link on the login modal.

> ⚠️ Note: In a production system, admin access would be protected with JWT-based role authentication.

---

## 🌱 Database Seeding

To populate the database with sample rooms:
```bash
node --env-file=.env scripts/seedRooms.js
```

This creates 5 room types:
- Standard Room - $120/night
- Deluxe Room - $200/night
- Suite - $350/night
- Family Room - $280/night
- Executive Suite - $450/night

---

## 🚧 Future Improvements

- JWT-based authentication with role-based access control
- Room availability calendar
- Payment integration
- Email confirmation for bookings
- Image upload for rooms