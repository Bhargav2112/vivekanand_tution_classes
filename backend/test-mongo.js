require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log(`Node Version: ${process.version}`);
  console.log(`Mongoose Version: ${mongoose.version}`);
  
  try {
    const rawUri = process.env.MONGODB_URI;
    
    if (!rawUri) {
      console.error('MONGODB_URI is undefined in environment variables.');
      process.exit(1);
    }

    console.log(`Testing Connection...`);
    
    await mongoose.connect(rawUri);
    
    console.log('MongoDB Connected Successfully');
    console.log(`Database Name: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
    await mongoose.disconnect();
    console.log('Disconnected cleanly.');
  } catch (error) {
    console.error('Connection failed with error:');
    console.error(error);
  }
};

testConnection();
