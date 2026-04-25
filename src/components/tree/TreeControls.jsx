import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function TreeControls({
  onZoomIn,
  onZoomOut,
  onFitView,
  depth,
  onDepthChange,
  viewMode,
  onViewModeChange,
}) {
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 space-y-4 z-10">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onZoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={onFitView}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Fit to View"
        >
          <Maximize2 className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Depth</label>
        <select
          value={depth}
          onChange={(e) => onDepthChange(Number(e.target.value))}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value={1}>1 Level</option>
          <option value={2}>2 Levels</option>
          <option value={3}>3 Levels</option>
          <option value={4}>4 Levels</option>
          <option value={5}>5 Levels</option>
        </select>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">View</label>
        <select
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value)}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
        >
          <option value="ancestors">Ancestors</option>
          <option value="descendants">Descendants</option>
          <option value="tree">Full Tree</option>
        </select>
      </div>
    </div>
  );
}
