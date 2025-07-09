## CHAT API

## Description
A RESTful API for chat built with Node.js, Express

## Prerequisites
- Node.js
- MySQL


## Installation
1. Clone the repository:
```bash
git clone https://github.com/hienle15/chatapp-api

```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration:
```env
PORT=3000
HOST=localhost
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
DB_PORT=3306
API_VERSION=/api/v1
```

## Running the Application
Development mode:
```bash
npm run dev
```

Build and run:
```bash
npm run build
npm start
```

## API Documentation
Access Swagger documentation at:
```
http://localhost:3000/api-docs


## Project Structure
```
src/
├── config/
├── controllers/
├── middleware/
├── routes/

```