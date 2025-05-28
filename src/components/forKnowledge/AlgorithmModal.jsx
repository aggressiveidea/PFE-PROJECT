<<<<<<< Updated upstream
import { useState, useRef, useEffect } from "react"
import "./AlgorithmModal.css"
=======
"use client";
import "./AlgorithmModal.css";
import { useState } from "react";
import {
  runPageRank,
  runLouvain,
  runBetweennessCentrality,
  runLabelPropagation,
  createCompleteProjection,
  createCategoryProjection,
  addSearchHistory,
} from "../../services/Api";
>>>>>>> Stashed changes

const AlgorithmModal = ({ isOpen, onClose, algorithm }) => {
  const [selectedScope, setSelectedScope] = useState("");
  const [selectedClusterType, setSelectedClusterType] = useState("");
  const [selectedDefinitionLevel, setSelectedDefinitionLevel] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [appliedAlgorithmResult, setAppliedAlgorithmResult] = useState(null);

<<<<<<< Updated upstream
  const graphData = {
    nodes: [
      { id: "A", label: "A" },
      { id: "B", label: "B" },
      { id: "C", label: "C" },
      { id: "D", label: "D" },
      { id: "E", label: "E" },
      { id: "F", label: "F" },
    ],
    edges: [
      { from: "A", to: "B", weight: 4 },
      { from: "A", to: "C", weight: 2 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 5 },
      { from: "C", to: "D", weight: 8 },
      { from: "C", to: "E", weight: 10 },
      { from: "D", to: "E", weight: 2 },
      { from: "D", to: "F", weight: 6 },
      { from: "E", to: "F", weight: 3 },
    ],
  }

  const translations = {
    english: {
      close: "Close",
      execute: "Execute Algorithm",
      executing: "Executing...",
      timeComplexity: "Time Complexity",
      spaceComplexity: "Space Complexity",
      formula: "Mathematical Formula",
      parameters: "Parameters",
      startNode: "Start Node",
      endNode: "End Node",
      dampingFactor: "Damping Factor",
      iterations: "Iterations",
      results: "Execution Results",
      step: "Step",
      of: "of",
      prevStep: "Previous Step",
      nextStep: "Next Step",
      pseudocode: "Pseudocode",
      sampleGraph: "Sample Graph",
    },
    french: {
      close: "Fermer",
      execute: "Exécuter l'Algorithme",
      executing: "Exécution en cours...",
      timeComplexity: "Complexité Temporelle",
      spaceComplexity: "Complexité Spatiale",
      formula: "Formule Mathématique",
      parameters: "Paramètres",
      startNode: "Nœud de Départ",
      endNode: "Nœud d'Arrivée",
      dampingFactor: "Facteur d'Amortissement",
      iterations: "Itérations",
      results: "Résultats d'Exécution",
      step: "Étape",
      of: "sur",
      prevStep: "Étape Précédente",
      nextStep: "Étape Suivante",
      pseudocode: "Pseudocode",
      sampleGraph: "Graphe d'Exemple",
    },
    arabic: {
      close: "إغلاق",
      execute: "تنفيذ الخوارزمية",
      executing: "جاري التنفيذ...",
      timeComplexity: "تعقيد الوقت",
      spaceComplexity: "تعقيد المساحة",
      formula: "الصيغة الرياضية",
      parameters: "المعلمات",
      startNode: "نقطة البداية",
      endNode: "نقطة النهاية",
      dampingFactor: "عامل التخميد",
      iterations: "التكرارات",
      results: "نتائج التنفيذ",
      step: "خطوة",
      of: "من",
      prevStep: "الخطوة السابقة",
      nextStep: "الخطوة التالية",
      pseudocode: "الشفرة الزائفة",
      sampleGraph: "رسم بياني للعينة",
    },
  }
=======
  const handleScopeChange = (scope) => {
    setSelectedScope(scope);
    setSelectedClusterType("");
    setSelectedDefinitionLevel("");
    setSelectedCategory("");
  };

  const handleClusterTypeChange = (type) => {
    setSelectedClusterType(type);
    setSelectedDefinitionLevel("");
    setSelectedCategory("");
  };
>>>>>>> Stashed changes

  const handleDefinitionLevelChange = (level) => {
    setSelectedDefinitionLevel(level);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleApplyAlgorithm = async () => {
    if (!selectedScope) {
      console.error("No scope selected");
      return;
    }

<<<<<<< Updated upstream
  const drawGraph = (ctx, width, height) => {
    const nodeRadius = 20
    const nodePositions = calculateNodePositions(width, height)
    graphData.edges.forEach((edge) => {
      const startPos = nodePositions[edge.from]
      const endPos = nodePositions[edge.to]

      if (startPos && endPos) {
        const isHighlighted = executionSteps[currentStep]?.highlightedEdges?.includes(`${edge.from}-${edge.to}`)

        ctx.beginPath()
        ctx.moveTo(startPos.x, startPos.y)
        ctx.lineTo(endPos.x, endPos.y)
        ctx.strokeStyle = isHighlighted ? "#ff5722" : "#aaa"
        ctx.lineWidth = isHighlighted ? 3 : 1
        ctx.stroke()

        // Draw weight
        const midX = (startPos.x + endPos.x) / 2
        const midY = (startPos.y + endPos.y) / 2
        ctx.fillStyle = "#555"
        ctx.font = "12px Arial"
        ctx.fillText(edge.weight, midX, midY)
      }
    })

    // Draw nodes
    graphData.nodes.forEach((node) => {
      const pos = nodePositions[node.id]

      if (pos) {

        const isHighlighted = executionSteps[currentStep]?.highlightedNodes?.includes(node.id)
        const isVisited = executionSteps[currentStep]?.visitedNodes?.includes(node.id)

        ctx.beginPath()
        ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)

        if (isHighlighted) {
          ctx.fillStyle = "#ff5722"
        } else if (isVisited) {
          ctx.fillStyle = "#8bc34a"
        } else {
          ctx.fillStyle = "#9b87f5"
=======
    setShowResults(false);
    setAppliedAlgorithmResult(null);

    try {
      // Show loading state
      setAppliedAlgorithmResult({
        loading: true,
        algorithm: algorithm.name.english,
        scope: selectedScope,
      });
      setShowResults(true);

      let projectionName = null;
      const algorithmParams = {};

      // Create or get appropriate projection based on scope
      if (selectedScope === "allGraph") {
        const projection = await createCompleteProjection("english");
        projectionName = projection.graphName;
      } else if (selectedScope === "clustering") {
        if (selectedClusterType === "categories" && selectedCategory) {
          const projection = await createCategoryProjection(
            selectedCategory,
            "english"
          );
          projectionName = projection.graphName;
          algorithmParams.category = selectedCategory;
        } else if (
          selectedClusterType === "definitions" &&
          selectedDefinitionLevel
        ) {
          // For definitions, we'll use complete projection but filter by definition level
          const projection = await createCompleteProjection("english");
          projectionName = projection.graphName;
          algorithmParams.definitionLevel = selectedDefinitionLevel;
        } else if (selectedClusterType === "terms") {
          const projection = await createCompleteProjection("english");
          projectionName = projection.graphName;
          algorithmParams.nodeType = "terms";
>>>>>>> Stashed changes
        }
      } else if (selectedScope === "recentResearch") {
        // For recent research, use complete projection
        const projection = await createCompleteProjection("english");
        projectionName = projection.graphName;
        algorithmParams.recent = true;
      }

      if (!projectionName) {
        throw new Error("Failed to create or get graph projection");
      }

<<<<<<< Updated upstream

        ctx.fillStyle = "white"
        ctx.font = "bold 14px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.label, pos.x, pos.y)

        if (executionSteps[currentStep]?.distances?.[node.id] !== undefined) {
          const distance = executionSteps[currentStep].distances[node.id]
          ctx.fillStyle = "#333"
          ctx.font = "12px Arial"
          ctx.fillText(distance === Number.POSITIVE_INFINITY ? "∞" : distance, pos.x, pos.y + nodeRadius + 15)
=======
      // Run the appropriate algorithm
      let results;
      switch (algorithm.id) {
        case "pagerank":
          results = await runPageRank(projectionName, algorithmParams);
          break;
        case "louvain":
          results = await runLouvain(projectionName, algorithmParams);
          break;
        case "betweenness":
          results = await runBetweennessCentrality(
            projectionName,
            algorithmParams
          );
          break;
        case "labelpropagation":
          results = await runLabelPropagation(projectionName, algorithmParams);
          break;
        default:
          throw new Error(`Algorithm ${algorithm.id} not implemented`);
      }

      // Format results for display
      const formattedResults = {
        algorithm: algorithm.name.english,
        scope: selectedScope,
        projectionName: projectionName,
        nodesProcessed:
          results.nodePropertiesWritten || results.nodesProcessed || 0,
        edgesProcessed:
          results.relationshipsProcessed || results.edgesProcessed || 0,
        executionTime: results.computeMillis
          ? `${(results.computeMillis / 1000).toFixed(2)}s`
          : "N/A",
        results: results.results || [],
        algorithmSpecific: results.algorithmSpecific || {},
        loading: false,
      };

      setAppliedAlgorithmResult(formattedResults);

      // Add to search history
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData?.id || userData?._id;

        if (userId) {
          await addSearchHistory({
            userId: userId,
            type: "algorithm",
            query: `${algorithm.name.english} - ${selectedScope}`,
            termId: null,
            category: algorithm.category,
          });
>>>>>>> Stashed changes
        }
      } catch (historyError) {
        console.warn("Failed to add to search history:", historyError);
      }
    } catch (error) {
      console.error("Error applying algorithm:", error);

      // Show error state
      setAppliedAlgorithmResult({
        algorithm: algorithm.name.english,
        scope: selectedScope,
        error: error.message || "Failed to apply algorithm",
        loading: false,
      });
    }
  };

  if (!isOpen || !algorithm) {
    return null;
  }

<<<<<<< Updated upstream
  const calculateNodePositions = (width, height) => {
    const positions = {}
    const nodeCount = graphData.nodes.length
    const radius = Math.min(width, height) * 0.35
    const centerX = width / 2
    const centerY = height / 2

    graphData.nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * 2 * Math.PI
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    return positions
  }

  const executeAlgorithm = () => {
    setIsExecuting(true)
    setExecutionSteps([])
    setCurrentStep(0)

    let steps = []

    switch (algorithm.id) {
      case "shortest-path":
        steps = executeDijkstra(userParams.startNode, userParams.endNode)
        break
      case "bfs":
        steps = executeBFS(userParams.startNode)
        break
      case "dfs":
        steps = executeDFS(userParams.startNode)
        break
      case "pagerank":
        steps = executePageRank(userParams.dampingFactor, userParams.iterations)
        break
      case "centrality":
        steps = executeBetweennessCentrality()
        break
      case "community-detection":
        steps = executeLouvain()
        break
      case "mst":
        steps = executeKruskal()
        break
      default:
        steps = []
=======
  const renderGraph = (graphData) => {
    if (!graphData || !graphData.nodes || !graphData.edges) {
      return <p>No graph data available.</p>;
>>>>>>> Stashed changes
    }

    const { nodes, edges } = graphData;

    const maxX = Math.max(...nodes.map((node) => node.x));
    const maxY = Math.max(...nodes.map((node) => node.y));

<<<<<<< Updated upstream
    // Initialize distances
    nodes.forEach((node) => {
      distances[node] = node === startNode ? 0 : Number.POSITIVE_INFINITY
      previous[node] = null
    })

    const stepDescriptions = {
      english: `Initialize distances: set distance to start node ${startNode} as 0, all others as ∞`,
      french: `Initialiser les distances: définir la distance au nœud de départ ${startNode} comme 0, toutes les autres comme ∞`,
      arabic: `تهيئة المسافات: تعيين المسافة إلى نقطة البداية ${startNode} كـ 0، وجميع المسافات الأخرى كـ ∞`,
    }

    steps.push({
      description: stepDescriptions[language] || stepDescriptions.english,
      distances: { ...distances },
      visitedNodes: [...visited],
      highlightedNodes: [startNode],
      highlightedEdges: [],
    })

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let minDistance = Number.POSITIVE_INFINITY
      let minNode = null

      unvisited.forEach((node) => {
        if (distances[node] < minDistance) {
          minDistance = distances[node]
          minNode = node
        }
      })

      if (minNode === null || minNode === endNode || minDistance === Number.POSITIVE_INFINITY) {
        break
      }

      unvisited.delete(minNode)
      visited.add(minNode)

      const edges = graphData.edges.filter((e) => e.from === minNode)
      const highlightedEdges = []

      edges.forEach((edge) => {
        const neighbor = edge.to

        if (unvisited.has(neighbor)) {
          const alt = distances[minNode] + edge.weight

          if (alt < distances[neighbor]) {
            distances[neighbor] = alt
            previous[neighbor] = minNode
            highlightedEdges.push(`${minNode}-${neighbor}`)
          }
        }
      })

      const visitingDescriptions = {
        english: `Visiting node ${minNode}. Updating distances to neighbors.`,
        french: `Visite du nœud ${minNode}. Mise à jour des distances vers les voisins.`,
        arabic: `زيارة العقدة ${minNode}. تحديث المسافات إلى الجيران.`,
      }

      steps.push({
        description: visitingDescriptions[language] || visitingDescriptions.english,
        distances: { ...distances },
        visitedNodes: [...visited],
        highlightedNodes: [minNode],
        highlightedEdges,
      })
    }

    if (distances[endNode] !== Number.POSITIVE_INFINITY) {
      const path = []
      let current = endNode

      while (current !== null) {
        path.unshift(current)
        current = previous[current]
      }

      const pathEdges = []
      for (let i = 0; i < path.length - 1; i++) {
        pathEdges.push(`${path[i]}-${path[i + 1]}`)
      }

      const foundPathDescriptions = {
        english: `Found shortest path from ${startNode} to ${endNode}: ${path.join(" → ")} with distance ${
          distances[endNode]
        }`,
        french: `Chemin le plus court trouvé de ${startNode} à ${endNode}: ${path.join(" → ")} avec une distance de ${
          distances[endNode]
        }`,
        arabic: `تم العثور على أقصر مسار من ${startNode} إلى ${endNode}: ${path.join(" → ")} بمسافة ${
          distances[endNode]
        }`,
      }

      steps.push({
        description: foundPathDescriptions[language] || foundPathDescriptions.english,
        distances: { ...distances },
        visitedNodes: [...visited],
        highlightedNodes: path,
        highlightedEdges: pathEdges,
      })
    } else {
      const noPathDescriptions = {
        english: `No path found from ${startNode} to ${endNode}`,
        french: `Aucun chemin trouvé de ${startNode} à ${endNode}`,
        arabic: `لم يتم العثور على مسار من ${startNode} إلى ${endNode}`,
      }

      steps.push({
        description: noPathDescriptions[language] || noPathDescriptions.english,
        distances: { ...distances },
        visitedNodes: [...visited],
        highlightedNodes: [],
        highlightedEdges: [],
      })
    }

    return steps
  }

  const executeBFS = (startNode) => {
    const steps = []
    const nodes = graphData.nodes.map((n) => n.id)
    const visited = new Set()
    const queue = [startNode]
    visited.add(startNode)

    const initDescriptions = {
      english: `Initialize BFS: Start at node ${startNode}, mark as visited, and add to queue`,
      french: `Initialiser BFS: Commencer au nœud ${startNode}, marquer comme visité et ajouter à la file`,
      arabic: `تهيئة البحث أولاً بالعرض: ابدأ من العقدة ${startNode}، وضع علامة عليها كمزارة، وأضفها إلى الطابور`,
    }

    steps.push({
      description: initDescriptions[language] || initDescriptions.english,
      visitedNodes: [...visited],
      highlightedNodes: [startNode],
      highlightedEdges: [],
      queue: [...queue],
    })

    while (queue.length > 0) {
      const current = queue.shift()
      const neighbors = graphData.edges.filter((e) => e.from === current).map((e) => e.to)

      const highlightedEdges = []

      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
          highlightedEdges.push(`${current}-${neighbor}`)
        }
      })

      const visitingDescriptions = {
        english: `Dequeue node ${current}. Visit unvisited neighbors and add them to queue.`,
        french: `Retirer le nœud ${current} de la file. Visiter les voisins non visités et les ajouter à la file.`,
        arabic: `إزالة العقدة ${current} من الطابور. زيارة الجيران غير المزارين وإضافتهم إلى الطابور.`,
      }

      steps.push({
        description: visitingDescriptions[language] || visitingDescriptions.english,
        visitedNodes: [...visited],
        highlightedNodes: [current, ...neighbors.filter((n) => !visited.has(n))],
        highlightedEdges,
        queue: [...queue],
      })
    }

    const completeDescriptions = {
      english: `BFS complete. All reachable nodes from ${startNode} have been visited.`,
      french: `BFS terminé. Tous les nœuds accessibles depuis ${startNode} ont été visités.`,
      arabic: `اكتمل البحث أولاً بالعرض. تمت زيارة جميع العقد التي يمكن الوصول إليها من ${startNode}.`,
    }

    steps.push({
      description: completeDescriptions[language] || completeDescriptions.english,
      visitedNodes: [...visited],
      highlightedNodes: [],
      highlightedEdges: [],
      queue: [],
    })

    return steps
  }

  const executeDFS = (startNode) => {
    const steps = []
    const nodes = graphData.nodes.map((n) => n.id)
    const visited = new Set()
    const stack = [startNode]

    const initDescriptions = {
      english: `Initialize DFS: Start at node ${startNode} and add to stack`,
      french: `Initialiser DFS: Commencer au nœud ${startNode} et ajouter à la pile`,
      arabic: `تهيئة البحث أولاً بالعمق: ابدأ من العقدة ${startNode} وأضفها إلى المكدس`,
    }

    steps.push({
      description: initDescriptions[language] || initDescriptions.english,
      visitedNodes: [],
      highlightedNodes: [startNode],
      highlightedEdges: [],
      stack: [...stack],
    })

    while (stack.length > 0) {
      const current = stack.pop()

      if (!visited.has(current)) {
        visited.add(current)

        // Get all neighbors
        const neighbors = graphData.edges
          .filter((e) => e.from === current)
          .map((e) => e.to)
          .reverse() // Reverse to maintain correct DFS order when pushing to stack

        const highlightedEdges = []

        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            stack.push(neighbor)
            highlightedEdges.push(`${current}-${neighbor}`)
          }
        })

        const visitingDescriptions = {
          english: `Pop node ${current} from stack and mark as visited. Push unvisited neighbors to stack.`,
          french: `Retirer le nœud ${current} de la pile et marquer comme visité. Pousser les voisins non visités sur la pile.`,
          arabic: `إزالة العقدة ${current} من المكدس ووضع علامة عليها كمزارة. دفع الجيران غير المزارين إلى المكدس.`,
        }

        steps.push({
          description: visitingDescriptions[language] || visitingDescriptions.english,
          visitedNodes: [...visited],
          highlightedNodes: [current],
          highlightedEdges,
          stack: [...stack],
        })
      }
    }

    const completeDescriptions = {
      english: `DFS complete. All reachable nodes from ${startNode} have been visited.`,
      french: `DFS terminé. Tous les nœuds accessibles depuis ${startNode} ont été visités.`,
      arabic: `اكتمل البحث أولاً بالعمق. تمت زيارة جميع العقد التي يمكن الوصول إليها من ${startNode}.`,
    }

    steps.push({
      description: completeDescriptions[language] || completeDescriptions.english,
      visitedNodes: [...visited],
      highlightedNodes: [],
      highlightedEdges: [],
      stack: [],
    })

    return steps
  }

  const executePageRank = (dampingFactor, iterations) => {
    const steps = []
    const nodes = graphData.nodes.map((n) => n.id)
    const n = nodes.length
    let pageRank = {}

    // Initialize PageRank values
    nodes.forEach((node) => {
      pageRank[node] = 1 / n
    })

    const initDescriptions = {
      english: `Initialize PageRank: each node starts with value 1/${n} = ${(1 / n).toFixed(3)}`,
      french: `Initialiser PageRank: chaque nœud commence avec la valeur 1/${n} = ${(1 / n).toFixed(3)}`,
      arabic: `تهيئة تصنيف الصفحات: تبدأ كل عقدة بقيمة 1/${n} = ${(1 / n).toFixed(3)}`,
    }

    steps.push({
      description: initDescriptions[language] || initDescriptions.english,
      pageRank: { ...pageRank },
      visitedNodes: [],
      highlightedNodes: nodes,
      highlightedEdges: [],
    })

    // Perform iterations
    for (let i = 0; i < iterations; i++) {
      const newPageRank = {}
      const highlightedNodes = []

      nodes.forEach((node) => {
        // Find all nodes that link to this node
        const incomingLinks = graphData.edges.filter((e) => e.to === node).map((e) => e.from)
        let sum = 0

        incomingLinks.forEach((source) => {
          // Count outgoing links from the source
          const outgoingCount = graphData.edges.filter((e) => e.from === source).length
          sum += pageRank[source] / outgoingCount
        })

        newPageRank[node] = 1 - dampingFactor + dampingFactor * sum

        // Highlight nodes with significant changes
        if (Math.abs(newPageRank[node] - pageRank[node]) > 0.01) {
          highlightedNodes.push(node)
        }
      })

      pageRank = { ...newPageRank }

      const iterationDescriptions = {
        english: `Iteration ${i + 1}: Updated PageRank values`,
        french: `Itération ${i + 1}: Valeurs PageRank mises à jour`,
        arabic: `التكرار ${i + 1}: تم تحديث قيم تصنيف الصفحات`,
      }

      steps.push({
        description: iterationDescriptions[language] || iterationDescriptions.english,
        pageRank: { ...pageRank },
        visitedNodes: [],
        highlightedNodes,
        highlightedEdges: [],
      })
    }

    // Final step - highlight nodes with highest PageRank
    const sortedNodes = nodes.sort((a, b) => pageRank[b] - pageRank[a])
    const topNodes = sortedNodes.slice(0, 2)

    const finalDescriptions = {
      english: `Final PageRank values after ${iterations} iterations. Nodes ${topNodes.join(", ")} have the highest PageRank.`,
      french: `Valeurs finales de PageRank après ${iterations} itérations. Les nœuds ${topNodes.join(", ")} ont le PageRank le plus élevé.`,
      arabic: `القيم النهائية لتصنيف الصفحات بعد ${iterations} تكرارًا. العقد ${topNodes.join(", ")} لديها أعلى تصنيف للصفحات.`,
    }

    steps.push({
      description: finalDescriptions[language] || finalDescriptions.english,
      pageRank: { ...pageRank },
      visitedNodes: [],
      highlightedNodes: topNodes,
      highlightedEdges: [],
    })

    return steps
  }

  const executeBetweennessCentrality = () => {
    // Simplified implementation for visualization purposes
    const steps = []
    const nodes = graphData.nodes.map((n) => n.id)
    const betweenness = {}

    // Initialize betweenness values
    nodes.forEach((node) => {
      betweenness[node] = 0
    })

    const initDescriptions = {
      english: "Initialize betweenness centrality values to 0 for all nodes",
      french: "Initialiser les valeurs de centralité d'intermédiarité à 0 pour tous les nœuds",
      arabic: "تهيئة قيم المركزية البينية إلى 0 لجميع العقد",
    }

    steps.push({
      description: initDescriptions[language] || initDescriptions.english,
      betweenness: { ...betweenness },
      visitedNodes: [],
      highlightedNodes: nodes,
      highlightedEdges: [],
    })

    // For each pair of nodes, find shortest paths
    for (let s = 0; s < nodes.length; s++) {
      const source = nodes[s]

      // Run a simplified BFS from this source
      const distances = {}
      const paths = {}
      const queue = [source]
      const visited = new Set([source])

      nodes.forEach((node) => {
        distances[node] = node === source ? 0 : Number.POSITIVE_INFINITY
        paths[node] = []
      })

      paths[source] = [[source]]

      while (queue.length > 0) {
        const current = queue.shift()

        // Get neighbors
        const neighbors = graphData.edges.filter((e) => e.from === current).map((e) => e.to)

        neighbors.forEach((neighbor) => {
          if (!visited.has(neighbor)) {
            visited.add(neighbor)
            queue.push(neighbor)
          }

          // If this is a shortest path to neighbor
          if (distances[neighbor] > distances[current] + 1) {
            distances[neighbor] = distances[current] + 1
            paths[neighbor] = paths[current].map((p) => [...p, neighbor])
          } else if (distances[neighbor] === distances[current] + 1) {
            paths[neighbor] = [...paths[neighbor], ...paths[current].map((p) => [...p, neighbor])]
          }
        })
      }

      // For each destination, count paths through each node
      for (let t = 0; t < nodes.length; t++) {
        if (s !== t) {
          const target = nodes[t]

          if (paths[target].length > 0) {
            // Count how many paths go through each node
            const allPaths = paths[target]

            nodes.forEach((node) => {
              if (node !== source && node !== target) {
                const pathsThroughNode = allPaths.filter((path) => path.includes(node)).length
                betweenness[node] += pathsThroughNode / allPaths.length
              }
            })
          }
        }
      }

      const processedDescriptions = {
        english: `Processed source node ${source}. Updated betweenness values.`,
        french: `Nœud source ${source} traité. Valeurs d'intermédiarité mises à jour.`,
        arabic: `تمت معالجة العقدة المصدر ${source}. تم تحديث قيم المركزية البينية.`,
      }

      steps.push({
        description: processedDescriptions[language] || processedDescriptions.english,
        betweenness: { ...betweenness },
        visitedNodes: [...visited],
        highlightedNodes: [source],
        highlightedEdges: [],
      })
    }

    // Final step - highlight nodes with highest betweenness
    const sortedNodes = nodes.sort((a, b) => betweenness[b] - betweenness[a])
    const topNodes = sortedNodes.slice(0, 2)

    const finalDescriptions = {
      english: `Final betweenness centrality values. Nodes ${topNodes.join(", ")} have the highest betweenness.`,
      french: `Valeurs finales de centralité d'intermédiarité. Les nœuds ${topNodes.join(", ")} ont l'intermédiarité la plus élevée.`,
      arabic: `القيم النهائية للمركزية البينية. العقد ${topNodes.join(", ")} لديها أعلى مركزية بينية.`,
    }

    steps.push({
      description: finalDescriptions[language] || finalDescriptions.english,
      betweenness: { ...betweenness },
      visitedNodes: [],
      highlightedNodes: topNodes,
      highlightedEdges: [],
    })

    return steps
  }

  const executeLouvain = () => {
    // Simplified implementation for visualization
    const steps = []
    const nodes = graphData.nodes.map((n) => n.id)

    // Initialize: each node in its own community
    const communities = {}
    nodes.forEach((node) => {
      communities[node] = node
    })

    const initDescriptions = {
      english: "Initialize: each node starts in its own community",
      french: "Initialisation: chaque nœud commence dans sa propre communauté",
      arabic: "تهيئة: تبدأ كل عقدة في مجتمعها الخاص",
    }

    steps.push({
      description: initDescriptions[language] || initDescriptions.english,
      communities: { ...communities },
      visitedNodes: [],
      highlightedNodes: nodes,
      highlightedEdges: [],
    })

    // Phase 1: Optimize modularity locally
    for (let iteration = 0; iteration < 2; iteration++) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const neighbors = new Set()

        // Find all neighboring communities
        graphData.edges.forEach((edge) => {
          if (edge.from === node) {
            neighbors.add(communities[edge.to])
          } else if (edge.to === node) {
            neighbors.add(communities[edge.from])
          }
        })

        // Simulate finding best community (simplified)
        const neighborArray = Array.from(neighbors)
        if (neighborArray.length > 0) {
          // For visualization, just move to a random neighbor community
          const randomNeighbor = neighborArray[Math.floor(Math.random() * neighborArray.length)]
          communities[node] = randomNeighbor

          const movedDescriptions = {
            english: `Node ${node} moved to community ${randomNeighbor}`,
            french: `Le nœud ${node} a été déplacé vers la communauté ${randomNeighbor}`,
            arabic: `انتقلت العقدة ${node} إلى المجتمع ${randomNeighbor}`,
          }

          steps.push({
            description: movedDescriptions[language] || movedDescriptions.english,
            communities: { ...communities },
            visitedNodes: [],
            highlightedNodes: [node],
            highlightedEdges: [],
          })
        }
      }
    }

    // Find all unique communities
    const uniqueCommunities = new Set(Object.values(communities))
    const communityColors = {}
    let colorIndex = 0

    uniqueCommunities.forEach((community) => {
      communityColors[community] = colorIndex++
    })

    // Final step - highlight nodes by community
    const finalDescriptions = {
      english: `Final communities detected: ${uniqueCommunities.size} communities`,
      french: `Communautés finales détectées: ${uniqueCommunities.size} communautés`,
      arabic: `المجتمعات النهائية المكتشفة: ${uniqueCommunities.size} مجتمعات`,
    }

    steps.push({
      description: finalDescriptions[language] || finalDescriptions.english,
      communities: { ...communities },
      communityColors,
      visitedNodes: [],
      highlightedNodes: nodes,
      highlightedEdges: [],
    })

    return steps
  }

  const executeKruskal = () => {
    const steps = []
    const nodes = graphData.nodes.map((n) => n.id)
    const edges = [...graphData.edges].sort((a, b) => a.weight - b.weight)

    // Initialize disjoint set for each node
    const parent = {}
    nodes.forEach((node) => {
      parent[node] = node
    })

    // Find function for disjoint set
    const find = (node) => {
      if (parent[node] !== node) {
        parent[node] = find(parent[node])
      }
      return parent[node]
    }

    // Union function for disjoint set
    const union = (a, b) => {
      parent[find(a)] = find(b)
    }

    const mstEdges = []
    const totalWeight = { value: 0 }

    const initDescriptions = {
      english: "Initialize MST: Sort all edges by weight in ascending order",
      french: "Initialiser ACM: Trier toutes les arêtes par poids en ordre croissant",
      arabic: "تهيئة شجرة امتداد الحد الأدنى: ترتيب جميع الحواف حسب الوزن بترتيب تصاعدي",
    }

    steps.push({
      description: initDescriptions[language] || initDescriptions.english,
      mstEdges: [],
      visitedNodes: [],
      highlightedNodes: [],
      highlightedEdges: [],
      totalWeight: 0,
    })

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i]
      const fromRoot = find(edge.from)
      const toRoot = find(edge.to)

      const checkingDescriptions = {
        english: `Checking edge ${edge.from}-${edge.to} with weight ${edge.weight}`,
        french: `Vérification de l'arête ${edge.from}-${edge.to} avec poids ${edge.weight}`,
        arabic: `فحص الحافة ${edge.from}-${edge.to} بوزن ${edge.weight}`,
      }

      steps.push({
        description: checkingDescriptions[language] || checkingDescriptions.english,
        mstEdges: [...mstEdges],
        visitedNodes: [],
        highlightedNodes: [edge.from, edge.to],
        highlightedEdges: [`${edge.from}-${edge.to}`],
        totalWeight: totalWeight.value,
      })

      if (fromRoot !== toRoot) {
        mstEdges.push(edge)
        totalWeight.value += edge.weight
        union(edge.from, edge.to)

        const addedDescriptions = {
          english: `Added edge ${edge.from}-${edge.to} to MST. Current total weight: ${totalWeight.value}`,
          french: `Ajout de l'arête ${edge.from}-${edge.to} à l'ACM. Poids total actuel: ${totalWeight.value}`,
          arabic: `تمت إضافة الحافة ${edge.from}-${edge.to} إلى شجرة امتداد الحد الأدنى. الوزن الإجمالي الحالي: ${totalWeight.value}`,
        }

        steps.push({
          description: addedDescriptions[language] || addedDescriptions.english,
          mstEdges: [...mstEdges],
          visitedNodes: [],
          highlightedNodes: [edge.from, edge.to],
          highlightedEdges: mstEdges.map((e) => `${e.from}-${e.to}`),
          totalWeight: totalWeight.value,
        })
      } else {
        const skipDescriptions = {
          english: `Skipped edge ${edge.from}-${edge.to} as it would create a cycle`,
          french: `Arête ${edge.from}-${edge.to} ignorée car elle créerait un cycle`,
          arabic: `تم تخطي الحافة ${edge.from}-${edge.to} لأنها ستخلق دورة`,
        }

        steps.push({
          description: skipDescriptions[language] || skipDescriptions.english,
          mstEdges: [...mstEdges],
          visitedNodes: [],
          highlightedNodes: [],
          highlightedEdges: mstEdges.map((e) => `${e.from}-${e.to}`),
          totalWeight: totalWeight.value,
        })
      }
    }

    const finalDescriptions = {
      english: `MST complete with total weight ${totalWeight.value}`,
      french: `ACM terminé avec un poids total de ${totalWeight.value}`,
      arabic: `اكتملت شجرة امتداد الحد الأدنى بوزن إجمالي ${totalWeight.value}`,
    }

    steps.push({
      description: finalDescriptions[language] || finalDescriptions.english,
      mstEdges,
      visitedNodes: [],
      highlightedNodes: [],
      highlightedEdges: mstEdges.map((e) => `${e.from}-${e.to}`),
      totalWeight: totalWeight.value,
    })

    return steps
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNextStep = () => {
    if (currentStep < executionSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const renderParameters = () => {
    if (!algorithm.parameters || algorithm.parameters.length === 0) {
      return null
    }
=======
    const viewBoxWidth = maxX + 20; // Add some padding
    const viewBoxHeight = maxY + 20; // Add some padding
>>>>>>> Stashed changes

    return (
      <svg
        width="100%"
        height="200"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      >
        {edges.map((edge, index) => (
          <line
            key={`edge-${index}`}
            x1={nodes.find((node) => node.id === edge.source)?.x}
            y1={nodes.find((node) => node.id === edge.source)?.y}
            x2={nodes.find((node) => node.id === edge.target)?.x}
            y2={nodes.find((node) => node.id === edge.target)?.y}
            stroke={edge.color || "#ccc"}
            strokeWidth={edge.width || 2}
          />
        ))}
        {nodes.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.size || 8}
            fill={node.color || "#8B5CF6"}
          />
        ))}
      </svg>
    );
  };

  return (
    <div className="algorithm-modal-overlay">
      <div className="algorithm-modal">
        <div className="algorithm-modal-header">
          <h2>{algorithm.name.english}</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="algorithm-modal-content">
          <div className="algorithm-modal-section">
            <h4>Overview</h4>
            <p>{algorithm.overview}</p>
          </div>
          <div className="algorithm-modal-section">
            <h4>How It Works</h4>
            <p>{algorithm.howItWorks.english}</p>
          </div>
          <div className="algorithm-modal-section">
            <h4>Examples</h4>
            <div className="algorithm-examples">
              <div className="example-container">
                <div className="example-item">
                  <h5>Before Algorithm</h5>
                  <div className="example-graph before">
                    {algorithm.before && renderGraph(algorithm.before)}
                  </div>
                </div>
                <div className="example-item">
                  <h5>After Algorithm</h5>
                  <div className="example-graph after">
                    {algorithm.after && renderGraph(algorithm.after)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="algorithm-modal-section">
            <h4>Applications</h4>
            <ul className="applications-list">
              {algorithm.applications.english.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          </div>
          <div className="algorithm-modal-section">
            <h4>Complexity</h4>
            <div className="complexity-details">
              <div className="complexity-item">
                <span className="complexity-label">Time:</span>
                <span className="complexity-value">
                  {algorithm.timeComplexity}
                </span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">Space:</span>
                <span className="complexity-value">
                  {algorithm.spaceComplexity}
                </span>
              </div>
            </div>
          </div>
          <div className="algorithm-modal-section apply-algorithm-section">
            <h4>Apply Algorithm</h4>
            <div className="apply-controls">
              <div className="scope-selection">
                <label htmlFor="scope-select">Apply to:</label>
                <select
                  id="scope-select"
                  value={selectedScope}
                  onChange={(e) => handleScopeChange(e.target.value)}
                  className="scope-select"
                >
                  <option value="">Select scope...</option>
                  <option value="allGraph">All Graph</option>
                  <option value="clustering">Clustering</option>
                  <option value="recentResearch">Recent Research</option>
                </select>
              </div>

              {selectedScope === "clustering" && (
                <div className="cluster-options">
                  <select
                    value={selectedClusterType || ""}
                    onChange={(e) => handleClusterTypeChange(e.target.value)}
                    className="cluster-type-select"
                  >
                    <option value="">Select cluster type...</option>
                    <option value="terms">Terms</option>
                    <option value="definitions">Definitions</option>
                    <option value="categories">Categories</option>
                  </select>

                  {selectedClusterType === "definitions" && (
                    <select
                      value={selectedDefinitionLevel || ""}
                      onChange={(e) =>
                        handleDefinitionLevelChange(e.target.value)
                      }
                      className="definition-level-select"
                    >
                      <option value="">Select definition level...</option>
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                    </select>
                  )}

                  {selectedClusterType === "categories" && (
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="category-select"
                    >
                      <option value="">Select category...</option>
                      <option value="Computer Crime">Computer Crime</option>
                      <option value="Personal Data">Personal Data</option>
                      <option value="Electronic Commerce">
                        Electronic Commerce
                      </option>
                      <option value="Organization">Organization</option>
                      <option value="Networks">Networks</option>
                      <option value="Intellectual Property">
                        Intellectual Property
                      </option>
                      <option value="Miscellaneous">Miscellaneous</option>
                      <option value="Computer Science">Computer Science</option>
                    </select>
                  )}
                </div>
              )}

              <button
                className="apply-algorithm-btn"
                onClick={handleApplyAlgorithm}
                disabled={
                  !selectedScope ||
                  (selectedScope === "clustering" && !selectedClusterType) ||
                  (selectedClusterType === "definitions" &&
                    !selectedDefinitionLevel) ||
                  (selectedClusterType === "categories" && !selectedCategory)
                }
              >
                Apply Algorithm
              </button>
            </div>
          </div>
          {showResults && appliedAlgorithmResult && (
            <div className="algorithm-modal-section results-section">
              <div className="results-header">
                <h4>Algorithm Results: {appliedAlgorithmResult.algorithm}</h4>
                <button
                  className="close-results-btn"
                  onClick={() => setShowResults(false)}
                >
                  ×
                </button>
              </div>
              <div className="results-content">
                {appliedAlgorithmResult.loading ? (
                  <div className="results-loading">
                    <div className="loading-spinner"></div>
                    <p>Running algorithm...</p>
                  </div>
                ) : appliedAlgorithmResult.error ? (
                  <div className="results-error">
                    <p className="error-message">
                      Error: {appliedAlgorithmResult.error}
                    </p>
                    <button
                      className="retry-btn"
                      onClick={handleApplyAlgorithm}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="results-stats">
                      <div className="stat-item">
                        <span className="stat-label">Projection:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.projectionName}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Nodes Processed:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.nodesProcessed}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Edges Processed:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.edgesProcessed}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Execution Time:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.executionTime}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Scope:</span>
                        <span className="stat-value">
                          {appliedAlgorithmResult.scope}
                        </span>
                      </div>
                    </div>
                    {appliedAlgorithmResult.results &&
                      appliedAlgorithmResult.results.length > 0 && (
                        <div className="results-table">
                          <h5>Top Results</h5>
                          <table>
                            <thead>
                              <tr>
                                <th>Rank</th>
                                <th>Node</th>
                                <th>Score</th>
                              </tr>
                            </thead>
                            <tbody>
                              {appliedAlgorithmResult.results
                                .slice(0, 10)
                                .map((result, index) => (
                                  <tr key={result.nodeId || index}>
                                    <td>{index + 1}</td>
                                    <td>
                                      {result.nodeName ||
                                        result.name ||
                                        `Node ${result.nodeId}`}
                                    </td>
                                    <td>
                                      {typeof result.score === "number"
                                        ? result.score.toFixed(4)
                                        : result.score}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    {appliedAlgorithmResult.algorithmSpecific &&
                      Object.keys(appliedAlgorithmResult.algorithmSpecific)
                        .length > 0 && (
                        <div className="algorithm-specific-results">
                          <h5>Algorithm-Specific Results</h5>
                          <div className="specific-stats">
                            {Object.entries(
                              appliedAlgorithmResult.algorithmSpecific
                            ).map(([key, value]) => (
                              <div key={key} className="stat-item">
                                <span className="stat-label">{key}:</span>
                                <span className="stat-value">
                                  {typeof value === "number"
                                    ? value.toFixed(4)
                                    : value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmModal;
