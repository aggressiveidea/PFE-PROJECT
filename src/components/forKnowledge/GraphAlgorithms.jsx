import { useState } from "react";
import {
  Network,
  Database,
  Zap,
  Cpu,
  ShoppingCart,
  FileText,
  Server,
  Globe,
} from "lucide-react";
import AlgorithmModal from "./AlgorithmModal";
import "./GraphAlgorithms.css";

const GraphAlgorithmsEnhanced = ({
  language = "english",
  onAlgorithmSelect,
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [selectedScope, setSelectedScope] = useState("complete");
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [selectedClusterType, setSelectedClusterType] = useState(null);
  const [selectedDefinitionLevel, setSelectedDefinitionLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [
    showResults, setShowResults
  ] = useState(false);
  const [
    appliedAlgorithmResult, setAppliedAlgorithmResult
  ] = useState(null);

  // Mock data for filtering counts
  const filterCounts = {
    categories: {
      "Computer Crime": 8,
      "Personal Data": 12,
      "Electronic Commerce": 6,
      Organization: 15,
      Networks: 22,
      "Intellectual Property": 9,
      Miscellaneous: 18,
      "Computer Science": 25,
    },
    definitions: {
      Primary: 45,
      Secondary: 32,
    },
    terms: 115,
  };

  // Translations
  const translations = {
    english: {
      title: "Graph Algorithms",
      subtitle: "Explore terms and concepts powered by Neo4j graph technology",
      primaryProvision: "Primary Algorithm",
      applyTo: "Apply to:",
      completeGraph: "Complete Graph",
      lastResearch: "Last Research",
      clustering: "Clustering",
      custom: "Custom",
      apply: "Apply Algorithm",
      close: "Close",
      complexity: "Complexity",
      time: "Time:",
      space: "Space:",
      howItWorks: "How It Works",
      applications: "Applications",
      examples: "Examples",
      beforeExample: "Before Algorithm",
      afterExample: "After Algorithm",
      byCategory: "By Category",
      byDefinition: "By Definition",
      firstLevel: "First Level",
      secondLevel: "Second Level",
      searchPlaceholder: "Search algorithms...",
      filters: "Filters",
      categories: "Categories",
      definitions: "Definitions",
      terms: "Terms",
      showAll: "Show All",
      networkTypes: {
        networks: "Networks",
        data: "Data",
        electrical: "Electrical",
        computer: "Computer",
        ecommerce: "E-Commerce",
        security: "Security",
        cloud: "Cloud",
        internet: "Internet",
      },
      algorithmCategories: {
        all: "All Categories",
        centrality: "Centrality",
        community: "Community Detection",
        pathfinding: "Path Finding",
        structure: "Structure Analysis",
        optimization: "Optimization",
        clustering: "Clustering",
      },
      applicationScopes: {
        complete: "Complete Graph",
        lastResearch: "Last Research",
        clusters: "Clusters",
        terms: "Terms",
        definitions: "Definitions",
        categories: "Categories",
      },
    },
    french: {
      title: "Graphe de Connaissances",
      subtitle:
        "Explorez les termes et concepts alimentés par la technologie de graphe Neo4j",
      primaryProvision: "Algorithme Principal",
      applyTo: "Appliquer à:",
      completeGraph: "Graphe Complet",
      lastResearch: "Dernière Recherche",
      clustering: "Regroupement",
      custom: "Personnalisé",
      apply: "Appliquer l'Algorithme",
      close: "Fermer",
      complexity: "Complexité",
      time: "Temps:",
      space: "Espace:",
      howItWorks: "Comment Ça Marche",
      applications: "Applications",
      examples: "Exemples",
      beforeExample: "Avant l'Algorithme",
      afterExample: "Après l'Algorithme",
      byCategory: "Par Catégorie",
      byDefinition: "Par Définition",
      firstLevel: "Premier Niveau",
      secondLevel: "Deuxième Niveau",
      searchPlaceholder: "Rechercher des algorithmes...",
      filters: "Filtres",
      categories: "Catégories",
      definitions: "Définitions",
      terms: "Termes",
      showAll: "Tout Afficher",
      networkTypes: {
        networks: "Réseaux",
        data: "Données",
        electrical: "Électrique",
        computer: "Informatique",
        ecommerce: "Commerce Électronique",
        security: "Sécurité",
        cloud: "Cloud",
        internet: "Internet",
      },
      algorithmCategories: {
        all: "Toutes les Catégories",
        centrality: "Centralité",
        community: "Détection de Communauté",
        pathfinding: "Recherche de Chemin",
        structure: "Analyse de Structure",
        optimization: "Optimisation",
        clustering: "Regroupement",
      },
      applicationScopes: {
        complete: "Graphe Complet",
        lastResearch: "Dernière Recherche",
        clusters: "Clusters",
        terms: "Termes",
        definitions: "Définitions",
        categories: "Catégories",
      },
    },
    arabic: {
      title: "رسم المعرفة البياني",
      subtitle:
        "استكشف المصطلحات والمفاهيم المدعومة بتقنية الرسم البياني Neo4j",
      primaryProvision: "الخوارزمية الرئيسية",
      applyTo: "تطبيق على:",
      completeGraph: "الرسم البياني الكامل",
      lastResearch: "آخر بحث",
      clustering: "التجميع",
      custom: "مخصص",
      apply: "تطبيق الخوارزمية",
      close: "إغلاق",
      complexity: "التعقيد",
      time: "الوقت:",
      space: "المساحة:",
      howItWorks: "كيف تعمل",
      applications: "التطبيقات",
      examples: "أمثلة",
      beforeExample: "قبل الخوارزمية",
      afterExample: "بعد الخوارزمية",
      byCategory: "حسب الفئة",
      byDefinition: "حسب التعريف",
      firstLevel: "المستوى الأول",
      secondLevel: "المستوى الثاني",
      searchPlaceholder: "البحث عن الخوارزميات...",
      filters: "المرشحات",
      categories: "الفئات",
      definitions: "التعريفات",
      terms: "المصطلحات",
      showAll: "إظهار الكل",
      networkTypes: {
        networks: "الشبكات",
        data: "البيانات",
        electrical: "الكهربائية",
        computer: "الحاسوب",
        ecommerce: "التجارة الإلكترونية",
        security: "الأمن",
        cloud: "السحابة",
        internet: "الإنترنت",
      },
      algorithmCategories: {
        all: "جميع الفئات",
        centrality: "المركزية",
        community: "اكتشاف المجتمع",
        pathfinding: "إيجاد المسار",
        structure: "تحليل البنية",
        optimization: "التحسين",
        clustering: "التجميع",
      },
      applicationScopes: {
        complete: "الرسم البياني الكامل",
        lastResearch: "آخر بحث",
        clusters: "المجموعات",
        terms: "المصطلحات",
        definitions: "التعريفات",
        categories: "الفئات",
      },
    },
  };

  const t = translations[language] || translations.english;

  // Real graph data for examples
  const graphExamples = {
    pagerank: {
      before: {
        nodes: [
          { id: 1, x: 50, y: 30, size: 8, color: "#8B5CF6" },
          { id: 2, x: 100, y: 30, size: 8, color: "#8B5CF6" },
          { id: 3, x: 150, y: 30, size: 8, color: "#8B5CF6" },
          { id: 4, x: 75, y: 80, size: 8, color: "#8B5CF6" },
          { id: 5, x: 125, y: 80, size: 8, color: "#8B5CF6" },
        ],
        edges: [
          { source: 1, target: 2, color: "#ccc", width: 2 },
          { source: 2, target: 3, color: "#ccc", width: 2 },
          { source: 1, target: 4, color: "#ccc", width: 2 },
          { source: 2, target: 4, color: "#ccc", width: 2 },
          { source: 2, target: 5, color: "#ccc", width: 2 },
          { source: 3, target: 5, color: "#ccc", width: 2 },
        ],
      },
      after: {
        nodes: [
          { id: 1, x: 50, y: 30, size: 6, color: "#EC4899" },
          { id: 2, x: 100, y: 30, size: 12, color: "#EF4444" },
          { id: 3, x: 150, y: 30, size: 8, color: "#10B981" },
          { id: 4, x: 75, y: 80, size: 10, color: "#F59E0B" },
          { id: 5, x: 125, y: 80, size: 7, color: "#3B82F6" },
        ],
        edges: [
          { source: 1, target: 2, color: "#EF4444", width: 3 },
          { source: 2, target: 3, color: "#10B981", width: 2 },
          { source: 1, target: 4, color: "#F59E0B", width: 2 },
          { source: 2, target: 4, color: "#EF4444", width: 3 },
          { source: 2, target: 5, color: "#3B82F6", width: 2 },
          { source: 3, target: 5, color: "#3B82F6", width: 2 },
        ],
      },
    },
    betweenness: {
      before: {
        nodes: [
          { id: 1, x: 30, y: 30, size: 8, color: "#8B5CF6" },
          { id: 2, x: 90, y: 30, size: 8, color: "#8B5CF6" },
          { id: 3, x: 150, y: 30, size: 8, color: "#8B5CF6" },
          { id: 4, x: 30, y: 90, size: 8, color: "#8B5CF6" },
          { id: 5, x: 90, y: 90, size: 8, color: "#8B5CF6" },
          { id: 6, x: 150, y: 90, size: 8, color: "#8B5CF6" },
        ],
        edges: [
          { source: 1, target: 2, color: "#ccc", width: 2 },
          { source: 2, target: 3, color: "#ccc", width: 2 },
          { source: 4, target: 5, color: "#ccc", width: 2 },
          { source: 5, target: 6, color: "#ccc", width: 2 },
          { source: 2, target: 5, color: "#ccc", width: 2 },
        ],
      },
      after: {
        nodes: [
          { id: 1, x: 30, y: 30, size: 6, color: "#3B82F6" },
          { id: 2, x: 90, y: 30, size: 14, color: "#EF4444" },
          { id: 3, x: 150, y: 30, size: 6, color: "#3B82F6" },
          { id: 4, x: 30, y: 90, size: 6, color: "#3B82F6" },
          { id: 5, x: 90, y: 90, size: 14, color: "#EF4444" },
          { id: 6, x: 150, y: 90, size: 6, color: "#3B82F6" },
        ],
        edges: [
          { source: 1, target: 2, color: "#3B82F6", width: 2 },
          { source: 2, target: 3, color: "#3B82F6", width: 2 },
          { source: 4, target: 5, color: "#3B82F6", width: 2 },
          { source: 5, target: 6, color: "#3B82F6", width: 2 },
          { source: 2, target: 5, color: "#EF4444", width: 4 },
        ],
      },
    },
    louvain: {
      before: {
        nodes: [
          { id: 1, x: 50, y: 30, size: 8, color: "#8B5CF6" },
          { id: 2, x: 90, y: 30, size: 8, color: "#8B5CF6" },
          { id: 3, x: 130, y: 30, size: 8, color: "#8B5CF6" },
          { id: 4, x: 50, y: 70, size: 8, color: "#8B5CF6" },
          { id: 5, x: 90, y: 70, size: 8, color: "#8B5CF6" },
          { id: 6, x: 130, y: 70, size: 8, color: "#8B5CF6" },
          { id: 7, x: 170, y: 50, size: 8, color: "#8B5CF6" },
          { id: 8, x: 210, y: 50, size: 8, color: "#8B5CF6" },
        ],
        edges: [
          { source: 1, target: 2, color: "#ccc", width: 2 },
          { source: 1, target: 4, color: "#ccc", width: 2 },
          { source: 1, target: 5, color: "#ccc", width: 2 },
          { source: 2, target: 3, color: "#ccc", width: 2 },
          { source: 2, target: 5, color: "#ccc", width: 2 },
          { source: 3, target: 6, color: "#ccc", width: 2 },
          { source: 4, target: 5, color: "#ccc", width: 2 },
          { source: 5, target: 6, color: "#ccc", width: 2 },
          { source: 6, target: 7, color: "#ccc", width: 2 },
          { source: 7, target: 8, color: "#ccc", width: 2 },
        ],
      },
      after: {
        nodes: [
          { id: 1, x: 50, y: 30, size: 8, color: "#EF4444" },
          { id: 2, x: 90, y: 30, size: 8, color: "#EF4444" },
          { id: 3, x: 130, y: 30, size: 8, color: "#10B981" },
          { id: 4, x: 50, y: 70, size: 8, color: "#EF4444" },
          { id: 5, x: 90, y: 70, size: 8, color: "#EF4444" },
          { id: 6, x: 130, y: 70, size: 8, color: "#10B981" },
          { id: 7, x: 170, y: 50, size: 8, color: "#3B82F6" },
          { id: 8, x: 210, y: 50, size: 8, color: "#3B82F6" },
        ],
        edges: [
          { source: 1, target: 2, color: "#EF4444", width: 2 },
          { source: 1, target: 4, color: "#EF4444", width: 2 },
          { source: 1, target: 5, color: "#EF4444", width: 2 },
          { source: 2, target: 3, color: "#ccc", width: 1 },
          { source: 2, target: 5, color: "#EF4444", width: 2 },
          { source: 3, target: 6, color: "#10B981", width: 2 },
          { source: 4, target: 5, color: "#EF4444", width: 2 },
          { source: 5, target: 6, color: "#ccc", width: 1 },
          { source: 6, target: 7, color: "#ccc", width: 1 },
          { source: 7, target: 8, color: "#3B82F6", width: 2 },
        ],
      },
    },
    dijkstra: {
      before: {
        nodes: [
          { id: 1, x: 30, y: 30, size: 8, color: "#8B5CF6" },
          { id: 2, x: 90, y: 30, size: 8, color: "#8B5CF6" },
          { id: 3, x: 150, y: 30, size: 8, color: "#8B5CF6" },
          { id: 4, x: 30, y: 90, size: 8, color: "#8B5CF6" },
          { id: 5, x: 90, y: 90, size: 8, color: "#8B5CF6" },
          { id: 6, x: 150, y: 90, size: 8, color: "#8B5CF6" },
        ],
        edges: [
          { source: 1, target: 2, color: "#ccc", width: 2 },
          { source: 1, target: 4, color: "#ccc", width: 2 },
          { source: 2, target: 3, color: "#ccc", width: 2 },
          { source: 2, target: 5, color: "#ccc", width: 2 },
          { source: 3, target: 6, color: "#ccc", width: 2 },
          { source: 4, target: 5, color: "#ccc", width: 2 },
          { source: 5, target: 6, color: "#ccc", width: 2 },
        ],
      },
      after: {
        nodes: [
          { id: 1, x: 30, y: 30, size: 10, color: "#EF4444" },
          { id: 2, x: 90, y: 30, size: 8, color: "#F59E0B" },
          { id: 3, x: 150, y: 30, size: 8, color: "#10B981" },
          { id: 4, x: 30, y: 90, size: 8, color: "#8B5CF6" },
          { id: 5, x: 90, y: 90, size: 8, color: "#8B5CF6" },
          { id: 6, x: 150, y: 90, size: 10, color: "#EF4444" },
        ],
        edges: [
          { source: 1, target: 2, color: "#F59E0B", width: 3 },
          { source: 1, target: 4, color: "#ccc", width: 1 },
          { source: 2, target: 3, color: "#10B981", width: 3 },
          { source: 2, target: 5, color: "#ccc", width: 1 },
          { source: 3, target: 6, color: "#EF4444", width: 3 },
          { source: 4, target: 5, color: "#ccc", width: 1 },
          { source: 5, target: 6, color: "#ccc", width: 1 },
        ],
      },
    },
  };

  // Enhanced algorithms with more examples
  const algorithms = [
    {
      id: "pagerank",
      name: {
        english: "PageRank",
        french: "PageRank",
        arabic: "خوارزمية تصنيف الصفحات",
      },
      category: "centrality",
      categoryLabel: {
        english: "CENTRALITY",
        french: "CENTRALITÉ",
        arabic: "المركزية",
      },
      description: {
        english:
          "Measures the importance of each node based on the structure of incoming links",
        french:
          "Mesure l'importance de chaque nœud en fonction de la structure des liens entrants",
        arabic: "تقيس أهمية كل عقدة بناءً على هيكل الروابط الواردة",
      },
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(n)",
      howItWorks: {
        english:
          "PageRank assigns a numerical weight to each node in a graph, with the purpose of measuring its relative importance within the set. The algorithm works by counting the number and quality of links to a page to determine a rough estimate of how important the website is.",
        french:
          "PageRank attribue un poids numérique à chaque nœud d'un graphe, dans le but de mesurer son importance relative au sein de l'ensemble. L'algorithme fonctionne en comptant le nombre et la qualité des liens vers une page.",
        arabic:
          "تخصص خوارزمية PageRank وزنًا رقميًا لكل عقدة في الرسم البياني، بهدف قياس أهميتها النسبية ضمن المجموعة.",
      },
      applications: {
        english: [
          "Web search ranking",
          "Social network analysis",
          "Citation analysis in academic papers",
          "Recommendation systems",
        ],
        french: [
          "Classement des recherches Web",
          "Analyse des réseaux sociaux",
          "Analyse des citations dans les articles académiques",
          "Systèmes de recommandation",
        ],
        arabic: [
          "ترتيب نتائج البحث على الويب",
          "تحليل الشبكات الاجتماعية",
          "تحليل الاستشهادات في الأوراق الأكاديمية",
          "أنظمة التوصية",
        ],
      },
      before: graphExamples.pagerank.before,
      after: graphExamples.pagerank.after,
      overview:
        "PageRank is a link analysis algorithm used by Google Search to rank web pages in their search engine results. It works by counting the number and quality of links to a page to determine a rough estimate of how important the website is.",
    },
    {
      id: "betweenness",
      name: {
        english: "Betweenness Centrality",
        french: "Centralité d'Intermédiarité",
        arabic: "المركزية البينية",
      },
      category: "centrality",
      categoryLabel: {
        english: "CENTRALITY",
        french: "CENTRALITÉ",
        arabic: "المركزية",
      },
      description: {
        english:
          "Identifies nodes that act as bridges between different parts of a graph",
        french:
          "Identifie les nœuds qui agissent comme des ponts entre différentes parties d'un graphe",
        arabic: "تحدد العقد التي تعمل كجسور بين أجزاء مختلفة من الرسم البياني",
      },
      timeComplexity: "O(n³)",
      spaceComplexity: "O(n² + m)",
      howItWorks: {
        english:
          "Betweenness centrality is calculated by finding the shortest paths between all pairs of nodes in a graph and then counting how many of these paths pass through each node.",
        french:
          "La centralité d'intermédiarité est calculée en trouvant les chemins les plus courts entre toutes les paires de nœuds dans un graphe.",
        arabic:
          "يتم حساب المركزية البينية من خلال إيجاد أقصر المسارات بين جميع أزواج العقد في الرسم البياني.",
      },
      applications: {
        english: [
          "Identifying influential individuals in social networks",
          "Finding bottlenecks in transportation networks",
          "Detecting community bridges in networks",
          "Network vulnerability analysis",
        ],
        french: [
          "Identification des individus influents dans les réseaux sociaux",
          "Recherche de goulots d'étranglement dans les réseaux de transport",
          "Détection des ponts communautaires dans les réseaux",
          "Analyse de la vulnérabilité du réseau",
        ],
        arabic: [
          "تحديد الأفراد المؤثرين في الشبكات الاجتماعية",
          "العثور على نقاط الاختناق في شبكات النقل",
          "اكتشاف جسور المجتمع في الشبكات",
          "تحليل نقاط ضعف الشبكة",
        ],
      },
      before: graphExamples.betweenness.before,
      after: graphExamples.betweenness.after,
      overview:
        "Betweenness centrality measures the extent to which a node lies on paths between other nodes. Nodes with high betweenness may have considerable influence within a network by virtue of their control over information passing between others.",
    },
    {
      id: "closeness",
      name: {
        english: "Closeness Centrality",
        french: "Centralité de Proximité",
        arabic: "مركزية التقارب",
      },
      category: "centrality",
      categoryLabel: {
        english: "CENTRALITY",
        french: "CENTRALITÉ",
        arabic: "المركزية",
      },
      description: {
        english:
          "Measures the average distance from each node to all other nodes in the graph",
        french:
          "Mesure la distance moyenne de chaque nœud à tous les autres nœuds du graphe",
        arabic:
          "يقيس متوسط المسافة من كل عقدة إلى جميع العقد الأخرى في الرسم البياني",
      },
      timeComplexity: "O(n²)",
      spaceComplexity: "O(n²)",
      howItWorks: {
        english:
          "Closeness centrality calculates the sum of the shortest distances between a node and all other nodes in the graph. A node with a high closeness centrality has short distances to all other nodes.",
        french:
          "La centralité de proximité calcule la somme des distances les plus courtes entre un nœud et tous les autres nœuds du graphe.",
        arabic:
          "تحسب مركزية التقارب مجموع أقصر المسافات بين عقدة وجميع العقد الأخرى في الرسم البياني. العقدة ذات مركزية التقارب العالية لديها مسافات قصيرة إلى جميع العقد الأخرى.",
      },
      applications: {
        english: [
          "Identifying key influencers in a network",
          "Finding central locations in a transportation network",
          "Analyzing information flow in social networks",
        ],
        french: [
          "Identifier les influenceurs clés dans un réseau",
          "Trouver des emplacements centraux dans un réseau de transport",
          "Analyser le flux d'informations dans les réseaux sociaux",
        ],
        arabic: [
          "تحديد المؤثرين الرئيسيين في الشبكة",
          "إيجاد المواقع المركزية في شبكة النقل",
          "تحليل تدفق المعلومات في الشبكات الاجتماعية",
        ],
      },
      before: graphExamples.pagerank.before,
      after: graphExamples.pagerank.after,
      overview:
        "Closeness centrality measures how close a node is to all other nodes in the network. It is calculated as the reciprocal of the sum of the shortest path distances from a node to all other nodes in the graph.",
    },
    {
      id: "degree",
      name: {
        english: "Degree Centrality",
        french: "Centralité de Degré",
        arabic: "مركزية الدرجة",
      },
      category: "centrality",
      categoryLabel: {
        english: "CENTRALITY",
        french: "CENTRALITÉ",
        arabic: "المركزية",
      },
      description: {
        english: "Measures the number of connections a node has",
        french: "Mesure le nombre de connexions qu'un nœud possède",
        arabic: "يقيس عدد الاتصالات التي تمتلكها العقدة",
      },
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      howItWorks: {
        english:
          "Degree centrality is simply the count of how many connections (edges) a node has. In a directed graph, we can differentiate between in-degree (incoming connections) and out-degree (outgoing connections).",
        french:
          "La centralité de degré est simplement le nombre de connexions (arêtes) qu'un nœud possède. Dans un graphe orienté, nous pouvons différencier le degré entrant (connexions entrantes) et le degré sortant (connexions sortantes).",
        arabic:
          "مركزية الدرجة هي ببساطة عدد الاتصالات (الحواف) التي تمتلكها العقدة. في الرسم البياني الموجه، يمكننا التمييز بين الدرجة الداخلية (الاتصالات الواردة) والدرجة الخارجية (الاتصالات الصادرة).",
      },
      applications: {
        english: [
          "Identifying popular users in social networks",
          "Finding important nodes in a network",
          "Analyzing network connectivity",
        ],
        french: [
          "Identifier les utilisateurs populaires dans les réseaux sociaux",
          "Trouver les nœuds importants dans un réseau",
          "Analyser la connectivité du réseau",
        ],
        arabic: [
          "تحديد المستخدمين المشهورين في الشبكات الاجتماعية",
          "إيجاد العقد المهمة في الشبكة",
          "تحليل اتصال الشبكة",
        ],
      },
      before: graphExamples.pagerank.before,
      after: graphExamples.pagerank.after,
      overview:
        "Degree centrality is the simplest measure of node connectivity. It equals the number of edges that a node has. In directed networks, we can define indegree (number of incoming edges) and outdegree (number of outgoing edges).",
    },
    {
      id: "louvain",
      name: {
        english: "Louvain Community Detection",
        french: "Détection de Communauté Louvain",
        arabic: "اكتشاف المجتمع لوفان",
      },
      category: "community",
      categoryLabel: {
        english: "COMMUNITY DETECTION",
        french: "DÉTECTION DE COMMUNAUTÉ",
        arabic: "اكتشاف المجتمع",
      },
      description: {
        english:
          "Identifies groups of nodes that are more densely connected to each other than to the rest of the network",
        french:
          "Identifie des groupes de nœuds qui sont plus densément connectés entre eux qu'au reste du réseau",
        arabic:
          "تحدد مجموعات من العقد التي ترتبط ببعضها البعض بشكل أكثر كثافة من بقية الشبكة",
      },
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n + m)",
      howItWorks: {
        english:
          "The Louvain method works in two phases that are repeated iteratively. First, it optimizes modularity locally by moving nodes between communities. Then, it aggregates nodes of the same community.",
        french:
          "La méthode de Louvain fonctionne en deux phases qui sont répétées de manière itérative. Elle optimise la modularité localement en déplaçant les nœuds entre les communautés.",
        arabic:
          "تعمل طريقة Louvain في مرحلتين يتم تكرارهما بشكل متكرر. تقوم بتحسين النمطية محليًا عن طريق نقل العقد بين المجتمعات.",
      },
      applications: {
        english: [
          "Social network analysis",
          "Customer segmentation",
          "Recommendation systems",
          "Biological network analysis",
        ],
        french: [
          "Analyse des réseaux sociaux",
          "Segmentation des clients",
          "Systèmes de recommandation",
          "Analyse des réseaux biologiques",
        ],
        arabic: [
          "تحليل الشبكات الاجتماعية",
          "تقسيم العملاء",
          "أنظمة التوصية",
          "تحليل الشبكات البيولوجية",
        ],
      },
      before: graphExamples.louvain.before,
      after: graphExamples.louvain.after,
      overview:
        "The Louvain method is a fast algorithm for community detection in large networks. It optimizes modularity, which measures the density of connections within communities compared to connections between communities.",
    },
    {
      id: "labelpropagation",
      name: {
        english: "Label Propagation",
        french: "Propagation d'Étiquettes",
        arabic: "انتشار التسمية",
      },
      category: "community",
      categoryLabel: {
        english: "COMMUNITY DETECTION",
        french: "DÉTECTION DE COMMUNAUTÉ",
        arabic: "اكتشاف المجتمع",
      },
      description: {
        english:
          "A fast algorithm for finding community structure in large networks",
        french:
          "Un algorithme rapide pour trouver la structure communautaire dans les grands réseaux",
        arabic: "خوارزمية سريعة لإيجاد هيكل المجتمع في الشبكات الكبيرة",
      },
      timeComplexity: "O(m)",
      spaceComplexity: "O(n)",
      howItWorks: {
        english:
          "Label Propagation works by initially assigning a unique label to each node and then iteratively updating the label of each node to be the one that the majority of its neighbors have.",
        french:
          "La propagation d'étiquettes fonctionne en attribuant initialement une étiquette unique à chaque nœud, puis en mettant à jour itérativement l'étiquette de chaque nœud.",
        arabic:
          "يعمل انتشار التسمية عن طريق تعيين تسمية فريدة لكل عقدة في البداية، ثم تحديث تسمية كل عقدة بشكل متكرر لتكون هي التسمية التي تمتلكها غالبية جيرانها.",
      },
      applications: {
        english: [
          "Identifying communities in social networks",
          "Analyzing social influence",
          "Detecting fraud in financial networks",
        ],
        french: [
          "Identifier les communautés dans les réseaux sociaux",
          "Analyser l'influence sociale",
          "Détecter la fraude dans les réseaux financiers",
        ],
        arabic: [
          "تحديد المجتمعات في الشبكات الاجتماعية",
          "تحليل التأثير الاجتماعي",
          "اكتشاف الاحتيال في الشبكات المالية",
        ],
      },
      before: graphExamples.louvain.before,
      after: graphExamples.louvain.after,
      overview:
        "Label Propagation is a semi-supervised machine learning algorithm that assigns labels to previously unlabeled data points. It works by propagating labels through the network based on the principle that connected nodes are likely to have the same label.",
    },
    {
      id: "wcc",
      name: {
        english: "Weakly Connected Components",
        french: "Composantes Connexes Faibles",
        arabic: "المكونات المتصلة ضعيفة",
      },
      category: "structure",
      categoryLabel: {
        english: "STRUCTURE ANALYSIS",
        french: "ANALYSE DE STRUCTURE",
        arabic: "تحليل البنية",
      },
      description: {
        english:
          "Finds sets of nodes that are reachable from each other, ignoring direction of edges",
        french:
          "Trouve des ensembles de nœuds qui sont accessibles les uns aux autres, en ignorant la direction des arêtes",
        arabic:
          "يجد مجموعات من العقد التي يمكن الوصول إليها من بعضها البعض، مع تجاهل اتجاه الحواف",
      },
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(n)",
      howItWorks: {
        english:
          "Weakly Connected Components identifies components by traversing the graph as if all edges were undirected.",
        french:
          "Les composantes connexes faibles identifient les composantes en parcourant le graphe comme si toutes les arêtes étaient non orientées.",
        arabic:
          "تحدد المكونات المتصلة ضعيفة المكونات عن طريق اجتياز الرسم البياني كما لو كانت جميع الحواف غير موجهة.",
      },
      applications: {
        english: [
          "Network partitioning",
          "Identifying disconnected subgraphs",
          "Analyzing network resilience",
        ],
        french: [
          "Partitionnement de réseau",
          "Identifier les sous-graphes déconnectés",
          "Analyser la résilience du réseau",
        ],
        arabic: [
          "تقسيم الشبكة",
          "تحديد الرسوم البيانية الفرعية المنفصلة",
          "تحليل مرونة الشبكة",
        ],
      },
      before: graphExamples.louvain.before,
      after: graphExamples.louvain.after,
      overview:
        "Weakly Connected Components finds subgraphs where all nodes are connected to each other by some path, ignoring the direction of edges. This is useful for identifying isolated parts of a directed graph.",
    },
    {
      id: "dijkstra",
      name: {
        english: "Dijkstra's Shortest Path",
        french: "Plus Court Chemin de Dijkstra",
        arabic: "أقصر مسار لديكسترا",
      },
      category: "pathfinding",
      categoryLabel: {
        english: "PATH FINDING",
        french: "RECHERCHE DE CHEMIN",
        arabic: "إيجاد المسار",
      },
      description: {
        english: "Finds the shortest path between two nodes in a graph",
        french:
          "Trouve le chemin le plus court entre deux nœuds dans un graphe",
        arabic: "يجد أقصر مسار بين عقدتين في الرسم البياني",
      },
      timeComplexity: "O(m + n log n)",
      spaceComplexity: "O(n)",
      howItWorks: {
        english:
          "Dijkstra's algorithm works by maintaining a set of nodes whose shortest distance from the source is already known. It starts with the source node and gradually includes more nodes.",
        french:
          "L'algorithme de Dijkstra fonctionne en maintenant un ensemble de nœuds dont la distance la plus courte depuis la source est déjà connue.",
        arabic:
          "تعمل خوارزمية Dijkstra عن طريق الاحتفاظ بمجموعة من العقد التي تكون أقصر مسافة لها من المصدر معروفة بالفعل.",
      },
      applications: {
        english: [
          "Navigation and route planning",
          "Network routing protocols",
          "Flight scheduling",
          "Resource allocation",
        ],
        french: [
          "Navigation et planification d'itinéraire",
          "Protocoles de routage réseau",
          "Planification des vols",
          "Allocation des ressources",
        ],
        arabic: [
          "التنقل وتخطيط المسار",
          "بروتوكولات توجيه الشبكة",
          "جدولة الرحلات",
          "تخصيص الموارد",
        ],
      },
      before: graphExamples.dijkstra.before,
      after: graphExamples.dijkstra.after,
      overview:
        "Dijkstra's algorithm finds the shortest path between nodes in a graph. It works by visiting vertices in order of increasing distance from the source, and for each vertex, relaxing all outgoing edges.",
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      centrality: "#3b82f6", // Blue-500
      community: "#8b5cf6", // Purple-500
      pathfinding: "#22c55e", // Green-500
      structure: "#f97316", // Orange-500
      optimization: "#eab308", // Yellow-500
      clustering: "#06b6d4", // Cyan-500
    };
    return colors[category] || "#6366f1";
  };

  const handleAlgorithmClick = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setSelectedClusterType(null);
    setSelectedDefinitionLevel(null);
    setSelectedCategory(null);
    setSelectedScope("complete");
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedAlgorithm(null);
    setIsModalOpen(false);
  };

  const handleScopeChange = (scope) => {
    setSelectedScope(scope);
    setSelectedTarget(null);
    setSelectedClusterType(null);
    setSelectedDefinitionLevel(null);
    setSelectedCategory(null);
  };

  const handleTargetChange = (target) => {
    setSelectedTarget(target);
  };

  const handleClusterTypeChange = (type) => {
    setSelectedClusterType(type);
    setSelectedDefinitionLevel(null);
    setSelectedCategory(null);
  };

  const handleDefinitionLevelChange = (level) => {
    setSelectedDefinitionLevel(level);
    setSelectedCategory(null);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleCategoryChangeMain = (category) => {
    //setActiveCategory(category)
  };

  // Network type icons
  const networkIcons = {
    networks: <Network size={20} />,
    data: <Database size={20} />,
    electrical: <Zap size={20} />,
    computer: <Cpu size={20} />,
    ecommerce: <ShoppingCart size={20} />,
    security: <FileText size={20} />,
    cloud: <Server size={20} />,
    internet: <Globe size={20} />,
  };

  return (
    <div className="enhanced-graph-algorithms">
      {/* Header with Title and Subtitle - Clean Style */}
      <div className="knowledge-graph-header">
        <h1 className="main-title">Graph Algorithms</h1>
        <p className="main-subtitle">
          Explore terms and concepts powered by Neo4j graph technology
        </p>
        <div className="header-divider"></div>
      </div>

      {/* Algorithm Cards Grid */}
      <div className="algorithms-grid">
        {algorithms.map((algorithm) => (
          <div
            key={algorithm.id}
            className="algorithm-card"
            onClick={() => handleAlgorithmClick(algorithm)}
          >
            {/* Keep existing card content but remove the application-scope-dropdown section from card-footer */}
            <div className="card-header">
              <div
                className="algorithm-icon"
                style={{
                  backgroundColor: getCategoryColor(algorithm.category),
                }}
              >
                <Network size={24} />
              </div>
              <div className="algorithm-info">
                <h3 className="algorithm-name">
                  {algorithm.name[language] || algorithm.name.english}
                </h3>
                <div
                  className="algorithm-category"
                  style={{ color: getCategoryColor(algorithm.category) }}
                >
                  {algorithm.categoryLabel[language] ||
                    algorithm.categoryLabel.english}
                </div>
              </div>
            </div>

            <p className="algorithm-description">
              {algorithm.description[language] || algorithm.description.english}
            </p>

            <div className="algorithm-complexity">
              <div className="complexity-item">
                <span className="complexity-label">{t.time}</span>
                <span className="complexity-value">
                  {algorithm.timeComplexity}
                </span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">{t.space}</span>
                <span className="complexity-value">
                  {algorithm.spaceComplexity}
                </span>
              </div>
            </div>

            <div className="card-footer">
              <button
                className="view-details-btn"
                style={{
                  backgroundColor: getCategoryColor(algorithm.category),
                }}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Algorithm Modal */}
      {selectedAlgorithm && isModalOpen && (
        <AlgorithmModal
          isOpen={isModalOpen}
          onClose={handleCloseDetails}
          algorithm={selectedAlgorithm}
        />
      )}
    </div>
  );
};

export default GraphAlgorithmsEnhanced;
