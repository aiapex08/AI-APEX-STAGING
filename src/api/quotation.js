// NAFFCO — API layer (stub — full implementation in PROMPT 1)
export const apiClient = null;
export const submitQuotation = async () => {};
export const getJob = async () => {};
export const updateDoors = async () => {};
export const approveJob = async () => {};
export const listJobs = async () => [];
export const getPdfUrl = (jobId) => `${import.meta.env.VITE_API_URL}/api/job/${jobId}/pdf`;
export const getFactoryUrl = (jobId) => `${import.meta.env.VITE_API_URL}/api/job/${jobId}/factory`;
