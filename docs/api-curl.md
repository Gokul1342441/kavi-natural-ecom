# API Documentation with cURL Examples

This document provides examples of how to interact with the Kavi Natural E-commerce API using cURL.

## Base URL

```
http://localhost:3000/api
```

For production, replace with your actual domain.

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" ...
```

## Endpoints

### Authentication

#### Login

Authenticate a user and get a token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Success Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "mobile": "1234567890",
    "address": "User Address",
    "role": "USER",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Invalid credentials
- 500 Internal Server Error: Server error

#### Signup

Register a new user.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "mobile": "1234567890",
  "address": "User Address, City, Country",
  "password": "password123",
  "role": "USER"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New User",
    "email": "newuser@example.com",
    "mobile": "1234567890",
    "address": "User Address, City, Country",
    "password": "password123"
  }'
```

**Success Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "New User",
    "email": "newuser@example.com",
    "mobile": "1234567890",
    "address": "User Address, City, Country",
    "role": "USER",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

**Error Responses:**
- 400 Bad Request: Invalid input data
- 409 Conflict: Email or mobile already exists
- 500 Internal Server Error: Server error

### User Profile

#### Get User Profile

Get the profile of the authenticated user.

**Endpoint:** `GET /profile`

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Success Response (200 OK):**
```json
{
  "message": "Profile fetched successfully",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "mobile": "1234567890",
    "address": "User Address",
    "role": "USER",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- 401 Unauthorized: No token or invalid token
- 404 Not Found: User not found
- 500 Internal Server Error: Server error

## Error Handling

All endpoints return appropriate HTTP status codes and error messages in the following format:

```json
{
  "error": "Error message here"
}
```

## Validation

Input validation is performed using Zod. Here are the validation rules:

### Login
- `email`: Must be a valid email format
- `password`: Minimum 6 characters

### Signup
- `name`: Minimum 2 characters
- `email`: Must be a valid email format
- `mobile`: Must be exactly 10 digits
- `address`: Minimum 5 characters
- `password`: Minimum 6 characters
- `role`: Optional, must be either "USER" or "SUPER_ADMIN" (defaults to "USER")

## Testing with Postman

You can also import these examples into Postman:

1. Create a new request
2. Select the appropriate HTTP method (GET, POST, etc.)
3. Enter the URL (e.g., http://localhost:3000/api/auth/login)
4. For POST requests, go to the "Body" tab, select "raw" and "JSON"
5. Paste the example request body
6. For authenticated requests, go to the "Headers" tab and add:
   - Key: Authorization
   - Value: Bearer YOUR_TOKEN_HERE
7. Click "Send" to execute the request
