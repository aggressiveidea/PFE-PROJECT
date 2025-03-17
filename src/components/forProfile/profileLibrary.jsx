"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import "./Library.css";

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
      ar: "بيانات إلكترونية تستخدم لتحديد هوية مرسل الرسالة أو المستند",
    },
    category: "e-commerce",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-03-14",
    isFavorite: true,
    relatedTerms: ["ec-1", "cs-3"],
  },
  {
    id: "ec-3",
    title: "Online Marketplace",
    definition: {
      en: "Digital platform where products or services are provided by multiple third parties",
      fr: "Plateforme numérique où des produits ou services sont fournis par plusieurs tiers",
      ar: "منصة رقمية حيث يتم توفير المنتجات أو الخدمات من قبل أطراف ثالثة متعددة",
    },
    category: "e-commerce",
    languages: ["en", "fr"],
    dateAdded: "2024-03-10",
    isFavorite: false,
    relatedTerms: ["ec-1", "ip-2"],
  },

  // IT Contract Terms
  {
    id: "itc-1",
    title: "Service Level Agreement",
    definition: {
      en: "Contract between a service provider and client specifying performance metrics",
      fr: "Contrat entre un fournisseur de services et un client spécifiant les métriques de performance",
      ar: "عقد بين مزود الخدمة والعميل يحدد مقاييس الأداء",
    },
    category: "it-contract",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-03-12",
    isFavorite: true,
    relatedTerms: ["itc-2", "org-1"],
  },
  {
    id: "itc-2",
    title: "Software License Agreement",
    definition: {
      en: "Legal contract between software developer and user defining usage rights",
      fr: "Contrat juridique entre le développeur de logiciel et l'utilisateur définissant les droits d'utilisation",
      ar: "عقد قانوني بين مطور البرمجيات والمستخدم يحدد حقوق الاستخدام",
    },
    category: "it-contract",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-03-08",
    isFavorite: false,
    relatedTerms: ["itc-1", "ip-1"],
  },

  // Cybercrime Terms
  {
    id: "cc-1",
    title: "Phishing",
    definition: {
      en: "Fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity",
      fr: "Tentative frauduleuse d'obtenir des informations sensibles en se faisant passer pour une entité de confiance",
      ar: "محاولة احتيالية للحصول على معلومات حساسة من خلال التنكر ككيان جدير بالثقة",
    },
    category: "cybercrime",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-03-05",
    isFavorite: true,
    relatedTerms: ["cc-2", "pd-1"],
  },
  {
    id: "cc-2",
    title: "Ransomware",
    definition: {
      en: "Malicious software designed to block access to data until a ransom is paid",
      fr: "Logiciel malveillant conçu pour bloquer l'accès aux données jusqu'au paiement d'une rançon",
      ar: "برمجيات خبيثة مصممة لمنع الوصول إلى البيانات حتى يتم دفع فدية",
    },
    category: "cybercrime",
    languages: ["en", "fr"],
    dateAdded: "2024-03-01",
    isFavorite: false,
    relatedTerms: ["cc-1", "net-2"],
  },
  {
    id: "cc-3",
    title: "DDoS Attack",
    definition: {
      en: "Attempt to make a network resource unavailable by flooding it with traffic",
      fr: "Tentative de rendre une ressource réseau indisponible en l'inondant de trafic",
      ar: "محاولة لجعل مورد الشبكة غير متاح من خلال إغراقه بحركة المرور",
    },
    category: "cybercrime",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-02-28",
    isFavorite: false,
    relatedTerms: ["cc-2", "net-1"],
  },

  // Personal Data Terms
  {
    id: "pd-1",
    title: "GDPR",
    definition: {
      en: "General Data Protection Regulation - EU law on data protection and privacy",
      fr: "Règlement Général sur la Protection des Données - loi européenne sur la protection des données",
      ar: "اللائحة العامة لحماية البيانات - قانون الاتحاد الأوروبي بشأن حماية البيانات والخصوصية",
    },
    category: "personal-data",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-02-25",
    isFavorite: true,
    relatedTerms: ["pd-2", "pd-3"],
  },
  {
    id: "pd-2",
    title: "Data Controller",
    definition: {
      en: "Entity that determines the purposes and means of processing personal data",
      fr: "Entité qui détermine les finalités et les moyens du traitement des données personnelles",
      ar: "الكيان الذي يحدد أغراض ووسائل معالجة البيانات الشخصية",
    },
    category: "personal-data",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-02-20",
    isFavorite: false,
    relatedTerms: ["pd-1", "pd-3"],
  },
  {
    id: "pd-3",
    title: "Data Subject Rights",
    definition: {
      en: "Rights individuals have regarding their personal data under privacy laws",
      fr: "Droits des individus concernant leurs données personnelles en vertu des lois sur la vie privée",
      ar: "حقوق الأفراد فيما يتعلق ببياناتهم الشخصية بموجب قوانين الخصوصية",
    },
    category: "personal-data",
    languages: ["en", "fr"],
    dateAdded: "2024-02-18",
    isFavorite: true,
    relatedTerms: ["pd-1", "pd-2"],
  },

  // Organization Terms
  {
    id: "org-1",
    title: "ICANN",
    definition: {
      en: "Internet Corporation for Assigned Names and Numbers - coordinates domain names",
      fr: "Société pour l'attribution des noms de domaine et des numéros sur Internet",
      ar: "مؤسسة الإنترنت للأسماء والأرقام المخصصة - تنسق أسماء النطاقات",
    },
    category: "organization",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-02-15",
    isFavorite: false,
    relatedTerms: ["org-2", "net-1"],
  },
  {
    id: "org-2",
    title: "ISO/IEC 27001",
    definition: {
      en: "International standard for information security management systems",
      fr: "Norme internationale pour les systèmes de gestion de la sécurité de l'information",
      ar: "معيار دولي لأنظمة إدارة أمن المعلومات",
    },
    category: "organization",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-02-10",
    isFavorite: true,
    relatedTerms: ["org-1", "cc-1"],
  },

  // Intellectual Property Terms
  {
    id: "ip-1",
    title: "Software Patent",
    definition: {
      en: "Legal protection granted to inventions implemented through computer software",
      fr: "Protection juridique accordée aux inventions mises en œuvre par logiciel informatique",
      ar: "حماية قانونية ممنوحة للاختراعات المنفذة من خلال برامج الكمبيوتر",
    },
    category: "intellectual-property",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-02-05",
    isFavorite: false,
    relatedTerms: ["ip-2", "itc-2"],
  },
  {
    id: "ip-2",
    title: "Digital Rights Management",
    definition: {
      en: "Technologies used to control access to copyrighted digital materials",
      fr: "Technologies utilisées pour contrôler l'accès aux matériaux numériques protégés par droit d'auteur",
      ar: "التقنيات المستخدمة للتحكم في الوصول إلى المواد الرقمية المحمية بحقوق النشر",
    },
    category: "intellectual-property",
    languages: ["en", "fr"],
    dateAdded: "2024-02-01",
    isFavorite: true,
    relatedTerms: ["ip-1", "ec-2"],
  },

  // Network Terms
  {
    id: "net-1",
    title: "Net Neutrality",
    definition: {
      en: "Principle that internet service providers should treat all internet data equally",
      fr: "Principe selon lequel les fournisseurs d'accès Internet doivent traiter toutes les données Internet de manière égale",
      ar: "مبدأ أن مزودي خدمة الإنترنت يجب أن يعاملوا جميع بيانات الإنترنت بالتساوي",
    },
    category: "networks",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-01-28",
    isFavorite: true,
    relatedTerms: ["net-2", "org-1"],
  },
  {
    id: "net-2",
    title: "VPN",
    definition: {
      en: "Virtual Private Network - extends a private network across a public network",
      fr: "Réseau Privé Virtuel - étend un réseau privé à travers un réseau public",
      ar: "الشبكة الخاصة الافتراضية - تمتد شبكة خاصة عبر شبكة عامة",
    },
    category: "networks",
    languages: ["en", "fr", "ar"],
    dateAdded: "2024-01-25",
    isFavorite: false,
    relatedTerms: ["net-1", "cc-1"],
  },
];

