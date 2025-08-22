// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Create the loyalty database and collections
db = db.getSiblingDB('loyalty');

// Create some initial collections
db.createCollection('users');
db.createCollection('stores');
db.createCollection('scratch_cards');
db.createCollection('transactions');
db.createCollection('otps');

// Insert a test document to verify the database is working
db.users.insertOne({
  email: 'test@example.com',
  phone: '+989123456789',
  createdAt: new Date(),
  updatedAt: new Date()
});

// Switch back to admin database to create user with proper permissions
db = db.getSiblingDB('admin');

// Create a user for the loyalty database with appropriate permissions
db.createUser({
  user: 'admin',
  pwd: 'admin123',
  roles: [
    {
      role: 'readWrite',
      db: 'loyalty'
    },
    {
      role: 'dbAdmin',
      db: 'loyalty'
    },
    {
      role: 'readWrite',
      db: 'admin'
    }
  ]
});

print('Loyalty database initialized successfully!');
