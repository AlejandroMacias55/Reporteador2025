import { useState, useEffect } from 'react';
import { SavedConnection } from '../types/database';

const STORAGE_KEY = 'saved_connections';

export function useSavedConnections() {
  const [savedConnections, setSavedConnections] = useState<SavedConnection[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setSavedConnections(JSON.parse(stored));
    }
  }, []);

  const saveConnection = (connection: SavedConnection) => {
    const updated = [...savedConnections.filter(c => c.id !== connection.id), connection];
    setSavedConnections(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteConnection = (id: string) => {
    const updated = savedConnections.filter(c => c.id !== id);
    setSavedConnections(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return {
    savedConnections,
    saveConnection,
    deleteConnection
  };
}