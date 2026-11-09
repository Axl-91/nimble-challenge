import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import JobApplicationPage from './JobApplicationPage'
import type { CandidateInfo, JobInfo } from '../types'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}))

import axios from 'axios'

const candidate: CandidateInfo = {
  uuid: 'candidate-uuid',
  candidateId: 'candidate-id',
  applicationId: 'application-id',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
}

const job: JobInfo = { id: 'job-123', title: 'Frontend Engineer' }

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[{ pathname: '/jobs/job-123', state: { job } }]}>
      <Routes>
        <Route path='/jobs/:jobId' element={<JobApplicationPage candidate={candidate} />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('JobApplicationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the application form for a job', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'Frontend Engineer' })).toBeInTheDocument()
    expect(screen.getByText(/Job ID: job-123/)).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub repository URL')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit application' })).toBeInTheDocument()
  })

  it('shows validation feedback for an invalid GitHub URL', async () => {
    renderPage()

    fireEvent.change(screen.getByLabelText('GitHub repository URL'), {
      target: { value: 'https://gitlab.com/user/repository' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit application' }))

    expect(
      await screen.findByText('Please enter a valid GitHub repository URL (https://github.com/...).'),
    ).toBeInTheDocument()
    expect(axios.post).not.toHaveBeenCalled()
  })
})
