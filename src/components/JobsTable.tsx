import { Alert } from "@mui/material";
import { useState } from "react";
import type { CandidateInfo, FlashMessageInfo, JobInfo, SubmitInfo } from "../types";
import axios from "axios";

type JobsTableProps = {
  candidate: CandidateInfo;
  jobs: JobInfo[];
}

function isValidGitHubUrl(input: string) {
  try {
    const url = new URL(input);
    return url.hostname === 'github.com' || url.hostname.endsWith('.github.com');
  } catch (error) {
    return false;
  }
}

function JobsTable({ candidate, jobs }: JobsTableProps) {
  const baseUrl: string = import.meta.env.VITE_BASE_URL;
  const [githubLinks, setGithubLinks] = useState<{ [key: string]: string }>({});
  const [flashMessage, setFlashMessage] = useState<FlashMessageInfo | null>(null);

  const handleInputChange = (jobId: string, value: string) => {
    setGithubLinks((prev) => {
      const updatedLinks = { ...prev };
      updatedLinks[jobId] = value;
      return updatedLinks;
    });
  };

  const handleSubmit = async (jobId: string) => {
    const githubLink = githubLinks[jobId];

    if (!isValidGitHubUrl(githubLink)) {
      setFlashMessage({ type: 'error', message: `Github Link for: ${jobId} is invalid` });
      return
    }

    const submitInfo: SubmitInfo = {
      uuid: candidate.uuid,
      jobId: jobId,
      candidateId: candidate.candidateId,
      applicationId: candidate.applicationId,
      repoUrl: githubLink
    }

    await axios.post(`${baseUrl}/api/candidate/apply-to-job`, submitInfo, { headers: { 'Content-Type': 'application/json' } })
      .then((response) => {
        if (response.status === 200) {
          setFlashMessage({ type: 'success', message: 'Submission successful!' });
        } else {
          setFlashMessage({ type: 'error', message: 'Unknown error' });
          console.error('Response: ', response);
        }
      }).catch((error) => {
        console.error('Error on submission', error.response.data);
        setFlashMessage({ type: 'error', message: `There was an error on the submission: ${error.response.data.error}` });
      }).finally(() => {
        setGithubLinks((prev) => {
          const updatedLinks = { ...prev };
          updatedLinks[jobId] = '';
          return updatedLinks;
        });
      })
  };

  return (
    <>
      {flashMessage && (
        <div className='pb-4'>
          <Alert variant='outlined' severity={flashMessage.type} onClose={() => { setFlashMessage(null) }}>{flashMessage.message}</Alert>
        </div>
      )}

      <div className='overflow-x-auto rounded-xl bg-violet-300 p-3 shadow-xl'>
        <table className='min-w-full border-separate border-spacing-0 overflow-hidden rounded-lg bg-white shadow-sm'>
          <thead>
            <tr className='bg-violet-700 text-left text-sm font-semibold uppercase tracking-wide text-white'>
              <th className='whitespace-nowrap px-4 py-3'>ID</th>
              <th className='px-4 py-3'>Title</th>
              <th className='px-4 py-3'>Github Link</th>
              <th className='px-4 py-3 text-center'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {jobs.map((job) => (
              <tr key={job.id} className='transition-colors duration-150 hover:bg-gray-100'>
                <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-700'>{job.id}</td>
                <td className='px-4 py-3 font-medium text-gray-800'>{job.title}</td>
                <td className='px-4 py-3'>
                  <input
                    type='text'
                    placeholder='https://github.com/user/repository'
                    value={githubLinks[job.id] || ''}
                    onChange={(e) => handleInputChange(job.id, e.target.value)}
                    className='w-full min-w-56 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition duration-150 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-400'
                  />
                </td>
                <td className='px-4 py-3 text-center'>
                  <button
                    type='button'
                    onClick={() => handleSubmit(job.id)}
                    className='cursor-pointer rounded-md bg-violet-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-md active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1'>
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default JobsTable;

