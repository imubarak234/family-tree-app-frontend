import { useState, useCallback, useEffect } from 'react';
import { eventsAPI } from '../../api/events';
import { normalizeResponse, handleApiError } from '../../utils/apiHelpers';

function useEventAction(defaultErrorMessage) {
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

export function useCreateEvent() {
  const { run, loading, error } = useEventAction('Failed to create event');
  return { createEvent: (payload) => run(() => eventsAPI.create(payload)), loading, error };
}

export function useUpdateEvent() {
  const { run, loading, error } = useEventAction('Failed to update event');
  return { updateEvent: (id, payload) => run(() => eventsAPI.update(id, payload)), loading, error };
}

export function useDeleteEvent() {
  const { run, loading, error } = useEventAction('Failed to delete event');
  return { deleteEvent: (id) => run(() => eventsAPI.delete(id)), loading, error };
}

export function useEventRsvps(eventId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!eventId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getRsvps(eventId);
      setData(normalizeResponse(response));
    } catch (err) {
      setError(handleApiError(err, 'Failed to fetch RSVPs'));
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useCreateRsvp() {
  const { run, loading, error } = useEventAction('Failed to save RSVP');
  return { createRsvp: (eventId, payload) => run(() => eventsAPI.createRsvp(eventId, payload)), loading, error };
}

export function useUpdateRsvp() {
  const { run, loading, error } = useEventAction('Failed to update RSVP');
  return { updateRsvp: (eventId, payload) => run(() => eventsAPI.updateRsvp(eventId, payload)), loading, error };
}

export function useDeleteRsvp() {
  const { run, loading, error } = useEventAction('Failed to delete RSVP');
  return { deleteRsvp: (eventId) => run(() => eventsAPI.deleteRsvp(eventId)), loading, error };
}
