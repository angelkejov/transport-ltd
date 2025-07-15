const pool = require('./config/db');

async function migrateGallery() {
  try {
    console.log('Starting gallery migration...');
    
    // Check if mediaType column exists
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'gallery' 
      AND COLUMN_NAME = 'mediaType'
    `);
    
    if (columns.length === 0) {
      // Add mediaType column
      await pool.execute(`
        ALTER TABLE gallery 
        ADD COLUMN mediaType ENUM('image', 'video') DEFAULT 'image'
      `);
      console.log('Added mediaType column');
    } else {
      console.log('mediaType column already exists');
    }
    
    // Update existing records to have 'image' as default mediaType
    await pool.execute(`
      UPDATE gallery 
      SET mediaType = 'image' 
      WHERE mediaType IS NULL
    `);
    
    console.log('Gallery migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateGallery(); 