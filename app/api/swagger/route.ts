import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import yaml from 'js-yaml'

/**
 * GET /api/swagger
 * 
 * Serves the OpenAPI specification as JSON.
 * This endpoint is used by Swagger UI to load the API documentation.
 */
export async function GET() {
  try {
    // Read the OpenAPI YAML file
    const filePath = join(process.cwd(), 'openapi.yaml')
    const fileContents = readFileSync(filePath, 'utf8')
    
    // Parse YAML to JSON
    const spec = yaml.load(fileContents)
    
    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error)
    return NextResponse.json(
      { error: 'Failed to load OpenAPI specification' },
      { status: 500 }
    )
  }
}
