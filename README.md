# Catalog AI Documentation

This repository contains the official documentation for Catalog AI, a powerful product discovery platform for agentic commerce.

## Features

The documentation covers:

- **Search API**: Advanced product discovery with natural language processing and intelligent filtering capabilities
- **Feed API**: Customizable product feeds for powering agentic shopping applications
- **API Playground**: Interactive examples in JavaScript, Python, and cURL
- **Developer Guides**: Detailed guides on request/response structures

## Documentation Structure

- **Overview**: Introduction to Catalog AI and its capabilities
- **Getting Started**: Quick setup guides and authentication
- **Developer Guides**: 
  - Search API (request and response structures)
  - Feed API (request and response structures)
- **Examples**: Code samples and use cases

## Local Development

To preview the documentation changes locally:

1. Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify)

```bash
npm i -g mintlify
```

2. Run the development server at the root of your documentation

```bash
mintlify dev
```

3. Visit http://localhost:3000 to see your documentation

### Configuration

The documentation is configured through the `mint.json` file, which includes:

- Site metadata
- Navigation structure
- Color themes and branding
- Sidebar organization

## Deployment

Changes to the documentation are automatically deployed when pushed to the main branch.

1. Install our GitHub App to enable automatic deployments
2. Push changes to the default branch
3. Your changes will be live within minutes

## API Access

To access the Catalog AI API:

1. [Contact the team](mailto:hamish@getcatalog.ai) to obtain an API key
2. Include your API key in the `x-api-key` header with every request
3. Use the API endpoints at `https://catalogai.vercel.app/api/`

## Troubleshooting

- If `mintlify dev` isn't running, try `mintlify install` to re-install dependencies
- If a page loads as a 404, ensure you're running in a folder with `mint.json`
- For API issues, check authentication headers and request format
- For further assistance, contact [support](mailto:hamish@getcatalog.ai)

## Links

- [Catalog AI Website](https://www.getcatalog.ai)
- [Twitter](https://x.com/hamishgunaseka)
