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
