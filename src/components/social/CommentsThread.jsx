import { useMemo, useState } from 'react';
import { MessageCircle, Send, Trash2, Edit2, Reply } from 'lucide-react';
import {
  canCreateComment,
  canEditOwnComment,
  canDeleteOwnComment,
  canModerateComments,
} from '../../utils/permissions';
import { formatDate } from '../../utils/formatters';
import { useCommentActions } from '../../hooks/social/useEngagement';

function getActorId(comment) {
  return comment?.createdBy || comment?.userId || comment?.user?.id || comment?.createdById || null;
}

function getActorName(comment) {
  return (
    comment?.createdByName ||
    comment?.user?.name ||
    comment?.authorName ||
    'Family Member'
  );
}

export default function CommentsThread({
  resource,
  targetId,
  comments = [],
  currentUser,
  onChanged,
}) {
  const { createComment, updateComment, deleteComment, loading, error } = useCommentActions();
  const [newComment, setNewComment] = useState('');
  const [editState, setEditState] = useState({ id: null, value: '' });
  const [replyState, setReplyState] = useState({ parentId: null, value: '' });

  const { roots, byParent } = useMemo(() => {
    const map = new Map();
    const parents = new Map();
    const rootItems = [];

    comments.forEach((comment) => map.set(comment.id, comment));

    comments.forEach((comment) => {
      if (comment.parentCommentId && map.has(comment.parentCommentId)) {
        if (!parents.has(comment.parentCommentId)) parents.set(comment.parentCommentId, []);
        parents.get(comment.parentCommentId).push(comment);
      } else {
        rootItems.push(comment);
      }
    });

    return { roots: rootItems, byParent: parents };
  }, [comments]);

  const handleCreate = async () => {
    if (!newComment.trim() || !canCreateComment(currentUser)) return;
    await createComment(resource, targetId, { content: newComment.trim() });
    setNewComment('');
    onChanged?.();
  };

  const handleReply = async (parentId) => {
    if (!replyState.value.trim() || !canCreateComment(currentUser)) return;
    await createComment(resource, targetId, {
      content: replyState.value.trim(),
      parentCommentId: parentId,
    });
    setReplyState({ parentId: null, value: '' });
    onChanged?.();
  };

  const handleSaveEdit = async () => {
    if (!editState.id || !editState.value.trim()) return;
    await updateComment(editState.id, { content: editState.value.trim() });
    setEditState({ id: null, value: '' });
    onChanged?.();
  };

  const canEditComment = (comment) => {
    const own = getActorId(comment) === currentUser?.id;
    return canModerateComments(currentUser) || (own && canEditOwnComment(currentUser));
  };

  const canDeleteComment = (comment) => {
    const own = getActorId(comment) === currentUser?.id;
    return canModerateComments(currentUser) || (own && canDeleteOwnComment(currentUser));
  };

  const renderComment = (comment, isReply = false) => {
    const replies = byParent.get(comment.id) || [];
    const isEditing = editState.id === comment.id;
    const isReplying = replyState.parentId === comment.id;

    return (
      <div key={comment.id} className={`rounded-lg border border-gray-100 bg-white p-3 ${isReply ? 'ml-8 mt-2' : 'mt-2'}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-gray-800">{getActorName(comment)}</p>
            <p className="text-xs text-gray-400">{formatDate(comment.createdAt)}</p>
          </div>
          <div className="flex items-center gap-1">
            {!isReply && canCreateComment(currentUser) && (
              <button
                type="button"
                onClick={() => setReplyState({ parentId: comment.id, value: '' })}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                title="Reply"
              >
                <Reply className="w-3.5 h-3.5" />
              </button>
            )}
            {canEditComment(comment) && (
              <button
                type="button"
                onClick={() => setEditState({ id: comment.id, value: comment.content || '' })}
                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {canDeleteComment(comment) && (
              <button
                type="button"
                onClick={async () => {
                  await deleteComment(comment.id);
                  onChanged?.();
                }}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="mt-2 space-y-2">
            <textarea
              value={editState.value}
              onChange={(e) => setEditState({ id: comment.id, value: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setEditState({ id: null, value: '' })}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSaveEdit}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
        )}

        {isReplying && (
          <div className="mt-2 space-y-2">
            <textarea
              value={replyState.value}
              onChange={(e) => setReplyState({ parentId: comment.id, value: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write a reply..."
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setReplyState({ parentId: null, value: '' })}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleReply(comment.id)}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                Reply
              </button>
            </div>
          </div>
        )}

        {replies.map((reply) => renderComment(reply, true))}
      </div>
    );
  };

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <MessageCircle className="w-4 h-4" />
        Comments ({comments.length})
      </h3>

      {canCreateComment(currentUser) && (
        <div className="rounded-lg border border-gray-200 bg-white p-3 space-y-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a comment..."
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreate}
              disabled={loading || !newComment.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              Post
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
      {roots.length === 0 ? (
        <p className="text-sm text-gray-400">No comments yet.</p>
      ) : (
        <div>{roots.map((comment) => renderComment(comment))}</div>
      )}
    </section>
  );
}
