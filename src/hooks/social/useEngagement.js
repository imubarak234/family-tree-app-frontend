import { useState, useEffect, useCallback } from 'react';
import { engagementAPI } from '../../api/engagement';
import { normalizeResponse, handleApiError } from '../../utils/apiHelpers';

export function useComments(resource, targetId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!resource || !targetId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await engagementAPI.getComments(resource, targetId);
      const normalized = normalizeResponse(response);
      setData(Array.isArray(normalized) ? normalized : normalized?.items || []);
    } catch (err) {
      setError(handleApiError(err, 'Failed to fetch comments'));
    } finally {
      setLoading(false);
    }
  }, [resource, targetId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useCommentActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (action, fallbackMessage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await action();
      return response ? normalizeResponse(response) : true;
    } catch (err) {
      const message = handleApiError(err, fallbackMessage);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createComment: (resource, targetId, payload) =>
      run(() => engagementAPI.createComment(resource, targetId, payload), 'Failed to create comment'),
    updateComment: (commentId, payload) =>
      run(() => engagementAPI.updateComment(commentId, payload), 'Failed to update comment'),
    deleteComment: (commentId) =>
      run(() => engagementAPI.deleteComment(commentId), 'Failed to delete comment'),
  };
}

export function useReactions(resource, targetId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!resource || !targetId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await engagementAPI.getReactions(resource, targetId);
      const normalized = normalizeResponse(response);
      setData(Array.isArray(normalized) ? normalized : normalized?.items || []);
    } catch (err) {
      setError(handleApiError(err, 'Failed to fetch reactions'));
    } finally {
      setLoading(false);
    }
  }, [resource, targetId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useReactionActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (action, fallbackMessage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await action();
      return response ? normalizeResponse(response) : true;
    } catch (err) {
      const message = handleApiError(err, fallbackMessage);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createReaction: (resource, targetId, payload) =>
      run(() => engagementAPI.createReaction(resource, targetId, payload), 'Failed to add reaction'),
    deleteReaction: (reactionId) =>
      run(() => engagementAPI.deleteReaction(reactionId), 'Failed to remove reaction'),
  };
}
