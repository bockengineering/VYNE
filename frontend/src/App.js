import React from 'react';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Pipeline from './pages/Pipeline';
import AwardSearch from './pages/AwardSearch';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <nav className="w-64 bg-white shadow-md">
          <ul className="py-4">
            <li><Link to="/" className="block px-4 py-2 hover:bg-gray-200">Home</Link></li>
            <li><Link to="/portfolio" className="block px-4 py-2 hover:bg-gray-200">Portfolio</Link></li>
            <li><Link to="/pipeline" className="block px-4 py-2 hover:bg-gray-200">Pipeline</Link></li>
            <li><Link to="/award-search" className="block px-4 py-2 hover:bg-gray-200">Award Search</Link></li>
          </ul>
        </nav>

        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/award-search" element={<AwardSearch />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;