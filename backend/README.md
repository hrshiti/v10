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

For the full detailed list of all Admin and User APIs, see the [Root README.md](../README.md).

### Quick Reference (Admin)

| Category | Base Path |
| :--- | :--- |
| **Auth** | `/api/admin/auth` |
| **Dashboard** | `/api/admin/dashboard` |
| **Members** | `/api/admin/members` |
| **Enquiries** | `/api/admin/enquiries` |
| **Packages** | `/api/admin/packages` |
| **Workouts** | `/api/admin/workouts` |
| **Diet Plans** | `/api/admin/diet-plans` |
| **Employees** | `/api/admin/employees` |
| **Sales** | `/api/admin/sales` |
| **Reports** | `/api/admin/reports` |
| **Expenses** | `/api/admin/expenses` |
| **Gym Details**| `/api/admin/gym-details` |

### Quick Reference (User)

| Category | Base Path |
| :--- | :--- |
| **Auth** | `/api/user/auth` |
| **Profile & Stats** | `/api/user` |
| **Water Intake** | `/api/user/water-intake` |


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
