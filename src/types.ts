export type CandidateInfo = {
  uuid: string;
  candidateId: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type JobInfo = {
  id: string;
  title: string;
};

export type FlashMessageInfo = {
  type: "success" | "error";
  message: string;
};

export type SubmitInfo = {
  uuid: string;
  jobId: string;
  candidateId: string;
  repoUrl: string;
};
