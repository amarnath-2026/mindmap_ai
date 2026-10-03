# MindMap AI

> **Turn any document into an intelligent visual mind map.**

MindMap AI is a production-quality full-stack application that transforms PDFs, PowerPoint presentations, Word documents, Markdown/Text files, and images into interactive, hierarchical knowledge maps.

---

## 🌟 Key Features

- 📄 **Multi-Format Extraction**: Extract structured content from PDF, PPT/PPTX, DOC/DOCX, TXT, MD, and image OCR scans.
- 🧠 **Multi-Agent Knowledge Pipeline**: Modular agents for document understanding, knowledge hierarchy extraction, graph generation, and validation.
- 🎨 **NotebookLM Signature Visual Style**: Sleek slate-indigo root pills, dark-teal concept nodes, curved bezier connectors, and dark pitch canvas.
- ⚡ **Interactive Mind Map Canvas**: Powered by React Flow and Dagre graph layout (supporting Horizontal, Vertical, Radial, and Tree modes).
- 🔍 **Dynamic AI Node Expansion**: Expand sub-branches in real-time, request ELI5 simplifications, and generate exam/viva study quizzes per node.
- 🔐 **User Accounts & Google Auth**: Per-user isolated database sessions for saved maps and uploaded file history.
- ☀️/🌙 **Full App Light & Dark Modes**: Seamless theme switching across all views, sidebars, headers, and mind map canvas.
- 📤 **Multi-Format Export**: Export as PNG, PDF, JSON data, Markdown outlines, or copy raw Mermaid syntax.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Visualization**: `@xyflow/react` (React Flow), `@dagrejs/dagre`
- **Document Parsing**: `pdfjs-dist`, `mammoth`, `jszip`, `tesseract.js`
- **Exporting**: `html-to-image`, `jspdf`
- **Icons**: Lucide Icons

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/amarnath-2026/mindmap_ai.git

# Navigate to project directory
cd mindmap_ai

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
