# API Documentation

> MockTest Pro ke backend API endpoints ki documentation. Backend **FastAPI** pe chalta hai aur automatically Swagger UI generate karta hai at `/docs`.

---

## Base URL

```
Development: http://localhost:8000
```

---

## Authentication

API JWT (JSON Web Token) Bearer authentication use karta hai.

### How it works:

1. Login endpoint se `access_token` milta hai
2. Har subsequent request mein `Authorization` header mein token bhejo:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. Token expire hone pe dubara login karo

### Token Details

| Role    | Token Expiry | Payload Fields                     |
|---------|--------------|------------------------------------|
| Admin   | 24 hours     | `sub` (admin_id), `email`, `role: "admin"` |
| Student | 7 days       | `sub` (student_id), `email`, `role: "student"` |

---

## Endpoints

### Health Check

#### `GET /api/health`

Server ki health status check karo.

**Auth Required**: ❌ No

**Response** `200 OK`:
```json
{
  "status": "ok",
  "service": "mocktest-api"
}
```

---

### Authentication

#### `POST /api/auth/admin/login`

Admin login karke JWT token lo.

**Auth Required**: ❌ No

**Request Body**:
```json
{
  "email": "admin@mocktest.com",
  "password": "admin123"
}
```

| Field    | Type   | Required | Validation         |
|----------|--------|----------|--------------------|
| email    | string | ✅       | Valid email format  |
| password | string | ✅       | Min 4 characters   |

**Response** `200 OK`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "role": "admin",
  "name": "Super Admin"
}
```

**Error Response** `401 Unauthorized`:
```json
{
  "detail": "Invalid email or password"
}
```

---

### Planned Endpoints (Not Yet Implemented)

#### Admin Endpoints (Protected — Admin JWT Required)

| Method | Endpoint                    | Description                    |
|--------|------------------------------|-------------------------------|
| GET    | `/api/admin/dashboard`      | Dashboard stats               |
| GET    | `/api/admin/questions`      | List all questions             |
| POST   | `/api/admin/questions`      | Create a question              |
| PUT    | `/api/admin/questions/:id`  | Update a question              |
| DELETE | `/api/admin/questions/:id`  | Delete a question              |
| GET    | `/api/admin/tests`          | List all tests                 |
| POST   | `/api/admin/tests`          | Create a test                  |
| PUT    | `/api/admin/tests/:id`      | Update a test                  |
| DELETE | `/api/admin/tests/:id`      | Delete a test                  |
| GET    | `/api/admin/categories`     | List categories                |
| POST   | `/api/admin/categories`     | Create a category              |
| GET    | `/api/admin/packages`       | List packages                  |
| POST   | `/api/admin/packages`       | Create a package               |
| GET    | `/api/admin/students`       | List all students              |
| GET    | `/api/admin/materials`      | List learning materials        |
| POST   | `/api/admin/materials`      | Upload learning material       |

#### Student Endpoints

| Method | Endpoint                     | Description                     |
|--------|-------------------------------|---------------------------------|
| POST   | `/api/auth/student/register` | Student registration            |
| POST   | `/api/auth/student/login`    | Student login                   |
| GET    | `/api/student/profile`       | Get student profile (protected) |
| GET    | `/api/student/tests`         | List available tests            |
| POST   | `/api/student/tests/:id/start`| Start a test attempt           |
| POST   | `/api/student/tests/:id/submit`| Submit test answers           |
| GET    | `/api/student/results`       | View past results               |
| GET    | `/api/student/leaderboard`   | View leaderboard                |
| GET    | `/api/student/materials`     | Access learning materials       |

#### Payment Endpoints

| Method | Endpoint                     | Description                       |
|--------|-------------------------------|-----------------------------------|
| POST   | `/api/payments/create-order`  | Create Razorpay order             |
| POST   | `/api/payments/verify`        | Verify payment & activate package |

---

## Error Handling

Sabhi errors standard JSON format mein return hote hain:

```json
{
  "detail": "Error message description"
}
```

### Common Error Codes

| HTTP Code | Meaning              | When                                    |
|-----------|----------------------|-----------------------------------------|
| 400       | Bad Request          | Invalid request body / validation fail  |
| 401       | Unauthorized         | Missing/invalid/expired JWT token       |
| 403       | Forbidden            | Wrong role (e.g., student accessing admin endpoint) |
| 404       | Not Found            | Resource doesn't exist                  |
| 422       | Unprocessable Entity | Pydantic validation error               |
| 500       | Server Error         | Internal server error                   |

---

## Auth Dependencies (Backend)

Backend mein 2 dependency injection guards hain:

### `get_current_admin`
- JWT token verify karta hai
- Check karta hai ki `role == "admin"`
- Admin endpoints pe use hota hai

### `get_current_student`
- JWT token verify karta hai
- Check karta hai ki `role == "student"`
- Student endpoints pe use hota hai

Usage in FastAPI:
```python
@router.get("/api/admin/dashboard")
async def dashboard(admin: dict = Depends(get_current_admin)):
    # admin["sub"] = admin_id
    # admin["email"] = admin_email
    pass
```
