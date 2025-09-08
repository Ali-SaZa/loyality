const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loyalty');

// Define schemas
const userSchema = new mongoose.Schema({
  phoneNumber: String,
  firstName: String,
  lastName: String,
  role: String
});

const storeSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  address: Object,
  status: String
});

const User = mongoose.model('User', userSchema);
const Store = mongoose.model('Store', storeSchema);

async function debugStoreLookup() {
  try {
    console.log('=== Debugging Store Lookup ===');
    
    // JWT payload data
    const jwtUserId = '68b8b87d758c4d96c512b981';
    const jwtPhoneNumber = '09122222222';
    
    console.log(`\nJWT Token Data:`);
    console.log(`- userId: ${jwtUserId}`);
    console.log(`- phoneNumber: ${jwtPhoneNumber}`);
    
    // Find user by phone number
    const user = await User.findOne({ phoneNumber: jwtPhoneNumber });
    console.log(`\nUser found by phone number:`);
    console.log(JSON.stringify(user, null, 2));
    
    if (user) {
      console.log(`\nUser._id: ${user._id}`);
      console.log(`JWT userId: ${jwtUserId}`);
      console.log(`Match: ${user._id.toString() === jwtUserId}`);
    }
    
    // Find store by userId from JWT
    const storeByJwtUserId = await Store.findOne({ userId: jwtUserId });
    console.log(`\nStore found by JWT userId:`);
    console.log(JSON.stringify(storeByJwtUserId, null, 2));
    
    // Find store by actual user._id
    if (user) {
      const storeByActualUserId = await Store.findOne({ userId: user._id });
      console.log(`\nStore found by actual user._id:`);
      console.log(JSON.stringify(storeByActualUserId, null, 2));
    }
    
    // List all stores
    const allStores = await Store.find({}).populate('userId', 'phoneNumber firstName lastName role');
    console.log(`\nAll stores in database:`);
    allStores.forEach((store, index) => {
      console.log(`\nStore ${index + 1}:`);
      console.log(`- _id: ${store._id}`);
      console.log(`- name: ${store.name}`);
      console.log(`- phoneNumber: ${store.phoneNumber}`);
      console.log(`- userId: ${store.userId}`);
      if (store.userId && typeof store.userId === 'object') {
        console.log(`- userId._id: ${store.userId._id}`);
        console.log(`- userId.phoneNumber: ${store.userId.phoneNumber}`);
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

debugStoreLookup();
