# Fitness Lab v10 - Backend via Node.js & Express

This is the backend API for the Fitness Lab Gym Management System. It handles Authentication, Member Management, Enquiries, Workout Planning, and Sales Analytics.

## 🚀 Features

-   **Admin Authentication**: Secure login with JWT (JSON Web Tokens).
-   **Enquiry Management**: Track leads (Cold, Warm, Hot), follow-ups, and conversion to members.
-   **Member Management**: Full profile tracking, membership expiry, and renewal status.
-   **Package System**: Create and manage dynamic gym membership plans (Gold, Silver, PT).
-   **Workout Builder**: Assign personalized workout schedules (Mon-Sun) to members.
-   **Sales & Analytics**: Automated sales recording and dashboard stats (Active vs. Expired members).

## 🛠️ Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB (via Mongoose)
-   **Authentication**: JWT & Bcrypt
-   **Environment**: Dotenv

## ⚙️ Installation & Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Configuration**
    Create a `.env` file in the root of the `backend` folder:
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/fitness-lab-v10
    JWT_SECRET=your_super_secret_key_here
    NODE_ENV=development
    ```

3.  **Run with Seeder (Optional)**
    To create the initial Admin user (`admin@example.com` / `password123`):
    ```bash
    node seeder.js
    ```

4.  **Start Server**
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:5000`.

## 📚 API Documentation

### **1. Authentication**
*   `POST /api/admin/auth/login` - Admin Login

### **2. Enquiries**
*   `GET /api/admin/enquiries` - List all enquiries (supports pagination & search)
*   `POST /api/admin/enquiries` - Create new enquiry
*   `GET /api/admin/enquiries/stats` - Get status counts

### **3. Members**
*   `GET /api/admin/members` - List all members
*   `POST /api/admin/members` - Register new member (Auto-creates Sale)
*   `GET /api/admin/members/stats` - Active vs Expired stats

### **4. Packages**
*   `GET /api/admin/packages` - List all active plans
*   `POST /api/admin/packages` - Create new membership package

### **5. Workouts**
*   `POST /api/admin/workouts` - Assign workout plan to member
*   `GET /api/admin/workouts/member/:id` - View member's plan

## 📂 Project Structure

```
backend/
├── config/         # DB Connection
├── controllers/    # Route Logic (Auth, Member, Enquiry, etc.)
├── middlewares/    # Auth & Error Handling
├── models/         # Mongoose Schemas (Member, Sale, Workout...)
├── routes/         # API Route definitions
├── utils/          # Helper functions
├── index.js        # Entry point
└── seeder.js       # Data seeding script
```
