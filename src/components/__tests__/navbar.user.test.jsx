import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../navbar'

describe('Navbar with user', () => {
  test('renders user avatar and name when user provided and toggles mobile menu', async () => {
    const mockSetTab = jest.fn()
    const mockSetMobile = jest.fn()
    const mockShowLogin = jest.fn()
    const mockShowSignup = jest.fn()
    const user = { id: 'u1', name: 'Alice', avatar_url: 'http://example.com/a.png' }

    render(
      <Navbar
        tab="profile"
        setTab={mockSetTab}
        user={user}
        onShowSignup={mockShowSignup}
        onShowLogin={mockShowLogin}
        mobileMenu={false}
        setMobileMenu={mockSetMobile}
      />
    )

    expect(screen.getByText(/Alice/i)).toBeInTheDocument()
    const avatar = screen.getByAltText('avatar')
    expect(avatar).toHaveAttribute('src', user.avatar_url)

    // Mobile button has no accessible name; use query to avoid throwing and fallback
    const mobileBtn = screen.queryByRole('button', { name: /menu/i })
    if (mobileBtn) {
      await userEvent.click(mobileBtn)
      expect(mockSetMobile).toHaveBeenCalled()
    } else {
      const btns = screen.getAllByRole('button')
      // click the last button (the mobile menu button in markup)
      await userEvent.click(btns[btns.length - 1])
      expect(mockSetMobile).toHaveBeenCalled()
    }
  })
})
