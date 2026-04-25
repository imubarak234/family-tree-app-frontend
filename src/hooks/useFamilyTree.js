import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useFamilyTree(memberId, treeType = 'ancestors', maxDepth = 3) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTree = async () => {
    if (!memberId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let response;
      switch (treeType) {
        case 'ancestors':
          response = await familyAPI.getAncestors(memberId, maxDepth);
          break;
        case 'descendants':
          response = await familyAPI.getDescendants(memberId, maxDepth);
          break;
        case 'siblings':
          response = await familyAPI.getSiblings(memberId);
          break;
        case 'tree':
          response = await familyAPI.getFamilyTree(memberId, maxDepth);
          break;
        case 'spouses':
          response = await familyAPI.getSpouses(memberId);
          break;
        case 'children':
          response = await familyAPI.getChildren(memberId);
          break;
        case 'parents':
          response = await familyAPI.getParents(memberId);
          break;
        default:
          throw new Error(`Unknown tree type: ${treeType}`);
      }

      const normalizedData = normalizeResponse(response);

      setTreeData(normalizedData);
    } catch (err) {
      const errorMessage = handleApiError(err, 'Failed to fetch family tree');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [memberId, treeType, maxDepth]);

  return { treeData, loading, error, refetch: fetchTree };
}
