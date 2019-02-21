import React from 'react';
import CurrencyConverter from './CurrencyConverter';
import './app.css';

export default function App() {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#!">Currency Converter</a>
        </nav>
      </header>
      <div className="container">
        <CurrencyConverter />
      </div>
    </>
  );
}