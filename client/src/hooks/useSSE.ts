import { useEffect, useRef, useState, useCallback } from 'react';

interface SSEMessage {
  event: string;
  data: any;
}

export function useSSE() {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<{ agents: number; leads: number } | null>(null);
  const [updates, setUpdates] = useState<SSEMessage[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sse/stream`;

    fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` },
      signal: controller.signal
    }).then(async response => {
      if (!response.ok || !response.body) {
        setConnected(false);
        setTimeout(connect, 5000);
        return;
      }

      setConnected(true);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let currentEvent = 'message';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7);
          } else if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (currentEvent === 'stats') setStats(data);
              setUpdates(prev => [...prev.slice(-50), { event: currentEvent, data }]);
            } catch {
              // ignore
            }
          }
        }
      }
    }).catch((err) => {
      if (err.name !== 'AbortError') {
        setConnected(false);
        setTimeout(connect, 5000);
      }
    });
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (abortRef.current) abortRef.current.abort();
    };
  }, [connect]);

  return { connected, stats, updates };
}
