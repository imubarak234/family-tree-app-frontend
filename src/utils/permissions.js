export function isAdmin(user) {
  return user?.isAdmin === true;
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
