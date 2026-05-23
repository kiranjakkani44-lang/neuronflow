import { useEffect, useRef, useState, useCallback } from 'react';

interface SSEMessage {
  event: string;
  data: any;
}

export function useSSE() {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<{ agents: number; leads: number } | null>(null);
  const [updates, setUpdates] = useState<SSEMessage[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sse/stats`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setConnected(true);
        const data = await res.json();
        setStats({ agents: data.activeAgents || 0, leads: data.leads || 0 });
      } else {
        setConnected(false);
      }
    } catch (err) {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(); // Initial fetch
    intervalRef.current = setInterval(fetchStats, 10000); // Poll every 10s

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStats]);

  return { connected, stats, updates };
}
