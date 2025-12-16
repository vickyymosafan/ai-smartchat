/**
 * API Client Generator Script
 * 
 * This script generates a TypeScript API client from the OpenAPI specification.
 * Run with: npm run generate:api
 */

const { generateApi } = require('swagger-typescript-api');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve(__dirname, '../lib/generated');
const SPEC_PATH = path.resolve(__dirname, '../openapi.yaml');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generate() {
  console.log('🚀 Generating API client from OpenAPI spec...');
  console.log(`📄 Spec: ${SPEC_PATH}`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);

  try {
    await generateApi({
      name: 'api-client.ts',
      output: OUTPUT_DIR,
      input: SPEC_PATH,
      httpClientType: 'fetch',
      generateClient: true,
      generateRouteTypes: true,
      generateResponses: true,
      extractRequestParams: true,
      extractRequestBody: true,
      unwrapResponseData: false,
      prettier: {
        printWidth: 100,
        tabWidth: 2,
        trailingComma: 'es5',
        singleQuote: true,
      },
      defaultResponseAsSuccess: false,
      generateUnionEnums: true,
      addReadonly: false,
      extractEnums: true,
      moduleNameFirstTag: true,
      modular: false,
      singleHttpClient: true,
    });

    console.log('✅ API client generated successfully!');
    console.log(`📦 Output file: ${path.join(OUTPUT_DIR, 'api-client.ts')}`);
  } catch (error) {
    console.error('❌ Error generating API client:', error);
    process.exit(1);
  }
}

generate();
