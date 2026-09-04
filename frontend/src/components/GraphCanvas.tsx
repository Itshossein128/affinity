import { useEffect, useRef, useState } from 'react';
import { BaseNode, NeighborEntry, NeighborhoodResponse } from '../types';

interface GraphCanvasProps {
  neighborhood: NeighborhoodResponse | null;
  loading: boolean;
  onNodeClick: (nodeId: string) => void;
  onFocusClick: (node: BaseNode) => void;
}

const TYPE_COLORS: Record<string, string> = {
  Genre: '#6366f1',
  Artist: '#ec4899',
  Movie: '#f59e0b',
  Book: '#10b981',
  Game: '#06b6d4',
  Category: '#a855f7',
  Person: '#f43f5e',
  User: '#f43f5e',
};

export default function GraphCanvas({ neighborhood, loading, onNodeClick, onFocusClick }: GraphCanvasProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const animRef = useRef<number>(0);

  // Animate nodes in when neighborhood changes
  useEffect(() => {
    setAnimationProgress(0);
    const start = performance.now();
    const duration = 500;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimationProgress(eased);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [neighborhood]);

  if (loading && !neighborhood) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading graph...</p>
        </div>
      </div>
    );
  }

  if (!neighborhood) {
    return <div className="flex items-center justify-center w-full h-full text-white/40">Select a node to explore</div>;
  }

  const { focusNode, neighbors } = neighborhood;

  const width = 800;
  const height = 600;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.32;

  const getPos = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle) * animationProgress,
      y: cy + radius * Math.sin(angle) * animationProgress,
    };
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="bg-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f0d2e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle background radial */}
        <circle cx={cx} cy={cy} r={radius + 60} fill="url(#bg-gradient)" />

        {/* Edges */}
        <g>
          {neighbors.map((entry: NeighborEntry, i: number) => {
            const pos = getPos(i, neighbors.length);
            const weight = (entry.edge.properties?.weight as number) || 0.5;
            const isHovered = hoveredNodeId === entry.node.id;

            return (
              <line
                key={`edge-${entry.node.id}`}
                x1={cx}
                y1={cy}
                x2={pos.x}
                y2={pos.y}
                stroke={isHovered ? '#ffffff' : 'rgba(255,255,255,0.15)'}
                strokeWidth={Math.max(1.5, weight * 4)}
                strokeDasharray={isHovered ? '6 4' : 'none'}
                opacity={animationProgress}
                style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
              />
            );
          })}
        </g>

        {/* Neighbor Nodes */}
        <g>
          {neighbors.map((entry: NeighborEntry, i: number) => {
            const pos = getPos(i, neighbors.length);
            const color = TYPE_COLORS[entry.node.type] || '#94a3b8';
            const isHovered = hoveredNodeId === entry.node.id;
            const displayName = entry.node.name || entry.node.displayName || '?';

            return (
              <g
                key={entry.node.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onNodeClick(entry.node.id)}
                onMouseEnter={() => setHoveredNodeId(entry.node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Hover ring */}
                {isHovered && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={36}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.5"
                    filter="url(#glow-soft)"
                  />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 33 : 28}
                  fill={color}
                  opacity={0.85}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                  style={{ transition: 'r 0.2s' }}
                />
                {/* Type icon */}
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="16"
                  style={{ pointerEvents: 'none' }}
                >
                  {entry.node.type === 'Artist' ? '🎵' :
                   entry.node.type === 'Movie' ? '🎬' :
                   entry.node.type === 'Book' ? '📚' :
                   entry.node.type === 'Game' ? '🎮' :
                   entry.node.type === 'Genre' ? '🏷️' :
                   entry.node.type === 'Category' ? '📂' :
                   entry.node.type === 'User' ? '👤' : '•'}
                </text>
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + 46}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize="11"
                  fontWeight="500"
                  style={{ pointerEvents: 'none' }}
                >
                  {displayName.length > 18 ? displayName.slice(0, 16) + '…' : displayName}
                </text>
                {/* Edge label on hover */}
                {isHovered && (
                  <text
                    x={pos.x}
                    y={pos.y + 60}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.4)"
                    fontSize="9"
                    style={{ pointerEvents: 'none' }}
                  >
                    {entry.edge.type} ({entry.edge.direction})
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Focus Node */}
        <g
          style={{ cursor: 'pointer' }}
          onClick={() => onFocusClick(focusNode)}
        >
          <circle
            cx={cx}
            cy={cy}
            r={54}
            fill="none"
            stroke={TYPE_COLORS[focusNode.type] || '#6366f1'}
            strokeWidth="2"
            opacity="0.3"
            filter="url(#glow)"
          />
          <circle
            cx={cx}
            cy={cy}
            r={46}
            fill={TYPE_COLORS[focusNode.type] || '#6366f1'}
            filter="url(#glow)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
          />
          {/* Focus node name */}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            style={{ pointerEvents: 'none' }}
          >
            {(focusNode.name || focusNode.displayName || '?')}
          </text>
          {/* Focus node type */}
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fill="rgba(255,255,255,0.6)"
            fontSize="10"
            fontWeight="600"
            letterSpacing="0.1em"
            style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
          >
            {focusNode.type}
          </text>
        </g>

        {/* Neighbor count badge */}
        <text
          x={cx}
          y={height - 20}
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          fontSize="11"
        >
          {neighbors.length} connection{neighbors.length !== 1 ? 's' : ''}
        </text>
      </svg>
    </div>
  );
}
