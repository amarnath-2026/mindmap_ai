import { MindMapGraph, ParsedDocument } from "@/types";

export interface DemoDataset {
  id: string;
  title: string;
  tagline: string;
  fileName: string;
  fileType: string;
  parsedDoc: ParsedDocument;
  graph: MindMapGraph;
}

export const DEMO_DATASETS: Record<string, DemoDataset> = {
  "prompt-engineering": {
    id: "prompt-engineering",
    title: "Prompt Engineering Principles & Techniques",
    tagline: "Methods for designing effective instructions for Large Language Models",
    fileName: "Prompt_Engineering_Guide.pdf",
    fileType: "pdf",
    parsedDoc: {
      id: "doc-prompt-eng",
      fileName: "Prompt_Engineering_Guide.pdf",
      fileType: "pdf",
      fileSize: 3450000,
      title: "Prompt Engineering Guide & Best Practices",
      extractedText: `
# Prompt Engineering Guide

## 1. Introduction to Prompting
Prompt engineering is the process of structuring text that can be interpreted and understood by a generative AI model. A prompt is the input instruction provided to a Large Language Model (LLM) to guide its responses. Language models predict the next token based on context provided in the prompt.

## 2. Fundamental Prompt Elements
An effective prompt generally consists of four key components:
- **Instruction**: The specific task or command you want the model to perform.
- **Context**: External information or background context to guide the model.
- **Input Data**: The specific text or problem instance to be processed.
- **Output Indicator**: Formatting constraints, output JSON schemas, or desired style.

## 3. Core Prompting Techniques
- **Zero-Shot Prompting**: Providing instructions directly without any prior examples.
- **Few-Shot Prompting**: Providing a few exemplar input-output pairs to condition model output pattern.
- **Chain-of-Thought (CoT)**: Encouraging the model to generate step-by-step intermediate reasoning before reaching a final answer.
- **Self-Consistency**: Generating multiple CoT reasoning paths and selecting the most consistent majority answer.
- **ReAct (Reason + Act)**: Combining reasoning traces with task-specific actions like API lookup or web search.

## 4. LLM Hyperparameters & Configuration
- **Temperature**: Controls randomness in sampling (0.0 for deterministic, 1.0 for creative).
- **Top_P (Nucleus Sampling)**: Filters token pool to cumulative probability mass P.
- **Frequency & Presence Penalties**: Discourage repetitive phrasing or introduce novel tokens.
- **Stop Sequences**: Triggers immediate generation termination upon matching strings.

## 5. Evaluation & System Architecture
Building reliable LLM applications requires evaluation frameworks (Evals), prompt version control, defense against prompt injection attacks, and strict JSON output parsing schemas.
      `,
      sections: [
        {
          id: "sec-1",
          heading: "1. Introduction to Prompting",
          level: 1,
          pageOrSlide: 1,
          content: "Prompt engineering is the process of structuring text that can be interpreted and understood by a generative AI model."
        },
        {
          id: "sec-2",
          heading: "2. Fundamental Prompt Elements",
          level: 1,
          pageOrSlide: 2,
          content: "Key components include Instruction, Context, Input Data, and Output Indicator."
        },
        {
          id: "sec-3",
          heading: "3. Core Prompting Techniques",
          level: 1,
          pageOrSlide: 3,
          content: "Zero-Shot, Few-Shot, Chain-of-Thought, Self-Consistency, and ReAct frameworks."
        },
        {
          id: "sec-4",
          heading: "4. LLM Hyperparameters & Configuration",
          level: 1,
          pageOrSlide: 4,
          content: "Temperature, Top_P, Frequency/Presence Penalties, and Stop Sequences."
        },
        {
          id: "sec-5",
          heading: "5. Evaluation & Security",
          level: 1,
          pageOrSlide: 5,
          content: "Evaluation frameworks, prompt injection defense, and schema validation."
        }
      ],
      metadata: {
        totalPages: 5,
        wordCount: 420,
        parsedAt: new Date().toISOString()
      }
    },
    graph: {
      id: "graph-prompt-eng",
      title: "Prompt Engineering",
      description: "Structured knowledge map of prompt design, techniques, and LLM configuration",
      rootId: "root",
      nodes: [
        {
          id: "root",
          label: "Prompt Engineering",
          type: "root",
          description: "Methods for designing effective instructions for Large Language Models to produce optimal outputs.",
          children: ["intro", "elements", "techniques", "params", "eval"],
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 1, section: "Title" }],
          color: "#3b82f6"
        },
        // Level 1: Major Topics
        {
          id: "intro",
          label: "Introduction & Basics",
          type: "topic",
          parentId: "root",
          description: "Fundamental definitions and mechanics of prompting LLMs.",
          children: ["llm-def", "prompt-def"],
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 1, section: "1. Introduction" }]
        },
        {
          id: "elements",
          label: "Prompt Components",
          type: "topic",
          parentId: "root",
          description: "The structural elements that make up an effective prompt.",
          children: ["elem-inst", "elem-ctx", "elem-input", "elem-output"],
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 2, section: "2. Fundamental Elements" }]
        },
        {
          id: "techniques",
          label: "Prompting Techniques",
          type: "topic",
          parentId: "root",
          description: "Advanced methodologies to improve model reasoning and accuracy.",
          children: ["tech-zero", "tech-few", "tech-cot", "tech-react"],
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 3, section: "3. Core Techniques" }]
        },
        {
          id: "params",
          label: "Model Parameters",
          type: "topic",
          parentId: "root",
          description: "Configuration settings that influence text generation behavior.",
          children: ["param-temp", "param-topp", "param-stop"],
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 4, section: "4. LLM Hyperparameters" }]
        },
        {
          id: "eval",
          label: "Evaluation & Security",
          type: "topic",
          parentId: "root",
          description: "Testing model outputs and defending against security vulnerabilities.",
          children: ["eval-framework", "sec-injection"],
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 5, section: "5. Evaluation & Security" }]
        },

        // Level 2: Subtopics & Concepts
        {
          id: "llm-def",
          label: "LLM Mechanics",
          type: "concept",
          parentId: "intro",
          description: "Language models predict the next token based on statistical context probability.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 1, section: "Introduction" }]
        },
        {
          id: "prompt-def",
          label: "Prompt Definition",
          type: "concept",
          parentId: "intro",
          description: "Input text provided to guide model output style, task execution, and response format.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 1, section: "Introduction" }]
        },

        {
          id: "elem-inst",
          label: "Instruction",
          type: "concept",
          parentId: "elements",
          description: "Specific command or task requested (e.g. 'Summarize', 'Translate', 'Code').",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 2, section: "Prompt Components" }]
        },
        {
          id: "elem-ctx",
          label: "Context",
          type: "concept",
          parentId: "elements",
          description: "External background knowledge, persona definition, or domain constraints.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 2, section: "Prompt Components" }]
        },
        {
          id: "elem-input",
          label: "Input Data",
          type: "concept",
          parentId: "elements",
          description: "The targeted payload text or problem query to process.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 2, section: "Prompt Components" }]
        },
        {
          id: "elem-output",
          label: "Output Formatting",
          type: "concept",
          parentId: "elements",
          description: "Desired format constraints such as JSON, Markdown tables, or bullet lists.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 2, section: "Prompt Components" }]
        },

        {
          id: "tech-zero",
          label: "Zero-Shot Prompting",
          type: "subtopic",
          parentId: "techniques",
          description: "Asking the model to complete a task without supplying any example demonstrations.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 3, section: "Core Techniques" }]
        },
        {
          id: "tech-few",
          label: "Few-Shot Prompting",
          type: "subtopic",
          parentId: "techniques",
          description: "Providing exemplar input-output pairs to steer output format and pattern matching.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 3, section: "Core Techniques" }]
        },
        {
          id: "tech-cot",
          label: "Chain-of-Thought (CoT)",
          type: "subtopic",
          parentId: "techniques",
          description: "Prompting the model to output intermediate reasoning steps before giving the final answer.",
          children: ["cot-self-con"],
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 3, section: "Core Techniques" }]
        },
        {
          id: "cot-self-con",
          label: "Self-Consistency",
          type: "detail",
          parentId: "tech-cot",
          description: "Samples multiple CoT reasoning paths and selects the majority consensus answer.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 3, section: "Core Techniques" }]
        },
        {
          id: "tech-react",
          label: "ReAct Framework",
          type: "subtopic",
          parentId: "techniques",
          description: "Interleaving reasoning traces with actionable tool use (APIs, search engines).",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 3, section: "Core Techniques" }]
        },

        {
          id: "param-temp",
          label: "Temperature",
          type: "concept",
          parentId: "params",
          description: "Controls sampling randomness. Low values (0.0) yield deterministic outputs; high values yield creativity.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 4, section: "LLM Hyperparameters" }]
        },
        {
          id: "param-topp",
          label: "Top_P Sampling",
          type: "concept",
          parentId: "params",
          description: "Nucleus sampling limits selection to cumulative probability mass P.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 4, section: "LLM Hyperparameters" }]
        },
        {
          id: "param-stop",
          label: "Stop Sequences",
          type: "concept",
          parentId: "params",
          description: "Explicit string triggers that immediately halt generation.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 4, section: "LLM Hyperparameters" }]
        },

        {
          id: "eval-framework",
          label: "LLM Evals",
          type: "concept",
          parentId: "eval",
          description: "Automated benchmarking using ground-truth datasets and LLM-as-a-judge approaches.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 5, section: "Evaluation & Security" }]
        },
        {
          id: "sec-injection",
          label: "Prompt Injection Defense",
          type: "concept",
          parentId: "eval",
          description: "Preventing malicious untrusted inputs from overriding system instructions.",
          sourceReferences: [{ file: "Prompt_Engineering_Guide.pdf", page: 5, section: "Evaluation & Security" }]
        }
      ],
      metadata: {
        sourceFiles: ["Prompt_Engineering_Guide.pdf"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodeCount: 19,
        depthMode: "detailed",
        theme: "dark_professional",
        layout: "horizontal"
      }
    }
  },

  "machine-learning": {
    id: "machine-learning",
    title: "Machine Learning Concepts & Algorithms",
    tagline: "Supervised, Unsupervised, and Deep Learning Foundations",
    fileName: "Machine_Learning_Overview.pptx",
    fileType: "pptx",
    parsedDoc: {
      id: "doc-ml",
      fileName: "Machine_Learning_Overview.pptx",
      fileType: "pptx",
      fileSize: 5100000,
      title: "Machine Learning Architecture & Algorithms",
      extractedText: `
Slide 1: Machine Learning Fundamentals
Machine learning (ML) is a branch of artificial intelligence focused on building applications that learn from data and improve accuracy over time without being explicitly programmed.

Slide 2: Supervised Learning
Supervised learning uses labeled datasets to train algorithms to classify data or predict outcomes accurately.
- Classification: Categorizes data into distinct classes (Logistic Regression, SVM, Random Forest).
- Regression: Predicts continuous numerical values (Linear Regression, Decision Trees).

Slide 3: Unsupervised Learning
Unsupervised learning analyzes and clusters unlabeled datasets to discover hidden patterns or data groupings without human intervention.
- Clustering: Grouping similar data points together (K-Means, Hierarchical Clustering, DBSCAN).
- Dimensionality Reduction: Reducing feature space complexity (PCA, t-SNE, UMAP).

Slide 4: Reinforcement Learning
RL is an area where an agent learns to take actions in an environment to maximize cumulative reward through trial and error (Q-Learning, PPO, Deep Q-Networks).

Slide 5: Deep Learning & Neural Networks
Deep Learning utilizes multi-layered Artificial Neural Networks (ANNs). Key architectures include Convolutional Neural Networks (CNNs) for vision, Recurrent Neural Networks (RNNs) for sequential data, and Transformer architectures for natural language.
      `,
      sections: [
        { id: "s1", heading: "Slide 1: ML Fundamentals", level: 1, pageOrSlide: 1, content: "Definition and paradigm shift from rule-based programming." },
        { id: "s2", heading: "Slide 2: Supervised Learning", level: 1, pageOrSlide: 2, content: "Classification and Regression algorithms with labeled data." },
        { id: "s3", heading: "Slide 3: Unsupervised Learning", level: 1, pageOrSlide: 3, content: "Clustering and Dimensionality Reduction without labels." },
        { id: "s4", heading: "Slide 4: Reinforcement Learning", level: 1, pageOrSlide: 4, content: "Reward-driven agent learning." },
        { id: "s5", heading: "Slide 5: Deep Learning", level: 1, pageOrSlide: 5, content: "ANNs, CNNs, RNNs, and Transformers." }
      ],
      metadata: { totalSlides: 5, wordCount: 280, parsedAt: new Date().toISOString() }
    },
    graph: {
      id: "graph-ml",
      title: "Machine Learning",
      description: "Comprehensive breakdown of supervised, unsupervised, reinforcement learning and deep neural networks",
      rootId: "root",
      nodes: [
        {
          id: "root",
          label: "Machine Learning",
          type: "root",
          description: "Algorithms that parse data, learn from it, and make informed decisions or predictions based on learned patterns.",
          children: ["supervised", "unsupervised", "reinforcement", "deep-learning"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 1 }]
        },
        // Topics
        {
          id: "supervised",
          label: "Supervised Learning",
          type: "topic",
          parentId: "root",
          description: "Training algorithms with labeled datasets where target outcomes are known.",
          children: ["classification", "regression"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 2 }]
        },
        {
          id: "unsupervised",
          label: "Unsupervised Learning",
          type: "topic",
          parentId: "root",
          description: "Discovering inherent structures or patterns in unlabeled datasets.",
          children: ["clustering", "dim-reduction"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 3 }]
        },
        {
          id: "reinforcement",
          label: "Reinforcement Learning",
          type: "topic",
          parentId: "root",
          description: "Agents learning optimal policy actions via environmental rewards and penalties.",
          children: ["q-learning", "policy-grad"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 4 }]
        },
        {
          id: "deep-learning",
          label: "Deep Neural Networks",
          type: "topic",
          parentId: "root",
          description: "Representation learning using multi-layered artificial neural network architectures.",
          children: ["cnn", "rnn", "transformer"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 5 }]
        },

        // Subtopics & Concepts
        {
          id: "classification",
          label: "Classification",
          type: "subtopic",
          parentId: "supervised",
          description: "Assigning input items into discrete categorical classes.",
          children: ["logistic-reg", "svm", "random-forest"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 2 }]
        },
        {
          id: "regression",
          label: "Regression",
          type: "subtopic",
          parentId: "supervised",
          description: "Predicting continuous numeric values based on feature relationships.",
          children: ["linear-reg"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 2 }]
        },
        {
          id: "logistic-reg",
          label: "Logistic Regression",
          type: "detail",
          parentId: "classification",
          description: "Probabilistic linear classifier using sigmoid activation function.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 2 }]
        },
        {
          id: "svm",
          label: "Support Vector Machines",
          type: "detail",
          parentId: "classification",
          description: "Finds optimal separating hyperplanes maximizing class margin.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 2 }]
        },
        {
          id: "random-forest",
          label: "Random Forest",
          type: "detail",
          parentId: "classification",
          description: "Ensemble of decision trees using bagging and feature subspace sampling.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 2 }]
        },
        {
          id: "linear-reg",
          label: "Linear Regression",
          type: "detail",
          parentId: "regression",
          description: "Models relationship between scalar dependent response and independent variables.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 2 }]
        },

        {
          id: "clustering",
          label: "Clustering",
          type: "subtopic",
          parentId: "unsupervised",
          description: "Partitioning data points into groups based on similarity distance metrics.",
          children: ["kmeans"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 3 }]
        },
        {
          id: "dim-reduction",
          label: "Dimensionality Reduction",
          type: "subtopic",
          parentId: "unsupervised",
          description: "Projecting high-dimensional data into lower dimensional space while preserving variance.",
          children: ["pca"],
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 3 }]
        },
        {
          id: "kmeans",
          label: "K-Means Clustering",
          type: "detail",
          parentId: "clustering",
          description: "Iteratively assigns data to K nearest centroid clusters.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 3 }]
        },
        {
          id: "pca",
          label: "Principal Component Analysis (PCA)",
          type: "detail",
          parentId: "dim-reduction",
          description: "Orthogonal linear transformation mapping data to new coordinate system of orthogonal principal components.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 3 }]
        },

        {
          id: "q-learning",
          label: "Q-Learning",
          type: "concept",
          parentId: "reinforcement",
          description: "Model-free value-based algorithm seeking best action given current state.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 4 }]
        },
        {
          id: "policy-grad",
          label: "Policy Gradients",
          type: "concept",
          parentId: "reinforcement",
          description: "Optimizes policy parameters directly via gradient ascent on expected reward.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 4 }]
        },

        {
          id: "cnn",
          label: "Convolutional Networks (CNN)",
          type: "concept",
          parentId: "deep-learning",
          description: "Spatial feature extraction using receptive convolutional kernels, pooled layers, and dense heads.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 5 }]
        },
        {
          id: "rnn",
          label: "Recurrent Networks (RNN)",
          type: "concept",
          parentId: "deep-learning",
          description: "Sequential memory handling using hidden recurrent state updates (LSTM, GRU).",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 5 }]
        },
        {
          id: "transformer",
          label: "Transformer Architecture",
          type: "concept",
          parentId: "deep-learning",
          description: "Self-attention mechanism processing sequences in parallel without recurrent recurrence.",
          sourceReferences: [{ file: "Machine_Learning_Overview.pptx", slide: 5 }]
        }
      ],
      metadata: {
        sourceFiles: ["Machine_Learning_Overview.pptx"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodeCount: 20,
        depthMode: "deep",
        theme: "dark_professional",
        layout: "horizontal"
      }
    }
  },

  "generative-ai": {
    id: "generative-ai",
    title: "Generative AI Systems & Architectures",
    tagline: "LLMs, Diffusion Models, RAG, and Agent Systems",
    fileName: "Generative_AI_Report.docx",
    fileType: "docx",
    parsedDoc: {
      id: "doc-genai",
      fileName: "Generative_AI_Report.docx",
      fileType: "docx",
      fileSize: 2800000,
      title: "Generative AI Systems, RAG & Agents",
      extractedText: `
# Generative AI Systems & Applications

## Section 1: Foundation Models
Generative AI refers to artificial intelligence capable of generating text, images, videos, synthetic audio, or code based on generative probability distributions learned from training data.

## Section 2: Large Language Models (LLMs)
LLMs use autoregressive transformer architectures to predict tokens. Key capabilities include natural language understanding, reasoning, translation, and code generation. Fine-tuning approaches include Instruction Fine-Tuning and RLHF (Reinforcement Learning from Human Feedback).

## Section 3: Diffusion & Multimodal Models
Diffusion models iteratively denoise random Gaussian noise to generate high-resolution images or videos (Stable Diffusion, Midjourney, Sora). Multimodal models unify vision, audio, and text embeddings into a joint multi-modal representation space.

## Section 4: Retrieval-Augmented Generation (RAG)
RAG combines non-parametric vector retrieval with parametric LLMs:
1. Document Chunking & Embedding
2. Vector Indexing in Vector Databases (FAISS, Chroma, pgvector)
3. Semantic Similarity Search via Cosine Distance
4. Grounded Prompt Context Synthesis

## Section 5: Autonomous AI Agents
AI Agents pair an LLM core with memory (short-term & long-term), reasoning engines, planning loops, and external tool execution environments.
      `,
      sections: [
        { id: "g1", heading: "Section 1: Foundation Models", level: 1, pageOrSlide: 1, content: "Definition of generative models." },
        { id: "g2", heading: "Section 2: LLMs & Fine-Tuning", level: 1, pageOrSlide: 2, content: "Autoregressive transformers and RLHF." },
        { id: "g3", heading: "Section 3: Diffusion Models", level: 1, pageOrSlide: 3, content: "Iterative denoising process for image generation." },
        { id: "g4", heading: "Section 4: Retrieval-Augmented Generation (RAG)", level: 1, pageOrSlide: 4, content: "Combining vector search with LLMs." },
        { id: "g5", heading: "Section 5: Autonomous AI Agents", level: 1, pageOrSlide: 5, content: "Memory, planning, and tool execution." }
      ],
      metadata: { totalPages: 5, wordCount: 310, parsedAt: new Date().toISOString() }
    },
    graph: {
      id: "graph-genai",
      title: "Generative AI",
      description: "Knowledge architecture of LLMs, Diffusion, RAG systems, and Autonomous Agent frameworks",
      rootId: "root",
      nodes: [
        {
          id: "root",
          label: "Generative AI",
          type: "root",
          description: "AI technologies that create new realistic synthetic data across modalities based on learned training patterns.",
          children: ["llms", "diffusion", "rag", "agents"],
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 1" }]
        },
        {
          id: "llms",
          label: "Large Language Models",
          type: "topic",
          parentId: "root",
          description: "Autoregressive models trained on vast text corpora for text processing and reasoning.",
          children: ["transformer-base", "rlhf"],
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 2" }]
        },
        {
          id: "diffusion",
          label: "Diffusion & Vision",
          type: "topic",
          parentId: "root",
          description: "Generative models using forward noise addition and reverse denoising U-Nets.",
          children: ["denoising", "multimodal"],
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 3" }]
        },
        {
          id: "rag",
          label: "Retrieval-Augmented Generation",
          type: "topic",
          parentId: "root",
          description: "Integrating external vector knowledge bases to prevent LLM hallucinations.",
          children: ["vector-db", "embedding-search"],
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 4" }]
        },
        {
          id: "agents",
          label: "Autonomous AI Agents",
          type: "topic",
          parentId: "root",
          description: "Systems using LLMs as central orchestrators for planning, memory, and tool calls.",
          children: ["agent-memory", "tool-execution"],
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 5" }]
        },

        // Subnodes
        {
          id: "transformer-base",
          label: "Decoder-Only Architecture",
          type: "concept",
          parentId: "llms",
          description: "Predicts the next token using causal self-attention masks.",
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 2" }]
        },
        {
          id: "rlhf",
          label: "RLHF Alignment",
          type: "concept",
          parentId: "llms",
          description: "Reinforcement Learning from Human Feedback tunes outputs for safety and helpfulness.",
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 2" }]
        },

        {
          id: "denoising",
          label: "Reverse Denoising",
          type: "concept",
          parentId: "diffusion",
          description: "Iteratively subtracts predicted noise vectors to construct high-fidelity images.",
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 3" }]
        },
        {
          id: "multimodal",
          label: "Multimodal Embeddings",
          type: "concept",
          parentId: "diffusion",
          description: "Joint embedding spaces mapping image tokens and text concepts (CLIP).",
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 3" }]
        },

        {
          id: "vector-db",
          label: "Vector Databases",
          type: "concept",
          parentId: "rag",
          description: "High-dimensional index stores for dense embedding vectors (FAISS, Chroma).",
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 4" }]
        },
        {
          id: "embedding-search",
          label: "Semantic Similarity Search",
          type: "concept",
          parentId: "rag",
          description: "Uses cosine similarity or dot product metrics to find contextually relevant text chunks.",
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 4" }]
        },

        {
          id: "agent-memory",
          label: "Agent Memory Systems",
          type: "concept",
          parentId: "agents",
          description: "Short-term prompt window memory and long-term vector store memory.",
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 5" }]
        },
        {
          id: "tool-execution",
          label: "Tool & API Execution",
          type: "concept",
          parentId: "agents",
          description: "Dynamic execution of web tools, calculators, code interpreters, and external APIs.",
          sourceReferences: [{ file: "Generative_AI_Report.docx", section: "Section 5" }]
        }
      ],
      metadata: {
        sourceFiles: ["Generative_AI_Report.docx"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodeCount: 13,
        depthMode: "detailed",
        theme: "dark_professional",
        layout: "horizontal"
      }
    }
  }
};
