import { useState, useEffect } from 'react';
import { familyAPI } from '../api/family';
import { normalizeResponse, handleApiError } from '../utils/apiHelpers';

export function useFamilyTree(memberId, treeType = 'ancestors', maxDepth = 3) {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTree = async () => {
    if (!memberId) {
      setTreeData(null);
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

      const normalizedData = normalizeResponse(response) || {};
      const rootMember = normalizedData.rootMember || normalizedData.member || null;

      setTreeData({
        ...normalizedData,
        rootMember,
        ancestors: Array.isArray(normalizedData.ancestors) ? normalizedData.ancestors : [],
        descendants: Array.isArray(normalizedData.descendants) ? normalizedData.descendants : [],
        relationships: Array.isArray(normalizedData.relationships) ? normalizedData.relationships : [],
        siblings: Array.isArray(normalizedData.siblings) ? normalizedData.siblings : [],
        spouses: Array.isArray(normalizedData.spouses) ? normalizedData.spouses : [],
        parents: Array.isArray(normalizedData.parents) ? normalizedData.parents : [],
        children: Array.isArray(normalizedData.children) ? normalizedData.children : [],
      });
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
