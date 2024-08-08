const express = require('express');
const asyncHandler = require('express-async-handler');
const db = require('../db');

const router = express.Router();

// Get all opportunities
router.get('/', asyncHandler(async (req, res) => {
  const opportunities = await new Promise((resolve, reject) => {
    db.all(`
      SELECT o.*, c.name as company_name 
      FROM opportunities o
      LEFT JOIN companies c ON o.company_id = c.id
    `, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
  res.json(opportunities);
}));

// Create new opportunity
router.post('/', asyncHandler(async (req, res) => {
  const { type, title, priority, amount, date, status, company_id } = req.body;
  const result = await new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO opportunities (type, title, priority, amount, date, status, company_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [type, title, priority, amount, date, status, company_id],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
  res.status(201).json({ id: result });
}));

// Update opportunity
router.put('/:id', asyncHandler(async (req, res) => {
  const { type, title, priority, amount, date, status, company_id } = req.body;
  await new Promise((resolve, reject) => {
    db.run(
      "UPDATE opportunities SET type = ?, title = ?, priority = ?, amount = ?, date = ?, status = ?, company_id = ? WHERE id = ?",
      [type, title, priority, amount, date, status, company_id, req.params.id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
  res.status(200).json({ message: 'Opportunity updated' });
}));

module.exports = router;