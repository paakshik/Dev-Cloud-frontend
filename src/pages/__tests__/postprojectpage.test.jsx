import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('react-toastify', () => ({ toast: { warn: jest.fn(), success: jest.fn(), error: jest.fn() } }))

import PostProjectPage from '../postprojectpage'

describe('PostProjectPage', () => {
  test('shows warning when submitting without user', async () => {
    const reload = jest.fn()
    render(<PostProjectPage reload={reload} user={null} />)

    const button = screen.getByRole('button', { name: /Post Project/i })
    await userEvent.click(button)

    const { toast } = require('react-toastify')
    expect(toast.warn).toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })
})
