# Backend Repository for Portfolio Management Application

This repository contains the backend implementation for the **Portfolio Management Application**, a robust platform for managing user portfolios, stock references, and other related functionalities. It leverages modern technologies like **Node.js**, **Express**, and **Sequelize** with **PostgreSQL** to deliver scalable and maintainable API services.

---

## Features

### Core Features

- **User Management**:

  - Create, update, and manage user accounts.
  - Handle user-specific data, including portfolios and stock details.

- **Stock Reference Management**:

  - Maintain a database of user-defined stock references categorized by sectors.
  - Automatically manage cascading updates and deletions to preserve database integrity.

- **Sector Management**:

  - Organize stocks into sectors for better categorization.
  - Automatically set "NULL" in the stockmaster table when a sector is deleted.

- **Portfolio Tracking**:
  - Consolidate portfolio data across multiple brokerages for a specific date.
  - Fetch unique upload dates for user stock data.
  - Monitor user-specific stock quantities and average costs.

### Additional Functionalities

- **Database Integrity**:

  - Update dependent `StockMapper` entries when `StockMaster` is deleted using hooks.
  - Leverage transactions and hooks to maintain atomicity and referential integrity.

- **Efficient Querying**:

  - Retrieve unique dates and portfolio summaries using optimized Sequelize queries.

- **Custom Hooks**:
  - Implement model hooks for cascading effects on `StockMaster` and `Sector` deletions.

---

## Technologies Used

- **Node.js**: High-performance server-side JavaScript runtime.
- **Express**: Lightweight framework for building RESTful APIs.
- **Sequelize**: ORM for managing relational database operations.
- **PostgreSQL**: A powerful open-source relational database system.
- **Docker**: Containerization for consistent environment deployment.
- **ESM**: Modern JavaScript module support.

---

## Installation and Setup

### Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional for containerized deployment)

### Steps to Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/hacKRD0/PMApp.git
   cd PMApp
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory with the following content:

   ```env
   NODE_ENV=development
   PORT=3000
   APP_NAME=pmapp
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_postgres_username
   DB_PASSWORD=your_postgres_password
   DB_NAME=your_database_name
   WORKING_DIR=/app
   FRONTEND_URL=your_frontend_url
   FIREBASE_KEY=your_firebase_key
   ```

4. **Run Database Migrations**:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Seed the Database** (Optional):

   ```bash
   npx sequelize-cli db:seed:all
   ```

6. **Start the Server**:

   ```bash
   npm run dev
   ```

   The server will be available at `http://localhost:3000`.

---

## Database Structure

### Tables and Relationships

#### **Users**

| Column               | Type    | Description                 |
| -------------------- | ------- | --------------------------- |
| `id`                 | Integer | Primary key                 |
| `name`               | String  | User's name                 |
| `email`              | String  | User's email                |
| `defaultBrokerageId` | Integer | Foreign key to `Brokerages` |

#### **Brokerages**

| Column | Type    | Description    |
| ------ | ------- | -------------- |
| `id`   | Integer | Primary key    |
| `name` | String  | Brokerage name |
| `code` | String  | Brokerage code |

#### **StockMasters**

| Column     | Type    | Description              |
| ---------- | ------- | ------------------------ |
| `id`       | Integer | Primary key              |
| `name`     | String  | Stock reference name     |
| `code`     | String  | Stock reference code     |
| `SectorId` | Integer | Foreign key to `Sectors` |
| `UserId`   | Integer | Foreign key to `Users`   |

#### **StockMappers**

| Column          | Type    | Description                   |
| --------------- | ------- | ----------------------------- |
| `id`            | Integer | Primary key                   |
| `UserId`        | Integer | Foreign key to `Users`        |
| `BrokerageId`   | Integer | Foreign key to `Brokerages`   |
| `StockMasterId` | Integer | Foreign key to `StockMasters` |

#### **Sectors**

| Column   | Type    | Description            |
| -------- | ------- | ---------------------- |
| `id`     | Integer | Primary key            |
| `name`   | String  | Sector name            |
| `UserId` | Integer | Foreign key to `Users` |

#### **UserStocks**

| Column          | Type    | Description                   |
| --------------- | ------- | ----------------------------- |
| `id`            | Integer | Primary key                   |
| `UserId`        | Integer | Foreign key to `Users`        |
| `StockMapperId` | Integer | Foreign key to `StockMappers` |
| `Qty`           | Integer | Stock quantity                |
| `AvgCost`       | Double  | Average stock cost            |
| `Date`          | Date    | Uploaded date                 |

---

## Deployment with Docker

1. **Build and Store the Docker Container for deployment**:

   ```bash
   docker build -t docker_username/pmapp-backend:latest .
   docker push docker_username/pmapp-backend:latest
   ```

2. **Access the Application**:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

---

## Project Structure

- **`src/`**: Main source directory.
  - **`controllers/`**: Handles incoming API requests and responses.
  - **`models/`**: Defines Sequelize models and database relationships.
  - **`routes/`**: API endpoints and route definitions.
  - **`auth/`**: Custom middleware for validation, authentication, etc.
  - **`db/`**: Database configuration, migrations, and seeders.

---

## NPM Scripts

| Script                          | Description                         |
| ------------------------------- | ----------------------------------- |
| `npm run dev`                   | Run the server in development mode  |
| `npm run start`                 | Start the server in production mode |
| `npx sequelize-cli db:migrate`  | Run database migrations             |
| `npx sequelize-cli db:seed:all` | Seed the database with initial data |

---

## Related Repositories

- **Frontend**: [PMApp Frontend Repository](https://github.com/hacKRD0/PMApp-Frontend)
- **Deployment**: [PMApp Deployment Repository](https://github.com/hacKRD0/PMApp-deployment)

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For further assistance or inquiries, reach out to:

- **Maintainer**: [Keshava Rajavaram](mailto:keshava.rajavaram@gmail.com)

---
