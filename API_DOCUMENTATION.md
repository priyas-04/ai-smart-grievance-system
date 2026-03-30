# ResolveAI API Documentation

## Overview

ResolveAI provides a RESTful API for managing complaints, users, and departments with AI-powered classification and routing. The API implements role-based access control (RBAC) to ensure secure access to resources.

## Base URL

```
Development: http://localhost:8000
Production: https://api.resolveai.com
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## User Roles

- **citizen**: Can submit and view their own complaints
- **officer**: Can view and update complaints for their department
- **admin**: Full system access (cannot submit complaints)

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "citizen",
  "department_id": null
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### Users

#### Get Current User
```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "citizen",
  "department_id": null
}
```

#### Update Current User
```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

#### Get All Users (Admin Only)
```http
GET /api/users/
Authorization: Bearer <admin-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen",
    "department_id": null
  }
]
```

#### Get User by ID (Admin Only)
```http
GET /api/users/{user_id}
Authorization: Bearer <admin-token>
```

### Departments

#### Get All Departments
```http
GET /api/departments/
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Water Department",
    "contact_info": "water@municipality.gov | 1800-WATER"
  }
]
```

#### Create Department (Admin Only)
```http
POST /api/departments/
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Department",
  "contact_info": "contact@department.gov | 1800-CONTACT"
}
```

#### Get Department by ID
```http
GET /api/departments/{department_id}
```

#### Update Department (Admin Only)
```http
PUT /api/departments/{department_id}
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Updated Department Name",
  "contact_info": "updated@department.gov | 1800-UPDATED"
}
```

### Complaints

#### Submit Complaint (Citizen Only)
```http
POST /api/complaints/
Authorization: Bearer <citizen-token>
Content-Type: application/json

{
  "title": "Water Pipe Burst",
  "description": "There is a major water pipe burst on Main Street causing flooding in the area."
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Water Pipe Burst",
  "description": "There is a major water pipe burst on Main Street causing flooding in the area.",
  "category": "water",
  "priority": "high",
  "status": "pending",
  "department_id": 1,
  "user_id": 1,
  "created_at": "2023-12-01T10:00:00Z",
  "updated_at": "2023-12-01T10:00:00Z",
  "remarks": null
}
```

#### Get Complaints (Role-based)
```http
GET /api/complaints/
Authorization: Bearer <token>

# Optional query parameters:
# ?status=pending
# ?priority=high
# ?category=water
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Water Pipe Burst",
    "description": "There is a major water pipe burst on Main Street causing flooding in the area.",
    "category": "water",
    "priority": "high",
    "status": "pending",
    "department_id": 1,
    "user_id": 1,
    "created_at": "2023-12-01T10:00:00Z",
    "updated_at": "2023-12-01T10:00:00Z",
    "remarks": null,
    "department_name": "Water Department"
  }
]
```

#### Get Complaint by ID
```http
GET /api/complaints/{complaint_id}
Authorization: Bearer <token>
```

#### Update Complaint (Officer/Admin Only)
```http
PUT /api/complaints/{complaint_id}
Authorization: Bearer <officer-or-admin-token>
Content-Type: application/json

{
  "status": "in_progress",
  "remarks": "Team has been dispatched to location."
}
```

#### Get Dashboard Statistics
```http
GET /api/complaints/stats/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_complaints": 150,
  "pending": 45,
  "in_progress": 30,
  "resolved": 75,
  "high_priority": 15,
  "resolution_rate": 50.0
}
```

## Data Models

### User Model
```json
{
  "id": "integer",
  "name": "string (max 100)",
  "email": "string (unique, max 100)",
  "role": "enum (citizen, officer, admin)",
  "department_id": "integer (nullable)"
}
```

### Department Model
```json
{
  "id": "integer",
  "name": "string (unique, max 100)",
  "contact_info": "text (nullable)"
}
```

### Complaint Model
```json
{
  "id": "integer",
  "title": "string (max 200)",
  "description": "text",
  "category": "enum (water, electricity, road_transport, sanitation, general)",
  "priority": "enum (low, medium, high)",
  "status": "enum (pending, in_progress, resolved)",
  "department_id": "integer",
  "user_id": "integer",
  "created_at": "datetime",
  "updated_at": "datetime",
  "remarks": "text (nullable)"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Complaint not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## AI Classification

When a complaint is submitted, the AI system automatically:

1. **Preprocesses** the text (cleaning, tokenization, lemmatization)
2. **Classifies** the category using TF-IDF + Naive Bayes
3. **Predicts** priority using TF-IDF + Logistic Regression
4. **Routes** to the appropriate department
5. **Flags** high-priority issues for immediate attention

### Categories
- `water`: Water supply issues
- `electricity`: Power and electrical problems
- `road_transport`: Road and transportation issues
- `sanitation`: Waste management and cleaning
- `general`: General administrative matters

### Priority Levels
- `high`: Emergency situations, safety hazards
- `medium`: Service disruptions, maintenance issues
- `low`: General inquiries, non-urgent matters

## Rate Limiting

To ensure fair usage, the API implements rate limiting:
- 100 requests per minute per user
- 1000 requests per minute per IP address

## Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

## SDK Examples

### Python
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login', json={
    'email': 'user@example.com',
    'password': 'password123'
})
token = response.json()['access_token']

# Submit complaint
headers = {'Authorization': f'Bearer {token}'}
response = requests.post('http://localhost:8000/api/complaints/', 
                        headers=headers,
                        json={
                            'title': 'Street Light Not Working',
                            'description': 'The street light at the corner of Main St is not working.'
                        })
print(response.json())
```

### JavaScript
```javascript
// Login
const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { access_token } = await loginResponse.json();

// Submit complaint
const complaintResponse = await fetch('http://localhost:8000/api/complaints/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${access_token}`
  },
  body: JSON.stringify({
    title: 'Street Light Not Working',
    description: 'The street light at the corner of Main St is not working.'
  })
});
const complaint = await complaintResponse.json();
console.log(complaint);
```

## Webhooks (Coming Soon)

Future versions will support webhooks for:
- Complaint status updates
- High-priority alerts
- Resolution notifications

## Support

For API support:
- Check the interactive documentation at `/docs`
- Review error messages carefully
- Contact the development team
- Check the troubleshooting guide

---

**Note**: This API is designed for integration with government systems and third-party applications. All requests are logged and monitored for security purposes.
