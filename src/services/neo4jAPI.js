 
class GDSApi {
  constructor(baseUrl = "http://localhost:3001/api/gds") {
    this.baseUrl = baseUrl;
  }

   
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error.message);
      throw error;
    }
  }

   

  /**
   * Create a new GDS projection
   */
  async createProjection(type, options = {}) {
    return this.request("/projections", {
      method: "POST",
      body: { type, options },
    });
  }

  async searchNodeByName(nodeName, language = "en") {
    return this.request(`/search/node?nodeName=${nodeName}&language=${language}`, {
      method: "GET",
    });
  }
  /**
   * Create a subgraph projection for a specific term
   */
  async createSubgraphProjection(termName, depth = 2, language = "en") {
    return this.request("/subgraph-projections", {
      method: "POST",
      body: { termName, depth, language },
    });
  }

  /**
   * List all existing projections
   */
  async listProjections() {
    return this.request("/projections");
  }

  /**
   * Get information about a specific projection
   */
  async getProjectionInfo(projectionName) {
    return this.request(`/projections/${projectionName}`);
  }

  /**
   * Drop a projection to free memory
   */
  async dropProjection(projectionName) {
    return this.request(`/projections/${projectionName}`, {
      method: "DELETE",
    });
  }

  /**
   * Get relationship distribution in a projection
   */
  async getRelationshipDistribution(projectionName) {
    return this.request(`/projections/${projectionName}/relationships`);
  }

   

  /**
   * Run PageRank algorithm
   */
  async runPageRank(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/pagerank`, {
      method: "POST",
      body: { config },
    });
  }

  /**
   * Run Betweenness Centrality algorithm
   */
  async runBetweenness(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/betweenness`, {
      method: "POST",
      body: { config },
    });
  }

  /**
   * Run Closeness Centrality algorithm
   */
  async runClosenessCentrality(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/closeness`, {
      method: "POST",
      body: { config },
    });
  }

  /**
   * Run Degree Centrality algorithm
   */
  async runDegreeCentrality(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/degree`, {
      method: "POST",
      body: { config },
    });
  }

   

  /**
   * Run Louvain Community Detection algorithm
   */
  async runLouvain(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/louvain`, {
      method: "POST",
      body: { config },
    });
  }

  /**
   * Run Label Propagation algorithm
   */
  async runLabelPropagation(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/labelpropagation`, {
      method: "POST",
      body: { config },
    });
  }

  /**
   * Run Weakly Connected Components algorithm
   */
  async runWeaklyConnectedComponents(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/wcc`, {
      method: "POST",
      body: { config },
    });
  }

   

  /**
   * Run Triangle Count algorithm
   */
  async runTriangleCount(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/triangle-count`, {
      method: "POST",
      body: { config },
    });
  }

  /**
   * Run Local Clustering Coefficient algorithm
   */
  async runLocalClusteringCoefficient(projectionName, config = {}) {
    return this.request(
      `/projections/${projectionName}/clustering-coefficient`,
      {
        method: "POST",
        body: { config },
      }
    );
  }

  /**
   * Run Jaccard Similarity algorithm
   */
  async runJaccardSimilarity(projectionName, sourceTermName, config = {}) {
    return this.request("/similarity/jaccard", {
      method: "POST",
      body: { projectionName, sourceTermName, config },
    });
  }

   

  /**
   * Run Enhanced PageRank algorithm
   */
  async runEnhancedPageRank(projectionName, config = {}) {
    return this.request("/algorithms/pagerank", {
      method: "POST",
      body: { projectionName, config },
    });
  }

  /**
   * Run Enhanced Louvain algorithm
   */
  async runEnhancedLouvain(projectionName, config = {}) {
    return this.request("/algorithms/louvain", {
      method: "POST",
      body: { projectionName, config },
    });
  }

  /**
   * Run Enhanced Betweenness algorithm
   */
  async runEnhancedBetweenness(projectionName, config = {}) {
    return this.request("/algorithms/betweenness", {
      method: "POST",
      body: { projectionName, config },
    });
  }

  /**
   * Run Enhanced Label Propagation algorithm
   */
  async runEnhancedLabelPropagation(projectionName, config = {}) {
    return this.request("/algorithms/labelpropagation", {
      method: "POST",
      body: { projectionName, config },
    });
  }

   

  /**
   * Get smart term suggestions using multiple advanced algorithms
   * This is the BEST option for term suggestions
   */
  async getSmartSuggestions(
    termName,
    maxSuggestions = 10,
    includeEmbeddings = false
  ) {
    return this.request("/suggestions/smart", {
      method: "POST",
      body: { termName, maxSuggestions, includeEmbeddings },
    });
  }

  /**
   * Get term suggestions using multiple algorithms
   */
  async getSuggestedTerms(
    termName,
    maxSuggestions = 10,
    algorithms = ["pagerank", "degree", "louvain"]
  ) {
    return this.request("/suggestions/terms", {
      method: "POST",
      body: { termName, maxSuggestions, algorithms },
    });
  }

  /**
   * Get quick term suggestions using PageRank only (fastest)
   */
  async getQuickSuggestions(termName, maxSuggestions = 5) {
    return this.request("/suggestions/quick", {
      method: "POST",
      body: { termName, maxSuggestions },
    });
  }

   

  /**
   * Run complete workflow with single algorithm
   */
  async runCompleteWorkflow(type, algorithm = "pagerank", config = {}) {
    return this.request("/workflow", {
      method: "POST",
      body: { type, algorithm, config },
    });
  }

  /**
   * Run enhanced workflow with multiple algorithms
   */
  async runEnhancedWorkflow(type, algorithms = ["pagerank"], config = {}) {
    return this.request("/workflows/enhanced", {
      method: "POST",
      body: { type, algorithms, config },
    });
  }

   

  /**
   * Get available algorithms
   */
  async getAvailableAlgorithms() {
    return this.request("/algorithms/available");
  }

  /**
   * Search for nodes by name
   */
  async nodeNameSearch(nodeName, language = "en", limit = 10) {
    return this.request("/search/node", {
      method: "POST",
      body: { nodeName, language, limit },
    });
  }

  /**
   * Execute custom Cypher queries
   */
  async querySearch(cypherQuery, params = {}, limit = 100) {
    return this.request("/search/query", {
      method: "POST",
      body: { cypherQuery, params, limit },
    });
  }

  /**
   * Get query help and examples
   */
  async getQueryHelp() {
    return this.request("/search/query/help");
  }

  /**
   * Get available relationship types
   */
  async getRelationshipTypes() {
    return this.request("/relationship-types");
  }

   

  /**
   * Complete term suggestion workflow
   * Creates projection, gets suggestions, and cleans up
   */
  async getTermSuggestionsComplete(termName, options = {}) {
    const {
      maxSuggestions = 10,
      algorithms = ["pagerank", "degree", "louvain"],
      depth = 2,
      language = "en",
    } = options;

    let projectionName = null;

    try {
       
      const projectionResult = await this.createSubgraphProjection(
        termName,
        depth,
        language
      );
      projectionName = projectionResult.projectionName;

       
      const suggestions = await this.getSuggestedTerms(
        termName,
        maxSuggestions,
        algorithms
      );

       
      await this.dropProjection(projectionName);

      return suggestions;
    } catch (error) {
       
      if (projectionName) {
        try {
          await this.dropProjection(projectionName);
        } catch (cleanupError) {
          console.error("Failed to cleanup projection:", cleanupError);
        }
      }
      throw error;
    }
  }

  /**
   * Run all centrality algorithms on a projection
   */
  async runAllCentralityAlgorithms(projectionName, config = {}) {
    const results = {};

    try {
      results.pagerank = await this.runPageRank(
        projectionName,
        config.pagerank || {}
      );
      results.betweenness = await this.runBetweenness(
        projectionName,
        config.betweenness || {}
      );
      results.closeness = await this.runClosenessCentrality(
        projectionName,
        config.closeness || {}
      );
      results.degree = await this.runDegreeCentrality(
        projectionName,
        config.degree || {}
      );
    } catch (error) {
      console.error("Error running centrality algorithms:", error);
      throw error;
    }

    return results;
  }

  /**
   * Run all community detection algorithms on a projection
   */
  async runAllCommunityAlgorithms(projectionName, config = {}) {
    const results = {};

    try {
      results.louvain = await this.runLouvain(
        projectionName,
        config.louvain || {}
      );
      results.labelPropagation = await this.runLabelPropagation(
        projectionName,
        config.labelPropagation || {}
      );
      results.wcc = await this.runWeaklyConnectedComponents(
        projectionName,
        config.wcc || {}
      );
    } catch (error) {
      console.error("Error running community algorithms:", error);
      throw error;
    }

    return results;
  }

  /**
   * Get comprehensive analysis for a term
   */
  async getTermAnalysis(termName, options = {}) {
    const {
      depth = 2,
      language = "en",
      includeAllAlgorithms = false,
    } = options;

    let projectionName = null;

    try {
       
      const projectionResult = await this.createSubgraphProjection(
        termName,
        depth,
        language
      );
      projectionName = projectionResult.projectionName;

      const analysis = {
        termName,
        projectionName,
        projectionInfo: await this.getProjectionInfo(projectionName),
        relationshipDistribution: await this.getRelationshipDistribution(
          projectionName
        ),
      };

      if (includeAllAlgorithms) {
         
        analysis.centrality = await this.runAllCentralityAlgorithms(
          projectionName
        );
        analysis.community = await this.runAllCommunityAlgorithms(
          projectionName
        );
        analysis.clustering = {
          triangleCount: await this.runTriangleCount(projectionName),
          clusteringCoefficient: await this.runLocalClusteringCoefficient(
            projectionName
          ),
        };
        analysis.similarity = await this.runJaccardSimilarity(
          projectionName,
          termName
        );
      } else {
         
        analysis.suggestions = await this.getSmartSuggestions(termName, 10);
      }

       
      await this.dropProjection(projectionName);

      return analysis;
    } catch (error) {
       
      if (projectionName) {
        try {
          await this.dropProjection(projectionName);
        } catch (cleanupError) {
          console.error("Failed to cleanup projection:", cleanupError);
        }
      }
      throw error;
    }
  }
}

 
const gdsApi = new GDSApi();
export default gdsApi;

 
export { GDSApi };
