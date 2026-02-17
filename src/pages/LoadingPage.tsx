import { CircularProgress } from "@mui/material";

function LoadingPage() {
  return (
    <>
      <p className='text-xl text-center'>Loading...</p>
      <p className='text-center py-5'>
        <CircularProgress />
      </p>
    </>

  )
}

export default LoadingPage;
