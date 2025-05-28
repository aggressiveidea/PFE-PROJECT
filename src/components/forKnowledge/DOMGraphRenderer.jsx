<<<<<<< Updated upstream
import { useEffect, useRef, useState } from "react";
import SimpleForceLayout from "./SimpleForceLayout";
=======
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Move } from "lucide-react";
>>>>>>> Stashed changes

const DOMGraphRenderer = ({
  nodes,
  edges,
  width,
  height,
  onNodeClick,
  selectedNodeId,
  hoveredNodeId,
  onNodeHover,
  isDarkMode,
}) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNode, setDraggingNode] = useState(null);
  const [nodeSize, setNodeSize] = useState({});

<<<<<<< Updated upstream
=======
  // Initialize node positions
>>>>>>> Stashed changes
  useEffect(() => {
    const positions = {};
    const sizes = {};

<<<<<<< Updated upstream
    
    const layout = new SimpleForceLayout(
      nodes.map((node) => ({
        ...node,
        fixed: node.nodeType === "category", 
      })),
      edges,
      { width, height }
    );

    layout.run(50);

  
    setPositions(layout.getPositions());
  }, [nodes, edges, width, height]);

  
  const handleMouseDown = (e, nodeId) => {
=======
    nodes.forEach((node) => {
      // Use provided positions if available, otherwise calculate
      if (node.x !== undefined && node.y !== undefined) {
        positions[node.id] = {
          x: node.x,
          y: node.y,
        };
      } else {
        // Random position if not provided
        positions[node.id] = {
          x: Math.random() * width - width / 2,
          y: Math.random() * height - height / 2,
        };
      }

      // Set node size based on type or provided size
      sizes[node.id] =
        node.size ||
        (node.nodeType === "category" ? 15 : node.nodeType === "term" ? 10 : 7);
    });

    setNodePositions(positions);
    setNodeSize(sizes);
  }, [nodes, width, height]);

  // Handle mouse wheel for zooming
  const handleWheel = (e) => {
>>>>>>> Stashed changes
    e.preventDefault();
    const delta = e.deltaY;
    const newScale = delta > 0 ? scale * 0.9 : scale * 1.1;
    setScale(Math.min(Math.max(newScale, 0.1), 5));
  };

  // Handle mouse down for panning
  const handleMouseDown = (e) => {
    // Only start dragging on background, not on nodes
    if (e.target === containerRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Handle mouse move for panning or dragging nodes
  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setTranslate({
        x: translate.x + dx / scale,
        y: translate.y + dy / scale,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (draggingNode) {
      // Update position of the dragged node
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale - translate.x;
      const y = (e.clientY - rect.top) / scale - translate.y;

      setNodePositions((prev) => ({
        ...prev,
        [draggingNode]: { x, y },
      }));
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingNode(null);
  };

<<<<<<< Updated upstream
 
  const getNodeData = (nodeId) => {
    return nodes.find((n) => n.id === nodeId) || {};
=======
  // Handle node mouse down for dragging
  const handleNodeMouseDown = (e, nodeId) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
>>>>>>> Stashed changes
  };

  // Handle node click
  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation();
    if (onNodeClick) {
      onNodeClick(nodeId);
    }
  };

<<<<<<< Updated upstream
 
  const getEdgePath = (sourceId, targetId) => {
    const source = positions.find((n) => n.id === sourceId);
    const target = positions.find((n) => n.id === targetId);
=======
  // Calculate edge path between two nodes
  const calculateEdgePath = (sourceId, targetId) => {
    const source = nodePositions[sourceId];
    const target = nodePositions[targetId];
>>>>>>> Stashed changes

    if (!source || !target) return null;

    // Calculate center coordinates
    const centerX = width / 2;
    const centerY = height / 2;

    // Apply scale and translation
    const sourceX = centerX + (source.x + translate.x) * scale;
    const sourceY = centerY + (source.y + translate.y) * scale;
    const targetX = centerX + (target.x + translate.x) * scale;
    const targetY = centerY + (target.y + translate.y) * scale;

    // Calculate source and target node sizes
    const sourceSize = (nodeSize[sourceId] || 10) * scale;
    const targetSize = (nodeSize[targetId] || 10) * scale;

    // Calculate direction vector
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Normalize direction vector
    const nx = dx / length;
    const ny = dy / length;

    // Adjust start and end points to be on the edge of the nodes
    const startX = sourceX + nx * sourceSize;
    const startY = sourceY + ny * sourceSize;
    const endX = targetX - nx * targetSize;
    const endY = targetY - ny * targetSize;

    return { startX, startY, endX, endY };
  };

<<<<<<< Updated upstream
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [isDragging, dragNode, dragOffset]);

  if (!positions.length) {
    return (
      <div
        ref={containerRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          position: "relative",
          backgroundColor: isDarkMode ? "#1a1a1a" : "#f8fafc",
          border: `1px solid ${isDarkMode ? "#333333" : "#e2e8f0"}`,
          borderRadius: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isDarkMode ? "#f5f5f7" : "#333333",
        }}
      >
        <div>Loading graph...</div>
      </div>
    );
  }

=======
>>>>>>> Stashed changes
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: isDarkMode ? "#1a1a1a" : "#f8fafc",
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
<<<<<<< Updated upstream
    
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      >
        {edges.map((edge) => {
          const edgeData = getEdgeData(edge);
          const path = getEdgePath(edge.source, edge.target);
          return (
            <path
              key={`${edge.source}-${edge.target}`}
              d={path}
              stroke={isDarkMode ? "#666666" : "#cccccc"}
              strokeWidth={1}
            />
          );
        })}
      </svg>

  
      {positions.map((node) => {
        const nodeData = getNodeData(node.id);
        const isSelected = node.id === selectedNodeId;
        const isHovered = node.id === hoveredNodeId;
=======
      {/* Render edges */}
      {edges.map((edge) => {
        const path = calculateEdgePath(edge.source, edge.target);
        if (!path) return null;

        const { startX, startY, endX, endY } = path;

        // Calculate midpoint for edge label
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        return (
          <React.Fragment key={`edge-${edge.source}-${edge.target}`}>
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={edge.color || "#a78bfa"}
                strokeWidth={edge.size || 1}
                strokeOpacity={
                  hoveredNodeId &&
                  (edge.source === hoveredNodeId ||
                    edge.target === hoveredNodeId)
                    ? 1
                    : 0.6
                }
                strokeDasharray={edge.type === "dashed" ? "5,5" : ""}
              />
              {/* Arrow head */}
              {edge.type === "arrow" && (
                <polygon
                  points={`${endX},${endY} ${
                    endX -
                    5 *
                      (Math.cos(Math.atan2(endY - startY, endX - startX)) -
                        Math.sin(Math.atan2(endY - startY, endX - startX)))
                  },${
                    endY -
                    5 *
                      (Math.sin(Math.atan2(endY - startY, endX - startX)) +
                        Math.cos(Math.atan2(endY - startY, endX - startX)))
                  } ${
                    endX -
                    5 *
                      (Math.cos(Math.atan2(endY - startY, endX - startX)) +
                        Math.sin(Math.atan2(endY - startY, endX - startX)))
                  },${
                    endY -
                    5 *
                      (Math.sin(Math.atan2(endY - startY, endX - startX)) -
                        Math.cos(Math.atan2(endY - startY, endX - startX)))
                  }`}
                  fill={edge.color || "#a78bfa"}
                />
              )}
            </svg>
            {/* Edge label */}
            {edge.label && (
              <div
                style={{
                  position: "absolute",
                  top: midY,
                  left: midX,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: isDarkMode
                    ? "rgba(34, 34, 34, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                  color: isDarkMode ? "#f5f5f7" : "#1e293b",
                  padding: "2px 4px",
                  borderRadius: "2px",
                  fontSize: "10px",
                  pointerEvents: "none",
                  zIndex: 2,
                  opacity:
                    hoveredNodeId &&
                    (edge.source === hoveredNodeId ||
                      edge.target === hoveredNodeId)
                      ? 1
                      : 0.6,
                }}
              >
                {edge.label}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Render nodes */}
      {nodes.map((node) => {
        const position = nodePositions[node.id];
        if (!position) return null;
>>>>>>> Stashed changes

        // Calculate center coordinates
        const centerX = width / 2;
        const centerY = height / 2;

        // Apply scale and translation
        const x = centerX + (position.x + translate.x) * scale;
        const y = centerY + (position.y + translate.y) * scale;

        // Calculate node size
        const size = (nodeSize[node.id] || 10) * scale;

        // Determine if node is selected or hovered
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;

        return (
          <div
            key={`node-${node.id}`}
            style={{
              position: "absolute",
              top: y - size / 2,
              left: x - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: node.color || "#8b5cf6",
              border: isSelected
                ? `2px solid ${isDarkMode ? "#ffffff" : "#0f172a"}`
                : isHovered
                ? `2px solid ${isDarkMode ? "#aaaaaa" : "#64748b"}`
                : "none",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex:
                isSelected || isHovered
                  ? 4
                  : node.nodeType === "category"
                  ? 3
                  : 2,
              transition: "transform 0.2s ease",
              transform: isHovered || isSelected ? "scale(1.1)" : "scale(1)",
            }}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onClick={(e) => handleNodeClick(e, node.id)}
            onMouseEnter={() => onNodeHover && onNodeHover(node.id)}
            onMouseLeave={() => onNodeHover && onNodeHover(null)}
          >
            {/* Node icon or label */}
            {node.nodeType === "category" ? (
              <div
                style={{
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                  fontSize: Math.max(size / 3, 10),
                }}
              >
                C
              </div>
            ) : node.nodeType === "term" ? (
              <div
                style={{
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                  fontSize: Math.max(size / 3, 10),
                }}
              >
                T
              </div>
            ) : (
              <div
                style={{
                  color: isDarkMode ? "#ffffff" : "#0f172a",
                  fontSize: Math.max(size / 3, 10),
                }}
              >
                D
              </div>
            )}

            {/* Node label */}
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: "50%",
                transform: "translateX(-50%)",
                whiteSpace: "nowrap",
                fontSize: Math.max(10, size / 3),
                backgroundColor: isDarkMode
                  ? "rgba(34, 34, 34, 0.8)"
                  : "rgba(255, 255, 255, 0.8)",
                color: isDarkMode ? "#f5f5f7" : "#1e293b",
                padding: "2px 4px",
                borderRadius: "2px",
                pointerEvents: "none",
                opacity: isHovered || isSelected ? 1 : 0,
                transition: "opacity 0.2s ease",
                maxWidth: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {node.label || node.id}
            </div>
          </div>
        );
      })}

      {/* Pan indicator */}
      {isDragging && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: isDarkMode
              ? "rgba(34, 34, 34, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
            color: isDarkMode ? "#f5f5f7" : "#1e293b",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <Move size={14} /> Panning
        </div>
      )}

      {/* Zoom level indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: isDarkMode
            ? "rgba(34, 34, 34, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          color: isDarkMode ? "#f5f5f7" : "#1e293b",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        Zoom: {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

export default DOMGraphRenderer;
