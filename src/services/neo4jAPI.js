 
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

  async createSubgraphProjection(termName, depth = 2, language = "en") {
    return this.request("/subgraph-projections", {
      method: "POST",
      body: { termName, depth, language },
    });
  }

 
  async listProjections() {
    return this.request("/projections");
  }


  async getProjectionInfo(projectionName) {
    return this.request(`/projections/${projectionName}`);
  }

  async dropProjection(projectionName) {
    return this.request(`/projections/${projectionName}`, {
      method: "DELETE",
    });
  }


  async getRelationshipDistribution(projectionName) {
    return this.request(`/projections/${projectionName}/relationships`);
  }

   

 
  async runPageRank(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/pagerank`, {
      method: "POST",
      body: { config },
    });
  }


  async runBetweenness(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/betweenness`, {
      method: "POST",
      body: { config },
    });
  }


  async runClosenessCentrality(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/closeness`, {
      method: "POST",
      body: { config },
    });
  }


  async runDegreeCentrality(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/degree`, {
      method: "POST",
      body: { config },
    });
  }

  async runLouvain(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/louvain`, {
      method: "POST",
      body: { config },
    });
  }

  async runLabelPropagation(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/labelpropagation`, {
      method: "POST",
      body: { config },
    });
  }

  async runWeaklyConnectedComponents(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/wcc`, {
      method: "POST",
      body: { config },
    });
  }

  async runTriangleCount(projectionName, config = {}) {
    return this.request(`/projections/${projectionName}/triangle-count`, {
      method: "POST",
      body: { config },
    });
  }

  async runLocalClusteringCoefficient(projectionName, config = {}) {
    return this.request(
      `/projections/${projectionName}/clustering-coefficient`,
      {
        method: "POST",
        body: { config },
      }
    );
  }


  async runJaccardSimilarity(projectionName, sourceTermName, config = {}) {
    return this.request("/similarity/jaccard", {
      method: "POST",
      body: { projectionName, sourceTermName, config },
    });
  }

  async runEnhancedPageRank(projectionName, config = {}) {
    return this.request("/algorithms/pagerank", {
      method: "POST",
      body: { projectionName, config },
    });
  }

  async runEnhancedLouvain(projectionName, config = {}) {
    return this.request("/algorithms/louvain", {
      method: "POST",
      body: { projectionName, config },
    });
  }

  async runEnhancedBetweenness(projectionName, config = {}) {
    return this.request("/algorithms/betweenness", {
      method: "POST",
      body: { projectionName, config },
    });
  }

  async runEnhancedLabelPropagation(projectionName, config = {}) {
    return this.request("/algorithms/labelpropagation", {
      method: "POST",
      body: { projectionName, config },
    });
  }

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


  async getQuickSuggestions(termName, maxSuggestions = 5) {
    return this.request("/suggestions/quick", {
      method: "POST",
      body: { termName, maxSuggestions },
    });
  }

  async runCompleteWorkflow(type, algorithm = "pagerank", config = {}) {
    return this.request("/workflow", {
      method: "POST",
      body: { type, algorithm, config },
    });
  }

  async runEnhancedWorkflow(type, algorithms = ["pagerank"], config = {}) {
    return this.request("/workflows/enhanced", {
      method: "POST",
      body: { type, algorithms, config },
    });
  }


  async getAvailableAlgorithms() {
    return this.request("/algorithms/available");
  }

  async nodeNameSearch(nodeName, language = "en", limit = 10) {
    return this.request("/search/node", {
      method: "POST",
      body: { nodeName, language, limit },
    });
  }

  async querySearch(cypherQuery, params = {}, limit = 100) {
    return this.request("/search/query", {
      method: "POST",
      body: { cypherQuery, params, limit },
    });
  }


  async getQueryHelp() {
    return this.request("/search/query/help");
  }

  async getRelationshipTypes() {
    return this.request("/relationship-types");
  }

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
