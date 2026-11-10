import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ProjectsPage from '../projectpage';

jest.mock('../../components/refreshbutton.jsx', () => () => <button type="button">Refresh</button>);
jest.mock('../../components/models/applymodel.jsx', () => () => null);

describe('ProjectsPage', () => {
  const projects = [
    { id: 'p1', title: 'Alpha Design Tool', organization: 'Studio One', description: 'Build a collaborative design tool', skills: ['React', 'Design'], created_at: '2025-01-01T00:00:00Z', owner_id: 'owner' },
    { id: 'p2', title: 'Beta Data Platform', organization: 'Studio Two', description: 'Open data platform', skills: ['Python'], created_at: '2025-02-01T00:00:00Z', owner_id: 'owner' },
  ];

  test('filters projects by skill and offers clear search', () => {
    render(<ProjectsPage projects={projects} reload={jest.fn()} user={null} loadMessages={jest.fn()} messages={[]} />);
    fireEvent.change(screen.getByRole('searchbox', { name: /search projects/i }), { target: { value: 'python' } });
    expect(screen.getByText('Beta Data Platform')).toBeInTheDocument();
    expect(screen.queryByText('Alpha Design Tool')).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox', { name: /search projects/i }), { target: { value: 'missing project' } });
    expect(screen.getByText('No matching projects')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /clear search/i }));
    expect(screen.getByText('Alpha Design Tool')).toBeInTheDocument();
  });

  test('shows a useful empty state for a search with no matches', () => {
    render(<ProjectsPage projects={projects} reload={jest.fn()} user={null} loadMessages={jest.fn()} messages={[]} />);
    fireEvent.change(screen.getByRole('searchbox', { name: /search projects/i }), { target: { value: 'not found' } });
    expect(screen.getByText('No matching projects')).toBeInTheDocument();
  });
});
