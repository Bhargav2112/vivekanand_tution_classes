require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/User.model');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('ADMIN1', salt);

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
      await User.updateOne(
        { _id: adminExists._id },
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
