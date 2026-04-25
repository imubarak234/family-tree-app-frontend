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
