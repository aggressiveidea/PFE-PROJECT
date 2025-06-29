
import { useState, useEffect } from "react";
import {
  Network,
  Database,
  Zap,
  Cpu,
  ShoppingCart,
  FileText,
  Server,
  Globe,
  Loader2,
} from "lucide-react";
import AlgorithmModal from "./AlgorithmModal";
import "./GraphAlgorithms.css";
import { analyzeGraph } from "../../services/Api";

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
  const [showResults, setShowResults] = useState(false);
  const [appliedAlgorithmResult, setAppliedAlgorithmResult] = useState(null);

   
  const [algorithms, setAlgorithms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCounts, setFilterCounts] = useState({
    categories: {},
    definitions: { Primary: 0, Secondary: 0 },
    terms: 0,
  });

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
      loading: "Loading algorithms...",
      error: "Error loading algorithms",
      retry: "Retry",
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
      loading: "Chargement des algorithmes...",
      error: "Erreur lors du chargement des algorithmes",
      retry: "Réessayer",
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
      loading: "تحميل الخوارزميات...",
      error: "خطأ في تحميل الخوارزميات",
      retry: "إعادة المحاولة",
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

   
  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        setLoading(true);
        setError(null);

         
         
        const backendCompatibleAlgorithms = [
          {
            id: "PageRank",
            name: {
              english: "PageRank",
              french: "Classement de Pages",
              arabic: "ترتيب الصفحات",
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
                "PageRank assigns a numerical weight to each node in a graph, measuring its relative importance within the set.",
              french:
                "PageRank attribue un poids numérique à chaque nœud d'un graphe, mesurant son importance relative.",
              arabic:
                "تخصص خوارزمية ترتيب الصفحات وزنًا رقميًا لكل عقدة في الرسم البياني.",
            },
            applications: {
              english: [
                "Web search ranking",
                "Social network analysis",
                "Citation analysis",
                "Recommendation systems",
              ],
              french: [
                "Classement des recherches Web",
                "Analyse des réseaux sociaux",
                "Analyse des citations",
                "Systèmes de recommandation",
              ],
              arabic: [
                "ترتيب نتائج البحث",
                "تحليل الشبكات الاجتماعية",
                "تحليل الاستشهادات",
                "أنظمة التوصية",
              ],
            },
            overview: {
              english:
                "PageRank is a link analysis algorithm used to rank nodes by importance in a graph structure.",
              french:
                "PageRank est un algorithme d'analyse de liens utilisé pour classer les nœuds par importance dans une structure de graphe.",
              arabic:
                "ترتيب الصفحات هو خوارزمية تحليل الروابط المستخدمة لترتيب العقد حسب الأهمية في هيكل الرسم البياني.",
            },
          },
          {
            id: "Louvain",
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
                "Identifies groups of nodes that are more densely connected to each other",
              french:
                "Identifie des groupes de nœuds plus densément connectés entre eux",
              arabic: "تحدد مجموعات من العقد المترابطة بكثافة أكبر",
            },
            timeComplexity: "O(n log n)",
            spaceComplexity: "O(n + m)",
            howItWorks: {
              english:
                "The Louvain method optimizes modularity by moving nodes between communities iteratively.",
              french:
                "La méthode de Louvain optimise la modularité en déplaçant les nœuds entre communautés de manière itérative.",
              arabic:
                "تعمل طريقة لوفان على تحسين النمطية عن طريق نقل العقد بين المجتمعات بشكل متكرر.",
            },
            applications: {
              english: [
                "Social network analysis",
                "Customer segmentation",
                "Biological networks",
                "Recommendation systems",
              ],
              french: [
                "Analyse des réseaux sociaux",
                "Segmentation des clients",
                "Réseaux biologiques",
                "Systèmes de recommandation",
              ],
              arabic: [
                "تحليل الشبكات الاجتماعية",
                "تقسيم العملاء",
                "الشبكات البيولوجية",
                "أنظمة التوصية",
              ],
            },
            overview: {
              english:
                "The Louvain method is a fast algorithm for community detection in large networks.",
              french:
                "La méthode de Louvain est un algorithme rapide pour la détection de communautés dans de grands réseaux.",
              arabic:
                "طريقة لوفان هي خوارزمية سريعة لاكتشاف المجتمعات في الشبكات الكبيرة.",
            },
          },
          {
            id: "Betweenness",
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
              arabic:
                "تحدد العقد التي تعمل كجسور بين أجزاء مختلفة من الرسم البياني",
            },
            timeComplexity: "O(n³)",
            spaceComplexity: "O(n² + m)",
            howItWorks: {
              english:
                "Betweenness centrality measures how often a node lies on shortest paths between other nodes.",
              french:
                "La centralité d'intermédiarité mesure la fréquence à laquelle un nœud se trouve sur les chemins les plus courts entre d'autres nœuds.",
              arabic:
                "تقيس المركزية البينية مدى تكرار وجود العقدة في أقصر المسارات بين العقد الأخرى.",
            },
            applications: {
              english: [
                "Network bottleneck detection",
                "Influential node identification",
                "Transportation networks",
                "Social influence analysis",
              ],
              french: [
                "Détection de goulots d'étranglement réseau",
                "Identification de nœuds influents",
                "Réseaux de transport",
                "Analyse d'influence sociale",
              ],
              arabic: [
                "كشف نقاط الاختناق في الشبكة",
                "تحديد العقد المؤثرة",
                "شبكات النقل",
                "تحليل التأثير الاجتماعي",
              ],
            },
            overview: {
              english:
                "Betweenness centrality identifies nodes that serve as bridges in network communication.",
              french:
                "La centralité d'intermédiarité identifie les nœuds qui servent de ponts dans la communication réseau.",
              arabic:
                "تحدد المركزية البينية العقد التي تعمل كجسور في اتصالات الشبكة.",
            },
          },
          {
            id: "Jaccard",
            name: {
              english: "Jaccard Similarity",
              french: "Similarité de Jaccard",
              arabic: "تشابه جاكارد",
            },
            category: "similarity",
            categoryLabel: {
              english: "SIMILARITY",
              french: "SIMILARITÉ",
              arabic: "التشابه",
            },
            description: {
              english:
                "Measures similarity between nodes based on their shared neighbors",
              french:
                "Mesure la similarité entre nœuds basée sur leurs voisins partagés",
              arabic: "يقيس التشابه بين العقد بناءً على الجيران المشتركين",
            },
            timeComplexity: "O(n²)",
            spaceComplexity: "O(n)",
            howItWorks: {
              english:
                "Jaccard similarity compares the intersection and union of node neighborhoods.",
              french:
                "La similarité de Jaccard compare l'intersection et l'union des voisinages de nœuds.",
              arabic: "يقارن تشابه جاكارد تقاطع واتحاد أحياء العقد.",
            },
            applications: {
              english: [
                "Recommendation systems",
                "Duplicate detection",
                "Link prediction",
                "Content similarity",
              ],
              french: [
                "Systèmes de recommandation",
                "Détection de doublons",
                "Prédiction de liens",
                "Similarité de contenu",
              ],
              arabic: [
                "أنظمة التوصية",
                "كشف التكرارات",
                "توقع الروابط",
                "تشابه المحتوى",
              ],
            },
            overview: {
              english:
                "Jaccard similarity measures how similar two nodes are based on their shared connections.",
              french:
                "La similarité de Jaccard mesure à quel point deux nœuds sont similaires en fonction de leurs connexions partagées.",
              arabic:
                "يقيس تشابه جاكارد مدى تشابه عقدتين بناءً على اتصالاتهما المشتركة.",
            },
          },
          {
            id: "LabelPropagation",
            name: {
              english: "Label Propagation",
              french: "Propagation d'Étiquettes",
              arabic: "انتشار التسميات",
            },
            category: "community",
            categoryLabel: {
              english: "COMMUNITY DETECTION",
              french: "DÉTECTION DE COMMUNAUTÉ",
              arabic: "اكتشاف المجتمع",
            },
            description: {
              english:
                "Detects communities by propagating labels through the network",
              french:
                "Détecte les communautés en propageant les étiquettes dans le réseau",
              arabic: "يكتشف المجتمعات عن طريق نشر التسميات عبر الشبكة",
            },
            timeComplexity: "O(m)",
            spaceComplexity: "O(n)",
            howItWorks: {
              english:
                "Each node adopts the most frequent label among its neighbors iteratively.",
              french:
                "Chaque nœud adopte l'étiquette la plus fréquente parmi ses voisins de manière itérative.",
              arabic:
                "تتبنى كل عقدة التسمية الأكثر تكراراً بين جيرانها بشكل متكرر.",
            },
            applications: {
              english: [
                "Community detection",
                "Image segmentation",
                "Social group identification",
                "Network clustering",
              ],
              french: [
                "Détection de communauté",
                "Segmentation d'image",
                "Identification de groupes sociaux",
                "Regroupement de réseau",
              ],
              arabic: [
                "اكتشاف المجتمع",
                "تقسيم الصور",
                "تحديد المجموعات الاجتماعية",
                "تجميع الشبكة",
              ],
            },
            overview: {
              english:
                "Label Propagation is a fast community detection algorithm based on label spreading.",
              french:
                "La propagation d'étiquettes est un algorithme rapide de détection de communautés basé sur la diffusion d'étiquettes.",
              arabic:
                "انتشار التسميات هو خوارزمية سريعة لاكتشاف المجتمعات تعتمد على نشر التسميات.",
            },
          },
          {
            id: "Closeness",
            name: {
              english: "Closeness Centrality",
              french: "Centralité de Proximité",
              arabic: "مركزية القرب",
            },
            category: "centrality",
            categoryLabel: {
              english: "CENTRALITY",
              french: "CENTRALITÉ",
              arabic: "المركزية",
            },
            description: {
              english:
                "Measures how close a node is to all other nodes in the network",
              french:
                "Mesure la proximité d'un nœud à tous les autres nœuds du réseau",
              arabic: "يقيس مدى قرب العقدة من جميع العقد الأخرى في الشبكة",
            },
            timeComplexity: "O(n³)",
            spaceComplexity: "O(n²)",
            howItWorks: {
              english:
                "Closeness centrality is the reciprocal of the sum of shortest path distances to all other nodes.",
              french:
                "La centralité de proximité est l'inverse de la somme des distances de chemin le plus court vers tous les autres nœuds.",
              arabic:
                "مركزية القرب هي مقلوب مجموع مسافات أقصر مسار إلى جميع العقد الأخرى.",
            },
            applications: {
              english: [
                "Information spread analysis",
                "Transportation hubs",
                "Social influence",
                "Network efficiency",
              ],
              french: [
                "Analyse de propagation d'information",
                "Centres de transport",
                "Influence sociale",
                "Efficacité du réseau",
              ],
              arabic: [
                "تحليل انتشار المعلومات",
                "مراكز النقل",
                "التأثير الاجتماعي",
                "كفاءة الشبكة",
              ],
            },
            overview: {
              english:
                "Closeness centrality identifies nodes that can efficiently reach all other nodes in the network.",
              french:
                "La centralité de proximité identifie les nœuds qui peuvent atteindre efficacement tous les autres nœuds du réseau.",
              arabic:
                "تحدد مركزية القرب العقد التي يمكنها الوصول بكفاءة إلى جميع العقد الأخرى في الشبكة.",
            },
          },
          {
            id: "Degree",
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
              english: "Measures the number of direct connections a node has",
              french: "Mesure le nombre de connexions directes d'un nœud",
              arabic: "يقيس عدد الاتصالات المباشرة للعقدة",
            },
            timeComplexity: "O(n + m)",
            spaceComplexity: "O(n)",
            howItWorks: {
              english:
                "Degree centrality simply counts the number of edges connected to each node.",
              french:
                "La centralité de degré compte simplement le nombre d'arêtes connectées à chaque nœud.",
              arabic: "تحسب مركزية الدرجة ببساطة عدد الحواف المتصلة بكل عقدة.",
            },
            applications: {
              english: [
                "Social network popularity",
                "Network hubs identification",
                "Connection analysis",
                "Node importance ranking",
              ],
              french: [
                "Popularité des réseaux sociaux",
                "Identification des centres de réseau",
                "Analyse de connexion",
                "Classement d'importance des nœuds",
              ],
              arabic: [
                "شعبية الشبكات الاجتماعية",
                "تحديد مراكز الشبكة",
                "تحليل الاتصال",
                "ترتيب أهمية العقد",
              ],
            },
            overview: {
              english:
                "Degree centrality is the simplest measure of node importance based on direct connections.",
              french:
                "La centralité de degré est la mesure la plus simple de l'importance des nœuds basée sur les connexions directes.",
              arabic:
                "مركزية الدرجة هي أبسط مقياس لأهمية العقدة بناءً على الاتصالات المباشرة.",
            },
          },
        ];

        setAlgorithms(backendCompatibleAlgorithms);
      } catch (err) {
        console.error("Failed to load algorithms:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlgorithms();
  }, [language]);

  const getCategoryColor = (category) => {
    const colors = {
      centrality: "#3b82f6",
      community: "#8b5cf6",
      pathfinding: "#22c55e",
      structure: "#f97316",
      optimization: "#eab308",
      clustering: "#06b6d4",
    };
    return colors[category] || "#6366f1";
  };

  const handleAlgorithmClick = async (algorithm) => {
    try {
      setSelectedAlgorithm(algorithm);
      setSelectedClusterType(null);
      setSelectedDefinitionLevel(null);
      setSelectedCategory(null);
      setSelectedScope("complete");
      setIsModalOpen(true);

       
       
    } catch (err) {
      console.error("Failed to open algorithm details:", err);
    }
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

  const handleApplyAlgorithm = async () => {
    if (!selectedAlgorithm) return;

    try {
      setLoading(true);

      const result = await analyzeGraph(
        "apply",
        selectedAlgorithm.id || selectedAlgorithm.name?.english,
        selectedTarget,
        language === "english"
          ? "en"
          : language === "french"
          ? "fr"
          : language === "arabic"
          ? "ar"
          : "en",
        {
          scope: selectedScope,
          clusterType: selectedClusterType,
          definitionLevel: selectedDefinitionLevel,
          category: selectedCategory,
        }
      );

      if (result) {
        setAppliedAlgorithmResult(result);
        setShowResults(true);
        if (onAlgorithmSelect) {
          onAlgorithmSelect(result);
        }
      }
    } catch (err) {
      console.error("Failed to apply algorithm:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

   
  if (loading && algorithms.length === 0) {
    return (
      <div className="enhanced-graph-algorithms">
        <div className="knowledge-graph-header">
          <h1 className="main-title">{t.title}</h1>
          <p className="main-subtitle">{t.subtitle}</p>
          <div className="header-divider"></div>
        </div>
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={48} />
          <p className="loading-text">{t.loading}</p>
        </div>
      </div>
    );
  }

   
  if (error && algorithms.length === 0) {
    return (
      <div className="enhanced-graph-algorithms">
        <div className="knowledge-graph-header">
          <h1 className="main-title">{t.title}</h1>
          <p className="main-subtitle">{t.subtitle}</p>
          <div className="header-divider"></div>
        </div>
        <div className="error-container">
          <p className="error-text">
            {t.error}: {error}
          </p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            {t.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="enhanced-graph-algorithms">
      {/* Header with Title and Subtitle - Clean Style */}
      <div className="knowledge-graph-header">
        <h1 className="main-title">{t.title}</h1>
        <p className="main-subtitle">{t.subtitle}</p>
        <div className="header-divider"></div>
      </div>

      {/* Algorithm Cards Grid */}
      <div className="algorithms-grid">
        {algorithms.map((algorithm, index) => (
          <div
            key={algorithm.id || index}
            className="algorithm-card"
            onClick={() => handleAlgorithmClick(algorithm)}
          >
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
                  {algorithm.name?.[language] ||
                    algorithm.name?.english ||
                    algorithm.name}
                </h3>
                <div
                  className="algorithm-category"
                  style={{ color: getCategoryColor(algorithm.category) }}
                >
                  {algorithm.categoryLabel?.[language] ||
                    algorithm.categoryLabel?.english ||
                    algorithm.category}
                </div>
              </div>
            </div>

            <p className="algorithm-description">
              {algorithm.description?.[language] ||
                algorithm.description?.english ||
                algorithm.description}
            </p>

            <div className="algorithm-complexity">
              <div className="complexity-item">
                <span className="complexity-label">{t.time}</span>
                <span className="complexity-value">
                  {algorithm.timeComplexity || "N/A"}
                </span>
              </div>
              <div className="complexity-item">
                <span className="complexity-label">{t.space}</span>
                <span className="complexity-value">
                  {algorithm.spaceComplexity || "N/A"}
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
          onApply={handleApplyAlgorithm}
          loading={loading}
          language={language}
          translations={t}
        />
      )}
    </div>
  );
};

export default GraphAlgorithmsEnhanced;
