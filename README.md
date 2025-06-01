# 100x Buildathon

## Overview

The 100x Buildathon project is a comprehensive suite of tools designed to streamline and enhance the software development lifecycle. It integrates AI-powered features to assist developers with various tasks, from code generation and analysis to deployment and environment provisioning.

## Scope of the Project / Features

The project aims to deliver the following key features:

1.  **README Generator**: Automatically generates README files for projects.
2.  **Pull Request Analyzer**: Analyzes pull requests for quality, potential issues, and provides summaries.
3.  **Vulnerability Scanner**: Scans codebases for known security vulnerabilities.
4.  **Chat with Code**: Allows developers to interact with their codebase using natural language queries.
5.  **Deploy with Chat**: Enables project deployment through chat-based commands.
6.  **Code Structure Visualization**: Provides tools to visualize the architecture and dependencies of a codebase.
7.  **Automated Testing**: Facilitates the generation and execution of automated tests.
8.  **Development Environment Provisioning**: Automates the setup of development environments.

## Tech Stack

The project is built using a modern technology stack:

*   **Frontend**:
    *   Next.js
    *   React
    *   TypeScript
    *   Tailwind CSS
    *   Shadcn/ui (based on Radix UI components)
*   **Backend**:
    *   Node.js
    *   Express.js
    *   Prisma (ORM)
    *   PostgreSQL (Database)
    *   Redis (Caching and Message Brokering)
*   **AI Service**:
    *   Python
    *   Flask
    *   Google Generative AI
*   **Containerization**:
    *   Docker
    *   Docker Compose

## Project Structure

The monorepo is organized into the following main directories:

```
10000x-devs/
├── ai/                   # Python/Flask based AI services
├── backend/              # Node.js/Express.js backend application
├── frontend/             # Next.js frontend application
├── docker-compose.yml    # Docker Compose configuration for services like PostgreSQL and Redis
└── README.md             # This file
```

*   `ai/`: Contains the Flask application responsible for AI-powered features, utilizing Google Generative AI.
*   `backend/`: Houses the Express.js API server, handling business logic, database interactions via Prisma, authentication, and communication with other services.
*   `frontend/`: The Next.js application providing the user interface and interacting with the backend API.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

*   [Node.js](https://nodejs.org/) (v18 or later recommended)
*   [pnpm](https://pnpm.io/) (Package manager)
*   [Python](https://www.python.org/) (v3.8 or later recommended)
*   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/MananGandhi1810/100x-buildathon.git
cd 100x-buildathon
```

### 2. Start Dependent Services (PostgreSQL and Redis)

Use Docker Compose to start the PostgreSQL database and Redis instance:

```bash
docker-compose up -d
```

This command will download the necessary images and run the containers in detached mode.

### 3. Install Dependencies

Install dependencies for each part of the project using `pnpm`:

*   **Backend**:
    ```bash
    cd backend
    pnpm install
    pnpm prisma generate # Generate Prisma Client
    pnpm prisma migrate dev # Apply database migrations
    cd ..
    ```

*   **Frontend**:
    ```bash
    cd frontend
    pnpm install
    cd ..
    ```

*   **AI Service**:
    ```bash
    cd ai
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    cd ..
    ```

### 4. Run the Applications

*   **Backend Server**:
    ```bash
    cd backend
    pnpm dev
    ```
    The backend server will typically start on `http://localhost:3001` (or as configured).

*   **Frontend Application**:
    ```bash
    cd frontend
    pnpm dev
    ```
    The frontend development server will typically start on `http://localhost:3000`.

*   **AI Service**:
    ```bash
    cd ai
    source venv/bin/activate # If not already activated
    flask run
    ```
    The Flask AI service will typically start on `http://localhost:5000`.

## Available Scripts

### Backend (`backend/package.json`)

*   `pnpm dev`: Starts the backend server in development mode with Nodemon.
*   `pnpm start`: Starts the backend server.
*   `pnpm format`: Formats code using Prettier.
*   `pnpm docker:build`: Builds a Docker image for the backend application.
*   `pnpm test`: Runs tests using Vitest.
*   `pnpm prisma generate`: Generates Prisma Client.
*   `pnpm prisma migrate dev`: Applies database migrations.
*   `pnpm prisma studio`: Opens Prisma Studio to view and manage data.

### Frontend (`frontend/package.json`)

*   `pnpm dev`: Starts the Next.js development server with Turbopack.
*   `pnpm build`: Builds the Next.js application for production.
*   `pnpm start`: Starts the Next.js production server.
*   `pnpm lint`: Lints the codebase using Next.js ESLint configuration.

### AI (`ai/`)

*   `flask run`: Starts the Flask development server (ensure `FLASK_APP=app.py` is set in `.env` or environment).

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding standards and includes tests where applicable.

## License

This project is licensed under the [ISC License](backend/LICENSE) (assuming the backend's LICENSE file applies to the whole project, please verify and update if necessary).

---

This README provides a comprehensive guide to understanding, setting up, and contributing to the 100x Buildathon project. If you encounter any issues or have suggestions, please open an issue on the project's repository.
