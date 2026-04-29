import { useState } from 'react';
import { newsAPI } from '../../api/news';
import { normalizeResponse, handleApiError } from '../../utils/apiHelpers';

function useNewsAction(defaultErrorMessage) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = async (action) => {
    try {
      setLoading(true);
      setError(null);
      const response = await action();
      return response ? normalizeResponse(response) : true;
    } catch (err) {
      const message = handleApiError(err, defaultErrorMessage);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error };
}

export function useCreateNews() {
  const { run, loading, error } = useNewsAction('Failed to create news');
  return { createNews: (payload) => run(() => newsAPI.create(payload)), loading, error };
}

export function useUpdateNews() {
  const { run, loading, error } = useNewsAction('Failed to update news');
  return { updateNews: (id, payload) => run(() => newsAPI.update(id, payload)), loading, error };
}

export function useDeleteNews() {
  const { run, loading, error } = useNewsAction('Failed to delete news');
  return { deleteNews: (id) => run(() => newsAPI.delete(id)), loading, error };
}

export function usePublishNews() {
  const { run, loading, error } = useNewsAction('Failed to publish news');
  return { publishNews: (id) => run(() => newsAPI.publish(id)), loading, error };
}

export function useUnpublishNews() {
  const { run, loading, error } = useNewsAction('Failed to unpublish news');
  return { unpublishNews: (id) => run(() => newsAPI.unpublish(id)), loading, error };
}

export function usePinNews() {
  const { run, loading, error } = useNewsAction('Failed to pin news');
  return { pinNews: (id) => run(() => newsAPI.pin(id)), loading, error };
}

export function useUnpinNews() {
  const { run, loading, error } = useNewsAction('Failed to unpin news');
  return { unpinNews: (id) => run(() => newsAPI.unpin(id)), loading, error };
}
