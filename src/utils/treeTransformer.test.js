import test from 'node:test';
import assert from 'node:assert/strict';
import { transformTreeToGraph, applyHierarchicalLayout } from './treeTransformer.js';

test('transformTreeToGraph builds nodes and sibling edges from siblings payload', () => {
  const treeData = {
    rootMember: { id: 'root', firstName: 'Root', lastName: 'Person' },
    siblings: [
      { id: 'sib-1', firstName: 'Sib', lastName: 'One' },
      { id: 'sib-2', firstName: 'Sib', lastName: 'Two' },
    ],
  };

  const graph = transformTreeToGraph(treeData, 'siblings');

  assert.equal(graph.nodes.length, 3);
  assert.equal(graph.edges.filter((edge) => edge.style?.stroke === '#10b981').length, 2);
});

test('transformTreeToGraph builds spouse and parent/child edges from flat payloads', () => {
  const treeData = {
    rootMember: { id: 'root', firstName: 'Root', lastName: 'Person' },
    spouses: [{ id: 'sp-1', firstName: 'Spouse', lastName: 'One' }],
    parents: [{ id: 'par-1', firstName: 'Parent', lastName: 'One' }],
    children: [{ id: 'ch-1', firstName: 'Child', lastName: 'One' }],
  };

  const graph = transformTreeToGraph(treeData, 'tree');

  assert.equal(graph.nodes.length, 4);
  assert.equal(graph.edges.filter((edge) => edge.style?.stroke === '#ec4899').length, 1);
  assert.equal(graph.edges.filter((edge) => edge.style?.stroke === '#3b82f6').length, 2);
});

test('applyHierarchicalLayout keeps root, siblings and spouses on same row', () => {
  const nodes = [
    { id: 'root', data: { level: 'root' }, position: { x: 0, y: 0 } },
    { id: 'sib-1', data: { level: 'sibling' }, position: { x: 0, y: 0 } },
    { id: 'sp-1', data: { level: 'spouse' }, position: { x: 0, y: 0 } },
    { id: 'par-1', data: { level: 'parent' }, position: { x: 0, y: 0 } },
    { id: 'ch-1', data: { level: 'child' }, position: { x: 0, y: 0 } },
  ];

  const positioned = applyHierarchicalLayout(nodes, []);

  const root = positioned.find((node) => node.id === 'root');
  const sibling = positioned.find((node) => node.id === 'sib-1');
  const spouse = positioned.find((node) => node.id === 'sp-1');
  const parent = positioned.find((node) => node.id === 'par-1');
  const child = positioned.find((node) => node.id === 'ch-1');

  assert.equal(root.position.y, sibling.position.y);
  assert.equal(root.position.y, spouse.position.y);
  assert.ok(parent.position.y < root.position.y);
  assert.ok(child.position.y > root.position.y);
});

test('applyHierarchicalLayout keeps multigenerational ancestors on distinct rows', () => {
  const treeData = {
    rootMember: { id: 'root', firstName: 'Root', lastName: 'Person' },
    ancestors: [
      [{ id: 'parent-1', firstName: 'Parent', lastName: 'One', childId: 'root' }],
      [{ id: 'grandparent-1', firstName: 'Grand', lastName: 'Parent', childId: 'parent-1' }],
    ],
  };

  const graph = transformTreeToGraph(treeData, 'ancestors');
  const positioned = applyHierarchicalLayout(graph.nodes, graph.edges);

  const root = positioned.find((node) => node.id === 'root');
  const parent = positioned.find((node) => node.id === 'parent-1');
  const grandparent = positioned.find((node) => node.id === 'grandparent-1');

  assert.ok(grandparent.position.y < parent.position.y);
  assert.ok(parent.position.y < root.position.y);
});

test('applyHierarchicalLayout positions grandchildren under their own parent', () => {
  // Two children (A, B) each with one grandchild (GA under A, GB under B)
  const nodes = [
    { id: 'root', data: { level: 'root', row: 0 }, position: { x: 0, y: 0 } },
    { id: 'child-a', data: { level: 'child', row: 1 }, position: { x: 0, y: 0 } },
    { id: 'child-b', data: { level: 'child', row: 1 }, position: { x: 0, y: 0 } },
    { id: 'gc-a', data: { level: 'descendant', row: 2 }, position: { x: 0, y: 0 } },
    { id: 'gc-b', data: { level: 'descendant', row: 2 }, position: { x: 0, y: 0 } },
  ];
  const edges = [
    { id: 'root-child-a', source: 'root', target: 'child-a', data: { relationshipType: 'parent-child' } },
    { id: 'root-child-b', source: 'root', target: 'child-b', data: { relationshipType: 'parent-child' } },
    { id: 'child-a-gc-a', source: 'child-a', target: 'gc-a', data: { relationshipType: 'parent-child' } },
    { id: 'child-b-gc-b', source: 'child-b', target: 'gc-b', data: { relationshipType: 'parent-child' } },
  ];

  const positioned = applyHierarchicalLayout(nodes, edges);

  const childA = positioned.find((n) => n.id === 'child-a');
  const childB = positioned.find((n) => n.id === 'child-b');
  const gcA = positioned.find((n) => n.id === 'gc-a');
  const gcB = positioned.find((n) => n.id === 'gc-b');

  // Each grandchild should be closer to its own parent than to the other parent
  assert.ok(
    Math.abs(gcA.position.x - childA.position.x) < Math.abs(gcA.position.x - childB.position.x),
  );
  assert.ok(
    Math.abs(gcB.position.x - childB.position.x) < Math.abs(gcB.position.x - childA.position.x),
  );
});

test('transformTreeToGraph assigns directional labels to edges', () => {
  const treeData = {
    rootMember: { id: 'root', firstName: 'Root', lastName: 'Person' },
    parents: [{ id: 'par-1', firstName: 'Parent', lastName: 'One' }],
    children: [{ id: 'ch-1', firstName: 'Child', lastName: 'One' }],
    spouses: [{ id: 'sp-1', firstName: 'Spouse', lastName: 'One' }],
  };

  const graph = transformTreeToGraph(treeData, 'tree');

  const parentChildEdge = graph.edges.find((e) => e.data?.relationshipType === 'parent-child');
  const spouseEdge = graph.edges.find((e) => e.data?.relationshipType === 'spouse');

  assert.equal(parentChildEdge?.data?.label, 'Parent of');
  assert.equal(spouseEdge?.data?.label, 'Married to');
  // All edge visible labels start empty (shown only on hover/select in UI)
  assert.ok(graph.edges.every((e) => e.label === ''));
});
