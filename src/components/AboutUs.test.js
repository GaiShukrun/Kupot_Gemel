import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AboutUs from './AboutUs';

describe('AboutUs Component', () => {
  it('should render the About Us page when the route is accessed', () => {
    render(
      <MemoryRouter initialEntries={['/about-us']}>
        <Routes>
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if the heading "About Us" is rendered
    expect(screen.getByText('About Us')).toBeInTheDocument();

    // Check if the correct content is rendered
    expect(screen.getByText('We are team 34 from SCE. Ori, Tal, Vlad and Gai. We work together with VLS.')).toBeInTheDocument();
    expect(screen.getByText('Our Story')).toBeInTheDocument();
    expect(screen.getByText('About the Funds')).toBeInTheDocument();
    expect(screen.getByText('What is a Fund?')).toBeInTheDocument();
  });
});
