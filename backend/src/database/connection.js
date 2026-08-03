const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is undefined in environment variables.');
      return;
    }

    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected Successfully`);

    // Auto-seed or update default Super Admin (admin1 / ADMIN1)
    try {
      const User = require('../models/User.model');
      let adminExists = await User.findOne({
        $or: [
          { username: 'admin1' },
          { email: 'admin1@vivekanand.com' },
          { email: 'admin@vivekanand.com' },
          { name: 'admin1' },
          { name: 'admin' }
        ]
      });

      if (adminExists) {
        adminExists.name = 'admin1';
        adminExists.username = 'admin1';
        adminExists.email = 'admin1@vivekanand.com';
        adminExists.password = 'ADMIN1';
        adminExists.role = 'Super Admin';
        adminExists.isVerified = true;
        adminExists.isActive = true;
        await adminExists.save();
        console.log('✅ Super Admin (admin1 / ADMIN1) updated & ready.');
      } else {
        await User.create({
          name: 'admin1',
          username: 'admin1',
          email: 'admin1@vivekanand.com',
          password: 'ADMIN1',
          role: 'Super Admin',
          isVerified: true,
          isActive: true
        });
        console.log('✅ Super Admin (admin1 / ADMIN1) created & ready.');
      }
    } catch (seedErr) {
      console.error('⚠️ Could not auto-seed Super Admin:', seedErr.message);
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`);
    console.error(error);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected!');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected!');
});

module.exports = connectDB;
