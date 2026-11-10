import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from '../homepage'

describe('HomePage', () => {
  test('renders hero and CTA buttons', async () => {
    const onLogin = jest.fn()
    const onExplore = jest.fn()
    const onPost = jest.fn()

    render(
      <HomePage stats={{ projects: 5, messages: 4, users: 10 }} onLoginClick={onLogin} onExploreProjects={onExplore} onPostProject={onPost} />
    )

    expect(screen.getByText(/right people\./i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Explore Projects/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Get Started/i }))
    expect(onLogin).toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: /Explore Projects/i }))
    expect(onExplore).toHaveBeenCalled()
  })
})
