import { useState, useEffect, useCallback } from 'react';
import { NeighborhoodResponse } from '../types';
import { apiClient } from '../api/client';

export function useGraph(initialNodeId: string | null) {
  const [focusNodeId, setFocusNodeId] = useState<string | null>(initialNodeId);
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Update focusNodeId when initialNodeId changes (e.g. after onboarding completes)
  useEffect(() => {
    if (initialNodeId && initialNodeId !== focusNodeId) {
      setFocusNodeId(initialNodeId);
      setHistory([initialNodeId]);
    }
  }, [initialNodeId]);

  useEffect(() => {
    if (!focusNodeId) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    apiClient.fetchNeighborhood(focusNodeId)
      .then(data => {
        if (mounted) {
          setNeighborhoodData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { mounted = false; };
  }, [focusNodeId]);

  const navigateTo = useCallback((nodeId: string) => {
    setHistory(prev => [...prev, nodeId]);
    setFocusNodeId(nodeId);
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      setFocusNodeId(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  return {
    neighborhood: neighborhoodData,
    focusNodeId,
    loading,
    error,
    navigateTo,
    goBack,
    canGoBack: history.length > 1
  };
}
