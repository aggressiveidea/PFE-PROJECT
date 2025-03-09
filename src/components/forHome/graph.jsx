import React, { useEffect, useRef } from "react";
import { DataSet, Network } from "vis-network/standalone";

const ICTGraph = () => {
  const graphRef = useRef(null);

  useEffect(() => {
 
    const nodes = new DataSet([
      { id: "cloud", label: "Cloud", color: "#4a90e2", font: { size: 14 } },
      { id: "server", label: "Server", color: "#4a90e2", font: { size: 14 } },
      { id: "router", label: "Router", color: "#4a90e2", font: { size: 14 } },
      { id: "firewall", label: "Firewall", color: "#4a90e2", font: { size: 14 } },
      { id: "db", label: "Database", color: "#4a90e2", font: { size: 14 } },
      { id: "iot", label: "IoT Device", color: "#4a90e2", font: { size: 14 } },
      { id: "user", label: "User Device", color: "#4a90e2", font: { size: 14 } },
      { id: "switch", label: "Network Switch", color: "#4a90e2", font: { size: 14 } },
      { id: "api", label: "API Gateway", color: "#4a90e2", font: { size: 14 } },
    ]);

 
    const edges = new DataSet([
      { from: "cloud", to: "server", label: "HOSTS", color: "#50e3c2", font: { size: 12 } },
      { from: "server", to: "router", label: "CONNECTS", color: "#50e3c2", font: { size: 12 } },
      { from: "router", to: "firewall", label: "SECURES", color: "#50e3c2", font: { size: 12 } },
      { from: "firewall", to: "db", label: "PROTECTS", color: "#50e3c2", font: { size: 12 } },
      { from: "db", to: "iot", label: "STORES", color: "#50e3c2", font: { size: 12 } },
      { from: "iot", to: "user", label: "SENDS_TO", color: "#50e3c2", font: { size: 12 } },
      { from: "user", to: "switch", label: "ACCESSES", color: "#50e3c2", font: { size: 12 } },
      { from: "switch", to: "api", label: "ROUTES", color: "#50e3c2", font: { size: 12 } },
      { from: "api", to: "cloud", label: "INTEGRATES", color: "#50e3c2", font: { size: 12 } },
      { from: "cloud", to: "db", label: "BACKUPS", color: "#50e3c2", font: { size: 12 } },
    ]);

 
    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      nodes: {
        shape: "ellipse",
        font: {
          size: 14,
          color: "#ffffff",
          face: "Roboto", 
        },
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        arrows: {
          to: { enabled: true, scaleFactor: 0.5 },
        },
        font: {
          size: 12,
          color: "#333333",
          strokeWidth: 0, 
          strokeColor: "#ffffff",
          face: "Roboto", 
        },
        color: {
          color: "#50e3c2",
          highlight: "#50e3c2",
        },
        smooth: {
          type: "cubicBezier", 
        },
      },
      interaction: {
        dragNodes: true, 
        dragView: true, 
        zoomView: true, 
      },
      physics: {
        enabled: true, 
        stabilization: {
          iterations: 100, 
        },
      },
      layout: {
        improvedLayout: true, 
      },
    };

    const network = new Network(graphRef.current, data, options);

    network.on("stabilizationIterationsDone", () => {
      network.fit();
    });
    return () => {
      network.destroy();
    };
  }, []);

  return (
    <div
      ref={graphRef}
      style={{
        width: "800px", 
        height: "500px", 
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", 
        margin: "20px auto",
      }}
    />
  );
};

export default ICTGraph;