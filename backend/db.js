const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./vyne.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

db.serialize(() => {
  // Create companies table
  db.run(`CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating companies table:', err.message);
    } else {
      console.log('Companies table is ready');
    }
  });

  // Create or update opportunities table
  db.run(`CREATE TABLE IF NOT EXISTS opportunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    priority TEXT,
    amount INTEGER,
    date TEXT,
    status TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating opportunities table:', err.message);
    } else {
      console.log('Opportunities table is ready');
      
      // Check if company_id column exists and add it if it doesn't
      db.all("PRAGMA table_info(opportunities)", (err, rows) => {
        if (err) {
          console.error('Error checking opportunities table schema:', err.message);
        } else {
          const companyIdExists = rows.some(row => row.name === 'company_id');
          
          if (!companyIdExists) {
            db.run(`ALTER TABLE opportunities ADD COLUMN company_id INTEGER REFERENCES companies(id)`, (err) => {
              if (err) {
                console.error('Error adding company_id column:', err.message);
              } else {
                console.log('Added company_id column to opportunities table');
              }
            });
          } else {
            console.log('company_id column already exists in opportunities table');
          }
        }
      });
    }
  });
});

module.exports = db;