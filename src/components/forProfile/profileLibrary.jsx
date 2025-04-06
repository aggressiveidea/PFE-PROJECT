"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  SlidersHorizontal,
  Heart,
  Eye,
  Share2,
  RotateCcw,
} from "lucide-react"
import Header from "../forHome/Header"
import Footer from "../forHome/Footer"
import Sidebar from "../forDashboard/Sidebar"
import "./Library.css"

// Mock data structure for legal IT terminology
const mockTermsData = [
  // E-Commerce Terms
  {
    id: "ec-1",
    title: "Electronic Contract",
    definition: {
      en: "A contract formed through electronic means rather than through paper documents",
      fr: "Un contrat formé par voie électronique plutôt que par documents papier",
      ar: "عقد تم تشكيله من خلال وسائل إلكترونية بدلاً من المستندات الورقية",
    },
    category: "e-commerce",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-03-15",
    isFavorite: false,
    relatedTerms: ["ec-3", "itc-2"],
  },
  {
    id: "ec-2",
    title: "Digital Signature",
    definition: {
      en: "Electronic data that is used to identify the sender of a message or document",
      fr: "Données électroniques utilisées pour identifier l'expéditeur d'un message ou d'un document",
      ar: "بيانات إلكترونية تستخدم لتحديد مرسل رسالة أو مستند",
    },
    category: "e-commerce",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-03-20",
    isFavorite: true,
    relatedTerms: ["ec-1", "sec-1"],
  },
  {
    id: "ec-3",
    title: "Online Marketplace",
    definition: {
      en: "A website or app where products or services are offered by multiple third parties",
      fr: "Un site web ou une application où des produits ou services sont proposés par plusieurs tiers",
      ar: "موقع ويب أو تطبيق حيث يتم تقديم المنتجات أو الخدمات من قبل أطراف ثالثة متعددة",
    },
    category: "e-commerce",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-03-25",
    isFavorite: false,
    relatedTerms: ["ec-1", "mkt-1"],
  },

  // IT Compliance Terms
  {
    id: "itc-1",
    title: "Data Protection",
    definition: {
      en: "Measures to protect personal data against unauthorized access or processing",
      fr: "Mesures visant à protéger les données personnelles contre l'accès ou le traitement non autorisés",
      ar: "تدابير لحماية البيانات الشخصية ضد الوصول أو المعالجة غير المصرح بهما",
    },
    category: "it-compliance",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-04-01",
    isFavorite: true,
    relatedTerms: ["sec-2", "leg-1"],
  },
  {
    id: "itc-2",
    title: "Compliance Audit",
    definition: {
      en: "A systematic review to ensure adherence to laws, regulations, and policies",
      fr: "Un examen systématique pour assurer le respect des lois, des règlements et des politiques",
      ar: "مراجعة منهجية لضمان الالتزام بالقوانين واللوائح والسياسات",
    },
    category: "it-compliance",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-04-05",
    isFavorite: false,
    relatedTerms: ["itc-1", "leg-2"],
  },

  // Security Terms
  {
    id: "sec-1",
    title: "Cybersecurity Threat",
    definition: {
      en: "A malicious act that seeks to damage data, steal data, or disrupt digital life",
      fr: "Un acte malveillant qui cherche à endommager les données, à voler des données ou à perturber la vie numérique",
      ar: "عمل ضار يسعى إلى إتلاف البيانات أو سرقة البيانات أو تعطيل الحياة الرقمية",
    },
    category: "security",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-04-10",
    isFavorite: true,
    relatedTerms: ["sec-2", "itc-1"],
  },
  {
    id: "sec-2",
    title: "Encryption",
    definition: {
      en: "The process of converting information into a code to prevent unauthorized access",
      fr: "Le processus de conversion d'informations en un code pour empêcher l'accès non autorisé",
      ar: "عملية تحويل المعلومات إلى رمز لمنع الوصول غير المصرح به",
    },
    category: "security",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-04-15",
    isFavorite: false,
    relatedTerms: ["sec-1", "itc-1"],
  },

  // Legal Terms
  {
    id: "leg-1",
    title: "Intellectual Property",
    definition: {
      en: "Creations of the mind, such as inventions, literary and artistic works, designs, and symbols",
      fr: "Créations de l'esprit, telles que les inventions, les œuvres littéraires et artistiques, les dessins et les symboles",
      ar: "إبداعات العقل، مثل الاختراعات والمصنفات الأدبية والفنية والتصاميم والرموز",
    },
    category: "legal",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-04-20",
    isFavorite: true,
    relatedTerms: ["leg-2", "mkt-2"],
  },
  {
    id: "leg-2",
    title: "Regulatory Compliance",
    definition: {
      en: "Adherence to laws, regulations, guidelines, and specifications relevant to one's industry",
      fr: "Respect des lois, règlements, directives et spécifications applicables à son secteur d'activité",
      ar: "الالتزام بالقوانين واللوائح والمبادئ التوجيهية والمواصفات ذات الصلة بقطاع الشخص",
    },
    category: "legal",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-04-25",
    isFavorite: false,
    relatedTerms: ["leg-1", "itc-2"],
  },

  // Marketing Terms
  {
    id: "mkt-1",
    title: "Search Engine Optimization (SEO)",
    definition: {
      en: "The process of improving the visibility of a website or a web page in a search engine's unpaid results",
      fr: "Le processus d'amélioration de la visibilité d'un site web ou d'une page web dans les résultats non payants d'un moteur de recherche",
      ar: "عملية تحسين رؤية موقع ويب أو صفحة ويب في نتائج البحث غير المدفوعة لمحرك البحث",
    },
    category: "marketing",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-04-30",
    isFavorite: true,
    relatedTerms: ["mkt-2", "ec-3"],
  },
  {
    id: "mkt-2",
    title: "Content Marketing",
    definition: {
      en: "A marketing technique of creating and distributing valuable, relevant, and consistent content",
      fr: "Une technique de marketing consistant à créer et à diffuser un contenu précieux, pertinent et cohérent",
      ar: "تقنية تسويقية تتمثل في إنشاء وتوزيع محتوى قيم وملائم ومتسق",
    },
    category: "marketing",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-05-05",
    isFavorite: false,
    relatedTerms: ["mkt-1", "leg-1"],
  },
]

