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
        <div className='text-center pb-4'>
          <Alert variant='outlined' severity={flashMessage.type} onClose={() => { setFlashMessage(null) }}>{flashMessage.message}</Alert>
        </div>
      )}

      <div className='p-2 bg-violet-300 shadow-xl rounded-sm'>
        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            <tr className='bg-violet-700 text-white'>
              <th className='py-2 px-4 border border-gray-300'>ID</th>
              <th className='py-2 px-4 border border-gray-300'>Title</th>
              <th className='py-2 px-4 border border-gray-300'>Github Link</th>
              <th className='py-2 px-4 border border-gray-300'>Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className='hover:bg-gray-100'>
                <td className='py-2 px-4 w-50 border border-gray-300'>{job.id}</td>
                <td className='py-2 px-4 border border-gray-300'>{job.title}</td>
                <td className='py-2 px-4 w-150 border border-gray-300'>
                  <input
                    type='text'
                    placeholder='https://github.com/user/repository'
                    value={githubLinks[job.id] || ''}
                    onChange={(e) => handleInputChange(job.id, e.target.value)}
                    className='border border-gray-300 rounded p-1 w-full'
                  />
                </td>
                <td className='py-2 px-4 w-30 border border-gray-300 text-center'>
                  <button
                    onClick={() => handleSubmit(job.id)}
                    className='bg-violet-800 text-white py-1 px-3 rounded hover:bg-violet-500 cursor-pointer'>
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

