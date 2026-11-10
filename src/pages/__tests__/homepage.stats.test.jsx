import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../homepage';

describe('HomePage stats', () => {
  test('renders community stats correctly without duplicating counts', () => {
    render(<HomePage stats={{ projects: 12, messages: 8, users: 42 }} onLoginClick={() => {}} onExploreProjects={() => {}} onPostProject={() => {}} />);
    expect(screen.getByText('12', { selector: '.home-stat-value' })).toBeInTheDocument();
    expect(screen.getByText('42', { selector: '.home-stat-value' })).toBeInTheDocument();
    expect(screen.getByText('Projects shared')).toBeInTheDocument();
    expect(screen.getByText('People building')).toBeInTheDocument();
  });
});
