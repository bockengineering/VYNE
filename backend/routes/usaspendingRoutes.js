const express = require('express');
const axios = require('axios');
const router = express.Router();

const USASPENDING_API_BASE_URL = 'https://api.usaspending.gov/api/v2/';
const AUTOCOMPLETE_API_URL = 'https://api.usaspending.gov/api/v2/autocomplete/recipient/';

const awardTypeCodes = {
  contracts: ['A', 'B', 'C', 'D'],
  grants: ['02', '03', '04', '05'],
  loans: ['07', '08'],
  idvs: ['IDV_A', 'IDV_B', 'IDV_B_A', 'IDV_B_B', 'IDV_B_C', 'IDV_C', 'IDV_D', 'IDV_E'],
  other_financial_assistance: ['06', '10'],
  direct_payments: ['09', '11']
};

router.post('/usaspending-search', async (req, res) => {
  try {
    const { recipient, startDate, endDate, awardTypeGroup } = req.body;

    const today = new Date().toISOString().split('T')[0];
    const defaultStartDate = '2008-01-02';

    const filters = {
      recipient_search_text: [recipient],
      time_period: [{ 
        start_date: startDate || defaultStartDate, 
        end_date: endDate || today 
      }],
      award_type_codes: awardTypeCodes[awardTypeGroup] || awardTypeCodes.contracts
    };

    // First, get the awarding agencies
    const awardingAgencyResponse = await axios.post(`${USASPENDING_API_BASE_URL}search/spending_by_category/awarding_agency`, { filters });

    // Then, get the awarding subagencies
    const awardingSubagencyResponse = await axios.post(`${USASPENDING_API_BASE_URL}search/spending_by_category/awarding_subagency`, { filters });

    const transactionsResponse = await axios.post(`${USASPENDING_API_BASE_URL}search/spending_by_award/`, {
        filters,
        fields: [
          "Award ID",
          "Recipient Name",
          "Action Date",
          "Total Outlays",
          "Award Type",
          "Awarding Agency",
          "Awarding Sub Agency",
          "Start Date",
          "End Date",
          "Award Amount",
          "Description",
          "Awarding Office Name",
          "Contract Award Type",
          "Award Base Action Date",
          "generated_internal_id"
        ],
        page: 1,
        limit: 100,
        sort: "Award Amount",
        order: "desc"
      });
  
      console.log('API Response:', JSON.stringify(transactionsResponse.data, null, 2));
  
      const formattedResults = transactionsResponse.data.results.map(transaction => ({
        "Prime Award ID": transaction["Award ID"],
        "Recipient Name": transaction["Recipient Name"],
        "Obligations": transaction["Award Amount"],
        "Award Description": transaction["Description"],
        "Award Type": transaction["Award Type"] || transaction["Contract Award Type"] || "Not specified",
        "Awarding Agency": transaction["Awarding Agency"],
        "Awarding Subagency": transaction["Awarding Sub Agency"],
        "Start Date": transaction["Start Date"],
        "End Date": transaction["End Date"],
        "Current Award Total": transaction["Award Amount"],
        "Potential Award Total": transaction["Total Outlays"],
        "Awarding Office": transaction["Awarding Office Name"],
        "Internal ID": transaction["generated_internal_id"]
      }));
  
      res.json({
        transactions: formattedResults
      });
    } catch (error) {
      console.error('Error fetching data from USAspending:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Failed to fetch data from USAspending', details: error.response ? error.response.data : error.message });
    }
  });

router.post('/api/v2/autocomplete/recipient', async (req, res) => {
  try {
    const { search_text } = req.body;
    const response = await axios.post(AUTOCOMPLETE_API_URL, { search_text });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching recipient autocomplete:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch recipient autocomplete', details: error.response ? error.response.data : error.message });
  }
});

module.exports = router;