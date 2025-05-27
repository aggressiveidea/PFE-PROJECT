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
  Sparkles,
} from "lucide-react"
import "./KnowledgeGraph.css"

// Lazy loaded components
const GraphPanel = lazy(() => import("./GraphPanel"))

// Enhanced Loading component with elegant animation
const LoadingSpinner = () => (
  <motion.div
    className="home-page-loading-container"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      <Sparkles size={40} />
    </motion.div>
    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
      Loading knowledge graph...
    </motion.p>
  </motion.div>
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

  // Enhanced data for mathematical graph positioning
  const terms = [
    {
      id: 1,
      name: "Cloud Computing",
      nameFr: "Informatique en nuage",
      nameAr: "الحوسبة السحابية",
      x: 50, // Center like origin (0,0)
      y: 50,
      category: "core",
      size: 45,
      definition:
        "A model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources.",
      icon: <Cloud size={22} />,
    },
    {
      id: 2,
      name: "SaaS",
      nameFr: "SaaS",
      nameAr: "البرمجيات كخدمة",
      x: 20, // Grid position (-3, 3)
      y: 20,
      category: "service",
      size: 38,
      related: [1],
      definition:
        "Software as a service is a software licensing and delivery model in which software is licensed on a subscription basis and is centrally hosted.",
      icon: <MonitorSmartphone size={20} />,
    },
    {
      id: 3,
      name: "PaaS",
      nameFr: "PaaS",
      nameAr: "المنصة كخدمة",
      x: 80, // Grid position (3, 3)
      y: 20,
      category: "service",
      size: 38,
      related: [1],
      definition:
        "Platform as a service is a category of cloud computing services that provides a platform allowing customers to develop, run, and manage applications.",
      icon: <Code size={20} />,
    },
    {
      id: 4,
      name: "IaaS",
      nameFr: "IaaS",
      nameAr: "البنية التحتية كخدمة",
      x: 20, // Grid position (-3, -3)
      y: 80,
      category: "service",
      size: 38,
      related: [1],
      definition:
        "Infrastructure as a service is a form of cloud computing that provides virtualized computing resources over the internet.",
      icon: <Server size={20} />,
    },
    {
      id: 5,
      name: "Virtualization",
      nameFr: "Virtualisation",
      nameAr: "المحاكاة الافتراضية",
      x: 80, // Grid position (3, -3)
      y: 80,
      category: "technology",
      size: 35,
      related: [1, 4],
      definition:
        "The act of creating a virtual version of something, including virtual computer hardware platforms, storage devices, and computer network resources.",
      icon: <Layers size={20} />,
    },
    {
      id: 6,
      name: "Cybersecurity",
      nameFr: "Cybersécurité",
      nameAr: "الأمن السيبراني",
      x: 10, // Grid position (-4, 0)
      y: 50,
      category: "security",
      size: 42,
      related: [1, 7],
      definition:
        "The practice of protecting systems, networks, and programs from digital attacks that aim to access, change, or destroy sensitive information.",
      icon: <Lock size={20} />,
    },
    {
      id: 7,
      name: "Encryption",
      nameFr: "Chiffrement",
      nameAr: "التشفير",
      x: 10, // Grid position (-4, 2)
      y: 30,
      category: "security",
      size: 35,
      related: [6],
      definition: "The process of converting information or data into a code to prevent unauthorized access.",
      icon: <Key size={20} />,
    },
    {
      id: 8,
      name: "Containers",
      nameFr: "Conteneurs",
      nameAr: "الحاويات",
      x: 90, // Grid position (4, 0)
      y: 50,
      category: "technology",
      size: 35,
      related: [1, 3, 5],
      definition:
        "A standard unit of software that packages code and its dependencies so the application runs quickly and reliably from one computing environment to another.",
      icon: <Package size={20} />,
    },
    {
      id: 9,
      name: "DevOps",
      nameFr: "DevOps",
      nameAr: "ديف أوبس",
      x: 70, // Grid position (2, -4)
      y: 90,
      category: "methodology",
      size: 38,
      related: [1, 3, 8],
      definition:
        "A set of practices that combines software development and IT operations aiming to shorten the systems development life cycle.",
      icon: <GitMerge size={20} />,
    },
    {
      id: 10,
      name: "Microservices",
      nameFr: "Microservices",
      nameAr: "الخدمات المصغرة",
      x: 30, // Grid position (-2, -4)
      y: 90,
      category: "methodology",
      size: 35,
      related: [9, 3, 8],
      definition:
        "An architectural style that structures an application as a collection of small autonomous services, modeled around a business domain.",
      icon: <Boxes size={20} />,
    },
    {
      id: 11,
      name: "Blockchain",
      nameFr: "Blockchain",
      nameAr: "سلسلة الكتل",
      x: 10, // Grid position (-4, -2)
      y: 70,
      category: "technology",
      size: 38,
      related: [6, 7],
      definition:
        "A distributed ledger technology that enables secure, transparent and tamper-proof record-keeping of transactions across a network.",
      icon: <Database size={20} />,
    },
    {
      id: 12,
      name: "AI",
      nameFr: "IA",
      nameAr: "الذكاء الاصطناعي",
      x: 90, // Grid position (4, 4)
      y: 10,
      category: "technology",
      size: 42,
      related: [13, 14],
      definition:
        "The simulation of human intelligence processes by machines, especially computer systems, including learning, reasoning, and self-correction.",
      icon: <Brain size={20} />,
    },
    {
      id: 13,
      name: "Machine Learning",
      nameFr: "Apprentissage automatique",
      nameAr: "تعلم الآلة",
      x: 90, // Grid position (4, 2)
      y: 30,
      category: "technology",
      size: 35,
      related: [12],
      definition:
        "A subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.",
      icon: <Network size={20} />,
    },
    {
      id: 14,
      name: "Big Data",
      nameFr: "Mégadonnées",
      nameAr: "البيانات الضخمة",
      x: 70, // Grid position (2, 4)
      y: 10,
      category: "technology",
      size: 38,
      related: [12, 13, 1],
      definition:
        "Extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations, especially relating to human behavior and interactions.",
      icon: <BarChart3 size={20} />,
    },
    {
      id: 15,
      name: "Edge Computing",
      nameFr: "Informatique en périphérie",
      nameAr: "الحوسبة الطرفية",
      x: 50, // Grid position (0, 4)
      y: 10,
      category: "technology",
      size: 35,
      related: [1, 4],
      definition:
        "A distributed computing paradigm that brings computation and data storage closer to the location where it is needed, to improve response times and save bandwidth.",
      icon: <Cpu size={20} />,
    },
    {
      id: 16,
      name: "Serverless",
      nameFr: "Sans serveur",
      nameAr: "بدون خادم",
      x: 30, // Grid position (-2, 4)
      y: 10,
      category: "service",
      size: 35,
      related: [1, 3],
      definition:
        "A cloud computing execution model where the cloud provider dynamically manages the allocation of machine resources, allowing developers to build and run applications without managing servers.",
      icon: <Zap size={20} />,
    },
    {
      id: 17,
      name: "CI/CD",
      nameFr: "CI/CD",
      nameAr: "التكامل المستمر/التسليم المستمر",
      x: 50, // Grid position (0, -4)
      y: 90,
      category: "methodology",
      size: 35,
      related: [9, 10],
      definition:
        "Continuous Integration and Continuous Delivery, a method to frequently deliver apps to customers by introducing automation into the stages of app development.",
      icon: <Workflow size={20} />,
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
    }, 1200)

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
      content: term.definition.substring(0, 120) + (term.definition.length > 120 ? "..." : ""),
      x,
      y,
    })
    setShowTooltip(true)
  }

  // Hide tooltip
  const hideTooltip = () => {
    setShowTooltip(false)
  }

  // Calculate connection path between two nodes (Neo4j Bloom style)
  const calculateConnectionPath = (sourceTerm, targetTerm) => {
    // Convert percentage positions to pixels
    const startX = (sourceTerm.x / 100) * graphSize.width
    const startY = (sourceTerm.y / 100) * graphSize.height
    const endX = (targetTerm.x / 100) * graphSize.width
    const endY = (targetTerm.y / 100) * graphSize.height

    // Mathematical straight line for precision
    return {
      path: `M ${startX} ${startY} L ${endX} ${endY}`,
      startX,
      startY,
      endX,
      endY,
    }
  }

  return (
    <section id="knowledge-graph" className={`home-page-knowledge-graph ${isRtl ? "home-page-rtl" : ""}`}>
      <div className="home-page-container">
        <motion.div
          className="home-page-section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="home-page-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles size={16} style={{ marginRight: "8px" }} />
            {t.interactive || "Interactive"}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {t.knowledgeGraphTitle || "Explore the Knowledge Graph"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {t.knowledgeGraphDescription ||
              "Discover relationships between ICT terms with our interactive visualization. Click on nodes to see details and connections."}
          </motion.p>
        </motion.div>

        <motion.div
          className="home-page-graph-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          <div className="home-page-graph-controls">
            <div className="home-page-search-container">
              <Search className="home-page-search-icon" size={18} />
              <input
                type="text"
                placeholder={t.search || "Search terms..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="home-page-search-input"
              />
              {searchTerm && (
                <motion.button
                  className="home-page-clear-search"
                  onClick={() => setSearchTerm("")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={16} />
                </motion.button>
              )}
            </div>

            <div className="home-page-controls-buttons">
              <motion.button
                className="home-page-control-button"
                onClick={() => setShowFilters(!showFilters)}
                title={t.filter || "Filter"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={18} />
              </motion.button>
              <motion.button
                className="home-page-control-button"
                onClick={handleZoomIn}
                title={t.zoomIn || "Zoom in"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ZoomIn size={18} />
              </motion.button>
              <motion.button
                className="home-page-control-button"
                onClick={handleZoomOut}
                title={t.zoomOut || "Zoom out"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ZoomOut size={18} />
              </motion.button>
              <motion.button
                className="home-page-control-button"
                onClick={handleZoomReset}
                title={t.reset || "Reset view"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={18} />
              </motion.button>
              <motion.button
                className="home-page-control-button"
                onClick={toggleFullscreen}
                title={t.fullscreen || "Fullscreen"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Maximize2 size={18} />
              </motion.button>
              <motion.button
                className="home-page-control-button"
                onClick={downloadImage}
                title={t.download || "Download as image"}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="home-page-filter-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="home-page-filter-header">
                  <h4>{t.filter || "Filter"}</h4>
                  <motion.button
                    className="home-page-close-filter"
                    onClick={() => setShowFilters(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>
                <div className="home-page-category-filters">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      className={`home-page-category-filter ${activeFilters.includes(category.id) ? "active" : ""}`}
                      onClick={() => toggleCategoryFilter(category.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="home-page-category-color" style={{ backgroundColor: category.color }}></span>
                      <span className="home-page-category-name">{category.name}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  className="home-page-reset-filters"
                  onClick={resetFilters}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t.allCategories || "All Categories"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            className="home-page-graph-visualization"
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
                  className="home-page-graph-content"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                >
                  <svg className="home-page-connections-svg" ref={svgRef}>
                    {/* Enhanced gradients for Neo4j Bloom style connections */}
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
                          <stop offset="50%" stopColor={`var(--color-${category.id})`} stopOpacity="0.6" />
                          <stop offset="100%" stopColor={`var(--color-${category.id})`} stopOpacity="0.4" />
                        </linearGradient>
                      ))}

                      {/* Neo4j Bloom style glow filter */}
                      <filter id="bloomGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>

                      {/* Enhanced node glow */}
                      <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Render all connections with Neo4j Bloom styling */}
                    {connections.map((connection, index) => {
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
                        <motion.g
                          key={`connection-${connection.id}`}
                          className="home-page-connection-group"
                          initial={{ opacity: 0, pathLength: 0 }}
                          animate={{ opacity: 1, pathLength: 1 }}
                          transition={{
                            delay: index * 0.03,
                            duration: 0.6,
                            ease: "easeOut",
                          }}
                        >
                          {/* Main connection path */}
                          <path
                            d={connectionPath.path}
                            className={`home-page-connection-line ${isHighlighted ? "highlighted" : ""}`}
                            stroke={getCategoryColor(connection.sourceCategory)}
                            strokeWidth={isHighlighted ? 5 : 3}
                            opacity={isHighlighted ? 0.9 : 0.6}
                            fill="none"
                            strokeLinecap="round"
                            filter={isHighlighted ? "url(#bloomGlow)" : "none"}
                          />

                          {/* Animated particles for highlighted connections */}
                          {isHighlighted && (
                            <motion.circle
                              r={3}
                              fill={getCategoryColor(connection.sourceCategory)}
                              opacity={0.8}
                              initial={{ scale: 0 }}
                              animate={{ scale: [0, 1.2, 1] }}
                              transition={{ duration: 0.4 }}
                            >
                              <animateMotion path={connectionPath.path} dur="1.5s" repeatCount="indefinite" />
                            </motion.circle>
                          )}
                        </motion.g>
                      )
                    })}
                  </svg>

                  {filteredTerms.map((term, index) => {
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
                        className={`home-page-term-node ${isHighlighted ? "highlighted" : ""} ${
                          selectedTerm?.id === term.id ? "selected" : ""
                        }`}
                        data-category={term.category}
                        style={{
                          left: `${posX}px`,
                          top: `${posY}px`,
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
                          scale: isHighlighted ? 1.3 : 1,
                          opacity: selectedTerm && !isHighlighted ? 0.5 : 1,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          delay: index * 0.05,
                        }}
                        whileHover={{
                          scale: 1.35,
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="home-page-term-icon">{term.icon}</span>
                        <AnimatePresence>
                          {(isHighlighted || hoveredTerm?.id === term.id) && (
                            <motion.span
                              className="home-page-term-label"
                              initial={{ opacity: 0, y: -15, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -15, scale: 0.8 }}
                              transition={{ duration: 0.3, type: "spring", stiffness: 400 }}
                            >
                              {getTermName(term)}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}

                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        className="home-page-term-tooltip"
                        style={{
                          left: tooltipContent.x,
                          top: tooltipContent.y,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {tooltipContent.content}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Suspense>
            )}

            {filteredTerms.length === 0 && isLoaded && (
              <motion.div
                className="home-page-no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <p>{t.noResults || "No results found"}</p>
                <motion.button
                  className="home-page-reset-search"
                  onClick={resetFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t.allCategories || "All Categories"}
                </motion.button>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {selectedTerm && (
              <Suspense fallback={<div className="home-page-loading-panel">Loading details...</div>}>
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
        </motion.div>
      </div>
    </section>
  )
}

export default KnowledgeGraph
