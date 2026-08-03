const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('ADMIN1', salt);

      // Find or reset main super admin
      let admin = await User.findOne({
        $or: [
          { username: 'admin1' },
          { email: 'admin1@vivekanand.com' },
          { email: 'admin@vivekanand.com' },
          { name: 'admin1' },
          { name: 'admin' }
        ]
      });

      if (admin) {
        admin.name = 'admin1';
        admin.username = 'admin1';
        admin.email = 'admin1@vivekanand.com';
        admin.role = 'Super Admin';
        admin.isVerified = true;
        admin.isActive = true;
        // Direct set hashed password to prevent any double-hashing
        await User.updateOne(
          { _id: admin._id },
          {
            $set: {
              name: 'admin1',
              username: 'admin1',
              email: 'admin1@vivekanand.com',
              password: hashedPassword,
              role: 'Super Admin',
              isVerified: true,
              isActive: true
            }
          }
        );
        console.log('✅ Super Admin (admin1 / ADMIN1) reset & ready.');
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
