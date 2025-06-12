import { useState, useCallback } from 'react';
import { DatabaseConfig, QueryResult } from '../types/database';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useDatabase = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = useCallback(async (config: DatabaseConfig) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      });

      const data = await response.json();

      if (data.success) {
        setConnectionStatus('connected');
        return true;
      } else {
        setError(data.error || 'Connection failed');
        setConnectionStatus('error');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(`Connection failed: ${errorMessage}`);
      setConnectionStatus('error');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const executeQuery = useCallback(async (config: DatabaseConfig, query: string) => {
    setIsExecuting(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/execute-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config, query }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.data);
        return data.data;
      } else {
        setError(data.error || 'Query execution failed');
        throw new Error(data.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(`Query failed: ${errorMessage}`);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  return {
    isConnecting,
    isExecuting,
    connectionStatus,
    results,
    error,
    testConnection,
    executeQuery
  };
};