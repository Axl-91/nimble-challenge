import { useEffect, useState } from 'react';
import { type CandidateInfo, type JobInfo } from '../types';
import axios from 'axios';
import LoadingPage from './LoadingPage';
import JobsTable from '../components/JobsTable';

type HomeProps = {
  candidate: CandidateInfo;
}

function Home({ candidate }: HomeProps) {
  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const [jobs, setJobs] = useState<JobInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      await axios.get(`${baseUrl}/api/jobs/get-list`)
        .then((response) => {
          setJobs(response.data);
        }).catch((error) => {
          console.error('Fetch Error:', error)
        }).finally(() => {
          setLoading(false);
        }
        )
    }
    fetchJobs();
  }, [baseUrl])

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Hello {candidate.firstName}, here are your job listenings!</h1>
      {loading ? <LoadingPage /> : <JobsTable candidate={candidate} jobs={jobs} />}
    </div>
  )
}

export default Home;
