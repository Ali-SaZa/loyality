import { Db } from 'mongodb';

export async function renameUserFields(db: Db): Promise<void> {
  console.log('Starting migration: Renaming user fields from firstname/lastname to firstName/lastName...');
  
  try {
    // Get the users collection
    const usersCollection = db.collection('users');
    
    // Update all documents to rename the fields
    const result = await usersCollection.updateMany(
      { 
        $or: [
          { firstname: { $exists: true } },
          { lastname: { $exists: true } }
        ]
      },
      [
        {
          $set: {
            firstName: '$firstname',
            lastName: '$lastname'
          }
        },
        {
          $unset: ['firstname', 'lastname']
        }
      ]
    );
    
    console.log(`Migration completed successfully. Updated ${result.modifiedCount} user documents.`);
    
    // Verify the migration
    const countWithOldFields = await usersCollection.countDocuments({
      $or: [
        { firstname: { $exists: true } },
        { lastname: { $exists: true } }
      ]
    });
    
    const countWithNewFields = await usersCollection.countDocuments({
      $or: [
        { firstName: { $exists: true } },
        { lastName: { $exists: true } }
      ]
    });
    
    console.log(`Verification: ${countWithOldFields} documents still have old fields, ${countWithNewFields} documents have new fields.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

export async function rollbackUserFields(db: Db): Promise<void> {
  console.log('Rolling back migration: Renaming user fields from firstName/lastName to firstname/lastname...');
  
  try {
    // Get the users collection
    const usersCollection = db.collection('users');
    
    // Update all documents to rename the fields back
    const result = await usersCollection.updateMany(
      { 
        $or: [
          { firstName: { $exists: true } },
          { lastName: { $exists: true } }
        ]
      },
      [
        {
          $set: {
            firstname: '$firstName',
            lastname: '$lastName'
          }
        },
        {
          $unset: ['firstName', 'lastName']
        }
      ]
    );
    
    console.log(`Rollback completed successfully. Updated ${result.modifiedCount} user documents.`);
    
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
}
