# Bundle Analyzer QA System

A bundle size analysis tool for podverse-web that generates visual reports of your Next.js application's bundle composition.

## Overview

This system uses `@next/bundle-analyzer` to analyze the production build of podverse-web, generating interactive HTML reports that show the size and composition of server and client bundles. Reports are saved to `qa/reports/bundle-analyzer/` for easy tracking and comparison.

## Features

- **Automated Bundle Analysis**: Builds the app in production mode and generates bundle reports
- **Visual Reports**: Creates interactive HTML visualizations of bundle composition
- **Report Management**: Stores reports with timestamps and custom names
- **Separate Server/Client Analysis**: Generates separate reports for server and client bundles
- **On-Demand Generation**: Run analysis when needed, reports saved to files

## Prerequisites

- **Node.js 22.17.0 or higher** (specified in `.nvmrc`)
  - If using nvm: `nvm use` in this directory to switch to the correct version
  - Or ensure your Node.js version matches `.nvmrc`
- podverse-web repository (this tool runs from within the repo)
- Next.js configured to work with `@next/bundle-analyzer`

## Installation

```bash
cd qa/bundle-analyzer
npm install
```

## Setup

1. **Configure Next.js for Bundle Analyzer**: The `next.config.ts` in the root of podverse-web needs to be configured to support bundle analyzer. The analyzer will automatically enable when `ANALYZE=true` environment variable is set.

2. **Environment Variables** (optional): Create a `.env` file in `qa/bundle-analyzer/` if you need custom environment variables. The tool will also load variables from `podverse-web/env/local.env`.

## Usage

Run the bundle analyzer:

```bash
npm run analyze
```

The CLI will prompt you to:
1. Enter a name for the bundle analysis report (e.g., "v1.0", "before-optimization", "after-lazy-loading", etc.)

### Report Generation

The system will:
1. Build the Next.js app in production mode with bundle analyzer enabled
2. Generate HTML reports for server and client bundles
3. Generate stats JSON files for server and client bundles
4. Save reports to `qa/reports/bundle-analyzer/` with the following naming:
   - `bundle-report-{name}-{timestamp}-server.html` - Server bundle visualization
   - `bundle-report-{name}-{timestamp}-client.html` - Client bundle visualization
   - `bundle-report-{name}-{timestamp}-server-stats.json` - Server stats export
   - `bundle-report-{name}-{timestamp}-client-stats.json` - Client stats export
   - `bundle-report-{name}-{timestamp}.json` - Metadata about the report

### Viewing Reports

Open the generated HTML files in your browser to view interactive bundle visualizations:
- **Treemap view**: Shows the relative size of each module
- **Zoom and filter**: Explore specific packages and modules
- **Size information**: See both parsed and gzipped sizes

## Report Structure

Reports are stored in `qa/reports/bundle-analyzer/` with the following structure:

**HTML Reports:**
- `bundle-report-{name}-{timestamp}-server.html` - Interactive server bundle visualization
- `bundle-report-{name}-{timestamp}-client.html` - Interactive client bundle visualization

**JSON Metadata:**
- `bundle-report-{name}-{timestamp}.json` - Contains:
  ```json
  {
    "timestamp": "2024-01-15T10:30:00Z",
    "reportName": "v1.0",
    "serverBundlePath": "path/to/server.html",
    "clientBundlePath": "path/to/client.html",
    "serverBundleSize": 1234567,
    "clientBundleSize": 2345678,
    "serverStatsPath": "path/to/server-stats.json",
    "clientStatsPath": "path/to/client-stats.json",
    "serverChunkSummary": {
      "totalChunks": 42,
      "totalAssets": 120,
      "totalAssetSize": 3456789,
      "topChunks": [
        { "name": "main", "size": 123456, "files": ["static/chunks/main.js"] }
      ]
    },
    "clientChunkSummary": {
      "totalChunks": 50,
      "totalAssets": 140,
      "totalAssetSize": 4567890,
      "topChunks": [
        { "name": "app", "size": 234567, "files": ["static/chunks/app.js"] }
      ]
    }
  }
  ```

## Integration with Next.js

The bundle analyzer works by:
1. Setting `ANALYZE=true` environment variable
2. Running `npm run build` in the podverse-web root directory
3. `@next/bundle-analyzer` generates HTML reports in `.next/analyze/`
4. The tool copies these reports to `qa/reports/bundle-analyzer/` with proper naming

**Note**: You may need to update `next.config.ts` in the root of podverse-web to include bundle analyzer configuration. The analyzer will work automatically if `@next/bundle-analyzer` is properly configured.

## Comparison Between Builds

To compare bundle sizes between different builds:
1. Run the analyzer with different report names (e.g., "before" and "after")
2. Open the HTML reports side-by-side in your browser
3. Compare the visualizations to see what changed
4. Check the JSON metadata files for size differences

## Troubleshooting

**Build fails:**
- Ensure all dependencies are installed in the podverse-web root: `cd ../../ && npm install`
- Check that `@next/bundle-analyzer` is installed in podverse-web
- Verify `next.config.ts` is properly configured

**No reports generated:**
- Check that `ANALYZE=true` is being set (the tool sets this automatically)
- Verify the build completed successfully
- Check `.next/analyze/` directory for generated files

**Reports directory not found:**
- The tool automatically creates `qa/reports/bundle-analyzer/` if it doesn't exist
- Ensure you have write permissions in the qa directory

## Development

The system consists of:
- `build-manager.ts`: Handles building the Next.js app with analyzer enabled
- `bundle-analyzer.ts`: Core analyzer logic and report generation
- `report-manager.ts`: Report storage, retrieval, and file management
- `index.ts`: Main CLI interface

## Notes

- The analyzer builds the app in production mode, which may take several minutes
- Reports are saved with timestamps to allow multiple reports with the same name
- HTML reports are self-contained and can be shared or archived
- The tool does not require a running web server - it only needs to build the app
