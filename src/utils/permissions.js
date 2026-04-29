export function isAdmin(user) {
  if (!user?.roles) return false;
  
  // If roles is array of strings (login response)
  if (typeof user.roles[0] === 'string') {
    return user.roles.includes("Admin");
  }
  
  // If roles is array of objects (profile response)
  return user.roles.some(r => r.name === "Admin");
}

export function canEditMember(user, member) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return user.id === member.userId; // Can edit own profile
}

export function canDeleteMember(user) {
  return isAdmin(user);
}

export function canCreateMember(user) {
  return isAdmin(user); // Only admins can add new members
}

export function canManageRelationships(user) {
  return isAdmin(user);
}

export function canViewRelationships(user) {
  return !!user;
}

export function canEditRelationship(user) {
  return isAdmin(user);
}

export function canDeleteRelationship(user) {
  return isAdmin(user);
}

// ---------------------------------------------------------------------------
// Generic permission helper — checks user.permissions[] with admin fallback
// ---------------------------------------------------------------------------
export function hasPermission(user, permission) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  return false;
}

// Media permissions
export function canViewMedia(user) {
  return hasPermission(user, 'view:photos');
}

export function canUploadPhoto(user) {
  return hasPermission(user, 'upload:photo');
}

export function canUploadDocument(user) {
  return hasPermission(user, 'upload:document');
}

export function canUpdateMedia(user) {
  return hasPermission(user, 'update:photo');
}

export function canDeleteMedia(user) {
  return hasPermission(user, 'delete:photo');
}

export function canTagPhoto(user) {
  return hasPermission(user, 'tag:photo');
}
