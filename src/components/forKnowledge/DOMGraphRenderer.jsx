import { useEffect, useRef, useState } from "react";
import SimpleForceLayout from "./SimpleForceLayout";

const DOMGraphRenderer = ({
  nodes,
  edges,
  width = 500,
  height = 400,
  onNodeClick,
  selectedNodeId = null,
  hoveredNodeId = null,
  onNodeHover = () => {},
  isDarkMode = false,
}) => {
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNode, setDragNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!nodes || !edges || nodes.length === 0) return;

    
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
    e.preventDefault();

    const node = positions.find((n) => n.id === nodeId);
    if (!node) return;

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - node.x;
    const offsetY = e.clientY - rect.top - node.y;

    setIsDragging(true);
    setDragNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragNode) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setPositions((prev) =>
      prev.map((node) => (node.id === dragNode ? { ...node, x, y } : node))
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNode(null);
  };

 
  const getNodeData = (nodeId) => {
    return nodes.find((n) => n.id === nodeId) || {};
  };

  const getEdgeData = (edge) => {
    return (
      edges.find(
        (e) =>
          (e.source === edge.source && e.target === edge.target) ||
          (e.source === edge.target && e.target === edge.source)
      ) || {}
    );
  };

 
  const getEdgePath = (sourceId, targetId) => {
    const source = positions.find((n) => n.id === sourceId);
    const target = positions.find((n) => n.id === targetId);

    if (!source || !target) return "";

    return `M${source.x},${source.y} L${target.x},${target.y}`;
  };

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
        overflow: "hidden",
      }}
    >
    
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

        let backgroundColor = isDarkMode ? "#333333" : "#ffffff";
        let borderColor = isDarkMode ? "#666666" : "#cccccc";
        const textColor = isDarkMode ? "#f5f5f7" : "#333333";

        if (nodeData.nodeType === "category") {
          backgroundColor = isDarkMode ? "#444444" : "#f0f0f0";
          borderColor = isDarkMode ? "#777777" : "#bbbbbb";
        }

        if (isSelected) {
          backgroundColor = isDarkMode ? "#555555" : "#eeeeee";
          borderColor = isDarkMode ? "#888888" : "#aaaaaa";
        }

        if (isHovered) {
          backgroundColor = isDarkMode ? "#666666" : "#dddddd";
          borderColor = isDarkMode ? "#999999" : "#999999";
        }

        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: `${node.x - 15}px`,
              top: `${node.y - 15}px`,
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: backgroundColor,
              border: `1px solid ${borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: textColor,
              cursor: "pointer",
              fontSize: "0.75rem",
              fontWeight: "bold",
              userSelect: "none",
            }}
            onMouseDown={(e) => handleMouseDown(e, node.id)}
            onClick={() => onNodeClick(node.id)}
            onMouseEnter={() => onNodeHover(node.id)}
            onMouseLeave={() => onNodeHover(null)}
          >
            {nodeData.label}
          </div>
        );
      })}
    </div>
  );
};

export default DOMGraphRenderer;
