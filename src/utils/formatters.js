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
