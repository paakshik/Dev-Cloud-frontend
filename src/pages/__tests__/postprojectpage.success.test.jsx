import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// mock react-toastify
jest.mock('react-toastify', () => ({ toast: { warn: jest.fn(), success: jest.fn(), error: jest.fn() } }))

// mock fetchJSON
jest.mock('../../utils/api', () => ({ fetchJSON: jest.fn() }))

import { fetchJSON } from '../../utils/api'
import PostProjectPage from '../postprojectpage'

describe('PostProjectPage success path', () => {
  test('submits form when user present and calls reload on success', async () => {
    const reload = jest.fn()
    const user = { id: 'u_post_1' }

    fetchJSON.mockResolvedValueOnce({})

    render(<PostProjectPage reload={reload} user={user} />)

    await userEvent.type(screen.getByPlaceholderText(/Project Title/i), 'My Project')
    await userEvent.type(screen.getByPlaceholderText(/Project Description/i), 'Desc')
    await userEvent.click(screen.getByRole('button', { name: /Post Project/i }))

    await waitFor(() => expect(fetchJSON).toHaveBeenCalled())
    const { toast } = require('react-toastify')
    await waitFor(() => expect(toast.success).toHaveBeenCalled())
    expect(reload).toHaveBeenCalled()
  })
})
