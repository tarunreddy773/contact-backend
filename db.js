import mongoose from 'mongoose';

// Retrieve MongoDB connection URL from environment variable
const mongodbURL = process.env.mongodb;

// Connect to MongoDB database
mongoose.connect(mongodbURL);

// Capture reference to the MongoDB connection
const db = mongoose.connection;

// Event listener for connection errors
db.on('error', () => {
  console.log('Error occurred while connecting to database');
});

// Event listener for successful connection
db.on('connected', () => {
  console.log('MongoDB connected');
});

// Export the database connection object
export default db;
