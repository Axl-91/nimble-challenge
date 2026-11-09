import { Alert } from '@mui/material';
import axios from 'axios';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import LoadingPage from './LoadingPage';
import type { CandidateInfo, FlashMessageInfo, JobInfo, SubmitInfo } from '../types';
import { isValidGitHubUrl } from '../utils/validation';

type JobApplicationPageProps = {
  candidate: CandidateInfo;
};

function JobApplicationPage({ candidate }: JobApplicationPageProps) {
  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const { jobId } = useParams<{ jobId: string }>();
  const location = useLocation();
  const stateJob = (location.state as { job?: JobInfo } | null)?.job;

  const [job, setJob] = useState<JobInfo | null>(
    stateJob && stateJob.id === jobId ? stateJob : null,
  );
  const [loading, setLoading] = useState(!stateJob || stateJob.id !== jobId);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [flashMessage, setFlashMessage] = useState<FlashMessageInfo | null>(null);

  useEffect(() => {
    if (!jobId) {
      setLoadError('Missing job ID.');
      setLoading(false);
      return;
    }

    if (job?.id === jobId) {
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await axios.get<JobInfo[]>(`${baseUrl}/api/jobs/get-list`);
        const foundJob = response.data.find((item) => item.id === jobId);
        if (!foundJob) {
          setLoadError('Job not found.');
          return;
        }
        setJob(foundJob);
      } catch (error) {
        console.error('Fetch Error:', error);
        setLoadError('Could not load job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [baseUrl, job?.id, jobId]);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setFlashMessage(null);

    if (!jobId) return;

    if (!isValidGitHubUrl(githubUrl)) {
      setFormError('Please enter a valid GitHub repository URL (https://github.com/...).');
      return;
    }

    setFormError(null);
    setSubmitting(true);

    const submitInfo: SubmitInfo = {
      uuid: candidate.uuid,
      jobId,
      candidateId: candidate.candidateId,
      applicationId: candidate.applicationId,
      repoUrl: githubUrl,
    };

    try {
      const response = await axios.post(`${baseUrl}/api/candidate/apply-to-job`, submitInfo, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        setFlashMessage({ type: 'success', message: 'Application submitted successfully.' });
        setGithubUrl('');
      } else {
        setFlashMessage({ type: 'error', message: 'Unexpected response. Please try again.' });
        console.error('Response:', response);
      }
    } catch (error) {
      console.error('Error on submission', error);
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? String(error.response.data.error)
          : 'There was an error submitting your application.';
      setFlashMessage({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='w-full px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-3xl'>
        <Link
          to='/'
          className='mb-6 inline-flex items-center text-sm font-semibold text-violet-700 transition-colors duration-150 hover:text-violet-500'
        >
          ← Back to job listings
        </Link>

        {loading ? (
          <LoadingPage />
        ) : loadError || !job ? (
          <div className='rounded-xl bg-white p-6 shadow-sm'>
            <Alert severity='error' variant='outlined'>
              {loadError ?? 'Job not found.'}
            </Alert>
          </div>
        ) : (
          <div className='overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200'>
            <div className='bg-violet-700 px-6 py-6 text-white sm:px-8'>
              <p className='text-sm font-semibold uppercase tracking-wide text-violet-100'>Job application</p>
              <h1 className='mt-2 text-2xl font-bold sm:text-3xl'>{job.title}</h1>
              <p className='mt-2 text-sm text-violet-100'>Job ID: {job.id}</p>
            </div>

            <div className='px-6 py-6 sm:px-8 sm:py-8'>
              <p className='mb-6 text-sm text-gray-600'>
                Applying as <span className='font-semibold text-gray-800'>{candidate.firstName} {candidate.lastName}</span> ({candidate.email}).
                Submit the GitHub repository URL for your solution below.
              </p>

              {flashMessage && (
                <div className='mb-6'>
                  <Alert
                    variant='outlined'
                    severity={flashMessage.type}
                    onClose={() => setFlashMessage(null)}
                  >
                    {flashMessage.message}
                  </Alert>
                </div>
              )}

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                  <label htmlFor='githubUrl' className='block text-sm font-semibold text-gray-700'>
                    GitHub repository URL
                  </label>
                  <input
                    id='githubUrl'
                    type='url'
                    value={githubUrl}
                    onChange={(event) => {
                      setGithubUrl(event.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder='https://github.com/username/repository'
                    required
                    className='mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm transition duration-150 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400'
                  />
                  {formError && <p className='mt-2 text-sm text-red-600'>{formError}</p>}
                  <p className='mt-2 text-xs text-gray-500'>Use a valid GitHub URL for the repository you want to submit.</p>
                </div>

                <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <Link
                    to='/'
                    className='inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-150 hover:bg-gray-50 active:scale-[0.98]'
                  >
                    Cancel
                  </Link>
                  <button
                    type='submit'
                    disabled={submitting}
                    className='inline-flex cursor-pointer items-center justify-center rounded-lg bg-violet-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-violet-800'
                  >
                    {submitting ? 'Submitting...' : 'Submit application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplicationPage;
