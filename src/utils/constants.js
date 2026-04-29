export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'PreferNotToSay', label: 'Prefer not to say' },
];

export const VITAL_STATUS_OPTIONS = [
  { value: 'Living', label: 'Living' },
  { value: 'Deceased', label: 'Deceased' },
  { value: 'Unknown', label: 'Unknown' },
];

export const RELATIONSHIP_TYPES = {
  PARENT: 'Parent',
  CHILD: 'Child',
  SPOUSE: 'Spouse',
  SIBLING: 'Sibling',
  PARTNER: 'Partner',
};

export const RELATIONSHIP_TYPE_OPTIONS = [
  { value: 'Parent', label: 'Parent' },
  { value: 'Child', label: 'Child' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Partner', label: 'Partner' },
  { value: 'Sibling', label: 'Sibling' },
];

export const RELATIONSHIP_LABELS = {
  Parent: 'Parent',
  Child: 'Child',
  Spouse: 'Spouse',
  Partner: 'Partner',
  Sibling: 'Sibling',
};

export const TREE_VIEW_MODES = {
  ANCESTORS: 'ancestors',
  DESCENDANTS: 'descendants',
  FULL: 'full',
  FOCUS: 'focus',
};

// ---------------------------------------------------------------------------
// Media constants
// ---------------------------------------------------------------------------
export const MEDIA_BASE_URL = 'http://localhost:5001';

export const PHOTO_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
};

export const DOCUMENT_ACCEPT = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
};

export const PHOTO_MAX_SIZE = 10 * 1024 * 1024;   // 10 MB
export const DOCUMENT_MAX_SIZE = 20 * 1024 * 1024; // 20 MB

// ---------------------------------------------------------------------------
// Social feature constants
// ---------------------------------------------------------------------------
export const NEWS_STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft' },
  { value: 'Published', label: 'Published' },
  { value: 'Archived', label: 'Archived' },
];

export const RSVP_STATUS_OPTIONS = [
  { value: 'Going', label: 'Going' },
  { value: 'Maybe', label: 'Maybe' },
  { value: 'NotGoing', label: 'Not going' },
];

export const REACTION_TYPES = ['Like', 'Love', 'Celebrate', 'Support'];

export const TIMELINE_SOURCE_TYPES = [
  { value: 'NewsPost', label: 'News' },
  { value: 'Event', label: 'Events' },
  { value: 'Birth', label: 'Births' },
  { value: 'Death', label: 'Deaths' },
];
