import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const CompanyCard = ({ company, onEdit }) => (
  <div className="bg-white p-4 mb-4 rounded shadow">
    <h3 className="font-bold text-lg mb-2">{company.name}</h3>
    <p className="text-gray-600 mb-2">{company.description}</p>
    <button onClick={() => onEdit(company)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
  </div>
);

const CompanyForm = ({ company, onSave, onClose }) => {
  const [formData, setFormData] = useState(company || { name: '', description: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-bold mb-4">{company ? 'Edit Company' : 'New Company'}</h3>
        <form onSubmit={handleSubmit}>
          <input 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Company Name" 
            className="mb-2 w-full p-2 border rounded" 
          />
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Company Description" 
            className="mb-2 w-full p-2 border rounded" 
          />
          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Portfolio() {
  const [companies, setCompanies] = useState([]);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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

  const handleSave = async (companyData) => {
    try {
      if (companyData.id) {
        await axios.put(`${API_URL}/companies/${companyData.id}`, companyData);
      } else {
        await axios.post(`${API_URL}/companies`, companyData);
      }
      fetchCompanies();
      setIsFormOpen(false);
      setEditingCompany(null);
    } catch (err) {
      console.error('Error saving company:', err);
      setError('Failed to save company. Please try again.');
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Company Portfolio</h1>
        <button onClick={() => setIsFormOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">+ New Company</button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {companies.length === 0 ? (
        <p className="text-gray-500">No companies added yet. Click the "New Company" button to add one.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map(company => (
            <CompanyCard key={company.id} company={company} onEdit={handleEdit} />
          ))}
        </div>
      )}
      {isFormOpen && (
        <CompanyForm
          company={editingCompany}
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCompany(null);
          }}
        />
      )}
    </div>
  );
}

export default Portfolio;