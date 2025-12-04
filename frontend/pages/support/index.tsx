import React from 'react';

const Support = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white text-center py-12">
        <h1 className="text-4xl font-bold">Support Center</h1>
        <p className="text-xl mt-2">How can we help you today?</p>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Search for answers..."
            className="w-full max-w-lg p-3 rounded-full text-gray-700"
          />
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-12">
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Frequently Asked Questions</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Getting Started</h3>
              <p className="text-gray-600">Find out how to set up your account and start trading.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Deposits & Withdrawals</h3>
              <p className="text-gray-600">Learn about our deposit and withdrawal processes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Security</h3>
              <p className="text-gray-600">Understand the measures we take to protect your account.</p>
            </div>
          </div>
        </section>
        
        <section className="mt-16 text-center">
          <h2 className="text-3xl font-semibold text-gray-800">Contact Us</h2>
          <p className="text-lg text-gray-600 mt-4">Still have questions? Get in touch with our support team.</p>
          <div className="mt-8">
            <a href="mailto:support@oceanic.com" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700">
              Email Support
            </a>
          </div>
        </section>
      </main>
      
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Oceanic. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Support;
