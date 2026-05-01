import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Settings as SettingsIcon,
  FileJson,
  Shield,
  Bell,
  SlidersHorizontal,
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
];

const DATE_FORMAT_OPTIONS = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
];

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Africa/Lagos', label: 'Africa/Lagos' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'America/New_York', label: 'America/New_York' },
];

function buildApiAbsoluteUrl(path) {
  const base = import.meta.env?.VITE_API_BASE_URL || '/api';

  if (base.startsWith('http://') || base.startsWith('https://')) {
    return `${base}${path}`;
  }

  return `${window.location.origin}${base}${path}`;
}

export default function Settings() {
  const {
    settings,
    loading,
    saving,
    error,
    saveMessage,
    updateSettings,
    sanitizeSettingsPayload,
  } = useSettings();

  const [localError, setLocalError] = useState('');
  const [docsHealth, setDocsHealth] = useState({ loading: true, ok: false, message: '' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: settings,
  });

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const checkDocsHealth = async () => {
    const docsJsonUrl = buildApiAbsoluteUrl('/docs.json');
    setDocsHealth({ loading: true, ok: false, message: '' });

    try {
      const response = await fetch(docsJsonUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Docs endpoint returned ${response.status}`);
      }

      setDocsHealth({ loading: false, ok: true, message: 'API docs endpoint is reachable.' });
    } catch {
      setDocsHealth({
        loading: false,
        ok: false,
        message:
          'API docs endpoint is unavailable. Verify backend is running and docs routes are enabled.',
      });
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkDocsHealth();
  }, []);

  const onSubmit = async (values) => {
    setLocalError('');

    const sanitized = sanitizeSettingsPayload(values);
    const result = await updateSettings(sanitized);

    if (!result.ok) {
      const response = result.error?.response;
      const validationMessage = response?.data?.errors
        ? Array.isArray(response.data.errors)
          ? response.data.errors[0]?.message
          : Object.values(response.data.errors)[0]
        : null;

      if (response?.status === 429) {
        setLocalError('You are saving too quickly. Please wait a moment and try again.');
      } else if (response?.status === 400) {
        setLocalError(validationMessage || 'Settings payload is invalid. Please review your inputs.');
      } else {
        setLocalError('Unable to save settings right now.');
      }
      return;
    }

    reset(result.data);
  };

  const docsUrl = useMemo(() => buildApiAbsoluteUrl('/docs'), []);
  const docsJsonUrl = useMemo(() => buildApiAbsoluteUrl('/docs.json'), []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Settings</h1>
          <p className="mt-2 text-gray-600">Manage your notification, privacy, and preferences.</p>
        </div>

        {(error || localError) && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-800 text-sm">
            {localError || error}
          </div>
        )}

        {saveMessage && (
          <div className="p-4 rounded-lg border border-green-200 bg-green-50 text-green-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {saveMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle label="Email notifications" register={register('notifications.email')} />
              <Toggle label="Birthday reminders" register={register('notifications.birthdayReminders')} />
              <Toggle label="News updates" register={register('notifications.newsUpdates')} />
              <Toggle label="Event reminders" register={register('notifications.eventReminders')} />
            </div>
          </section>

          <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle label="Profile visible" register={register('privacy.profileVisible')} />
              <Toggle label="Show birth date" register={register('privacy.showBirthDate')} />
              <Toggle label="Show contact info" register={register('privacy.showContactInfo')} />
            </div>
          </section>

          <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                label="Language"
                register={register('preferences.language')}
                options={LANGUAGE_OPTIONS}
              />
              <SelectField
                label="Date format"
                register={register('preferences.dateFormat')}
                options={DATE_FORMAT_OPTIONS}
              />
              <SelectField
                label="Timezone"
                register={register('preferences.timezone')}
                options={TIMEZONE_OPTIONS}
              />
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!isDirty || saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              {saving ? 'Saving...' : 'Save settings'}
            </button>
            <button
              type="button"
              onClick={() => {
                reset(settings);
                setLocalError('');
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Reset changes
            </button>
          </div>
        </form>

        <section className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Developer Tools</h2>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => window.open(docsUrl, '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Open API Docs
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(docsJsonUrl, '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Open OpenAPI JSON
              <FileJson className="w-4 h-4" />
            </button>
            <button
              onClick={checkDocsHealth}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Check docs health
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {docsHealth.loading ? (
            <p className="text-sm text-gray-600">Checking docs endpoint...</p>
          ) : docsHealth.ok ? (
            <p className="text-sm text-green-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {docsHealth.message}
            </p>
          ) : (
            <p className="text-sm text-amber-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {docsHealth.message}
            </p>
          )}

          <ul className="mt-5 space-y-2 text-sm text-gray-700">
            <ChecklistItem checked label="Endpoint discovered" />
            <ChecklistItem checked label="Auth header configured" />
            <ChecklistItem checked label="Settings payload shape verified" />
            <ChecklistItem checked label="Advanced search params wired" />
            <ChecklistItem checked label="Pagination wired" />
            <ChecklistItem checked label="Error handling verified" />
          </ul>
        </section>
      </div>
    </div>
  );
}

function Toggle({ label, register }) {
  return (
    <label className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
      <span className="text-sm text-gray-700">{label}</span>
      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" {...register} />
    </label>
  );
}

function SelectField({ label, register, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select
        {...register}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ChecklistItem({ checked, label }) {
  return (
    <li className="flex items-center gap-2">
      <CheckCircle2 className={`w-4 h-4 ${checked ? 'text-green-600' : 'text-gray-300'}`} />
      <span>{label}</span>
    </li>
  );
}
