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

// Phase 4 - News permissions
export function canViewNews(user) {
  return hasPermission(user, 'view:news');
}

export function canCreateNews(user) {
  return hasPermission(user, 'create:news');
}

export function canUpdateNews(user) {
  return hasPermission(user, 'update:news');
}

export function canDeleteNews(user) {
  return hasPermission(user, 'delete:news');
}

export function canPublishNews(user) {
  return hasPermission(user, 'publish:news');
}

export function canPinNews(user) {
  return hasPermission(user, 'pin:news');
}

// Phase 4 - Event permissions
export function canViewEvents(user) {
  return hasPermission(user, 'view:events');
}

export function canCreateEvent(user) {
  return hasPermission(user, 'create:event');
}

export function canUpdateEvent(user) {
  return hasPermission(user, 'update:event');
}

export function canDeleteEvent(user) {
  return hasPermission(user, 'delete:event');
}

export function canCreateRsvp(user) {
  return hasPermission(user, 'create:rsvp');
}

export function canUpdateRsvp(user) {
  return hasPermission(user, 'update:rsvp');
}

export function canDeleteRsvp(user) {
  return hasPermission(user, 'delete:rsvp');
}

// Phase 4 - Engagement permissions
export function canCreateComment(user) {
  return hasPermission(user, 'create:comment');
}

export function canModerateComments(user) {
  return hasPermission(user, 'update:comment') || hasPermission(user, 'delete:comment');
}

export function canEditOwnComment(user) {
  return hasPermission(user, 'update:own_comment');
}

export function canDeleteOwnComment(user) {
  return hasPermission(user, 'delete:own_comment');
}

export function canCreateReaction(user) {
  return hasPermission(user, 'create:reaction');
}

export function canDeleteOwnReaction(user) {
  return hasPermission(user, 'delete:own_reaction');
}

export function canDeleteReaction(user) {
  return hasPermission(user, 'delete:reaction');
}

// Phase 4 - Timeline
export function canViewTimeline(user) {
  return hasPermission(user, 'view:timeline');
}
