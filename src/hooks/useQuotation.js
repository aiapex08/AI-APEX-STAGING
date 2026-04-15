// NAFFCO — useQuotation hook (stub — will be expanded as needed)
import { useState } from 'react';

export default function useQuotation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  return { loading, error };
}
