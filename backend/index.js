// Import Express - Express is a popular Node.js framework for building web applications.

import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/index.js';
import dotenv from 'dotenv';
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";

// Use morgan as a middleware


// Load environment variables from .env file
dotenv.config();




// Initialize the app - Creates an instance of an Express application.
const app = express();
const PORT = 3001; // Define the port on which the server will run.


app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());


app.use('/', userRouter);

//
// Middleware to parse JSON in request bodies
// This ensures that incoming JSON data in the request body is automatically parsed into a JavaScript object.

// Middleware to log each request
// Logs the details of each incoming request, including timestamp, HTTP method, and URL.
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Calls the next middleware or route handler.
});

// MongoDB Connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/userDB';

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// Global error handling middleware
// Catches unhandled errors and responds with a 500 Internal Server Error.
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace.
  res.status(500).json({ error: "Internal Server Error" }); // Respond with a generic error message.
});




export default app

