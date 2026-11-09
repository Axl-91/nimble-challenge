import { Link } from 'react-router-dom';
import type { JobInfo } from '../types';

type JobsTableProps = {
  jobs: JobInfo[];
};

function JobsTable({ jobs }: JobsTableProps) {
  return (
    <div className='overflow-x-auto rounded-xl bg-violet-300 p-3 shadow-xl'>
      <table className='min-w-full border-separate border-spacing-0 overflow-hidden rounded-lg bg-white shadow-sm'>
        <thead>
          <tr className='bg-violet-700 text-left text-sm font-semibold uppercase tracking-wide text-white'>
            <th className='whitespace-nowrap px-4 py-3'>ID</th>
            <th className='px-4 py-3'>Job type</th>
            <th className='px-4 py-3 text-center'>Action</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200'>
          {jobs.map((job) => (
            <tr key={job.id} className='transition-colors duration-150 hover:bg-gray-100'>
              <td className='whitespace-nowrap px-4 py-3 text-sm text-gray-700'>{job.id}</td>
              <td className='px-4 py-3 font-medium text-gray-800'>{job.title}</td>
              <td className='px-4 py-3 text-center'>
                <Link
                  to={`/jobs/${job.id}`}
                  state={{ job }}
                  className='inline-flex cursor-pointer items-center justify-center rounded-md bg-violet-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-md active:translate-y-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1'
                >
                  Apply
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobsTable;

