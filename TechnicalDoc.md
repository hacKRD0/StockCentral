# Portfolio Management System Documentation

## Table of Contents

- [1. Overview](#1-overview)
- [2. Modules](#2-modules)
  - [2.1. Authentication Module](#21-authentication-module)
  - [2.2. Portfolio Module](#22-portfolio-module)
  - [2.3. User Module](#23-user-module)
- [3. Key Functions and Usage](#3-key-functions-and-usage)

  - [3.1. User Authentication](#31-user-authentication)
  - [3.2. Portfolio Upload](#32-portfolio-upload)
  - [3.3. Portfolio Data Management](#33-portfolio-data-management)
  - [3.4. User Data Management](#34-user-data-management)

- [4. Implementation and Deployment](#4-implementation-and-deployment)
- [5. Security Vulnerabilities and Potential Bugs](#5-security-vulnerabilities-and-potential-bugs)
- [6. Dockerfile](#6-dockerfile)

## 1. Overview

This document provides comprehensive documentation for the Portfolio Management System. This system allows users to upload their investment portfolio data, manage stock information, and view consolidated portfolio holdings. The system uses a backend built with Node.js, Express.js, Sequelize ORM for database interactions, and Firebase for authentication.

## 2. Modules

### 2.1. Authentication Module

This module handles user registration and authentication. It uses Firebase for secure authentication and integrates with the database to manage user accounts.

**Key Components:**

- `auth.controller.js`: Handles user registration. Creates new users, hashing passwords using bcrypt.
- `auth.middleware.js`: Verifies Firebase ID tokens for authorization. Checks for the presence of a valid Bearer token in the request headers and verifies it against Firebase.

### 2.2. Portfolio Module

This module allows users to upload, manage, and view their portfolio data. It handles CSV file uploads, data processing, and database interactions.

**Key Components:**

- `uploadPortfolio.js`: Handles portfolio CSV file uploads, processes the data, and stores it in the database. Uses Multer for file uploads.
- `getConsolidatedPortfolio.js`: Retrieves a user's consolidated portfolio holdings for a given date.
- `getStockMasters.js`: Retrieves a list of master stocks associated with a user.
- `addStockMaster.js`: Adds a new master stock.
- `updateStockMapper.js`: Updates existing master stock data.
- `deleteStockMaster.js`: Deletes a master stock.
- `getStockMapper.js`: Retrieves all stocks data for a user.
- `getSectors.js`: Retrieves all sectors for a user.
- `addSector.js`: Adds a new sector.
- `updateSector.js`: Updates an existing sector.
- `deleteSector.js`: Deletes a sector.
- `getBrokerages.js`: Retrieves all brokerages.
- `getUploadedDates.js`: Retrieves the unique dates of uploaded portfolio data.
- `processPortfolio.js`: Processes the uploaded CSV data, handling data validation and database interactions.

### 2.3. User Module

This module manages user-specific data, such as default brokerage settings.

**Key Components:**

- `getDefaultBrokerage.js`: Retrieves the default brokerage for a user.
- `updateDefaultBrokerage.js`: Updates a user's default brokerage.

## 3. Key Functions and Usage

### 3.1. User Authentication

- **Registration:** Users register by sending a POST request to `/api/auth/register` with `name`, `email`, and `password` in the request body. Passwords are automatically generated if left blank.

  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"name":"Test User", "email":"test@example.com"}' http://localhost:5000/api/auth/register
  ```

- **Authentication (Middleware):** All portfolio-related endpoints require authentication via a Firebase ID token. This token is passed in the `Authorization` header as a `Bearer` token.

### 3.2. Portfolio Upload

Users upload their portfolio data via a POST request to `/api/portfolio/upload`. The request must include a CSV file and details about the brokerage and date.

```bash
curl -X POST \
  -H "Authorization: Bearer <your_firebase_id_token>" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/your/portfolio.csv" \
  -F "brokerageName=Zerodha" \
  -F "date=2024-10-26" \
  http://localhost:5000/api/portfolio/upload
```

### 3.3. Portfolio Data Management

The `/api/portfolio` endpoint provides various functions for managing portfolio data:

- **Get Consolidated Portfolio:** GET `/api/portfolio/all?date=YYYY-MM-DD`
- **Get Stock References:** GET `/api/portfolio/stockMasters`
- **Update Stock Master:** PUT `/api/portfolio/updateStockMapper` (body: array of `{stockId, stockMasterId}`)
- **Update Stock Reference:** PUT `/api/portfolio/updateStockMaster` (body: `{stockMasterId, sectorId}`)
- **Delete Stock Reference:** DELETE `/api/portfolio/deleteStockMaster` (body: `{stockMasterId}`)
- **Get Stock Master Data:** GET `/api/portfolio/StockMapper`
- **Get Sectors:** GET `/api/portfolio/sectors`
- **Add Sector:** POST `/api/portfolio/addSector` (body: `{sectorName}`)
- **Update Sector:** PUT `/api/portfolio/updateSector` (body: `{sectorId, sectorName}`)
- **Delete Sector:** DELETE `/api/portfolio/deleteSector` (body: `{sectorId}`)
- **Get Brokerages:** GET `/api/portfolio/brokerages`
- **Add Stock Reference:** POST `/api/portfolio/stockMaster` (body: `{name, code, SectorId}`)
- **Get Uploaded Dates:** GET `/api/portfolio/dates`

### 3.4. User Data Management

The `/api/user` endpoint allows managing user-specific settings:

- **Get Default Brokerage:** GET `/api/user/defaultBrokerage`
- **Update Default Brokerage:** PUT `/api/user/defaultBrokerage` (body: `{brokerageId}`)

## 4. Implementation and Deployment

1. **Clone the Repository:** Clone the project repository from GitHub.
2. **Install Dependencies:** Run `npm install` in both the backend and frontend directories (if applicable).
3. **Set up Environment Variables:** Create a `.env` file in the backend directory and set the required environment variables (database credentials, Firebase credentials, frontend URL).
4. **Database Setup:** Create the database schema using Sequelize migrations (`npx sequelize-cli db:migrate`).
5. **Seed Database (Optional):** Seed the database with initial data using Sequelize seeders (`npx sequelize-cli db:seed:all`).
6. **Run the Backend:** Start the backend server using `npm run start`.
7. **Run Frontend (if applicable):** Start the frontend development server if you have a frontend application associated with this backend API.
8. **Deploy:** Deploy the backend application to a hosting service such as Heroku, AWS, Google Cloud, etc. You might also need to deploy your frontend application separately.

## 5. Security Vulnerabilities and Potential Bugs

**Security Vulnerabilities:**

- **Sensitive Data Exposure:** The `.env` file containing database credentials and Firebase keys should not be committed to version control.
- **Input Validation:** The application lacks robust input validation, making it vulnerable to injection attacks (SQL injection, Cross-Site Scripting, etc.). All user inputs should be carefully sanitized and validated before use.
- **Rate Limiting:** The application is currently vulnerable to brute force attacks, because there is no rate limiting implemented. Implementing rate limiting for authentication attempts is crucial.
- **Firebase Key Management:** Improper management of Firebase keys (exposing keys in public repositories) leads to unauthorized access.
- **Unhandled Errors:** The error handling is basic and could reveal sensitive information to the client in case of an unexpected error. Implement more robust error handling to return generic error messages to the client.
- **Authorization Issues:** While the middleware checks for a Firebase token, it doesn't explicitly check user permissions in the database. If more than one role (admin and users) is implemented, authorization should be implemented.

**Potential Bugs:**

- **File Upload Errors:** The `uploadPortfolio` function might not handle all file upload errors gracefully. More comprehensive error handling is needed.
- **Data Processing Errors:** The `processPortfolio` function has limited error handling in case parsing of the CSV data fails.
- **Concurrency Issues:** The application may have concurrency issues if multiple users try to upload data concurrently without proper locking mechanisms.
- **Date Handling:** The date handling should be improved for better consistency and to avoid timezone issues. Use UTC consistently.

## 6. Dockerfile

```dockerfile
# Backend Dockerfile
# Start with a Node image
FROM node:20

# Create app/backend directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend server
CMD ["npm", "run", "start"]
```

This Dockerfile provides a basic setup for running the backend application in a Docker container. For production deployments, consider adding more robust configurations (e.g., environment variable management, health checks). Also, it's recommended to utilize multi-stage builds to reduce image size.
