import React, { useEffect, useRef } from "react";
import { Sigma } from "sigma";
import { Graph } from "graphology";
import axios from "axios";

const GraphVisualization = () => {
  const sigmaInstance = useRef(null); 
  const containerRef = useRef(null); 

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/graph")
      .then((response) => {
        const data = response.data;
        const graph = new Graph();


        data.nodes.forEach((node) => {
          graph.addNode(node.id, {
            label: `${node.name} (${node.age})`, 
            size: 15,
            color: "blue",
            city: node.city, 
            x: Math.random() * 100, 
            y: Math.random() * 100, 
          });
        });
        
        data.links.forEach((link) => {
          if (!graph.hasEdge(link.source, link.target)) {
            graph.addEdge(link.source, link.target, {
              size: 2,
              color: "gray",
            });
          }
        });

 
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
        sigmaInstance.current.kill(); 
      }
    };
  }, []);

  return (
    <div>
      <h2>Graph Visualization</h2>
      <div ref={containerRef} style={{ width: "100%", height: "500px" }} /> 
    </div>
  );
};

export default GraphVisualization;



