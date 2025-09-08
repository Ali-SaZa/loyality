import { MongoClient } from 'mongodb';
import { renameUserFields } from '../src/migrations/rename-user-fields.migration';

async function runMigration() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/loyalty';
  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db();
    console.log('Connected to database:', db.databaseName);
    
    // Run the migration
    await renameUserFields(db);
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

export { runMigration };
