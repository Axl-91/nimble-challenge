# Nimble Challenge

Challenge for Nimble Gravity.

The page is made using React + TS.

## Setup

To run the project you need to setup a `.env` file with the following format
```env
VITE_BASE_URL= <BASE_URL to use>
```
## Required API

The required API on `VITE_BASE_URL` need to have three endpoints:

#### `/api/candidate/get-by-email?email=<EMAIL>` (GET)
This endpoint will return a response in the format
```json
{
  "uuid": "a1b2c3d4-...",
  "candidateId": "a1b2c3d4",
  "applicationId": "a1b2c3d4",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com"
}
```

#### `/api/jobs/get-list` (GET)
This endpoint will return a response in the format
```json
[
  { "id": "4416372005", "title": "Fullstack developer" },
  { "id": "9100000001", "title": "Head Chef" },
  ...
]
```

#### `/api/candidate/apply-to-job` (POST)
This endpoint will recive a body in the format
```json
{
  "uuid": "tu uuid (del Step 2)",
  "jobId": "id de la posición (del Step 3)",
  "candidateId": "tu candidateId (del Step 2)",
  "repoUrl": "https://github.com/tu-usuario/tu-repo"
}
```
Upon receiving the request, the endpoint will respond with:
```json
{"ok": true}
```

## Start project

To start project run:

```bash
npm install
npm run dev
```