// Mock data structure for articles
const mockArticlesData = [
  {
    id: "art-1",
    title: "The Impact of GDPR on Global Businesses",
    author: "Jane Doe",
    abstract: {
      en: "An overview of how the General Data Protection Regulation (GDPR) affects companies worldwide.",
      fr: "Un aperçu de la manière dont le Règlement général sur la protection des données (RGPD) affecte les entreprises du monde entier.",
      ar: "نظرة عامة حول كيفية تأثير اللائحة العامة لحماية البيانات (GDPR) على الشركات في جميع أنحاء العالم.",
    },
    category: "legal",
    languages: ["en", "fr", "ar"],
    datePublished: "2024-05-10",
    isFavorite: true,
    relatedTerms: ["leg-1", "itc-1"],
  },
  {
    id: "art-2",
    title: "Best Practices for Cybersecurity in 2024",
    author: "John Smith",
    abstract: {
      en: "A guide to the latest cybersecurity practices to protect your business from cyber threats.",
      fr: "Un guide des dernières pratiques de cybersécurité pour protéger votre entreprise contre les cybermenaces.",
      ar: "دليل لأحدث ممارسات الأمن السيبراني لحماية عملك من التهديدات السيبرانية.",
    },
    category: "security",
    languages: ["en", "fr", "ar"],
    datePublished: "2024-05-15",
    isFavorite: false,
    relatedTerms: ["sec-1", "sec-2"],
  },
  {
    id: "art-3",
    title: "The Future of E-Commerce: Trends and Predictions",
    author: "Emily White",
    abstract: {
      en: "Exploring the emerging trends and making predictions about the future of e-commerce.",
      fr: "Explorer les tendances émergentes et faire des prédictions sur l'avenir du commerce électronique.",
      ar: "استكشاف الاتجاهات الناشئة وتقديم تنبؤات حول مستقبل التجارة الإلكترونية.",
    },
    category: "e-commerce",
    languages: ["en", "fr", "ar"],
    datePublished: "2024-05-20",
    isFavorite: true,
    relatedTerms: ["ec-1", "ec-3"],
  },
]

// Metadata for categories
const categoryMetadata = {
  "e-commerce": {
    label: { en: "E-Commerce", fr: "Commerce électronique", ar: "التجارة الإلكترونية" },
    icon: "e-commerce",
    color: "#29ABE2",
  },
  "it-compliance": {
    label: { en: "IT Compliance", fr: "Conformité IT", ar: "الامتثال لتكنولوجيا المعلومات" },
    icon: "it-compliance",
    color: "#8E44AD",
  },
  security: {
    label: { en: "Security", fr: "Sécurité", ar: "الأمن" },
    icon: "security",
    color: "#E74C3C",
  },
  legal: {
    label: { en: "Legal", fr: "Légal", ar: "قانوني" },
    icon: "legal",
    color: "#16A085",
  },
  marketing: {
    label: { en: "Marketing", fr: "Marketing", ar: "التسويق" },
    icon: "marketing",
    color: "#F39C12",
  },
}

