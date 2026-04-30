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
export function transformTreeToGraph(treeData, _treeType = 'ancestors') {
  if (!treeData) return { nodes: [], edges: [] };

  const nodeMap = new Map(); // Deduplicate nodes by member ID
  const edges = [];

  const rootMember = treeData.rootMember || treeData.member || treeData;
  const rootMemberId = rootMember?.id;

  // If rootMember has an id, add it as root node
  if (rootMemberId) {
    addNode(rootMember, 0, 0, 'root');
  }

  // Process ancestors (parent levels)
  if (treeData.ancestors && Array.isArray(treeData.ancestors)) {
    processAncestors(treeData.ancestors);
  }

  // Process descendants (child levels)
  if (treeData.descendants && Array.isArray(treeData.descendants)) {
    processDescendants(treeData.descendants);
  }

  if (rootMemberId && treeData.parents && Array.isArray(treeData.parents)) {
    processParents(treeData.parents, rootMemberId);
  }

  if (rootMemberId && treeData.children && Array.isArray(treeData.children)) {
    processChildren(treeData.children, rootMemberId);
  }

  if (rootMemberId && treeData.siblings && Array.isArray(treeData.siblings)) {
    processSiblings(treeData.siblings, rootMemberId);
  }

  if (rootMemberId && treeData.spouses && Array.isArray(treeData.spouses)) {
    processSpouses(treeData.spouses, rootMemberId);
  }

  // Process relationships (siblings, spouses)
  if (treeData.relationships && Array.isArray(treeData.relationships)) {
    processRelationships(treeData.relationships);
  }

  return {
    nodes: Array.from(nodeMap.values()),
    edges: edges,
  };

  function addNode(member, x, y, level = 'middle', row = null) {
    const resolvedRow = Number.isFinite(row) ? row : y;
    if (!nodeMap.has(member.id)) {
      nodeMap.set(member.id, {
        id: String(member.id),
        type: 'familyMember',
        position: { x: x * 250, y: y * 150 },
        data: {
          member: member,
          level: level,
          row: resolvedRow,
        },
      });
    }
  }

  function addEdge(sourceId, targetId, type = 'parent-child') {
    if (!sourceId || !targetId) {
      return;
    }

    const isPeerRelationship = type === 'spouse' || type === 'sibling';
    const normalizedSource = isPeerRelationship
      ? [String(sourceId), String(targetId)].sort()[0]
      : String(sourceId);
    const normalizedTarget = isPeerRelationship
      ? [String(sourceId), String(targetId)].sort()[1]
      : String(targetId);
    const edgeId = `${normalizedSource}-${normalizedTarget}-${type}`;

    if (!nodeMap.has(normalizedSource) || !nodeMap.has(normalizedTarget)) {
      return;
    }

    // Check if edge already exists
    if (!edges.find((e) => e.id === edgeId)) {
      edges.push({
        id: edgeId,
        source: normalizedSource,
        target: normalizedTarget,
        type: 'smoothstep',
        animated: false,
        style: getEdgeStyle(type),
        label: '',
        labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9 },
        labelStyle: { fontSize: 11, fontWeight: 500, fill: '#374151' },
        data: { relationshipType: type, label: getDirectionalLabel(type) },
      });
    }
  }

  function processAncestors(ancestors) {
    ancestors.forEach((level, levelIndex) => {
      if (Array.isArray(level)) {
        level.forEach((member, index) => {
          const row = -(levelIndex + 1);
          addNode(member, index - level.length / 2, row, 'ancestor', row);
          if (member.childId) {
            addEdge(member.id, member.childId, 'parent-child');
          }
        });
      }
    });
  }

  function processDescendants(descendants) {
    descendants.forEach((level, levelIndex) => {
      if (Array.isArray(level)) {
        level.forEach((member, index) => {
          const row = levelIndex + 1;
          addNode(member, index - level.length / 2, row, 'descendant', row);
          if (member.parentId) {
            addEdge(member.parentId, member.id, 'parent-child');
          }
        });
      }
    });
  }

  function processParents(parents, memberId) {
    parents.forEach((member, index) => {
      addNode(member, index - parents.length / 2, -1, 'parent', -1);
      addEdge(member.id, memberId, 'parent-child');
    });
  }

  function processChildren(children, memberId) {
    children.forEach((member, index) => {
      addNode(member, index - children.length / 2, 1, 'child', 1);
      addEdge(memberId, member.id, 'parent-child');
    });
  }

  function processSiblings(siblings, memberId) {
    siblings.forEach((member, index) => {
      addNode(member, index + 1, 0, 'sibling', 0);
      addEdge(memberId, member.id, 'sibling');
    });
  }

  function processSpouses(spouses, memberId) {
    spouses.forEach((member, index) => {
      addNode(member, -(index + 1), 0, 'spouse', 0);
      addEdge(memberId, member.id, 'spouse');
    });
  }

  function processRelationships(relationships) {
    relationships.forEach((rel) => {
      const relationshipType = rel.relationshipType?.toLowerCase();

      if (relationshipType === 'spouse' || relationshipType === 'partner') {
        addEdge(rel.fromMemberId, rel.toMemberId, 'spouse');
      }

      if (relationshipType === 'sibling') {
        addEdge(rel.fromMemberId, rel.toMemberId, 'sibling');
      }
    });
  }
}

