import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import JobsTable from './JobsTable'
import type { CandidateInfo, JobInfo } from '../types'

const candidate: CandidateInfo = {
  uuid: 'candidate-uuid',
  candidateId: 'candidate-id',
  applicationId: 'application-id',
  firstName: 'Ada',
  lastName: 'Lovelace',
  email: 'ada@example.com',
}

const jobs: JobInfo[] = [{ id: 'job-123', title: 'Frontend Engineer' }]

describe('JobsTable', () => {
  it('renders job details and actions', () => {
    render(<JobsTable candidate={candidate} jobs={jobs} />)

    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Github Link' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Action' })).toBeInTheDocument()
    expect(screen.getByText('job-123')).toBeInTheDocument()
    expect(screen.getByText('Frontend Engineer')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })
})
