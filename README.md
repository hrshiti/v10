# V10 Fitness Gym Management System - API Documentation

This document provides a comprehensive list of all API endpoints available in the V10 Fitness Gym Management System.

## Base URL
`https://v10-fitness-gym.onrender.com/api` (Production)
`http://localhost:5000/api` (Development)

---

## 🛠️ Admin APIs
All admin routes (except login/register) require an `Authorization: Bearer <token>` header.

### 🔐 Authentication
**Base Route:** `/api/admin/auth`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/login` | Admin login |
| POST | `/register` | Register new admin |
| POST | `/forgot-password` | Reset password request |
| GET | `/me` | Get current admin profile |

### 📊 Dashboard
**Base Route:** `/api/admin/dashboard`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/stats` | Get high-level overview stats |
| GET | `/follow-ups` | Get recent/pending follow-ups |
| GET | `/charts` | Get analytics chart data |

### 👥 Members Management
**Base Route:** `/api/admin/members`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | List all members |
| POST | `/` | Create new member |
| GET | `/:id` | Get member details |
| PUT | `/:id` | Update member |
| DELETE | `/:id` | Delete member |
| GET | `/stats` | Get membership stats |
| POST | `/renew` | Renew membership |
| POST | `/sale` | Create fresh sale |
| PUT | `/bulk-deactivate` | Deactivate multiple members |
| PUT | `/bulk-assign-trainer` | Assign trainer to multiple members |
| PUT | `/:id/extend` | Extend membership duration |
| PUT | `/:id/change-start-date` | Change membership start date |
| POST | `/:id/freeze` | Freeze membership |
| POST | `/:id/upgrade` | Upgrade membership package |
| POST | `/:id/transfer` | Transfer membership to another person |
| GET | `/:id/subscriptions` | Get all subscriptions for a member |
| PUT | `/subscriptions/:subscriptionId/pay-due` | Pay subscription due |
| PUT | `/:id/pay-due` | Pay member total due |
| POST | `/:id/documents` | Upload member documents |
| GET | `/:id/documents` | List member documents |
| DELETE | `/:id/documents/:docId` | Delete member document |

### ⏰ Attendance (Admin)
**Base Route:** `/api/admin/members`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/attendance/scan` | Scan QR for manual attendance |
| GET | `/attendance` | Get all attendance logs |

### 📋 Enquiries
**Base Route:** `/api/admin/enquiries`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | List enquiries |
| POST | `/` | Create enquiry |
| GET | `/stats` | Enquiry analytics |
| PUT | `/:id` | Update enquiry |
| DELETE | `/:id` | Delete enquiry |

### 📦 Packages
**Base Route:** `/api/admin/packages`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | List all packages |
| POST | `/` | Create package |
| PUT | `/:id` | Update package |
| DELETE | `/:id` | Delete package |

### 🏋️ Workouts
**Base Route:** `/api/admin/workouts`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | List all workout templates |
| POST | `/` | Create workout template |
| PUT | `/:id` | Update workout template |
| DELETE | `/:id` | Delete workout template |
| GET | `/member/:memberId` | Get specific member's assigned workout |

### 🍎 Diet Plans
**Base Route:** `/api/admin/diet-plans`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | List all diet plans |
| POST | `/` | Create diet plan |
| GET | `/member/:memberId` | Get specific member's diet plan |
| PUT | `/:id` | Update diet plan |
| DELETE | `/:id` | Delete diet plan |

### 👔 Employees & HR
**Base Route:** `/api/admin/employees`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | List all employees |
| POST | `/` | Add employee |
| GET | `/role/:role` | Filter employees by role (Trainer, etc) |
| GET | `/attendance` | Employee attendance logs |
| POST | `/attendance/manual` | Mark manual employee attendance |
| PUT | `/:id` | Update employee details |
| DELETE | `/:id` | Delete employee |
| PATCH | `/:id/toggle` | Activate/Deactivate employee |

### 💰 Sales & Invoices
**Base Route:** `/api/admin/sales`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | List all sales |
| GET | `/member/:memberId` | Get sales for a member |
| GET | `/invoice/:invoiceNumber` | Get specific invoice details |

### 💹 Expenses
**Base Route:** `/api/admin/expenses`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | List expenses |
| POST | `/` | Record expense |
| PUT | `/:id` | Update expense |
| DELETE | `/:id` | Delete expense |

### 📈 Reports & Analytics
**Base Route:** `/api/admin/reports`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/sales` | Detailed sales reports |
| GET | `/balance-due` | Members with pending payments |
| GET | `/membership-expiry` | Upcoming/Past expiries |
| GET | `/subscription-analytics` | Package performance data |
| GET | `/attendance` | Detailed attendance reports |
| GET | `/due-membership` | Expired members report |
| GET | `/health-assessments`| List health assessments |
| POST | `/health-assessments`| Create health assessment |

### 🏢 Gym Configuration
**Base Route:** `/api/admin/gym-details`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | Get gym profile |
| PUT | `/` | Update gym logo/details |

---

## 📱 User (Member) APIs
All user routes (except OTP) require `Authorization: Bearer <token>` (User Token).

### 🔐 User Auth
**Base Route:** `/api/user/auth`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/send-otp` | Send login OTP to mobile |
| POST | `/verify-otp` | Verify OTP and login |

### 👤 User Services
**Base Route:** `/api/user`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/profile` | Get member profile |
| PUT | `/profile` | Update profile / Upload photo |
| POST | `/attendance/scan` | Mark attendance via QR |
| GET | `/attendance` | View personal attendance logs |
| GET | `/diet-plan` | View assigned diet plan |
| GET | `/workouts` | View assigned workout schedule |
| POST | `/workouts/log` | Mark workout as completed |
| GET | `/workouts/status` | Current workout status |
| GET | `/workouts/stats` | Personal workout progress |
| GET | `/feedback` | My submitted feedbacks |
| POST | `/feedback` | Submit new feedback |
| GET | `/stats` | Member home dashboard stats |

### 💧 Water Intake
**Base Route:** `/api/user/water-intake`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | Get today's water intake |
| POST | `/` | Log water consumption |

---

## 🚦 System Status
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/status` | Check server, DB, and config status |
| GET | `/` | Basic server ping |
