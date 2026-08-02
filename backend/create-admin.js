require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.model');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const adminExists = await User.findOne({ email: 'admin@vivekanand.com' });
    
    if (adminExists) {
      // update password to be sure
      adminExists.name = 'admin';
      adminExists.password = 'Admin@123';
      adminExists.role = 'Super Admin';
      adminExists.isVerified = true;
      await adminExists.save();
      console.log('Admin already exists. Password reset to Admin@123');
    } else {
      await User.create({
        name: 'admin',
        email: 'admin@vivekanand.com',
        password: 'Admin@123',
        role: 'Super Admin',
        isVerified: true
      });
      console.log('Admin created: admin@vivekanand.com / Admin@123');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
