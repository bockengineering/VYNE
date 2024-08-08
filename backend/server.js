const express = require('express');
const cors = require('cors');
const opportunityRoutes = require('./routes/opportunityRoutes');
const companyRoutes = require('./routes/companyRoutes');
const usaspendingRoutes = require('./routes/usaspendingRoutes');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/opportunities', opportunityRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api', usaspendingRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});