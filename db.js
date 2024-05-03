import mongoose from 'mongoose';

const mongodbURL = process.env.mongodb;

mongoose.connect(mongodbURL);

const db = mongoose.connection;

db.on('error', () => {
  console.log('Error occurred while connecting to database');
});

db.on('connected', () => {
  console.log('MongoDB connected');
});

export default db;
