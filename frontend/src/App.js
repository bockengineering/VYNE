import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Pipeline from './pages/Pipeline';
import AwardSearch from './pages/AwardSearch';
import PageLayout from './layout/PageLayout';

function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/award-search" element={<AwardSearch />} />
        </Routes>
      </PageLayout>
    </Router>
  );
}

export default App;
