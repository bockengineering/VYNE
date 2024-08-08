const express = require('express');
const asyncHandler = require('express-async-handler');
const db = require('../db');

const router = express.Router();

// Get all companies
router.get('/', asyncHandler(async (req, res) => {
  const companies = await new Promise((resolve, reject) => {
    db.all("SELECT * FROM companies", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
  res.json(companies);
}));

// Create new company
router.post('/', asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const result = await new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO companies (name, description) VALUES (?, ?)",
      [name, description],
      function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
  res.status(201).json({ id: result });
}));

module.exports = router;