// Mock articles data
const mockArticlesData = [
  {
    id: "art-1",
    title: "The Impact of GDPR on Global Data Practices",
    author: "Maria Garcia",
    abstract: {
      en: "This article explores how GDPR has influenced data protection worldwide",
      fr: "Cet article explore comment le RGPD a influencé la protection des données dans le monde entier",
      ar: "تستكشف هذه المقالة كيف أثرت اللائحة العامة لحماية البيانات على حماية البيانات في جميع أنحاء العالم",
    },
    category: "personal-data",
    languages: ["en", "fr", "ar"],
    datePublished: "2024-02-15",
    isFavorite: true,
    relatedTerms: ["pd-1", "pd-2", "pd-3"],
  },
  {
    id: "art-2",
    title: "Cybersecurity Challenges in the Digital Age",
    author: "John Smith",
    abstract: {
      en: "An overview of modern cybersecurity threats and mitigation strategies",
      fr: "Un aperçu des menaces modernes de cybersécurité et des stratégies d'atténuation",
      ar: "نظرة عامة على تهديدات الأمن السيبراني الحديثة واستراتيجيات التخفيف",
    },
    category: "cybercrime",
    languages: ["en", "fr", "ar"],
    datePublished: "2024-02-10",
    isFavorite: false,
    relatedTerms: ["cc-1", "cc-2", "cc-3"],
  },
  {
    id: "art-3",
    title: "Digital Rights in the Era of Social Media",
    author: "Ahmed Hassan",
    abstract: {
      en: "How social media platforms impact digital rights and privacy",
      fr: "Comment les plateformes de médias sociaux impactent les droits numériques et la vie privée",
      ar: "كيف تؤثر منصات التواصل الاجتماعي على الحقوق الرقمية والخصوصية",
    },
    category: "intellectual-property",
    languages: ["en", "ar"],
    datePublished: "2024-01-28",
    isFavorite: true,
    relatedTerms: ["ip-2", "pd-1"],
  },
  {
    id: "art-4",
    title: "AI Ethics and Legal Frameworks",
    author: "Sophie Chen",
    abstract: {
      en: "Exploring the ethical considerations in AI regulation",
      fr: "Explorer les considérations éthiques dans la réglementation de l'IA",
      ar: "استكشاف الاعتبارات الأخلاقية في تنظيم الذكاء الاصطناعي",
    },
    category: "it-contract",
    languages: ["en", "fr"],
    datePublished: "2024-01-15",
    isFavorite: false,
    relatedTerms: ["itc-1", "itc-2"],
  },
  {
    id: "art-5",
    title: "E-Commerce Regulations: A Comparative Study",
    author: "Carlos Rodriguez",
    abstract: {
      en: "Comparing e-commerce regulations across different jurisdictions",
      fr: "Comparaison des réglementations du commerce électronique dans différentes juridictions",
      ar: "مقارنة لوائح التجارة الإلكترونية عبر الولايات القضائية المختلفة",
    },
    category: "e-commerce",
    languages: ["en", "fr", "ar"],
    datePublished: "2024-01-10",
    isFavorite: true,
    relatedTerms: ["ec-1", "ec-2", "ec-3"],
  },
  {
    id: "art-6",
    title: "The Future of Network Neutrality",
    author: "Emma Wilson",
    abstract: {
      en: "Examining the evolving landscape of network neutrality regulations",
      fr: "Examen de l'évolution du paysage des réglementations sur la neutralité du réseau",
      ar: "دراسة المشهد المتطور للوائح حيادية الشبكة",
    },
    category: "networks",
    languages: ["en", "fr"],
    datePublished: "2023-12-20",
    isFavorite: false,
    relatedTerms: ["net-1", "net-2"],
  },
];

