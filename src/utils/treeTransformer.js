/**
 * Tree Transformer Utility
 * Converts family tree API responses to React Flow nodes and edges
 * Handles deduplication of members appearing in multiple paths
 */

/**
 * Transform family tree API response to React Flow nodes and edges
 * @param {Object} treeData - Tree data from API
 * @param {string} treeType - Type of tree (ancestors, descendants, full)
 * @returns {Object} Object with nodes and edges arrays
 */
export function transformTreeToGraph(treeData, treeType = 'ancestors') {
  if (!treeData) return { nodes: [], edges: [] };

  const nodeMap = new Map(); // Deduplicate nodes by member ID
  const edges = [];

  // Process tree data based on structure returned from API
  // Assuming API returns: { rootMember, ancestors: [], descendants: [], relationships: [] }
  console.log('Transforming tree data:', treeData, treeType);

  const rootMember = treeData.rootMember || treeData.member || treeData;

  // If rootMember has an id, add it as root node
  if (rootMember && rootMember.id) {
    addNode(rootMember, 0, 0, 'root');
  }

  // Process ancestors (parent levels)
  if (treeData.ancestors && Array.isArray(treeData.ancestors)) {
    processAncestors(treeData.ancestors, nodeMap, edges);
  }

  // Process descendants (child levels)
  if (treeData.descendants && Array.isArray(treeData.descendants)) {
    processDescendants(treeData.descendants, nodeMap, edges);
  }

  // Process relationships (siblings, spouses)
  if (treeData.relationships && Array.isArray(treeData.relationships)) {
    processRelationships(treeData.relationships, nodeMap, edges);
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges: edges,
  };

  function addNode(member, x, y, level = 'middle') {
    if (!nodeMap.has(member.id)) {
      nodeMap.set(member.id, {
        id: String(member.id),
        type: 'familyMember',
        position: { x: x * 250, y: y * 150 },
        data: {
          member: member,
          level: level,
        },
      });
    }
  }

  function addEdge(sourceId, targetId, type = 'parent-child') {
    const edgeId = `${sourceId}-${targetId}-${type}`;
    // Check if edge already exists
    if (!edges.find((e) => e.id === edgeId)) {
      edges.push({
        id: edgeId,
        source: String(sourceId),
        target: String(targetId),
        type: 'smoothstep',
        animated: false,
        style: getEdgeStyle(type),
        label: type === 'spouse' ? '💍' : '',
      });
    }
  }

  function processAncestors(ancestors, nodeMap, edges) {
    ancestors.forEach((level, levelIndex) => {
      if (Array.isArray(level)) {
        level.forEach((member, index) => {
          addNode(member, index - level.length / 2, -(levelIndex + 1), 'ancestor');
          if (member.childId) {
            addEdge(member.id, member.childId, 'parent-child');
          }
        });
      }
    });
  }

  function processDescendants(descendants, nodeMap, edges) {
    descendants.forEach((level, levelIndex) => {
      if (Array.isArray(level)) {
        level.forEach((member, index) => {
          addNode(member, index - level.length / 2, levelIndex + 1, 'descendant');
          if (member.parentId) {
            addEdge(member.parentId, member.id, 'parent-child');
          }
        });
      }
    });
  }

  function processRelationships(relationships, nodeMap, edges) {
    relationships.forEach((rel) => {
      if (rel.relationshipType === 'Spouse' || rel.relationshipType === 'Partner') {
        addEdge(rel.fromMemberId, rel.toMemberId, 'spouse');
      }
    });
  }
}

/**
 * Get edge styling based on relationship type
 * @param {string} type - Relationship type
 * @returns {Object} Style object for edge
 */
function getEdgeStyle(type) {
  switch (type) {
    case 'parent-child':
      return { stroke: '#3b82f6', strokeWidth: 2 };
    case 'spouse':
      return { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '5,5' };
    case 'sibling':
      return { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '3,3' };
    default:
      return { stroke: '#6b7280', strokeWidth: 1 };
  }
}

/**
 * Calculate automatic layout positioning using hierarchical approach
 * @param {Array} nodes - Array of nodes
 * @param {Array} edges - Array of edges
 * @returns {Array} Updated nodes with positions
 */
export function applyHierarchicalLayout(nodes, edges) {
  // Group nodes by level (y-coordinate)
  const levels = new Map();
  nodes.forEach((node) => {
    const level = node.data.level;
    if (!levels.has(level)) {
      levels.set(level, []);
    }
    levels.get(level).push(node);
  });

  // Apply horizontal spacing within each level
  const levelOrder = ['ancestor', 'root', 'descendant'];
  let currentY = 0;

  levelOrder.forEach((levelName) => {
    const levelNodes = levels.get(levelName) || [];
    const spacing = 250;
    const startX = -(levelNodes.length * spacing) / 2;

    levelNodes.forEach((node, index) => {
      node.position = {
        x: startX + index * spacing,
        y: currentY,
      };
    });

    if (levelNodes.length > 0) {
      currentY += 150;
    }
  });

  return nodes;
}
