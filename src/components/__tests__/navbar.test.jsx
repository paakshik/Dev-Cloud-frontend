import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../navbar'

describe('Navbar component', () => {
  test('renders logo and auth buttons when no user', () => {
    const mockSetTab = jest.fn()
    const mockSetMobile = jest.fn()
    const mockShowLogin = jest.fn()
    const mockShowSignup = jest.fn()

    render(
      <Navbar
        tab="home"
        setTab={mockSetTab}
        user={null}
        onShowSignup={mockShowSignup}
        onShowLogin={mockShowLogin}
        mobileMenu={false}
        setMobileMenu={mockSetMobile}
      />
    )

    expect(screen.getByText(/DevCloud/i)).toBeInTheDocument()
    expect(screen.getByText(/Login/i)).toBeInTheDocument()
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument()
  })

  test('clicking logo triggers navigation', async () => {
    const mockSetTab = jest.fn()
    const mockSetMobile = jest.fn()

    render(
      <Navbar
        tab="projects"
        setTab={mockSetTab}
        user={null}
        onShowSignup={() => {}}
        onShowLogin={() => {}}
        mobileMenu={false}
        setMobileMenu={mockSetMobile}
      />
    )

    await userEvent.click(screen.getByText(/DevCloud/i))
    expect(mockSetTab).toHaveBeenCalledWith('home')
  })
})
