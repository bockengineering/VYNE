import React from 'react';
import { Sidebar } from './components/Sidebar';
import './PageLayout.css';

const PageLayout = ({ children }) => (
  <div className="page-layout">
    <Sidebar />
    <div className="content">
      {children}
    </div>
  </div>
);

export default PageLayout;
