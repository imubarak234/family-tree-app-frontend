import { useCallback, useEffect, useState } from 'react';
import { settingsAPI } from '../api/settings';
import { handleApiError, normalizeResponse } from '../utils/apiHelpers';

const SETTINGS_DEFAULTS = {
  notifications: {
    email: false,
    birthdayReminders: false,
    newsUpdates: false,
    eventReminders: false,
  },
  privacy: {
    profileVisible: true,
    showBirthDate: true,
    showContactInfo: false,
  },
  preferences: {
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    timezone: 'UTC',
  },
};

function sanitizeSettingsPayload(values = {}) {
  return {
    notifications: {
      email: Boolean(values.notifications?.email),
      birthdayReminders: Boolean(values.notifications?.birthdayReminders),
      newsUpdates: Boolean(values.notifications?.newsUpdates),
      eventReminders: Boolean(values.notifications?.eventReminders),
    },
    privacy: {
      profileVisible: Boolean(values.privacy?.profileVisible),
      showBirthDate: Boolean(values.privacy?.showBirthDate),
      showContactInfo: Boolean(values.privacy?.showContactInfo),
    },
    preferences: {
      language: values.preferences?.language || 'en',
      dateFormat: values.preferences?.dateFormat || 'YYYY-MM-DD',
      timezone: values.preferences?.timezone || 'UTC',
    },
  };
}

export function useSettings() {
  const [settings, setSettings] = useState(SETTINGS_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await settingsAPI.getSettings();
      const payload = normalizeResponse(response);
      setSettings(sanitizeSettingsPayload(payload));
    } catch (err) {
      setError(handleApiError(err, 'Failed to load settings'));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (values) => {
    try {
      setSaving(true);
      setError('');
      setSaveMessage('');
      const payload = sanitizeSettingsPayload(values);
      await settingsAPI.updateSettings(payload);
      const refreshed = await settingsAPI.getSettings();
      const next = normalizeResponse(refreshed);
      setSettings(sanitizeSettingsPayload(next));
      setSaveMessage('Settings updated successfully.');
      return { ok: true, data: sanitizeSettingsPayload(next) };
    } catch (err) {
      setError(handleApiError(err, 'Failed to update settings'));
      return { ok: false, error: err };
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    saving,
    error,
    saveMessage,
    fetchSettings,
    updateSettings,
    sanitizeSettingsPayload,
    defaults: SETTINGS_DEFAULTS,
  };
}
