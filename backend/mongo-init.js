// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Starting MongoDB initialization...');

// Switch to admin database first
db = db.getSiblingDB('admin');

// Create root admin user if it doesn't exist
try {
  db.createUser({
    user: 'admin',
    pwd: 'admin123',
    roles: [
      { role: 'root', db: 'admin' }
    ]
  });
  print('Root admin user created successfully');
} catch (e) {
  print('Root admin user already exists or error: ' + e.message);
}

// Create the loyalty database
db = db.getSiblingDB('loyalty');

// Create collections
db.createCollection('users');
db.createCollection('stores');
db.createCollection('scratch_cards');
db.createCollection('transactions');
db.createCollection('otps');
db.createCollection('promotions');
db.createCollection('promo_codes');

print('Collections created successfully');

// Switch back to admin database to create loyalty user
db = db.getSiblingDB('admin');

// Create a user specifically for the loyalty database
try {
  db.createUser({
    user: 'loyalty_user',
    pwd: 'admin123',
    roles: [
      {
        role: 'readWrite',
        db: 'loyalty'
      },
      {
        role: 'dbAdmin',
        db: 'loyalty'
      }
    ]
  });
  print('Loyalty user created successfully');
} catch (e) {
  print('Loyalty user already exists or error: ' + e.message);
}

print('MongoDB initialization completed successfully!');