// Category metadata with icons and translations
const categoryMetadata = {
  "e-commerce": {
    icon: "shopping-cart",
    label: {
      en: "E-Commerce",
      fr: "Commerce Électronique",
      ar: "التجارة الإلكترونية",
    },
    color: "#2749D6",
  },
  "it-contract": {
    icon: "file-contract",
    label: {
      en: "IT Contracts",
      fr: "Contrats IT",
      ar: "عقود تكنولوجيا المعلومات",
    },
    color: "#5F2FD1",
  },
  cybercrime: {
    icon: "shield-virus",
    label: {
      en: "Cybercrime",
      fr: "Cybercriminalité",
      ar: "الجرائم الإلكترونية",
    },
    color: "#8522C7",
  },
  "personal-data": {
    icon: "user-shield",
    label: {
      en: "Personal Data",
      fr: "Données Personnelles",
      ar: "البيانات الشخصية",
    },
    color: "#A324AA",
  },
  organization: {
    icon: "building",
    label: {
      en: "Organizations",
      fr: "Organisations",
      ar: "المنظمات",
    },
    color: "#C2258E",
  },
  "intellectual-property": {
    icon: "copyright",
    label: {
      en: "Intellectual Property",
      fr: "Propriété Intellectuelle",
      ar: "الملكية الفكرية",
    },
    color: "#2749D6",
  },
  networks: {
    icon: "network-wired",
    label: {
      en: "Networks",
      fr: "Réseaux",
      ar: "الشبكات",
    },
    color: "#5F2FD1",
  },
};

