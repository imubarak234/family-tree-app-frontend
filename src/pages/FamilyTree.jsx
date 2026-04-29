import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitBranch, Search } from 'lucide-react';
import { useFamilyTree } from '../hooks/useFamilyTree';
import { transformTreeToGraph, applyHierarchicalLayout } from '../utils/treeTransformer';
import FamilyMemberNode from '../components/tree/FamilyMemberNode';
import TreeControls from '../components/tree/TreeControls';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MemberSearchDropdown from '../components/relationships/MemberSearchDropdown';

const nodeTypes = {
  familyMember: FamilyMemberNode,
};

export default function FamilyTree() {
  const [rootMemberId, setRootMemberId] = useState(null);
  const [depth, setDepth] = useState(3);
  const [viewMode, setViewMode] = useState('ancestors'); // ancestors | descendants | tree
  const [showSearch, setShowSearch] = useState(true);

  const { treeData, loading, error } = useFamilyTree(rootMemberId, viewMode, depth);

  // Transform tree data to graph
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!treeData) return { nodes: [], edges: [] };
    const graph = transformTreeToGraph(treeData, viewMode);
    graph.nodes = applyHierarchicalLayout(graph.nodes, graph.edges);
    return graph;
  }, [treeData, viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes/edges when tree data changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onMemberSelect = useCallback((memberId) => {
    setRootMemberId(memberId);
    setShowSearch(false);
  }, []);

  const handleZoomIn = () => {
    // Handled by ReactFlow Controls
  };

  const handleZoomOut = () => {
    // Handled by ReactFlow Controls
  };

  const handleFitView = () => {
    // Handled by ReactFlow Controls
  };


  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Family Tree</h1>
          </div>

          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            Select Member
          </button>
        </div>
      </div>

      {/* Member Search Dropdown */}
      {showSearch && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 w-96">
          <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Select a family member to view their tree</p>
            <MemberSearchDropdown
              selectedMemberId={rootMemberId}
              onChange={onMemberSelect}
              excludeMemberId={null}
            />
          </div>
        </div>
      )}

      {/* Tree Visualization */}
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => setShowSearch(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Select Another Member
              </button>
            </div>
          </div>
        )}

        {!rootMemberId && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-center">
              <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Select a family member to visualize their tree</p>
              <button
                onClick={() => setShowSearch(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {rootMemberId && !loading && !error && (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
          >
            <Background color="#e5e7eb" gap={16} />
            <Controls />
            <MiniMap nodeColor="#3b82f6" />

            <TreeControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitView={handleFitView}
              depth={depth}
              onDepthChange={setDepth}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
