import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const PriorityTag = ({ priority }) => {
  const colorClass = {
    'Low': 'bg-green-200 text-green-800',
    'Medium': 'bg-blue-200 text-blue-800',
    'High': 'bg-yellow-200 text-yellow-800',
    'Important': 'bg-red-200 text-red-800'
  }[priority] || 'bg-gray-200 text-gray-800';

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {priority}
    </span>
  );
};

const OpportunityCard = ({ item, onEdit }) => (
  <div className="bg-white p-4 mb-2 rounded shadow cursor-pointer" onClick={() => onEdit(item)}>
    <div className="flex justify-between items-start mb-2">
      <span className="text-sm text-gray-600">{item.type}</span>
      {item.priority && <PriorityTag priority={item.priority} />}
    </div>
    <h3 className="font-semibold mb-2">{item.title}</h3>
    {item.amount && <p className="text-sm">Amount: ${item.amount.toLocaleString()}</p>}
    {item.date && <p className="text-sm text-gray-600">{item.date}</p>}
    {item.company_name && <p className="text-sm text-blue-600">Company: {item.company_name}</p>}
  </div>
);

const Column = ({ title, items, total, onEdit }) => (
  <div className="bg-gray-100 p-4 rounded-lg w-1/4">
    <h2 className="font-bold mb-4 flex justify-between">
      <span>{title} <span className="ml-2 text-gray-500">{items.length}</span></span>
      <span className="text-sm">Total: ${total.toLocaleString()}</span>
    </h2>
    {items.map(item => <OpportunityCard key={item.id} item={item} onEdit={onEdit} />)}
  </div>
);

const OpportunityForm = ({ opportunity, companies, onSave, onClose }) => {
  const [formData, setFormData] = useState(opportunity || {
    type: 'Opportunity',
    title: '',
    priority: '',
    amount: '',
    date: '',
    status: 'Backlog',
    company_id: ''
  });

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
        <h3 className="text-lg font-bold mb-4">{opportunity ? 'Edit Opportunity' : 'New Opportunity'}</h3>
        <form onSubmit={handleSubmit}>
          <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" className="mb-2 w-full p-2 border rounded" />
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="mb-2 w-full p-2 border rounded" />
          <input name="priority" value={formData.priority} onChange={handleChange} placeholder="Priority" className="mb-2 w-full p-2 border rounded" />
          <input name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" type="number" className="mb-2 w-full p-2 border rounded" />
          <input name="date" value={formData.date} onChange={handleChange} placeholder="Date" className="mb-2 w-full p-2 border rounded" />
          <select name="status" value={formData.status} onChange={handleChange} className="mb-2 w-full p-2 border rounded">
            <option value="Backlog">Backlog</option>
            <option value="Interested">Interested</option>
            <option value="Pursuing">Pursuing</option>
            <option value="Applied">Applied</option>
          </select>
          <select 
            name="company_id" 
            value={formData.company_id} 
            onChange={handleChange} 
            className="mb-2 w-full p-2 border rounded"
          >
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
          {companies.length === 0 && (
            <p className="text-red-500 text-sm mb-2">No companies available. Please add a company in the Portfolio page first.</p>
          )}
          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={companies.length === 0}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

function Pipeline() {
  const [opportunities, setOpportunities] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOpportunities();
    fetchCompanies();
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

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/companies`);
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to fetch companies. Please try again later.');
    }
  };

  const handleSave = async (opportunityData) => {
    try {
      if (opportunityData.id) {
        await axios.put(`${API_URL}/opportunities/${opportunityData.id}`, opportunityData);
      } else {
        await axios.post(`${API_URL}/opportunities`, opportunityData);
      }
      fetchOpportunities();
      setIsFormOpen(false);
      setEditingOpportunity(null);
    } catch (err) {
      console.error('Error saving opportunity:', err);
      setError('Failed to save opportunity. Please try again.');
    }
  };

  const handleEdit = (opportunity) => {
    setEditingOpportunity(opportunity);
    setIsFormOpen(true);
  };

  const calculateTotal = (items) => items.reduce((sum, item) => sum + (parseInt(item.amount) || 0), 0);

  const filterByStatus = (status) => opportunities.filter(o => o.status === status);

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Demo Project</h1>
        <div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Insights</button>
          <button onClick={() => setIsFormOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">+ New Pursuit</button>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-4">
        <Column title="Backlog" items={filterByStatus('Backlog')} total={calculateTotal(filterByStatus('Backlog'))} onEdit={handleEdit} />
        <Column title="Interested" items={filterByStatus('Interested')} total={calculateTotal(filterByStatus('Interested'))} onEdit={handleEdit} />
        <Column title="Pursuing" items={filterByStatus('Pursuing')} total={calculateTotal(filterByStatus('Pursuing'))} onEdit={handleEdit} />
        <Column title="Applied" items={filterByStatus('Applied')} total={calculateTotal(filterByStatus('Applied'))} onEdit={handleEdit} />
      </div>
      {isFormOpen && (
        <OpportunityForm
          opportunity={editingOpportunity}
          companies={companies}
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditingOpportunity(null);
          }}
        />
      )}
    </div>
  );
}

export default Pipeline;