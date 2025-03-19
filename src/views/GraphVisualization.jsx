import React, { useEffect, useRef } from "react";
import { Sigma } from "sigma";
import { Graph } from "graphology";
import axios from "axios";

const GraphVisualization = () => {
  const sigmaInstance = useRef(null); // ✅ Remove TypeScript syntax
  const containerRef = useRef(null); // ✅ No TypeScript-specific ref

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/graph")
      .then((response) => {
        const data = response.data;

        // Create a graph instance
        const graph = new Graph();

        // Add nodes with formatted properties
        data.nodes.forEach((node) => {
          graph.addNode(node.id, {
            label: `${node.name} (${node.age})`, // Show name and age
            size: 15,
            color: "blue",
            city: node.city, // Extra data
            x: Math.random() * 100, // ✅ Add random X coordinate
            y: Math.random() * 100, // ✅ Add random Y coordinate
          });
        });
        

        // Add edges (avoid duplicates)
        data.links.forEach((link) => {
          if (!graph.hasEdge(link.source, link.target)) {
            graph.addEdge(link.source, link.target, {
              size: 2,
              color: "gray",
            });
          }
        });

        // Initialize Sigma
        if (containerRef.current) {
          sigmaInstance.current = new Sigma(graph, containerRef.current, {
            renderEdgeLabels: true,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching graph data:", error);
      });

    return () => {
      if (sigmaInstance.current) {
        sigmaInstance.current.kill(); // Cleanup on unmount
      }
    };
  }, []);

  return (
    <div>
      <h2>Graph Visualization</h2>
      <div ref={containerRef} style={{ width: "100%", height: "500px" }} /> {/* ✅ Fixed */}
    </div>
  );
};

export default GraphVisualization;



