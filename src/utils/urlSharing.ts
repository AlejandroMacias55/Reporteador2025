import { ShareableQuery } from '../types/database';

export const encodeQueryForUrl = (shareableQuery: ShareableQuery): string => {
  try {
    const jsonString = JSON.stringify(shareableQuery);
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Failed to encode query for URL:', error);
    return '';
  }
};

export const decodeQueryFromUrl = (encodedData: string): ShareableQuery | null => {
  try {
    const jsonString = decodeURIComponent(atob(encodedData));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to decode query from URL:', error);
    return null;
  }
};

export const getSharedQueryFromUrl = (): ShareableQuery | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedData = urlParams.get('shared');
  
  if (!sharedData) return null;
  
  return decodeQueryFromUrl(sharedData);
};