// UI translations
const uiTranslations = {
  en: {
    myLibrary: "My Library",
    manageItems: "Manage your legal and IT terms and articles",
    legalTerms: "Legal Terms",
    articles: "Articles",
    searchPlaceholder: "Search terms or articles...",
    allItems: "All Categories",
    languageFilter: "All Languages",
    dateNewest: "Date (Newest)",
    dateOldest: "Date (Oldest)",
    alphabetical: "Alphabetical",
    favorites: "Favorites",
    loading: "Loading...",
    noItemsFound: "No items found",
    tryChanging: "Try changing the filters or search query.",
    languages: "Languages",
    addedOn: "Added on",
    publishedOn: "Published on",
    view: "View",
    share: "Share",
    by: "By",
    relatedTerms: "Related Terms",
  },
  fr: {
    myLibrary: "Ma Bibliothèque",
    manageItems: "Gérez vos termes juridiques et informatiques et vos articles",
    legalTerms: "Termes Juridiques",
    articles: "Articles",
    searchPlaceholder: "Rechercher des termes ou des articles...",
    allItems: "Toutes Catégories",
    languageFilter: "Toutes les Langues",
    dateNewest: "Date (Plus Récent)",
    dateOldest: "Date (Plus Ancien)",
    alphabetical: "Alphabétique",
    favorites: "Favoris",
    loading: "Chargement...",
    noItemsFound: "Aucun élément trouvé",
    tryChanging: "Essayez de modifier les filtres ou la requête de recherche.",
    languages: "Langues",
    addedOn: "Ajouté le",
    publishedOn: "Publié le",
    view: "Voir",
    share: "Partager",
    by: "Par",
    relatedTerms: "Termes Associés",
  },
  ar: {
    myLibrary: "مكتبتي",
    manageItems: "إدارة المصطلحات والمقالات القانونية وتكنولوجيا المعلومات الخاصة بك",
    legalTerms: "المصطلحات القانونية",
    articles: "المقالات",
    searchPlaceholder: "البحث عن مصطلحات أو مقالات...",
    allItems: "جميع الفئات",
    languageFilter: "جميع اللغات",
    dateNewest: "التاريخ (الأحدث)",
    dateOldest: "التاريخ (الأقدم)",
    alphabetical: "أبجدي",
    favorites: "المفضلة",
    loading: "جار التحميل...",
    noItemsFound: "لم يتم العثور على عناصر",
    tryChanging: "حاول تغيير عوامل التصفية أو طلب البحث.",
    languages: "اللغات",
    addedOn: "أضيف في",
    publishedOn: "نشر في",
    view: "عرض",
    share: "شارك",
    by: "بواسطة",
    relatedTerms: "المصطلحات ذات الصلة",
  },
}

