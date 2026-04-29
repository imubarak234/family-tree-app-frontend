import { format, parseISO } from 'date-fns';

export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  if (!date) return '-';
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
}

export function formatFullName(member) {
  if (!member) return '';
  const parts = [member.firstName, member.middleName, member.lastName].filter(Boolean);
  return parts.join(' ');
}

export function formatLifespan(birthDate, deathDate, vitalStatus) {
  const birth = birthDate ? formatDate(birthDate, 'yyyy') : '?';
  if (vitalStatus === 'Deceased' && deathDate) {
    const death = formatDate(deathDate, 'yyyy');
    return `${birth} - ${death}`;
  }
  if (vitalStatus === 'Living') {
    return `Born ${formatDate(birthDate)}`;
  }
  return birth;
}

export function getMediaUrl(filePath) {
  if (!filePath) return null;
  return `http://localhost:5001/${filePath}`;
}

export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function calculateAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
