# QnA Tech Task

This repository contains the QnA tech task project, which consists of a Node.js backend and a Next.js frontend.

## Table of Contents

- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Environment Configuration](#environment-configuration)
- [Additional Information](#additional-information)

---

## Running the Backend

To start the Node.js backend:

1. Install dependencies:
    ```bash
    npm i
    ```

2. Navigate to the backend directory:
    ```bash
    cd qna-backend/
    ```

3. Run the server using `ts-node`:
    ```bash
    ts-node src/server.ts
    ```

The backend server will start, and it will be ready to handle API requests.

---

## Running the Frontend

To start the Next.js frontend:

1. Install dependencies:
    ```bash
    npm i
    ```

2. Navigate to the frontend directory:
    ```bash
    cd qna-frontend/
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

The frontend will launch, and you can access the application in your browser at `http://localhost:3000`.

---

## Environment Configuration

Both the backend and frontend require environment variables to be configured. To set these up:

1. Locate the `.env.example` files in the `qna-backend/` and `qna-frontend/` directories.

2. Create a new `.env` file in each directory:
    ```bash
    cd qna-backend/
    cp .env.example .env
    ```
    ```bash
    cd qna-frontend/
    cp .env.example .env
    ```

3. Update the contents of the `.env` files as needed for your environment.

---

## Additional Information

- Ensure that the backend server is running before starting the frontend to avoid API connection errors.
- If you encounter issues, check the logs for detailed error messages and ensure all dependencies are installed properly.

