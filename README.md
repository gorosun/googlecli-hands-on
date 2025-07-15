# Google CLI Hands-On

A TypeScript project demonstrating Google Cloud Vertex AI integration with Gemini API for enterprise-grade AI applications.

## Overview

This project showcases how to integrate Google Cloud Vertex AI with the Gemini AI models using TypeScript. It provides a complete setup for enterprise users who need secure, scalable AI integration with proper authentication and error handling.

### Key Features

- **Google Cloud Vertex AI Integration**: Stable enterprise-grade AI API access
- **Gemini 2.5 Pro Model**: Advanced language model capabilities
- **TypeScript Implementation**: Type-safe development with comprehensive error handling
- **Enterprise Security**: Service account-based authentication
- **Streaming Support**: Real-time response streaming capabilities
- **Comprehensive Documentation**: Detailed setup and troubleshooting guides

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Google Cloud Platform account with billing enabled
- Google Cloud project with Vertex AI API enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd googlecli-hands-on
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.sample .env
   ```

   Edit `.env` with your Google Cloud configuration:

   ```env
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
   GOOGLE_CLOUD_PROJECT=your-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

### Basic Usage

The main application demonstrates both regular and streaming text generation:

```typescript
import { VertexAI } from "@google-cloud/vertexai";

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION,
});

// Generate text with Gemini
const model = vertexAI.getGenerativeModel({
  model: "gemini-2.5-pro",
});

const result = await model.generateContent("Hello, world!");
console.log(result.response.candidates[0].content);
```

## Project Structure

```
googlecli-hands-on/
├── README.md                 # Project overview and quick start
├── index.ts                  # Main application entry point
├── package.json              # Node.js dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .env.sample              # Environment variables template
├── .gitignore               # Git ignore patterns
└── docs/                    # Documentation
    ├── index.md             # Documentation index
    ├── template_documentation.md  # Documentation standards
    ├── setup/               # Setup guides
    │   ├── index.md
    │   └── setup_google_cloud_vertex_ai_guide_jp.md
    └── guides/              # Usage guides
        ├── index.md
        └── guides_google_ai_enterprise_jp.html
```

## Documentation

### Setup Guides

- **[Google Cloud Vertex AI Setup](docs/setup/setup_google_cloud_vertex_ai_guide_jp.md)** - Complete setup guide for Google Cloud Vertex AI (Japanese)
- **[Setup Index](docs/setup/index.md)** - Setup documentation overview

### Usage Guides

- **[Enterprise AI Guide](docs/guides/guides_google_ai_enterprise_jp.html)** - Enterprise usage guidelines (Japanese)
- **[Guides Index](docs/guides/index.md)** - Usage documentation overview

### Documentation Standards

- **[Documentation Template](docs/template_documentation.md)** - Standards for creating and organizing documentation

## Configuration

### Environment Variables

| Variable                         | Description                           | Example              |
| -------------------------------- | ------------------------------------- | -------------------- |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON key file | `./path/to/key.json` |
| `GOOGLE_CLOUD_PROJECT`           | Your Google Cloud project ID          | `my-project-123`     |
| `GOOGLE_CLOUD_LOCATION`          | Google Cloud region                   | `us-central1`        |

### Google Cloud Setup

1. **Enable Vertex AI API** in your Google Cloud project
2. **Create a service account** with Vertex AI permissions
3. **Download the JSON key file** for authentication
4. **Set up billing** for your Google Cloud project

## Troubleshooting

### Common Issues

- **Authentication Errors**: Ensure your service account has proper Vertex AI permissions
- **Billing Issues**: Verify that billing is enabled for your Google Cloud project
- **API Errors**: Check that Vertex AI API is enabled in your project

### Getting Help

- Check the [detailed setup guide](docs/setup/setup_google_cloud_vertex_ai_guide_jp.md) for comprehensive troubleshooting
- Review the [enterprise usage guide](docs/guides/guides_google_ai_enterprise_jp.html) for best practices

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **AI Platform**: Google Cloud Vertex AI
- **AI Model**: Gemini 2.5 Pro
- **Package**: `@google-cloud/vertexai` (stable version)
- **Authentication**: Google Cloud Service Account

## Security Considerations

- Uses enterprise-grade Google Cloud Vertex AI (not experimental preview APIs)
- Service account-based authentication for secure API access
- Environment variable configuration for credential management
- Proper `.gitignore` configuration to protect sensitive files

## License

This project is for educational and demonstration purposes.

## Contributing

Contributions are welcome! Please follow the documentation standards defined in [`docs/template_documentation.md`](docs/template_documentation.md) when adding new documentation.
