
const MODELS = {
    
    textGeneration: {
      default: "gpt2-small",
      options: [
        { id: "gpt2-small", name: "GPT-2 Small", size: "~500MB", type: "local" },
        { id: "distilgpt2", name: "DistilGPT-2", size: "~300MB", type: "local" },
        { id: "bloom-560m", name: "BLOOM 560M", size: "~1GB", type: "local" },
        { id: "huggingface-inference", name: "Hugging Face Inference API", type: "api" },
      ]
    },
    

    summarization: {
      default: "bart-large-cnn",
      options: [
        { id: "bart-large-cnn", name: "BART CNN", size: "~400MB", type: "local" },
        { id: "t5-small", name: "T5 Small", size: "~300MB", type: "local" },
        { id: "huggingface-inference", name: "Hugging Face Inference API", type: "api" },
      ]
    },

    questionAnswering: {
      default: "distilbert-squad",
      options: [
        { id: "distilbert-squad", name: "DistilBERT SQuAD", size: "~250MB", type: "local" },
        { id: "roberta-base-squad2", name: "RoBERTa SQuAD2", size: "~500MB", type: "local" },
        { id: "huggingface-inference", name: "Hugging Face Inference API", type: "api" },
      ]
    }
  };
  

  const modelCache = {};
  

  export async function initAIService(options = {}) {
    console.log("Initializing AI Service...");
    
    const modelsToPreload = options.preloadModels || [];
    
    if (modelsToPreload.length > 0) {
      try {
        await Promise.all(modelsToPreload.map(modelId => loadModel(modelId)));
        console.log("Preloaded models:", modelsToPreload);
      } catch (error) {
        console.error("Error preloading models:", error);
      }
    }
    
    return {
      isInitialized: true,
      availableModels: MODELS
    };
  }
  
  
  async function loadModel(modelId) {
    
    if (modelCache[modelId]) {
      return modelCache[modelId];
    }
    
    console.log(`Loading model: ${modelId}`);
    
    try {
      const loadingTime = getModelLoadingTime(modelId);
      await new Promise(resolve => setTimeout(resolve, loadingTime));
      const model = {
        id: modelId,
        loaded: true,
        loadedAt: new Date(),
        generate: async (text) => simulateModelResponse(modelId, "generate", text),
        summarize: async (text) => simulateModelResponse(modelId, "summarize", text),
        answerQuestion: async (question, context) => simulateModelResponse(modelId, "answerQuestion", question, context)
      };

      modelCache[modelId] = model;
      return model;
    } catch (error) {
      console.error(`Error loading model ${modelId}:`, error);
      throw new Error(`Failed to load model ${modelId}: ${error.message}`);
    }
  }
  
  function getModelLoadingTime(modelId) {
    const modelSizes = {
      "gpt2-small": 3000,
      "distilgpt2": 2000,
      "bloom-560m": 4000,
      "bart-large-cnn": 2500,
      "t5-small": 2000,
      "distilbert-squad": 1500,
      "roberta-base-squad2": 3000,
      "huggingface-inference": 500 
    };
    
    return modelSizes[modelId] || 2000;
  }
  
  function simulateModelResponse(modelId, task, ...args) {
    console.log(`Model ${modelId} performing ${task} with args:`, args);

    const processingTime = Math.random() * 1000 + 500;
    
    return new Promise(resolve => {
      setTimeout(() => {
        switch (task) {
          case "generate":
            resolve(simulateTextGeneration(args[0], modelId));
            break;
          case "summarize":
            resolve(simulateTextSummarization(args[0], modelId));
            break;
          case "answerQuestion":
            resolve(simulateQuestionAnswering(args[0], args[1], modelId));
            break;
          default:
            resolve("Unsupported task");
        }
      }, processingTime);
    });
  }
  
  function simulateTextGeneration(inputText, modelId) {
    const prompt = inputText.toLowerCase();
    
    if (prompt.includes("network")) {
      return "A computer network is a set of computers sharing resources located on or provided by network nodes. Computers use common communication protocols over digital interconnections to communicate with each other. These interconnections are made up of telecommunication network technologies based on physically wired, optical, and wireless radio-frequency methods that may be arranged in a variety of network topologies.";
    } else if (prompt.includes("database")) {
      return "A database is an organized collection of data stored and accessed electronically. Small databases can be stored on a file system, while large databases are hosted on computer clusters or cloud storage. The design of databases spans formal techniques and practical considerations, including data modeling, efficient data representation and storage, query languages, security and privacy of sensitive data, and distributed computing issues.";
    } else if (prompt.includes("cloud computing")) {
      return "Cloud computing is the on-demand availability of computer system resources, especially data storage (cloud storage) and computing power, without direct active management by the user. Large clouds often have functions distributed over multiple locations, each location being a data center. Cloud computing relies on sharing of resources to achieve coherence and typically uses a pay-as-you-go model.";
    } else if (prompt.includes("artificial intelligence") || prompt.includes("ai")) {
      return "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.";
    } else {
      return "I'm an AI assistant specialized in ICT terminology. I can help explain concepts like computer networks, databases, cloud computing, artificial intelligence, and more. Please ask me about a specific ICT term you'd like to learn about.";
    }
  }
  
  function simulateTextSummarization(inputText, modelId) {

    if (inputText.length < 100) {
      return "The text is too short to summarize effectively.";
    } else if (inputText.length < 500) {
      return "This text discusses ICT concepts and their applications in modern technology environments.";
    } else {
      return "This comprehensive text explores various Information and Communication Technology (ICT) concepts, including networking principles, database management, cloud computing infrastructure, and artificial intelligence applications. It highlights the importance of these technologies in modern digital ecosystems and their impact on business operations and everyday life.";
    }
  }

  function simulateQuestionAnswering(question, context, modelId) {
    const q = question.toLowerCase();
    if (context && context.length > 0) {
      if (q.includes("what is") || q.includes("define") || q.includes("explain")) {
        if (q.includes("network")) {
          return "Based on the context, a network is a collection of interconnected computers and devices that can communicate and share resources.";
        } else if (q.includes("database")) {
          return "According to the context, a database is an organized collection of structured data stored electronically and accessed via a database management system.";
        } else if (q.includes("cloud")) {
          return "The context indicates that cloud computing refers to the delivery of computing services over the internet, including servers, storage, databases, and software.";
        } else {
          return "Based on the provided context, this refers to a key concept in Information and Communication Technology that involves digital systems and data processing.";
        }
      } else if (q.includes("how") || q.includes("why")) {
        return "The context explains that this process works through a combination of specialized protocols, algorithms, and infrastructure designed for efficient data processing and transmission.";
      } else {
        return "Based on the provided context, the answer relates to modern ICT systems that integrate various technologies to solve complex information processing challenges.";
      }
    }
  
    if (q.includes("what is ict")) {
      return "ICT stands for Information and Communication Technology. It encompasses all technologies used for handling telecommunications, broadcast media, intelligent building management systems, audiovisual processing and transmission systems, and network-based control and monitoring functions.";
    } else if (q.includes("network")) {
      return "A computer network is a group of computers and devices interconnected via communication channels, allowing for sharing of resources and information.";
    } else if (q.includes("database")) {
      return "A database is an organized collection of structured information or data, typically stored electronically in a computer system.";
    } else if (q.includes("cloud computing")) {
      return "Cloud computing is the delivery of different services through the Internet, including data storage, servers, databases, networking, and software.";
    } else if (q.includes("artificial intelligence") || q.includes("ai")) {
      return "Artificial Intelligence refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect.";
    } else {
      return "I don't have enough information to answer that question specifically. Could you provide more details or context?";
    }
  }
  
  export async function generateText(prompt, options = {}) {
    const modelId = options.modelId || MODELS.textGeneration.default;
    const maxLength = options.maxLength || 100;
    
    try {

      const model = await loadModel(modelId);

      const generatedText = await model.generate(prompt);
      
      return {
        text: generatedText,
        model: modelId,
        success: true
      };
    } catch (error) {
      console.error("Text generation error:", error);
      if (options.fallbackModelId && options.fallbackModelId !== modelId) {
        console.log(`Falling back to model: ${options.fallbackModelId}`);
        return generateText(prompt, { 
          ...options, 
          modelId: options.fallbackModelId,
          fallbackModelId: null 
        });
      }
      
      return {
        text: "I encountered an error generating a response. Please try again later.",
        model: null,
        success: false,
        error: error.message
      };
    }
  }
  
  export async function summarizeText(text, options = {}) {
    const modelId = options.modelId || MODELS.summarization.default;
    const maxLength = options.maxLength || 100;
    
    try {

      const model = await loadModel(modelId);
      const summary = await model.summarize(text);
      
      return {
        summary,
        model: modelId,
        success: true
      };
    } catch (error) {
      console.error("Text summarization error:", error);
      
      if (options.fallbackModelId && options.fallbackModelId !== modelId) {
        console.log(`Falling back to model: ${options.fallbackModelId}`);
        return summarizeText(text, { 
          ...options, 
          modelId: options.fallbackModelId,
          fallbackModelId: null
        });
      }
      
      return {
        summary: "I encountered an error summarizing this text. Please try again later.",
        model: null,
        success: false,
        error: error.message
      };
    }
  }
  

  export async function answerQuestion(question, context = "", options = {}) {
    const modelId = options.modelId || MODELS.questionAnswering.default;
    
    try {
  
      const model = await loadModel(modelId);
  
      const answer = await model.answerQuestion(question, context);
      
      return {
        answer,
        model: modelId,
        success: true
      };
    } catch (error) {
      console.error("Question answering error:", error);
      if (options.fallbackModelId && options.fallbackModelId !== modelId) {
        console.log(`Falling back to model: ${options.fallbackModelId}`);
        return answerQuestion(question, context, { 
          ...options, 
          modelId: options.fallbackModelId,
          fallbackModelId: null 
        });
      }
      
      return {
        answer: "I encountered an error answering this question. Please try again later.",
        model: null,
        success: false,
        error: error.message
      };
    }
  }
  
  
  export function getAvailableModels() {
    return MODELS;
  }
  
 
  export function getLoadedModels() {
    return Object.keys(modelCache).map(modelId => ({
      id: modelId,
      loadedAt: modelCache[modelId].loadedAt
    }));
  }
  

  export function unloadModel(modelId) {
    if (modelCache[modelId]) {
      console.log(`Unloading model: ${modelId}`);
      delete modelCache[modelId];
      return true;
    }
    return false;
  }
  