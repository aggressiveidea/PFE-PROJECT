"use client"
import { useState, useEffect } from "react"
import Header from "../components/forHome/Header"
import Sidebar from "../components/forDashboard/Sidebar"
import Footer from "../components/forHome/Footer"
import GraphVisualization from "../components/forKnowledge/GraphVisualization"
import GraphAlgorithmsSection from "../components/forKnowledge/GraphAlgorithms"
import AccessLock from "../components/forKnowledge/AccessLock"
import "./ICTDictionary.css"
import { Globe,Maximize,RotateCcw ,ZoomOut,ZoomIn, Sun, Moon, Sparkles } from "lucide-react";
import DOMGraphRenderer from "../components/forKnowledge/DOMGraphRenderer";
import useIsMounted from "../components/forKnowledge/useIsMounted";
import { getAllterms } from "../../services/Api";


const KnowledgeGraphPage = () => {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [statistics, setStatistics] = useState({
    totalNodes: 0,
    terms: 0,
    definitions: 0,
    categories: 0,
    relationships: 0,
  });
  const [relationshipTypes, setRelationshipTypes] = useState([]);
  const isMounted = useIsMounted();

  useEffect(() => {
    const loadGraphData = async () => {
      try {
        setLoading(true);
        const data = await getAllterms();

        if (isMounted()) {
          setGraphData(data);

          // Calculate statistics
          setStatistics({
            totalNodes: data.nodes.length,
            terms: data.nodes.filter((n) => n.type === "term").length,
            definitions: data.nodes.filter((n) => n.type === "definition")
              .length,
            categories: new Set(data.nodes.map((n) => n.category)).size,
            relationships: data.links.length,
          });

          // Extract relationship types
          const types = [...new Set(data.links.map((link) => link.type))];
          setRelationshipTypes(types);
        }
      } catch (err) {
        if (isMounted()) {
          setError(err.message || "Failed to load graph data");
        }
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    };

    if (isVerified) {
      loadGraphData();
    }
  }, [isVerified, isMounted]);

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
  };

  const handleVerification = () => {
    setIsVerified(true);
  };

  if (!isVerified) {
    return <AccessLock onVerify={handleVerification} />;
  }

  return (
    <div className="knowledge-graph-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading knowledge graph...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => setIsVerified(false)}>Retry</button>
        </div>
      ) : (
        <>
          <div className="graph-visualization-wrapper">
            <div className="graph-search">
              <input type="text" placeholder="Search nodes..." />
            </div>

            <GraphVisualization
              data={graphData}
              onNodeSelect={handleNodeSelect}
              fallbackRenderer={DOMGraphRenderer}
            />

            <div className="graph-controls">
              <button className="graph-control-btn" title="Zoom In">
                <ZoomIn size={18} />
              </button>
              <button className="graph-control-btn" title="Zoom Out">
                <ZoomOut size={18} />
              </button>
              <button className="graph-control-btn" title="Reset View">
                <RotateCcw size={18} />
              </button>
              <button className="graph-control-btn" title="Fullscreen">
                <Maximize size={18} />
              </button>
            </div>
          </div>

          <div className="graph-sidebar">
            <div className="graph-info-header">
              <h2>Graph Information</h2>
            </div>

            <div className="info-panel">
              <h3>Statistics</h3>
              <div className="info-panel-content">
                <div className="info-stat">
                  <span className="info-stat-label">Total Nodes:</span>
                  <span className="info-stat-value">
                    {statistics.totalNodes}
                  </span>
                </div>
                <div className="info-stat">
                  <span className="info-stat-label">Terms:</span>
                  <span className="info-stat-value">{statistics.terms}</span>
                </div>
                <div className="info-stat">
                  <span className="info-stat-label">Definitions:</span>
                  <span className="info-stat-value">
                    {statistics.definitions}
                  </span>
                </div>
                <div className="info-stat">
                  <span className="info-stat-label">Categories:</span>
                  <span className="info-stat-value">
                    {statistics.categories}
                  </span>
                </div>
                <div className="info-stat">
                  <span className="info-stat-label">Relationships:</span>
                  <span className="info-stat-value">
                    {statistics.relationships}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-panel">
              <h3>Relationship Types</h3>
              <div className="relationship-types">
                {relationshipTypes.map((type, index) => (
                  <span key={index} className="relationship-type">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="selected-node-panel">
              <h3>Selected Node</h3>
              {selectedNode ? (
                <div className="node-details">
                  <div className="node-detail-item">
                    <div className="node-detail-label">Name</div>
                    <div className="node-detail-value">{selectedNode.name}</div>
                  </div>

                  {selectedNode.type && (
                    <div className="node-detail-item">
                      <div className="node-detail-label">Type</div>
                      <div className="node-detail-value">
                        {selectedNode.type}
                      </div>
                    </div>
                  )}

                  {selectedNode.category && (
                    <div className="node-detail-item">
                      <div className="node-detail-label">Category</div>
                      <div className="node-detail-value">
                        {selectedNode.category}
                      </div>
                    </div>
                  )}

                  {selectedNode.description && (
                    <div className="node-detail-item">
                      <div className="node-detail-label">Description</div>
                      <div className="node-detail-value">
                        {selectedNode.description}
                      </div>
                    </div>
                  )}

                  {graphData && (
                    <div className="node-connections">
                      <div className="node-detail-label">
                        Connections (
                        {
                          graphData.links.filter(
                            (link) =>
                              link.source === selectedNode.id ||
                              link.target === selectedNode.id
                          ).length
                        }
                        )
                      </div>
                      {graphData.links
                        .filter(
                          (link) =>
                            link.source === selectedNode.id ||
                            link.target === selectedNode.id
                        )
                        .slice(0, 5) // Show only first 5 connections
                        .map((link, index) => {
                          const connectedNodeId =
                            link.source === selectedNode.id
                              ? link.target
                              : link.source;
                          const connectedNode = graphData.nodes.find(
                            (n) => n.id === connectedNodeId
                          );

                          return (
                            <div key={index} className="connection-item">
                              <div>{connectedNode?.name || "Unknown"}</div>
                              <div
                                style={{ fontSize: "0.8rem", color: "#999" }}
                              >
                                {link.type || "connected to"}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-node-selected">
                  No node selected. Click on a node to see details.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default KnowledgeGraphPage;
