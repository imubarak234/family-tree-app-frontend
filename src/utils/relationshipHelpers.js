import { formatDate } from './formatters';

export function getRelationshipLabel(type, context = 'general', length = 1) {
  // Returns appropriate label based on context
  const labels = {
    Parent: context === 'from' ? (length > 1 ? 'Children' : 'Child') : (length > 1 ? 'Parents' : 'Parent'),
    Child: context === 'from' ? (length > 1 ? 'Parents' : 'Parent') : (length > 1 ? 'Children' : 'Child'),
    Spouse: 'Spouse',
    Partner: 'Partner',
    Sibling: 'Sibling',
  };
  return labels[type] || type;
}

export function getRelationshipIcon(type) {
  // Returns Lucide icon name for relationship type
  const icons = {
    Parent: 'User',
    Child: 'Baby',
    Spouse: 'Heart',
    Partner: 'Users',
    Sibling: 'Users',
  };
  return icons[type] || 'User';
}

export function groupRelationships(relationships) {
  // Groups relationships by type
  if (!relationships || relationships.length === 0) return {};

  return relationships.reduce((acc, rel) => {
    const type = rel.relationshipType;
    if (!acc[type]) acc[type] = [];
    acc[type].push(rel);
    return acc;
  }, {});
}

export function formatRelationshipDates(startDate, endDate) {
  if (!startDate && !endDate) return null;
  if (startDate && !endDate) return `Since ${formatDate(startDate, 'MMM yyyy')}`;
  if (startDate && endDate) {
    return `${formatDate(startDate, 'MMM yyyy')} - ${formatDate(endDate, 'MMM yyyy')}`;
  }
  return null;
}

export function validateRelationshipMembers(fromMemberId, toMemberId) {
  if (fromMemberId === toMemberId) {
    return { valid: false, error: 'Cannot create relationship with the same person' };
  }
  return { valid: true };
}
