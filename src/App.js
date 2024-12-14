import React, { useState, useEffect, useCallback } from "react";
import "./style.css";
import logo from "./images/logo.png"; // Add your logo image here
import image9 from "./images/image-9.png";
import image16 from "./images/image-16.png";
import image4 from "./images/image-4.png";
import image19 from "./images/image-19.png";
import image from "./images/image.png";
import image10 from "./images/image-10.png";
import image12 from "./images/image-12.png";
import image7 from "./images/image-7.png";
import image13 from "./images/image-13.png";
import arrow from "./images/arrow-1.png"; // Add your arrow image here

const FigmaDesign = () => {
  const [currencyData, setCurrencyData] = useState([]);

  // Move the updateRates function outside of useEffect
  const updateRates = useCallback((data) => {
    // Map the fetched data to the required format and filter out unwanted currencies
    const updatedCurrencyData = data
      .filter(currency => [
        "USD-KES",
        "EUR-KES",
        "USD-UGX",
        "USD-TZS",
        "USD-NGN",
        "GBP-KES",
        "USD-JPY",
        "USD-CNY",
        "CNY-KES"
      ].includes(currency.Currency))
      .map(currency => {
        return {
          label: currency.Currency,
          icon: getCurrencyIcon(currency.Currency),
          buying: currency.BUY,
          selling: currency.SELL
        };
      });

    // Sort the currencies in the specified order
    const sortedCurrencyData = [
      "USD-KES",
      "EUR-KES",
      "USD-UGX",
      "USD-TZS",
      "USD-NGN",
      "GBP-KES",
      "USD-JPY",
      "USD-CNY",
      "CNY-KES"
    ].map(code => updatedCurrencyData.find(currency => currency.label === code));

    // Update state with the new data
    setCurrencyData(sortedCurrencyData);
  }, []);

  useEffect(() => {
    // Fetch the data from the backend
    fetch('http://localhost:3001/')
      .then(response => response.json())
      .then(data => {
        updateRates(data); // Use the updatedRates function here
      })
      .catch(error => console.error('Error fetching rates:', error));
  }, [updateRates]); // Add updateRates to the dependency array

  const getCurrencyIcon = (currencyCode) => {
    // Return the appropriate image for the currency
    switch (currencyCode) {
      case "USD-KES": return image9;
      case "EUR-KES": return image16;
      case "USD-UGX": return image4;
      case "USD-TZS": return image19;
      case "USD-NGN": return image;
      case "GBP-KES": return image12;
      case "USD-JPY": return image10;
      case "USD-CNY": return image7;
      case "CNY-KES": return image13;
      default: return image9; // Default icon if not matched
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const suffix = day % 10 === 1 && day !== 11 ? 'ST' : day % 10 === 2 && day !== 12 ? 'ND' : day % 10 === 3 && day !== 13 ? 'RD' : 'TH';
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString('en-US', options).toUpperCase();
    return formattedDate.replace(day, `${day}${suffix}`);
  };

  const currentDate = formatDate(new Date());

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="logo" />
      <div className="regulation-text">
        Licensed & Regulated by the Central Bank of Kenya & the Bank of Uganda
      </div>
      <div className="exchange-rate-container">
        <div className="exchange-rate-title asset-regular">EXCHANGE RATE</div>
        <div className="exchange-rate-date">{currentDate}</div>
      </div>
      <div className="header">
        <div className="header-left">
          <span className="header-text">BUYING</span>
        </div>
        <div className="header-right">
          <span className="header-text">SELLING</span>
        </div>
      </div>
      <div className="currency-list">
        {currencyData.map((currency, index) => (
          <div key={index} className="currency-row">
            <div className="currency-icon-container">
              <img
                className="currency-icon"
                src={currency.icon}
                alt={`${currency.label} icon`}
              />
            </div>
            <div className="currency-label-container">
              <span>{currency.label}</span>
            </div>
            <div className="currency-action-container">
              <img src={arrow} alt="Arrow" className="arrow-icon" />
            </div>
            <div className="currency-action">{currency.buying}</div>
            <div className="currency-action">{currency.selling}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return <FigmaDesign />;
}

export default App;