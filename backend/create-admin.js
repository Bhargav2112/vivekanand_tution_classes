require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User.model');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const adminExists = await User.findOne({
      $or: [
        { username: 'admin1' },
        { email: 'admin1@vivekanand.com' },
        { email: 'admin@vivekanand.com' },
        { name: 'admin1' }
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
      console.log('Super Admin updated successfully: username=admin1, password=ADMIN1');
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
      console.log('Super Admin created successfully: username=admin1, password=ADMIN1');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
