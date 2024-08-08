import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/usaspending-search';
const AUTOCOMPLETE_URL = 'http://localhost:3001/api/v2/autocomplete/recipient/';

const awardTypeGroups = {
  contracts: 'Contracts',
  grants: 'Grants',
  loans: 'Loans',
  idvs: 'Indefinite Delivery Vehicles',
  other_financial_assistance: 'Other Financial Assistance',
  direct_payments: 'Direct Payments'
};

function AwardModal({ award, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4">{award["Prime Award ID"]}</h3>
        <p><strong>Start Date:</strong> {award["Start Date"]}</p>
        <p><strong>End Date:</strong> {award["End Date"]}</p>
        <p><strong>Current Award Total:</strong> ${parseFloat(award["Current Award Total"]).toLocaleString()}</p>
        <p><strong>Potential Award Total:</strong> ${parseFloat(award["Potential Award Total"]).toLocaleString()}</p>
        <p><strong>Obligated Amount:</strong> ${parseFloat(award["Obligations"]).toLocaleString()}</p>
        <p><strong>Awarding Office:</strong> {award["Awarding Office"]}</p>
        <button onClick={onClose} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
}

function AwardSearch() {
  const [searchParams, setSearchParams] = useState({
    recipient: '',
    startDate: '2008-01-02',
    endDate: new Date().toISOString().split('T')[0],
    awardTypeGroup: 'contracts'
  });
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [selectedAward, setSelectedAward] = useState(null);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });

    if (name === 'recipient' && value.length > 2) {
      try {
        const response = await axios.post(AUTOCOMPLETE_URL, { search_text: value });
        setCompanySuggestions(response.data.results);
      } catch (error) {
        console.error('Error fetching company suggestions:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, searchParams);
      setSearchResults(response.data.transactions || []);
    } catch (err) {
      console.error('Error fetching data from USAspending:', err);
      setError('Failed to fetch data from USAspending. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAwardUrl = (awardId) => {
    return `https://www.usaspending.gov/award/${awardId}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Award Search</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              name="recipient"
              value={searchParams.recipient}
              onChange={handleInputChange}
              placeholder="Recipient (Company Name)"
              className="p-2 border rounded w-full"
              required
            />
            {companySuggestions.length > 0 && (
              <ul className="mt-2 border rounded bg-white">
                {companySuggestions.map((company, index) => (
                  <li 
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchParams(prev => ({ ...prev, recipient: company.legal_entity_name }));
                      setCompanySuggestions([]);
                    }}
                  >
                    {company.legal_entity_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={searchParams.startDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={searchParams.endDate}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
            />
          </div>
          <div>
            <label htmlFor="awardTypeGroup" className="block text-sm font-medium text-gray-700">Award Type</label>
            <select
              id="awardTypeGroup"
              name="awardTypeGroup"
              value={searchParams.awardTypeGroup}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
            >
              {Object.entries(awardTypeGroups).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </form>

      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

{/* Awards Table */}
{searchResults.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Prime Award ID</th>
                <th className="px-4 py-2 text-left">Recipient Name</th>
                <th className="px-4 py-2 text-left">Obligations</th>
                <th className="px-4 py-2 text-left">Award Description</th>
                <th className="px-4 py-2 text-left">Award Type</th>
                <th className="px-4 py-2 text-left">Awarding Agency</th>
                <th className="px-4 py-2 text-left">Awarding Subagency</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result["Prime Award ID"]} className="border-b">
                  <td className="px-4 py-2">
                    <a 
                      href={getAwardUrl(result["Internal ID"])} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {result["Prime Award ID"]}
                    </a>
                  </td>
                  <td className="px-4 py-2">{result["Recipient Name"]}</td>
                  <td className="px-4 py-2">${parseFloat(result["Obligations"]).toLocaleString()}</td>
                  <td className="px-4 py-2">{result["Award Description"]}</td>
                  <td className="px-4 py-2">{result["Award Type"]}</td>
                  <td className="px-4 py-2">{result["Awarding Agency"]}</td>
                  <td className="px-4 py-2">{result["Awarding Subagency"]}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => setSelectedAward(result)} className="bg-blue-500 text-white px-2 py-1 rounded">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAward && (
        <AwardModal award={selectedAward} onClose={() => setSelectedAward(null)} />
      )}

      {searchResults.length === 0 && !isLoading && (
        <p className="text-center text-gray-500">No results found. Please try a different search.</p>
      )}
    </div>
  );
}

export default AwardSearch;