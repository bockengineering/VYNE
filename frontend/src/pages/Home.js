import React from 'react';
import PageLayout from '../layout/PageLayout';

function Home() {
  return (
    <PageLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to VYNE</h1>
        <p>Manage your company profiles and discover federal contract opportunities.</p>
      </div>
    </PageLayout>
  );
}

export default Home;
