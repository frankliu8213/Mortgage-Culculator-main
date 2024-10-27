import React from 'react';
import MortgageCalculator from './components/MortgageCalculator';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <MortgageCalculator />
      </div>
    </LanguageProvider>
  );
}

export default App;