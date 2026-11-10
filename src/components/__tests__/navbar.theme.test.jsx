import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from '../navbar';

describe('Navbar theme controls', () => {
  test('shows and invokes the light-mode toggle in dark mode', () => {
    const onToggleTheme = jest.fn();
    render(<Navbar tab="home" setTab={jest.fn()} user={null} onShowSignup={jest.fn()} onShowLogin={jest.fn()} mobileMenu={false} setMobileMenu={jest.fn()} theme="dark" onToggleTheme={onToggleTheme} />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Switch to light mode' })[0]);
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  test('exposes an accessible dark-mode toggle in light mode', () => {
    render(<Navbar tab="home" setTab={jest.fn()} user={null} onShowSignup={jest.fn()} onShowLogin={jest.fn()} mobileMenu={false} setMobileMenu={jest.fn()} theme="light" onToggleTheme={jest.fn()} />);
    expect(screen.getAllByRole('button', { name: 'Switch to dark mode' })).toHaveLength(2);
  });
});
