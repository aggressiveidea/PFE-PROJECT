"use client"

import { useState, useEffect, useRef, Suspense, lazy } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  X,
  Download,
  RefreshCw,
  Cloud,
  MonitorSmartphone,
  Server,
  Database,
  Layers,
  Lock,
  Key,
  Package,
  GitMerge,
  Boxes,
  Brain,
  BarChart3,
  Network,
  Cpu,
  Code,
  Workflow,
  Zap,
  Loader2,
} from "lucide-react"
import "./KnowledgeGraph.css"

// Lazy loaded components
const GraphPanel = lazy(() => import("./GraphPanel"))

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <Loader2 className="animate-spin" size={32} />
    <p>Loading knowledge graph...</p>
  </div>
)

const KnowledgeGraph = ({ language = "en" }) => {
  const translations = {
    en: {
      interactive: "Interactive",
      knowledgeGraphTitle: "Explore the Knowledge Graph",
      knowledgeGraphDescription:
        "Discover relationships between ICT terms with our interactive visualization. Click on nodes to see details and connections.",
      selectedTerm: "Selected Term",
      relatedTerms: "Related Terms",
      search: "Search terms...",
      zoomIn: "Zoom in",
      zoomOut: "Zoom out",
      fullscreen: "Fullscreen",
      filter: "Filter",
      reset: "Reset view",
      download: "Download as image",
      allCategories: "All Categories",
      noResults: "No results found",
      saasDefinition:
        "Software as a service is a software licensing and delivery model in which software is licensed on a subscription basis and is centrally hosted.",
    },
    fr: {
      interactive: "Interactif",
      knowledgeGraphTitle: "Explorez le Graphe de Connaissances",
      knowledgeGraphDescription:
        "Découvrez les relations entre les termes TIC avec notre visualisation interactive. Cliquez sur les nœuds pour voir les détails et les connexions.",
      selectedTerm: "Terme Sélectionné",
      relatedTerms: "Termes Associés",
      search: "Rechercher des termes...",
      zoomIn: "Zoom avant",
      zoomOut: "Zoom arrière",
      fullscreen: "Plein écran",
      filter: "Filtrer",
      reset: "Réinitialiser la vue",
      download: "Télécharger comme image",
      allCategories: "Toutes les Catégories",
      noResults: "Aucun résultat trouvé",
      saasDefinition:
        "Le logiciel en tant que service est un modèle de licence et de livraison de logiciels dans lequel le logiciel est concédé sous licence sur la base d'un abonnement et est hébergé de manière centralisée.",
    },
    ar: {
      interactive: "تفاعلي",
      knowledgeGraphTitle: "استكشف رسم المعرفة",
      knowledgeGraphDescription:
        "اكتشف العلاقات بين مصطلحات تكنولوجيا المعلومات والاتصالات من خلال التصور التفاعلي. انقر على العقد لمشاهدة التفاصيل والاتصالات.",
      selectedTerm: "المصطلح المحدد",
      relatedTerms: "المصطلحات ذات الصلة",
      search: "البحث عن المصطلحات...",
      zoomIn: "تكبير",
      zoomOut: "تصغير",
      fullscreen: "ملء الشاشة",
      filter: "تصفية",
      reset: "إعادة ضبط العرض",
      download: "تنزيل كصورة",
      allCategories: "جميع الفئات",
      noResults: "لم يتم العثور على نتائج",
      saasDefinition:
        "البرمجيات كخدمة هي نموذج ترخيص وتسليم البرمجيات حيث يتم ترخيص البرمجيات على أساس الاشتراك ويتم استضافتها مركزيًا.",
    },
  }

  const t = translations[language] || translations.en
  const isRtl = language === "ar"
  const [selectedTerm, setSelectedTerm] = useState(null)
  const [hoveredTerm, setHoveredTerm] = useState(null)
  const graphRef = useRef(null)
  const svgRef = useRef(null)
  const [graphSize, setGraphSize] = useState({ width: 0, height: 0 })
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTerms, setFilteredTerms] = useState([])
  const [activeFilters, setActiveFilters] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipContent, setTooltipContent] = useState({ content: "", x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [connections, setConnections] = useState([])

  // Enhanced data for the knowledge graph with more detailed relationships and categories
  const terms = [
    {
      id: 1,
      name: "Cloud Computing",
      nameFr: "Informatique en nuage",
      nameAr: "الحوسبة السحابية",
      x: 50,
      y: 50,
      category: "core",
      size: 32,
      definition:
        "A model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources.",
      icon: <Cloud size={18} />,
    },
    {
      id: 2,
      name: "SaaS",
      nameFr: "SaaS",
      nameAr: "البرمجيات كخدمة",
      x: 30,
      y: 30,
      category: "service",
      size: 26,
      related: [1],
      definition:
        "Software as a service is a software licensing and delivery model in which software is licensed on a subscription basis and is centrally hosted.",
      icon: <MonitorSmartphone size={16} />,
    },
    {
      id: 3,
      name: "PaaS",
      nameFr: "PaaS",
      nameAr: "المنصة كخدمة",
      x: 70,
      y: 30,
      category: "service",
      size: 26,
      related: [1],
      definition:
        "Platform as a service is a category of cloud computing services that provides a platform allowing customers to develop, run, and manage applications.",
      icon: <Code size={16} />,
    },
    {
      id: 4,
      name: "IaaS",
      nameFr: "IaaS",
      nameAr: "البنية التحتية كخدمة",
      x: 30,
      y: 70,
      category: "service",
      size: 26,
      related: [1],
      definition:
        "Infrastructure as a service is a form of cloud computing that provides virtualized computing resources over the internet.",
      icon: <Server size={16} />,
    },
    {
      id: 5,
      name: "Virtualization",
      nameFr: "Virtualisation",
      nameAr: "المحاكاة الافتراضية",
      x: 70,
      y: 70,
      category: "technology",
      size: 24,
      related: [1, 4],
      definition:
        "The act of creating a virtual version of something, including virtual computer hardware platforms, storage devices, and computer network resources.",
      icon: <Layers size={16} />,
    },
    {
      id: 6,
      name: "Cybersecurity",
      nameFr: "Cybersécurité",
      nameAr: "الأمن السيبراني",
      x: 20,
      y: 50,
      category: "security",
      size: 28,
      related: [1, 7],
      definition:
        "The practice of protecting systems, networks, and programs from digital attacks that aim to access, change, or destroy sensitive information.",
      icon: <Lock size={16} />,
    },
    {
      id: 7,
      name: "Encryption",
      nameFr: "Chiffrement",
      nameAr: "التشفير",
      x: 10,
      y: 30,
      category: "security",
      size: 24,
      related: [6],
      definition: "The process of converting information or data into a code to prevent unauthorized access.",
      icon: <Key size={16} />,
    },
    {
      id: 8,
      name: "Containers",
      nameFr: "Conteneurs",
      nameAr: "الحاويات",
      x: 85,
      y: 55,
      category: "technology",
      size: 24,
      related: [1, 3, 5],
      definition:
        "A standard unit of software that packages code and its dependencies so the application runs quickly and reliably from one computing environment to another.",
      icon: <Package size={16} />,
    },
    {
      id: 9,
      name: "DevOps",
      nameFr: "DevOps",
      nameAr: "ديف أوبس",
      x: 60,
      y: 85,
      category: "methodology",
      size: 26,
      related: [1, 3, 8],
      definition:
        "A set of practices that combines software development and IT operations aiming to shorten the systems development life cycle.",
      icon: <GitMerge size={16} />,
    },
    {
      id: 10,
      name: "Microservices",
      nameFr: "Microservices",
      nameAr: "الخدمات المصغرة",
      x: 40,
      y: 85,
      category: "methodology",
      size: 24,
      related: [9, 3, 8],
      definition:
        "An architectural style that structures an application as a collection of small autonomous services, modeled around a business domain.",
      icon: <Boxes size={16} />,
    },
    {
      id: 11,
      name: "Blockchain",
      nameFr: "Blockchain",
      nameAr: "سلسلة الكتل",
      x: 15,
      y: 80,
      category: "technology",
      size: 26,
      related: [6, 7],
      definition:
        "A distributed ledger technology that enables secure, transparent and tamper-proof record-keeping of transactions across a network.",
      icon: <Database size={16} />,
    },
    {
      id: 12,
      name: "AI",
      nameFr: "IA",
      nameAr: "الذكاء الاصطناعي",
      x: 85,
      y: 20,
      category: "technology",
      size: 28,
      related: [13, 14],
      definition:
        "The simulation of human intelligence processes by machines, especially computer systems, including learning, reasoning, and self-correction.",
      icon: <Brain size={16} />,
    },
    {
      id: 13,
      name: "Machine Learning",
      nameFr: "Apprentissage automatique",
      nameAr: "تعلم الآلة",
      x: 90,
      y: 40,
      category: "technology",
      size: 24,
      related: [12],
      definition:
        "A subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.",
      icon: <Network size={16} />,
    },
    {
      id: 14,
      name: "Big Data",
      nameFr: "Mégadonnées",
      nameAr: "البيانات الضخمة",
      x: 75,
      y: 10,
      category: "technology",
      size: 26,
      related: [12, 13, 1],
      definition:
        "Extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations, especially relating to human behavior and interactions.",
      icon: <BarChart3 size={16} />,
    },
    {
      id: 15,
      name: "Edge Computing",
      nameFr: "Informatique en périphérie",
      nameAr: "الحوسبة الطرفية",
      x: 65,
      y: 15,
      category: "technology",
      size: 24,
      related: [1, 4],
      definition:
        "A distributed computing paradigm that brings computation and data storage closer to the location where it is needed, to improve response times and save bandwidth.",
      icon: <Cpu size={16} />,
    },
    {
      id: 16,
      name: "Serverless",
      nameFr: "Sans serveur",
      nameAr: "بدون خادم",
      x: 45,
      y: 15,
      category: "service",
      size: 24,
      related: [1, 3],
      definition:
        "A cloud computing execution model where the cloud provider dynamically manages the allocation of machine resources, allowing developers to build and run applications without managing servers.",
      icon: <Zap size={16} />,
    },
    {
      id: 17,
      name: "CI/CD",
      nameFr: "CI/CD",
      nameAr: "التكامل المستمر/التسليم المستمر",
      x: 25,
      y: 90,
      category: "methodology",
      size: 24,
      related: [9, 10],
      definition:
        "Continuous Integration and Continuous Delivery, a method to frequently deliver apps to customers by introducing automation into the stages of app development.",
      icon: <Workflow size={16} />,
    },
  ]

  const categories = [
    { id: "core", name: "Core Concepts", color: "var(--color-core)" },
    { id: "service", name: "Service Models", color: "var(--color-service)" },
    { id: "technology", name: "Technologies", color: "var(--color-technology)" },
    { id: "security", name: "Security", color: "var(--color-security)" },
    { id: "methodology", name: "Methodologies", color: "var(--color-methodology)" },
  ]

  // Generate all connections for better performance
  useEffect(() => {
    const allConnections = []

    terms.forEach((term) => {
      if (term.related) {
        term.related.forEach((relatedId) => {
          const relatedTerm = terms.find((t) => t.id === relatedId)
          if (relatedTerm) {
            // Ensure we don't add duplicate connections
            const connectionExists = allConnections.some(
              (conn) =>
                (conn.source === term.id && conn.target === relatedId) ||
                (conn.source === relatedId && conn.target === term.id),
            )

            if (!connectionExists) {
              allConnections.push({
                id: `${term.id}-${relatedId}`,
                source: term.id,
                target: relatedId,
                sourceCategory: term.category,
                targetCategory: relatedTerm.category,
              })
            }
          }
        })
      }
    })

    setConnections(allConnections)
  }, [terms])

  // Filter terms based on search and category filters
  useEffect(() => {
    let filtered = terms

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (term) =>
          term.name.toLowerCase().includes(search) ||
          term.nameFr.toLowerCase().includes(search) ||
          term.nameAr.includes(search) ||
          term.definition.toLowerCase().includes(search),
      )
    }

    // Apply category filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter((term) => activeFilters.includes(term.category))
    }

    setFilteredTerms(filtered)
  }, [searchTerm, activeFilters, terms])

  // Initialize filtered terms
  useEffect(() => {
    setFilteredTerms(terms)

    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Handle window resize and update graph size
  useEffect(() => {
    if (graphRef.current) {
      const updateSize = () => {
        setGraphSize({
          width: graphRef.current.offsetWidth,
          height: graphRef.current.offsetHeight,
        })
      }

      updateSize()
      window.addEventListener("resize", updateSize)

      return () => window.removeEventListener("resize", updateSize)
    }
  }, [])

  // Handle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (graphRef.current.requestFullscreen) {
        graphRef.current.requestFullscreen()
      } else if (graphRef.current.webkitRequestFullscreen) {
        graphRef.current.webkitRequestFullscreen()
      } else if (graphRef.current.msRequestFullscreen) {
        graphRef.current.msRequestFullscreen()
      }
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
      setIsFullscreen(false)
    }
  }

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement,
      )
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [])

  // Handle zoom
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleZoomReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  // Handle pan with mouse drag
  const handleMouseDown = (e) => {
    if (e.button === 0) {
      // Left mouse button
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }))
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Handle wheel zoom
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY * -0.01
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.5), 3))
  }

  // Handle term click
  const handleTermClick = (term) => {
    setSelectedTerm(term)
  }

  // Close panel
  const closePanel = () => {
    setSelectedTerm(null)
  }

  // Get term name based on language
  const getTermName = (term) => {
    if (language === "fr") return term.nameFr
    if (language === "ar") return term.nameAr
    return term.name
  }

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case "core":
        return "var(--color-core)"
      case "service":
        return "var(--color-service)"
      case "technology":
        return "var(--color-technology)"
      case "security":
        return "var(--color-security)"
      case "methodology":
        return "var(--color-methodology)"
      default:
        return "var(--color-default)"
    }
  }

  // Get related terms
  const getRelatedTerms = (termId) => {
    return terms.filter(
      (term) =>
        (term.related && term.related.includes(termId)) ||
        terms.find((t) => t.id === termId)?.related?.includes(term.id),
    )
  }

  // Toggle category filter
  const toggleCategoryFilter = (categoryId) => {
    setActiveFilters((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId)
      } else {
        return [...prev, categoryId]
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setActiveFilters([])
    setSearchTerm("")
  }

  // Download graph as image
  const downloadImage = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      img.crossOrigin = "anonymous"

      canvas.width = graphSize.width
      canvas.height = graphSize.height
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      img.onload = () => {
        ctx.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = "knowledge-graph.png"
        downloadLink.href = pngFile
        downloadLink.click()
      }

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    }
  }

  // Show tooltip with term info
  const showTermTooltip = (term, x, y) => {
    setTooltipContent({
      content: term.definition.substring(0, 100) + (term.definition.length > 100 ? "..." : ""),
      x,
      y,
    })
    setShowTooltip(true)
  }

  // Hide tooltip
  const hideTooltip = () => {
    setShowTooltip(false)
  }

  // Calculate connection path between two nodes
  const calculateConnectionPath = (sourceTerm, targetTerm) => {
    // Convert percentage positions to pixels
    const startX = (sourceTerm.x / 100) * graphSize.width
    const startY = (sourceTerm.y / 100) * graphSize.height
    const endX = (targetTerm.x / 100) * graphSize.width
    const endY = (targetTerm.y / 100) * graphSize.height

    // Calculate control points for curved lines
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2
    const dx = endX - startX
    const dy = endY - startY
    const dist = Math.sqrt(dx * dx + dy * dy)
    const normX = dx / dist
    const normY = dy / dist
    const perpX = -normY
    const perpY = normX
    const curveFactor = dist * 0.2
    const ctrlX = midX + perpX * curveFactor
    const ctrlY = midY + perpY * curveFactor

    return {
      path: `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`,
      startX,
      startY,
      endX,
      endY,
      ctrlX,
      ctrlY,
    }
  }

  return (
    <section id="knowledge-graph" className={`knowledge-graph ${isRtl ? "rtl" : ""}`}>
      <div className="container">
        <div className="section-header">
          <div className="badge">{t.interactive || "Interactive"}</div>
          <h2>{t.knowledgeGraphTitle || "Explore the Knowledge Graph"}</h2>
          <p>
            {t.knowledgeGraphDescription ||
              "Discover relationships between ICT terms with our interactive visualization. Click on nodes to see details and connections."}
          </p>
        </div>

        <div className="graph-container">
          <div className="graph-controls">
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder={t.search || "Search terms..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="controls-buttons">
              <button
                className="control-button"
                onClick={() => setShowFilters(!showFilters)}
                title={t.filter || "Filter"}
              >
                <Filter size={16} />
              </button>
              <button className="control-button" onClick={handleZoomIn} title={t.zoomIn || "Zoom in"}>
                <ZoomIn size={16} />
              </button>
              <button className="control-button" onClick={handleZoomOut} title={t.zoomOut || "Zoom out"}>
                <ZoomOut size={16} />
              </button>
              <button className="control-button" onClick={handleZoomReset} title={t.reset || "Reset view"}>
                <RefreshCw size={16} />
              </button>
              <button className="control-button" onClick={toggleFullscreen} title={t.fullscreen || "Fullscreen"}>
                <Maximize2 size={16} />
              </button>
              <button className="control-button" onClick={downloadImage} title={t.download || "Download as image"}>
                <Download size={16} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="filter-panel">
              <div className="filter-header">
                <h4>{t.filter || "Filter"}</h4>
                <button className="close-filter" onClick={() => setShowFilters(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="category-filters">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`category-filter ${activeFilters.includes(category.id) ? "active" : ""}`}
                    onClick={() => toggleCategoryFilter(category.id)}
                  >
                    <span className="category-color" style={{ backgroundColor: category.color }}></span>
                    <span className="category-name">{category.name}</span>
                  </div>
                ))}
              </div>
              <button className="reset-filters" onClick={resetFilters}>
                {t.allCategories || "All Categories"}
              </button>
            </div>
          )}

          <div
            className="graph-visualization"
            ref={graphRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
          >
            {!isLoaded ? (
              <LoadingSpinner />
            ) : (
              <Suspense fallback={<LoadingSpinner />}>
                <div
                  className="graph-content"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                >
                  <svg className="connections-svg" ref={svgRef}>
                    {/* Render connection gradients */}
                    <defs>
                      {categories.map((category) => (
                        <linearGradient
                          key={`gradient-${category.id}`}
                          id={`connection-gradient-${category.id}`}
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor={`var(--color-${category.id})`} stopOpacity="0.8" />
                          <stop offset="100%" stopColor={`var(--color-${category.id})`} stopOpacity="0.4" />
                        </linearGradient>
                      ))}
                    </defs>

                    {/* Render all connections */}
                    {connections.map((connection) => {
                      const sourceTerm = terms.find((t) => t.id === connection.source)
                      const targetTerm = terms.find((t) => t.id === connection.target)

                      // Skip if either term is not in filtered terms
                      if (
                        !filteredTerms.some((t) => t.id === connection.source) ||
                        !filteredTerms.some((t) => t.id === connection.target)
                      ) {
                        return null
                      }

                      const isHighlighted =
                        selectedTerm?.id === connection.source ||
                        selectedTerm?.id === connection.target ||
                        hoveredTerm?.id === connection.source ||
                        hoveredTerm?.id === connection.target

                      const connectionPath = calculateConnectionPath(sourceTerm, targetTerm)

                      return (
                        <g key={`connection-${connection.id}`} className="connection-group">
                          {/* Connection path with gradient */}
                          <path
                            d={connectionPath.path}
                            className={`connection-line ${isHighlighted ? "highlighted" : ""}`}
                            stroke={getCategoryColor(connection.sourceCategory)}
                            strokeWidth={isHighlighted ? 3 : 2}
                            opacity={isHighlighted ? 0.9 : 0.5}
                            fill="none"
                            strokeLinecap="round"
                          />

                          {/* Animated particles along the path */}
                          {isHighlighted && (
                            <circle r={3} fill={getCategoryColor(connection.sourceCategory)} opacity={0.8}>
                              <animateMotion path={connectionPath.path} dur="1.5s" repeatCount="indefinite" />
                            </circle>
                          )}
                        </g>
                      )
                    })}
                  </svg>

                  {filteredTerms.map((term) => {
                    const isHighlighted =
                      selectedTerm?.id === term.id ||
                      (selectedTerm && selectedTerm.related && selectedTerm.related.includes(term.id)) ||
                      (selectedTerm && terms.find((t) => t.id === term.id)?.related?.includes(selectedTerm.id)) ||
                      hoveredTerm?.id === term.id

                    // Convert percentage positions to pixels
                    const posX = (term.x / 100) * graphSize.width
                    const posY = (term.y / 100) * graphSize.height

                    return (
                      <motion.div
                        key={term.id}
                        className={`term-node ${isHighlighted ? "highlighted" : ""} ${
                          selectedTerm?.id === term.id ? "selected" : ""
                        }`}
                        style={{
                          left: `${posX}px`,
                          top: `${posY}px`,
                          backgroundColor: getCategoryColor(term.category),
                          width: `${term.size}px`,
                          height: `${term.size}px`,
                          transform: "translate(-50%, -50%)",
                        }}
                        onClick={() => handleTermClick(term)}
                        onMouseEnter={(e) => {
                          setHoveredTerm(term)
                          showTermTooltip(term, e.clientX, e.clientY)
                        }}
                        onMouseLeave={() => {
                          setHoveredTerm(null)
                          hideTooltip()
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: isHighlighted ? 1.2 : 1,
                          opacity: selectedTerm && !isHighlighted ? 0.6 : 1,
                          transition: {
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: term.id * 0.03, // Staggered animation
                          },
                        }}
                        whileHover={{ scale: 1.3 }}
                      >
                        <span className="term-icon">{term.icon}</span>
                        <motion.span
                          className="term-label"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{
                            opacity: isHighlighted || hoveredTerm?.id === term.id ? 1 : 0,
                            y: isHighlighted || hoveredTerm?.id === term.id ? 0 : -5,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {getTermName(term)}
                        </motion.span>
                      </motion.div>
                    )
                  })}

                  {showTooltip && (
                    <div
                      className="term-tooltip"
                      style={{
                        left: tooltipContent.x,
                        top: tooltipContent.y,
                      }}
                    >
                      {tooltipContent.content}
                    </div>
                  )}
                </div>
              </Suspense>
            )}

            {filteredTerms.length === 0 && isLoaded && (
              <div className="no-results">
                <p>{t.noResults || "No results found"}</p>
                <button className="reset-search" onClick={resetFilters}>
                  {t.allCategories || "All Categories"}
                </button>
              </div>
            )}
          </div>

          <AnimatePresence>
            {selectedTerm && (
              <Suspense fallback={<div className="loading-panel">Loading details...</div>}>
                <GraphPanel
                  selectedTerm={selectedTerm}
                  closePanel={closePanel}
                  getTermName={getTermName}
                  getCategoryColor={getCategoryColor}
                  getRelatedTerms={getRelatedTerms}
                  handleTermClick={handleTermClick}
                  categories={categories}
                  t={t}
                  isRtl={isRtl}
                />
              </Suspense>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default KnowledgeGraph
