// components/forKnowledge/GraphAlgorithmsSection.jsx
"use client"
import { useState } from "react"
import AlgorithmModal from "./AlgorithmModal"
import "./GraphAlgorithms.css"

const GraphAlgorithms = ({ language = "english" }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null)

  
  const translations = {
    english: {
      title: "Graph Data Algorithms",
      subtitle: "Explore and visualize common graph algorithms",
    },
    french: {
      title: "Algorithmes de Données de Graphe",
      subtitle: "Explorez et visualisez les algorithmes de graphe courants",
    },
    arabic: {
      title: "خوارزميات بيانات الرسم البياني",
      subtitle: "استكشاف وتصور خوارزميات الرسم البياني الشائعة",
    },
  }

  const t = translations[language] || translations.english

  const algorithms = [
    {
      id: "shortest-path",
      name: {
        english: "Shortest Path (Dijkstra's Algorithm)",
        french: "Chemin le Plus Court (Algorithme de Dijkstra)",
        arabic: "أقصر مسار (خوارزمية ديكسترا)",
      },
      description: {
        english:
          "Finds the shortest path between two nodes in a graph by iteratively selecting the unvisited node with the smallest tentative distance.",
        french:
          "Trouve le chemin le plus court entre deux nœuds dans un graphe en sélectionnant itérativement le nœud non visité avec la plus petite distance provisoire.",
        arabic:
          "تجد أقصر مسار بين عقدتين في الرسم البياني من خلال اختيار العقدة غير المزارة ذات المسافة المؤقتة الأصغر بشكل متكرر.",
      },
      timeComplexity: "O(|E| + |V|log|V|)",
      spaceComplexity: "O(|V|)",
      formula: "d[v] = min(d[v], d[u] + w(u,v))",
      formulaExplanation: {
        english:
          "Where d[v] is the distance to vertex v, d[u] is the distance to vertex u, and w(u,v) is the weight of the edge from u to v.",
        french:
          "Où d[v] est la distance au sommet v, d[u] est la distance au sommet u, et w(u,v) est le poids de l'arête de u à v.",
        arabic: "حيث d[v] هي المسافة إلى الرأس v، و d[u] هي المسافة إلى الرأس u، و w(u,v) هي وزن الحافة من u إلى v.",
      },
      parameters: ["startNode", "endNode"],
      pseudocode: [
        "function Dijkstra(Graph, source):",
        "    create vertex set Q",
        "    for each vertex v in Graph:",
        "        dist[v] ← INFINITY",
        "        prev[v] ← UNDEFINED",
        "        add v to Q",
        "    dist[source] ← 0",
        "",
        "    while Q is not empty:",
        "        u ← vertex in Q with min dist[u]",
        "        remove u from Q",
        "",
        "        for each neighbor v of u:",
        "            alt ← dist[u] + length(u, v)",
        "            if alt < dist[v]:",
        "                dist[v] ← alt",
        "                prev[v] ← u",
        "",
        "    return dist[], prev[]",
      ],
    },
    {
      id: "bfs",
      name: {
        english: "Breadth-First Search (BFS)",
        french: "Parcours en Largeur",
        arabic: "البحث أولاً بالعرض",
      },
      description: {
        english:
          "Explores all vertices at the present depth before moving on to vertices at the next depth level. Useful for finding shortest paths in unweighted graphs.",
        french:
          "Explore tous les sommets à la profondeur actuelle avant de passer aux sommets du niveau de profondeur suivant. Utile pour trouver les chemins les plus courts dans les graphes non pondérés.",
        arabic:
          "يستكشف جميع الرؤوس في العمق الحالي قبل الانتقال إلى الرؤوس في مستوى العمق التالي. مفيد لإيجاد أقصر المسارات في الرسوم البيانية غير الموزونة.",
      },
      timeComplexity: "O(|V| + |E|)",
      spaceComplexity: "O(|V|)",
      formula: "Queue-based traversal",
      formulaExplanation: {
        english: "Uses a queue data structure to keep track of vertices to be explored next.",
        french: "Utilise une structure de données de file pour suivre les sommets à explorer ensuite.",
        arabic: "يستخدم بنية بيانات الطابور لتتبع الرؤوس المراد استكشافها بعد ذلك.",
      },
      parameters: ["startNode"],
      pseudocode: [
        "function BFS(Graph, start):",
        "    create queue Q",
        "    mark start as visited",
        "    Q.enqueue(start)",
        "",
        "    while Q is not empty:",
        "        v = Q.dequeue()",
        "        for each neighbor w of v:",
        "            if w is not visited:",
        "                mark w as visited",
        "                Q.enqueue(w)",
      ],
    },
    {
      id: "dfs",
      name: {
        english: "Depth-First Search (DFS)",
        french: "Parcours en Profondeur",
        arabic: "البحث أولاً بالعمق",
      },
      description: {
        english:
          "Explores as far as possible along each branch before backtracking. Useful for topological sorting, finding connected components, and solving puzzles.",
        french:
          "Explore aussi loin que possible le long de chaque branche avant de revenir en arrière. Utile pour le tri topologique, la recherche de composants connectés et la résolution de puzzles.",
        arabic:
          "يستكشف بعيدًا قدر الإمكان على طول كل فرع قبل التراجع. مفيد للفرز الطوبولوجي، وإيجاد المكونات المتصلة، وحل الألغاز.",
      },
      timeComplexity: "O(|V| + |E|)",
      spaceComplexity: "O(|V|)",
      formula: "Stack-based traversal",
      formulaExplanation: {
        english: "Uses a stack data structure (or recursion) to keep track of vertices to be explored next.",
        french:
          "Utilise une structure de données de pile (ou récursion) pour suivre les sommets à explorer ensuite.",
        arabic: "يستخدم بنية بيانات المكدس (أو التكرار) لتتبع الرؤوس المراد استكشافها بعد ذلك.",
      },
      parameters: ["startNode"],
      pseudocode: [
        "function DFS(Graph, start):",
        "    mark start as visited",
        "    for each neighbor w of start:",
        "        if w is not visited:",
        "            DFS(Graph, w)",
      ],
    },
    {
      id: "pagerank",
      name: {
        english: "PageRank Algorithm",
        french: "Algorithme PageRank",
        arabic: "خوارزمية تصنيف الصفحات",
      },
      description: {
        english:
          "Measures the importance of each node in a graph based on the structure of incoming links, with the underlying assumption that more important nodes receive more links.",
        french:
          "Mesure l'importance de chaque nœud dans un graphe en fonction de la structure des liens entrants, avec l'hypothèse sous-jacente que les nœuds plus importants reçoivent plus de liens.",
        arabic:
          "تقيس أهمية كل عقدة في الرسم البياني بناءً على هيكل الروابط الواردة، مع الافتراض الأساسي أن العقد الأكثر أهمية تتلقى المزيد من الروابط.",
      },
      timeComplexity: "O(k|V| + |E|)",
      spaceComplexity: "O(|V|)",
      formula: "PR(u) = (1-d) + d \\sum_{v \\in N_{in}(u)} \\frac{PR(v)}{|N_{out}(v)|}",
      formulaExplanation: {
        english:
          "Where d is the damping factor, N_in(u) are nodes linking to u, and N_out(v) is the number of outgoing links from v.",
        french:
          "Où d est le facteur d'amortissement, N_in(u) sont les nœuds liés à u, et N_out(v) est le nombre de liens sortants de v.",
        arabic: "حيث d هو عامل التخميد، و N_in(u) هي العقد التي ترتبط بـ u، و N_out(v) هو عدد الروابط الخارجة من v.",
      },
      parameters: ["dampingFactor", "iterations"],
      pseudocode: [
        "function PageRank(Graph, d, iterations):",
        "    for each vertex v in Graph:",
        "        PR[v] ← 1/N",
        "    for i from 1 to iterations:",
        "        for each vertex v in Graph:",
        "            PR[v] ← (1-d) + d * sum(PR[u]/L[u] for u linking to v)",
        "    return PR[]",
      ],
    },
    {
      id: "community-detection",
      name: {
        english: "Community Detection (Louvain Method)",
        french: "Détection de Communauté (Méthode de Louvain)",
        arabic: "اكتشاف المجتمع (طريقة لوفان)",
      },
      description: {
        english:
          "A hierarchical clustering algorithm that optimizes modularity by iteratively merging communities to find the optimal community structure.",
        french:
          "Un algorithme de clustering hiérarchique qui optimise la modularité en fusionnant itérativement les communautés pour trouver la structure communautaire optimale.",
        arabic: "خوارزمية تجميع هرمية تحسن النمطية من خلال دمج المجتمعات بشكل متكرر للعثور على هيكل المجتمع الأمثل.",
      },
      timeComplexity: "O(|E|)",
      spaceComplexity: "O(|V| + |E|)",
      formula: "Q = \\frac{1}{2m}\\sum_{ij} \\left[ A_{ij} - \\frac{k_i k_j}{2m}\\right] \\delta(c_i, c_j)",
      formulaExplanation: {
        english:
          "Where m is the number of edges, A is the adjacency matrix, k is the degree of nodes, and δ is 1 if nodes i and j are in the same community.",
        french:
          "Où m est le nombre d'arêtes, A est la matrice d'adjacence, k est le degré des nœuds, et δ est 1 si les nœuds i et j sont dans la même communauté.",
        arabic:
          "حيث m هو عدد الحواف، و A هي مصفوفة التجاور، و k هي درجة العقد، و δ هي 1 إذا كانت العقد i و j في نفس المجتمع.",
      },
      parameters: [],
      pseudocode: [
        "function Louvain(Graph):",
        "    assign each node to its own community",
        "    while modularity increases:",
        "        for each node i:",
        "            place i in community that maximizes modularity gain",
        "        if no improvement:",
        "            break",
        "        merge nodes in same community",
        "    return communities",
      ],
    },
    {
      id: "centrality",
      name: {
        english: "Betweenness Centrality",
        french: "Centralité d'Intermédiarité",
        arabic: "المركزية البينية",
      },
      description: {
        english:
          "Measures the extent to which a node lies on paths between other nodes. Nodes with high betweenness may have considerable influence within a network.",
        french:
          "Mesure dans quelle mesure un nœud se trouve sur les chemins entre d'autres nœuds. Les nœuds à forte intermédiarité peuvent avoir une influence considérable au sein d'un réseau.",
        arabic:
          "تقيس مدى وقوع العقدة على المسارات بين العقد الأخرى. قد يكون للعقد ذات المركزية البينية العالية تأثير كبير داخل الشبكة.",
      },
      timeComplexity: "O(|V||E|)",
      spaceComplexity: "O(|V|²)",
      formula: "C_B(v) = \\sum_{s \\neq v \\neq t} \\frac{\\sigma_{st}(v)}{\\sigma_{st}}",
      formulaExplanation: {
        english:
          "Where σst is the total number of shortest paths from node s to node t and σst(v) is the number of those paths that pass through v.",
        french:
          "Où σst est le nombre total de chemins les plus courts du nœud s au nœud t et σst(v) est le nombre de ces chemins qui passent par v.",
        arabic:
          "حيث σst هو العدد الإجمالي لأقصر المسارات من العقدة s إلى العقدة t و σst(v) هو عدد تلك المسارات التي تمر عبر v.",
      },
      parameters: [],
      pseudocode: [
        "function BetweennessCentrality(Graph):",
        "    C_B[v] ← 0 for all v",
        "    for each s in Graph:",
        "        run BFS or Dijkstra from s",
        "        compute dependencies δ[v] for all v",
        "        add dependencies to C_B[v]",
        "    return C_B[]",
      ],
    },
    {
      id: "mst",
      name: {
        english: "Minimum Spanning Tree (Kruskal's Algorithm)",
        french: "Arbre Couvrant Minimal (Algorithme de Kruskal)",
        arabic: "شجرة امتداد الحد الأدنى (خوارزمية كروسكال)",
      },
      description: {
        english:
          "Finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.",
        french:
          "Trouve un sous-ensemble des arêtes qui forme un arbre incluant chaque sommet, où le poids total de toutes les arêtes de l'arbre est minimisé.",
        arabic:
          "تجد مجموعة فرعية من الحواف التي تشكل شجرة تتضمن كل رأس، حيث يتم تقليل الوزن الإجمالي لجميع الحواف في الشجرة.",
      },
      timeComplexity: "O(|E|log|E|)",
      spaceComplexity: "O(|V| + |E|)",
      formula: "Greedy algorithm: Sort edges by weight, add if no cycle forms",
      formulaExplanation: {
        english:
          "Kruskal's algorithm builds the MST by adding edges in order of increasing weight, skipping edges that would create a cycle.",
        french:
          "L'algorithme de Kruskal construit l'ACM en ajoutant des arêtes par ordre de poids croissant, en sautant les arêtes qui créeraient un cycle.",
        arabic:
          "تبني خوارزمية كروسكال شجرة امتداد الحد الأدنى عن طريق إضافة الحواف بترتيب الوزن المتزايد، وتخطي الحواف التي من شأنها أن تخلق دورة.",
      },
      parameters: [],
      pseudocode: [
        "function Kruskal(Graph):",
        "    A = ∅",
        "    for each vertex v in Graph:",
        "        Make-Set(v)",
        "    sort edges of Graph by weight",
        "    for each edge (u, v) in Graph (in order of increasing weight):",
        "        if Find-Set(u) ≠ Find-Set(v):",
        "            A = A ∪ {(u, v)}",
        "            Union(u, v)",
        "    return A",
      ],
    },
  ]

  const handleAlgorithmClick = (algorithm) => {
    setSelectedAlgorithm(algorithm)
  }

  const closeModal = () => {
    setSelectedAlgorithm(null)
  }

  return (
    <div className="graph-algorithms-section">
      <div className="algorithms-header">
        <h2>{t.title}</h2>
        <p className="algorithms-subtitle">{t.subtitle}</p>
      </div>

      <div className="algorithms-grid">
        {algorithms.map((algorithm) => (
          <div key={algorithm.id} className="algorithm-card" onClick={() => handleAlgorithmClick(algorithm)}>
            <h3>{algorithm.name[language] || algorithm.name.english}</h3>
            <p>{algorithm.description[language] || algorithm.description.english}</p>
            <div className="algorithm-complexity">
              <span className="time-complexity">
                <span className="complexity-label">Time:</span> {algorithm.timeComplexity}
              </span>
              <span className="space-complexity">
                <span className="complexity-label">Space:</span> {algorithm.spaceComplexity}
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedAlgorithm && <AlgorithmModal algorithm={selectedAlgorithm} onClose={closeModal} language={language} />}
    </div>
  )
}

export default GraphAlgorithms
