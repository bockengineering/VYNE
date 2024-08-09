import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '../layout/PageLayout';

const API_URL = 'http://localhost:3001/api';

function Portfolio() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to fetch companies. Please try again later.');
    }
  };

  return (
    <PageLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Portfolio</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div key={company.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold">{company.name}</h3>
              <p>{company.description}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default Portfolio;