/**
 * Get edge styling based on relationship type
  /**
   * Get directional label text for an edge relationship type
   * @param {string} type - Relationship type
   * @returns {string} Human-readable directional label
   */
  function getDirectionalLabel(type) {
    switch (type) {
      case 'parent-child':
        return 'Parent of';
      case 'sibling':
        return 'Sibling of';
      case 'spouse':
        return 'Married to';
      default:
        return '';
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
  const rows = new Map();
  const rowHeight = 170;
  const spacing = 250;
  const minSpacing = 180;

  function getRowForLevel(level) {
    switch (level) {
      case 'ancestor':
      case 'parent':
        return -1;
      case 'root':
      case 'sibling':
      case 'spouse':
      case 'middle':
        return 0;
      case 'child':
      case 'descendant':
        return 1;
      default:
        return 0;
    }
  }

  nodes.forEach((node) => {
    const explicitRow = Number(node.data?.row);
    const row = Number.isFinite(explicitRow)
      ? explicitRow
      : getRowForLevel(node.data.level);
    if (!rows.has(row)) {
      rows.set(row, []);
    }
    rows.get(row).push(node);
  });

  // Index for O(1) parent lookups during descendant positioning
  const nodeById = new Map(nodes.map((n) => [n.id, n]));
  const childToParentEdge = new Map();
  edges.forEach((e) => {
    if (e.data?.relationshipType === 'parent-child') {
      childToParentEdge.set(e.target, e);
    }
  });

  const rowOrder = Array.from(rows.keys()).sort((a, b) => a - b);

  rowOrder.forEach((row) => {
    const rowNodes = rows.get(row) || [];
    if (!rowNodes.length) {
      return;
    }

    const y = row * rowHeight;

    // Root row: center root node, alternate peers around it
    const rootNode = rowNodes.find((node) => node.data.level === 'root');
    if (rootNode) {
      rootNode.position = { x: 0, y };

      const peers = rowNodes
        .filter((node) => node.id !== rootNode.id)
        .sort((a, b) => {
          const levelWeight = { spouse: 0, sibling: 1, root: 2 };
          const aWeight = levelWeight[a.data.level] ?? 3;
          const bWeight = levelWeight[b.data.level] ?? 3;
          return aWeight - bWeight;
        });

      peers.forEach((node, index) => {
        const step = Math.floor(index / 2) + 1;
        const direction = index % 2 === 0 ? -1 : 1;
        node.position = { x: direction * step * spacing, y };
      });
      return;
    }

    // Descendant rows (row > 0): group children under their direct parent
    if (row > 0) {
      const parentToChildren = new Map();
      const orphans = [];

      rowNodes.forEach((node) => {
        const parentEdge = childToParentEdge.get(node.id);
        if (parentEdge) {
          const parent = nodeById.get(parentEdge.source);
          if (parent && Number.isFinite(parent.position?.x)) {
            if (!parentToChildren.has(parentEdge.source)) {
              parentToChildren.set(parentEdge.source, []);
            }
            parentToChildren.get(parentEdge.source).push(node);
          } else {
            orphans.push(node);
          }
        } else {
          orphans.push(node);
        }
      });

      parentToChildren.forEach((children, parentId) => {
        const parent = nodeById.get(parentId);
        const parentX = parent.position.x;
        // Hybrid spacing cap: compress large sibling groups but keep a minimum gap
        const effectiveSpacing =
          children.length > 5
            ? Math.max(minSpacing, (spacing * 5) / children.length)
            : spacing;
        const totalWidth = (children.length - 1) * effectiveSpacing;
        const startX = parentX - totalWidth / 2;
        children.forEach((child, idx) => {
          child.position = { x: startX + idx * effectiveSpacing, y };
        });
      });

      // Nodes whose parent is not yet positioned: spread evenly as fallback
      if (orphans.length > 0) {
        const startX = -((orphans.length - 1) * spacing) / 2;
        orphans.forEach((node, idx) => {
          node.position = { x: startX + idx * spacing, y };
        });
      }
      return;
    }

    // Ancestor rows (row <= 0, non-root): spread evenly
    const startX = -((rowNodes.length - 1) * spacing) / 2;
    rowNodes.forEach((node, index) => {
      node.position = { x: startX + index * spacing, y };
    });
  });

  return nodes;
}
