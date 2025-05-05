import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyApiKey } from '@/lib/verifyApiKey'
import { withApiLogging } from '@/lib/with-api-logging'
import type { Database } from '@/types/database'

export const runtime = 'nodejs'

// --- Simplified Type Definitions ---

// Define the expected request body structure
type SearchRequestBody = {
  vendor: string; // Required vendor filter
  page: number;   // Required for pagination
};

// Use Database type for Product
type Product = Database['public']['Tables']['products']['Row']

// Final API response structure
type SearchResponse = {
  products: Product[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
};

type ApiError = {
  error: string;
  details?: string;
};

// --- Constants ---
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10 // Standard limit per page

// --- API Handler ---

export const POST = withApiLogging(async function POST(request: NextRequest): Promise<NextResponse<SearchResponse | ApiError>> {
  // --- API Key Verification ---
  const apiKey = request.headers.get('x-api-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'API key required (x-api-key header)' }, { status: 401 })
  }
  const apiKeyInfo = await verifyApiKey(apiKey)
  if (!apiKeyInfo.valid) {
    const reason = 'reason' in apiKeyInfo ? apiKeyInfo.reason : 'Unknown reason';
    console.warn(`Invalid API key attempt: ${reason}`)
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  try {
    let body: SearchRequestBody; // Remove default initialization
    try {
      // Attempt to parse JSON body
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
      } else {
        // Return error for empty body since fields are required
        return NextResponse.json(
          { error: 'Invalid request: Request body is required with vendor and page parameters' },
          { status: 400 }
        );
      }
    } catch (parseError: unknown) {
      if (parseError instanceof SyntaxError) {
        console.error('Failed to parse request JSON:', parseError.message);
        return NextResponse.json(
          { error: 'Invalid request: Request body contains malformed JSON.' },
          { status: 400 }
        );
      }
      throw parseError; // Re-throw other errors
    }

    // --- Parameter Processing ---
    // Validate required fields
    if (!body.vendor || typeof body.vendor !== 'string' || !body.vendor.trim()) {
      return NextResponse.json(
        { error: 'Invalid request: vendor parameter is required' },
        { status: 400 }
      );
    }

    if (!body.page || typeof body.page !== 'number') {
      return NextResponse.json(
        { error: 'Invalid request: page parameter is required and must be a number' },
        { status: 400 }
      );
    }

    const { vendor } = body // Extract vendor from the body
    const page = Math.max(1, body.page) // Ensure page is at least 1
    const limit = DEFAULT_LIMIT // Use the fixed default limit
    const offset = (page - 1) * limit

    console.log(`Fetching products with filter: vendor=${vendor}, page: ${page}, limit: ${limit}`);

    // --- Build Supabase Query ---
    let query = supabase
      .from('products')
      .select('*', { count: 'exact' }) // Select all columns and request total count

    // Apply vendor filter (case-insensitive partial match)
    query = query.ilike('vendor', `%${vendor.trim()}%`)

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Order by updated_at (most recent first)
    query = query.order('updated_at', { ascending: false });

    // --- Execute Query ---
    const { data: productsData, error: queryError, count: totalCount } = await query;

    if (queryError) {
      console.error('Supabase query error (products):', queryError)
      return NextResponse.json({ error: 'Failed to retrieve products due to a database query error.' }, { status: 500 })
    }

    // --- Process Results ---
    const products: Product[] = productsData || []; // Ensure products is an array
    const totalItems = totalCount ?? 0; // Use the actual total count
    const totalPages = Math.ceil(totalItems / limit);

    // --- Format Response ---
    const response: SearchResponse = {
      products: products,
      meta: {
        totalItems: totalItems, // Use the actual total count here
        totalPages: totalPages,
        currentPage: page,
        pageSize: limit
      }
    }

    return NextResponse.json(response)

  } catch (error: unknown) {
    console.error('Error processing product search request:', error)
    let message = 'An unexpected error occurred while processing the search request.'
    let status = 500
    if (error instanceof Error) {
        // Log specific error internally if needed
    }

    return NextResponse.json({ error: message }, { status })
  }
})