const ProfileLibrary = () => {
  // State management
  const [activeTab, setActiveTab] = useState("terms") // 'terms' or 'articles'
  const [currentLanguage, setCurrentLanguage] = useState("en") // 'en', 'fr', or 'ar'
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [sortOption, setSortOption] = useState("dateNewest")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [animateItems, setAnimateItems] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedItemId, setExpandedItemId] = useState(null)
  const [relatedTermsMap, setRelatedTermsMap] = useState({})
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [language, setLanguage] = useState("en")

  const itemsPerPage = 6

  // Check for dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [])

  // Update dark mode when it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode])

  // Get UI text based on current language
  const getText = useCallback(
    (key) => {
      return uiTranslations[currentLanguage][key] || uiTranslations.en[key]
    },
    [currentLanguage],
  )

  // Get category label based on current language
  const getCategoryLabel = useCallback(
    (categoryKey) => {
      return categoryMetadata[categoryKey]?.label[currentLanguage] || categoryKey
    },
    [currentLanguage],
  )

  // Load initial data
  useEffect(() => {
    setIsLoading(true)
    setAnimateItems(false)

    // Simulate API call with delay
    const timer = setTimeout(() => {
      const sourceData = activeTab === "terms" ? mockTermsData : mockArticlesData
      setItems(sourceData)

      // Build related terms map
      const relatedMap = {}
      mockTermsData.forEach((term) => {
        relatedMap[term.id] = term
      })
      setRelatedTermsMap(relatedMap)

      setIsLoading(false)
      setCurrentPage(1)

      // Trigger animation after items are loaded
      setTimeout(() => {
        setAnimateItems(true)
      }, 100)
    }, 600)

    return () => clearTimeout(timer)
  }, [activeTab])

  // Toggle favorite status
  const toggleFavorite = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
    )
  }, [])

  // Toggle expanded item for details view
  const toggleExpandItem = useCallback((id) => {
    setExpandedItemId((prevId) => (prevId === id ? null : id))
  }, [])

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    // First apply filters
    const result = items.filter((item) => {
      // Search query filter
      const searchInCurrentLanguage = (text) => {
        if (!text) return true
        return text.toLowerCase().includes(searchQuery.toLowerCase())
      }

      const titleMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase())

      let contentMatch = false
      if (activeTab === "terms" && item.definition) {
        contentMatch = searchInCurrentLanguage(item.definition[currentLanguage])
      } else if (activeTab === "articles" && item.abstract) {
        contentMatch = searchInCurrentLanguage(item.abstract[currentLanguage])
      }

      const matchesSearch = searchQuery === "" || titleMatch || contentMatch

      // Category filter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      // Language filter
      const matchesLanguage = languageFilter === "all" || (item.languages && item.languages.includes(languageFilter))

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || item.isFavorite

      return matchesSearch && matchesCategory && matchesLanguage && matchesFavorites
    })

    // Then sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "dateNewest":
          const dateA = new Date(activeTab === "terms" ? a.dateAdded : a.datePublished)
          const dateB = new Date(activeTab === "terms" ? b.dateAdded : b.datePublished)
          return dateB - dateA
        case "dateOldest":
          const dateC = new Date(activeTab === "terms" ? a.dateAdded : a.datePublished)
          const dateD = new Date(activeTab === "terms" ? b.dateAdded : b.datePublished)
          return dateC - dateD
        case "alphabetical":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return result
  }, [items, searchQuery, categoryFilter, languageFilter, showFavoritesOnly, sortOption, activeTab, currentLanguage])

  // Pagination
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedItems, currentPage, itemsPerPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedItems.length / itemsPerPage)
  }, [filteredAndSortedItems, itemsPerPage])

  // Get related terms data
  const getRelatedTermsData = useCallback(
    (relatedIds) => {
      if (!relatedIds) return []
      return relatedIds.map((id) => relatedTermsMap[id]).filter((term) => term !== undefined)
    },
    [relatedTermsMap],
  )

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage)
        // Scroll to top of results
        document.querySelector(".library-grid")?.scrollIntoView({ behavior: "smooth" })
      }
    },
    [totalPages],
  )

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchQuery("")
    setCategoryFilter("all")
    setLanguageFilter("all")
    setShowFavoritesOnly(false)
    setSortOption("dateNewest")
    setCurrentPage(1)
  }, [])

  // Get all available languages
  const availableLanguages = useMemo(() => {
    return [
      { code: "en", label: "English" },
      { code: "fr", label: "Français" },
      { code: "ar", label: "العربية" },
    ]
  }, [])

  // Get all categories for the filter dropdown
  const categories = useMemo(() => {
    return Object.keys(categoryMetadata).map((key) => ({
      value: key,
      label: getCategoryLabel(key),
      icon: categoryMetadata[key].icon,
      color: categoryMetadata[key].color,
    }))
  }, [getCategoryLabel])

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Mobile menu handlers
  const closeMobileMenu = () => {
    setMobileOpen(false)
  }

  const openMobileMenu = () => {
    setMobileOpen(true)
  }

  return (
    <div className={`app-container ${darkMode ? "dark" : ""} ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <div className="header-wrapper">
        <Header language={language} setLanguage={setLanguage} darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>

      <div className="content-wrapper">
        <div className={`sidebar-wrapper ${mobileOpen ? "mobile-open" : ""}`}>
          <Sidebar
            collapsed={sidebarCollapsed}
            toggleSidebar={toggleSidebar}
            mobileOpen={mobileOpen}
            closeMobileMenu={closeMobileMenu}
            darkMode={darkMode}
          />
        </div>

        <div className="main-content">
          <button className="mobile-menu-button" onClick={openMobileMenu}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className={`library-container ${currentLanguage === "ar" ? "rtl" : "ltr"}`}>
            <div className="library-header">
              <h2 className="library-title">{getText("myLibrary")}</h2>
              <p className="library-subtitle">{getText("manageItems")}</p>
            </div>

            <div className="library-tabs">
              <button
                className={`tab-button ${activeTab === "terms" ? "active" : ""}`}
                onClick={() => setActiveTab("terms")}
              >
                <span className="tab-icon terms-icon"></span>
                {getText("legalTerms")}
              </button>
              <button
                className={`tab-button ${activeTab === "articles" ? "active" : ""}`}
                onClick={() => setActiveTab("articles")}
              >
                <span className="tab-icon articles-icon"></span>
                {getText("articles")}
              </button>
            </div>

            <div className="library-controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder={getText("searchPlaceholder")}
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="search-icon" size={20} />
              </div>

              <div className="filter-group">
                {/* Category filter */}
                <div className="filter-container">
                  <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">{getText("allItems")}</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <Filter className="filter-icon" size={16} />
                </div>

                {/* Language filter */}
                <div className="filter-container">
                  <select
                    className="filter-select"
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                  >
                    <option value="all">{getText("languageFilter")}</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <Filter className="filter-icon" size={16} />
                </div>

                {/* Sort options */}
                <div className="filter-container">
                  <select className="filter-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="dateNewest">{getText("dateNewest")}</option>
                    <option value="dateOldest">{getText("dateOldest")}</option>
                    <option value="alphabetical">{getText("alphabetical")}</option>
                  </select>
                  <SlidersHorizontal className="filter-icon" size={16} />
                </div>

                {/* Favorites toggle */}
                <button
                  className={`favorites-toggle ${showFavoritesOnly ? "active" : ""}`}
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  aria-label={getText("favorites")}
                >
                  <Heart className="favorites-icon" size={16} />
                  <span>{getText("favorites")}</span>
                </button>

                {/* Reset filters */}
                <button className="reset-filters-button" onClick={resetFilters} aria-label="Reset filters">
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>{getText("loading")}</p>
              </div>
            ) : (
              <>
                <div className="library-grid">
                  {paginatedItems.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon"></div>
                      <h3>{getText("noItemsFound")}</h3>
                      <p>{getText("tryChanging")}</p>
                    </div>
                  ) : (
                    paginatedItems.map((item, index) => (
                      <div
                        key={item.id}
                        className={`library-card ${animateItems ? "animate" : ""} ${
                          expandedItemId === item.id ? "expanded" : ""
                        }`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="card-header">
                          <div
                            className="card-category"
                            style={{
                              backgroundColor: `${categoryMetadata[item.category]?.color}20`,
                            }}
                          >
                            <span className={`category-icon ${item.category}`}></span>
                            {getCategoryLabel(item.category)}
                          </div>
                          <button
                            className={`favorite-button ${item.isFavorite ? "active" : ""}`}
                            onClick={() => toggleFavorite(item.id)}
                            aria-label={item.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart size={20} fill={item.isFavorite ? "currentColor" : "none"} />
                          </button>
                        </div>

                        <h3 className="card-title">{item.title}</h3>

                        {activeTab === "terms" ? (
                          <p className="card-definition">
                            {item.definition?.[currentLanguage] || item.definition?.en || ""}
                          </p>
                        ) : (
                          <>
                            <p className="card-author">
                              {getText("by")} {item.author}
                            </p>
                            <p className="card-abstract">
                              {item.abstract?.[currentLanguage] || item.abstract?.en || ""}
                            </p>
                          </>
                        )}

                        <div className="card-languages">
                          <span className="languages-label">{getText("languages")}:</span>
                          {item.languages.map((lang) => (
                            <span key={lang} className={`language-tag ${lang === currentLanguage ? "current" : ""}`}>
                              {availableLanguages.find((l) => l.code === lang)?.label || lang}
                            </span>
                          ))}
                        </div>

                        {expandedItemId === item.id && item.relatedTerms && (
                          <div className="related-terms">
                            <h4>{getText("relatedTerms")}</h4>
                            <div className="related-terms-list">
                              {getRelatedTermsData(item.relatedTerms).map((term) => (
                                <div key={term.id} className="related-term">
                                  <span className="related-term-title">{term.title}</span>
                                  <span className="related-term-category">{getCategoryLabel(term.category)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="card-footer">
                          <span className="card-date">
                            {activeTab === "terms"
                              ? `${getText("addedOn")} ${item.dateAdded}`
                              : `${getText("publishedOn")} ${item.datePublished}`}
                          </span>

                          <div className="card-actions">
                            <button className="action-button view-button">
                              <Eye size={16} />
                              <span>{getText("view")}</span>
                            </button>
                            <button className="action-button share-button">
                              <Share2 size={16} />
                              <span>{getText("share")}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {totalPages > 1 && (
                  <div className="library-pagination">
                    <button
                      className="pagination-button prev-button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`page-number ${currentPage === page ? "active" : ""}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      className="pagination-button next-button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="footer-wrapper">
        <Footer darkMode={darkMode} setDarkMode={setDarkMode} language={language} />
      </div>
    </div>
  )
}

export default ProfileLibrary

