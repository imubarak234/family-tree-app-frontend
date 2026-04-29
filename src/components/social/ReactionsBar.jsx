import { useMemo } from 'react';
import { Heart } from 'lucide-react';
import { REACTION_TYPES } from '../../utils/constants';
import {
  canCreateReaction,
  canDeleteOwnReaction,
  canDeleteReaction,
} from '../../utils/permissions';
import { useReactionActions } from '../../hooks/social/useEngagement';

function getActorId(entity) {
  return entity?.createdBy || entity?.userId || entity?.user?.id || entity?.createdById || null;
}

export default function ReactionsBar({
  resource,
  targetId,
  reactions = [],
  currentUser,
  onChanged,
}) {
  const { createReaction, deleteReaction, loading } = useReactionActions();

  const grouped = useMemo(() => {
    const counts = {};
    REACTION_TYPES.forEach((type) => {
      counts[type] = reactions.filter((r) => r.reactionType === type).length;
    });
    return counts;
  }, [reactions]);

  const myReactionsByType = useMemo(() => {
    const map = {};
    const myId = currentUser?.id;
    if (!myId) return map;
    reactions.forEach((r) => {
      const actorId = getActorId(r);
      if (actorId === myId) map[r.reactionType] = r;
    });
    return map;
  }, [reactions, currentUser]);

  const handleToggleReaction = async (type) => {
    const existing = myReactionsByType[type];
    if (existing) {
      const canDelete = canDeleteOwnReaction(currentUser) || canDeleteReaction(currentUser);
      if (!canDelete) return;
      await deleteReaction(existing.id);
      onChanged?.();
      return;
    }

    if (!canCreateReaction(currentUser)) return;
    await createReaction(resource, targetId, { reactionType: type });
    onChanged?.();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_TYPES.map((type) => {
        const isActive = !!myReactionsByType[type];
        return (
          <button
            key={type}
            type="button"
            disabled={loading || !canCreateReaction(currentUser)}
            onClick={() => handleToggleReaction(type)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors ${
              isActive
                ? 'bg-pink-50 border-pink-200 text-pink-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Heart className={`w-3.5 h-3.5 ${isActive ? 'fill-pink-500 text-pink-500' : ''}`} />
            <span>{type}</span>
            <span className="text-xs">{grouped[type] || 0}</span>
          </button>
        );
      })}
    </div>
  );
}
