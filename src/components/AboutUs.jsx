// AboutUs.jsx
import React from 'react';
import './AboutUs.css';
import financialMarketImage from './financialMarketImage.jpg';

const AboutUs = () => {
  return (
    <div className="about-us">
      <h1>About Us</h1>
      <p>We are team 34 from SCE. Ori, Tal, Vlad and Gai. We work together with VLS.</p>
      <p>So welcome to our project! This project aims to provide personalized provident fund recommendations.</p>
      <h2>Our Story</h2>
      <p>Our journey began with the mission to help individuals make informed financial decisions. By leveraging technology and data, we strive to offer the best fund options tailored to your needs.</p>
      <h2>About the Funds</h2>
      <p>Our platform includes various funds, each with unique characteristics and performance metrics. We analyze and recommend the best options based on your personal preferences and financial goals.</p>
      <h2>What is a Fund?</h2>
      <p>A fund is a pool of money collected from many investors to invest in securities such as stocks, bonds, money market instruments, and other assets. Funds are managed by professional fund managers who allocate the fund's assets and attempt to produce capital gains and income for the fund's investors. The structure of the fund provides diversification, which helps in spreading risk.</p>
      <img src={financialMarketImage} alt="Financial Market" className="financial-market-image" />

    </div>
  );
};

export default AboutUs;