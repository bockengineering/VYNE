import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageLayout from '../layout/PageLayout';

const API_URL = 'http://localhost:3001/api';

function Pipeline() {
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(`${API_URL}/opportunities`);
      setOpportunities(response.data);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError('Failed to fetch opportunities. Please try again later.');
    }
  };

  return (
    <PageLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Pipeline</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {opportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-bold">{opportunity.title}</h3>
              <p>{opportunity.description}</p>
              <p className="text-gray-600 text-sm">{opportunity.status}</p>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

export default Pipeline;