// UI text translations
const uiTranslations = {
  en: {
    myLibrary: "My Knowledge Library",
    manageItems: "Manage your saved terms and articles",
    legalTerms: "Legal Terms",
    articles: "Articles",
    searchPlaceholder: "Search...",
    allItems: "All Items",
    favorites: "Favorites",
    noItemsFound: "No items found",
    tryChanging: "Try changing your filter or adding new items to your library",
    addedOn: "Added on",
    publishedOn: "Published on",
    by: "By",
    view: "View",
    share: "Share",
    previous: "Previous",
    next: "Next",
    loading: "Loading your library...",
    languages: "Languages",
    relatedTerms: "Related Terms",
    category: "Category",
    sortBy: "Sort by",
    dateNewest: "Date (Newest)",
    dateOldest: "Date (Oldest)",
    alphabetical: "Alphabetical",
    languageFilter: "Language Filter",
  },
  fr: {
    myLibrary: "Ma Bibliothèque de Connaissances",
    manageItems: "Gérez vos termes et articles sauvegardés",
    legalTerms: "Termes Juridiques",
    articles: "Articles",
    searchPlaceholder: "Rechercher...",
    allItems: "Tous les Éléments",
    favorites: "Favoris",
    noItemsFound: "Aucun élément trouvé",
    tryChanging:
      "Essayez de changer votre filtre ou d'ajouter de nouveaux éléments à votre bibliothèque",
    addedOn: "Ajouté le",
    publishedOn: "Publié le",
    by: "Par",
    view: "Voir",
    share: "Partager",
    previous: "Précédent",
    next: "Suivant",
    loading: "Chargement de votre bibliothèque...",
    languages: "Langues",
    relatedTerms: "Termes Connexes",
    category: "Catégorie",
    sortBy: "Trier par",
    dateNewest: "Date (Plus récent)",
    dateOldest: "Date (Plus ancien)",
    alphabetical: "Alphabétique",
    languageFilter: "Filtre de Langue",
  },
  ar: {
    myLibrary: "مكتبة المعرفة الخاصة بي",
    manageItems: "إدارة المصطلحات والمقالات المحفوظة",
    legalTerms: "المصطلحات القانونية",
    articles: "المقالات",
    searchPlaceholder: "بحث...",
    allItems: "جميع العناصر",
    favorites: "المفضلة",
    noItemsFound: "لم يتم العثور على عناصر",
    tryChanging: "حاول تغيير التصفية أو إضافة عناصر جديدة إلى مكتبتك",
    addedOn: "أضيف في",
    publishedOn: "نشر في",
    by: "بواسطة",
    view: "عرض",
    share: "مشاركة",
    previous: "السابق",
    next: "التالي",
    loading: "جاري تحميل مكتبتك...",
    languages: "اللغات",
    relatedTerms: "مصطلحات ذات صلة",
    category: "الفئة",
    sortBy: "ترتيب حسب",
    dateNewest: "التاريخ (الأحدث)",
    dateOldest: "التاريخ (الأقدم)",
    alphabetical: "أبجدي",
    languageFilter: "تصفية اللغة",
  },
};

