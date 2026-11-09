import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import JobsTable from './JobsTable'
import type { JobInfo } from '../types'

const jobs: JobInfo[] = [{ id: 'job-123', title: 'Frontend Engineer' }]

describe('JobsTable', () => {
  it('renders job details and an apply action', () => {
    render(
      <MemoryRouter>
        <JobsTable jobs={jobs} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Job type' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Action' })).toBeInTheDocument()
    expect(screen.getByText('job-123')).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()

    const applyLink = screen.getByRole('link', { name: 'Apply' })
    expect(applyLink).toHaveAttribute('href', '/jobs/job-123')
  })
})
