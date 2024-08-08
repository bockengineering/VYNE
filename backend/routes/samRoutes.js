const express = require('express');
const axios = require('axios');
const router = express.Router();

const SAM_API_KEY = 'v2lgUBonGXUdhyi7gEph3ieO8P2ZHx9vP7eohYdH';
const SAM_API_URL = 'https://api.sam.gov/opportunities/v2/search';

router.post('/sam-search', async (req, res) => {
  try {
    const { keyword, awardee, naicsCode, psc, postedFrom, postedTo } = req.body;

    // Format dates as MM/DD/YYYY
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const response = await axios.get(SAM_API_URL, {
      params: {
        api_key: SAM_API_KEY,
        qTerms: keyword,
        organizationName: awardee,
        naicsCode: naicsCode,
        psc: psc,
        postedFrom: postedFrom ? formatDate(postedFrom) : undefined,
        postedTo: postedTo ? formatDate(postedTo) : undefined,
        limit: 10 // Limit the number of results
      },
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    res.json(response.data.opportunitiesData || []);
  } catch (error) {
    console.error('Error fetching data from SAM.gov:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch data from SAM.gov', details: error.response ? error.response.data : error.message });
  }
});

module.exports = router;