const LibraryLogic = () => {
  // State management
  const [activeTab, setActiveTab] = useState("terms"); // 'terms' or 'articles'
  const [currentLanguage, setCurrentLanguage] = useState("en"); // 'en', 'fr', or 'ar'
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortOption, setSortOption] = useState("dateNewest");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animateItems, setAnimateItems] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [relatedTermsMap, setRelatedTermsMap] = useState({});

  const itemsPerPage = 6;

  // Get UI text based on current language
  const getText = useCallback(
    (key) => {
      return uiTranslations[currentLanguage][key] || uiTranslations.en[key];
    },
    [currentLanguage]
  );

  // Get category label based on current language
  const getCategoryLabel = useCallback(
    (categoryKey) => {
      return (
        categoryMetadata[categoryKey]?.label[currentLanguage] || categoryKey
      );
    },
    [currentLanguage]
  );

  // Load initial data
  useEffect(() => {
    setIsLoading(true);
    setAnimateItems(false);

    // Simulate API call with delay
    const timer = setTimeout(() => {
      const sourceData =
        activeTab === "terms" ? mockTermsData : mockArticlesData;
      setItems(sourceData);

      // Build related terms map
      const relatedMap = {};
      mockTermsData.forEach((term) => {
        relatedMap[term.id] = term;
      });
      setRelatedTermsMap(relatedMap);

      setIsLoading(false);
      setCurrentPage(1);

      // Trigger animation after items are loaded
      setTimeout(() => {
        setAnimateItems(true);
      }, 100);
    }, 600);

    return () => clearTimeout(timer);
  }, [activeTab]);

  // Toggle favorite status
  const toggleFavorite = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  }, []);

  // Toggle expanded item for details view
  const toggleExpandItem = useCallback((id) => {
    setExpandedItemId((prevId) => (prevId === id ? null : id));
  }, []);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    // First apply filters
    const result = items.filter((item) => {
      // Search query filter
      const searchInCurrentLanguage = (text) => {
        if (!text) return true;
        return text.toLowerCase().includes(searchQuery.toLowerCase());
      };

      const titleMatch = item.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      let contentMatch = false;
      if (activeTab === "terms" && item.definition) {
        contentMatch = searchInCurrentLanguage(
          item.definition[currentLanguage]
        );
      } else if (activeTab === "articles" && item.abstract) {
        contentMatch = searchInCurrentLanguage(item.abstract[currentLanguage]);
      }

      const matchesSearch = searchQuery === "" || titleMatch || contentMatch;

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      // Language filter
      const matchesLanguage =
        languageFilter === "all" ||
        (item.languages && item.languages.includes(languageFilter));

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || item.isFavorite;

      return (
        matchesSearch && matchesCategory && matchesLanguage && matchesFavorites
      );
    });

    // Then sort
    result.sort((a, b) => {
      switch (sortOption) {
        case "dateNewest":
          const dateA = new Date(
            activeTab === "terms" ? a.dateAdded : a.datePublished
          );
          const dateB = new Date(
            activeTab === "terms" ? b.dateAdded : b.datePublished
          );
          return dateB - dateA;
        case "dateOldest":
          const dateC = new Date(
            activeTab === "terms" ? a.dateAdded : a.datePublished
          );
          const dateD = new Date(
            activeTab === "terms" ? b.dateAdded : b.datePublished
          );
          return dateC - dateD;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [
    items,
    searchQuery,
    categoryFilter,
    languageFilter,
    showFavoritesOnly,
    sortOption,
    activeTab,
    currentLanguage,
  ]);

  // Pagination
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedItems, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  }, [filteredAndSortedItems, itemsPerPage]);

  // Get related terms data
  const getRelatedTermsData = useCallback(
    (relatedIds) => {
      if (!relatedIds) return [];
      return relatedIds
        .map((id) => relatedTermsMap[id])
        .filter((term) => term !== undefined);
    },
    [relatedTermsMap]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
        // Scroll to top of results
        document
          .querySelector(".library-grid")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [totalPages]
  );

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setCategoryFilter("all");
    setLanguageFilter("all");
    setShowFavoritesOnly(false);
    setSortOption("dateNewest");
    setCurrentPage(1);
  }, []);

  // Get all available languages
  const availableLanguages = useMemo(() => {
    return [
      { code: "en", label: "English" },
      { code: "fr", label: "Français" },
      { code: "ar", label: "العربية" },
    ];
  }, []);

  // Get all categories for the filter dropdown
  const categories = useMemo(() => {
    return Object.keys(categoryMetadata).map((key) => ({
      value: key,
      label: getCategoryLabel(key),
      icon: categoryMetadata[key].icon,
      color: categoryMetadata[key].color,
    }));
  }, [getCategoryLabel]);

  return (
    <div
      className={`library-container ${
        currentLanguage === "ar" ? "rtl" : "ltr"
      }`}
    >
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
          <span className="search-icon"></span>
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
            <span className="filter-icon category-filter-icon"></span>
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
            <span className="filter-icon language-filter-icon"></span>
          </div>

          {/* Sort options */}
          <div className="filter-container">
            <select
              className="filter-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="dateNewest">{getText("dateNewest")}</option>
              <option value="dateOldest">{getText("dateOldest")}</option>
              <option value="alphabetical">{getText("alphabetical")}</option>
            </select>
            <span className="filter-icon sort-icon"></span>
          </div>

          {/* Favorites toggle */}
          <button
            className={`favorites-toggle ${showFavoritesOnly ? "active" : ""}`}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            aria-label={getText("favorites")}
          >
            <span className="favorites-icon"></span>
            {getText("favorites")}
          </button>

          {/* Reset filters */}
          <button className="reset-filters-button" onClick={resetFilters}>
            <span className="reset-icon"></span>
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
                        backgroundColor: `${
                          categoryMetadata[item.category]?.color
                        }20`,
                      }}
                    >
                      <span className={`category-icon ${item.category}`}></span>
                      {getCategoryLabel(item.category)}
                    </div>
                    <button
                      className={`favorite-button ${
                        item.isFavorite ? "active" : ""
                      }`}
                      onClick={() => toggleFavorite(item.id)}
                      aria-label={
                        item.isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <span className="favorite-icon"></span>
                    </button>
                  </div>

                  <h3 className="card-title">{item.title}</h3>

                  {activeTab === "terms" ? (
                    <p className="card-definition">
                      {item.definition?.[currentLanguage] ||
                        item.definition?.en ||
                        ""}
                    </p>
                  ) : (
                    <>
                      <p className="card-author">
                        {getText("by")} {item.author}
                      </p>
                      <p className="card-abstract">
                        {item.abstract?.[currentLanguage] ||
                          item.abstract?.en ||
                          ""}
                      </p>
                    </>
                  )}

                  <div className="card-languages">
                    <span className="languages-label">
                      {getText("languages")}:
                    </span>
                    {item.languages.map((lang) => (
                      <span
                        key={lang}
                        className={`language-tag ${
                          lang === currentLanguage ? "current" : ""
                        }`}
                      >
                        {availableLanguages.find((l) => l.code === lang)
                          ?.label || lang}
                      </span>
                    ))}
                  </div>

                  {expandedItemId === item.id && item.relatedTerms && (
                    <div className="related-terms">
                      <h4>{getText("relatedTerms")}</h4>
                      <div className="related-terms-list">
                        {getRelatedTermsData(item.relatedTerms).map((term) => (
                          <div key={term.id} className="related-term">
                            <span className="related-term-title">
                              {term.title}
                            </span>
                            <span className="related-term-category">
                              {getCategoryLabel(term.category)}
                            </span>
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
                        <span className="button-icon view-icon"></span>
                        {getText("view")}
                      </button>
                      <button className="action-button share-button">
                        <span className="button-icon share-icon"></span>
                        {getText("share")}
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
                <span className="pagination-icon prev-icon"></span>
                {getText("previous")}
              </button>
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`page-number ${
                        currentPage === page ? "active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                className="pagination-button next-button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {getText("next")}
                <span className="pagination-icon next-icon"></span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LibraryLogic;
