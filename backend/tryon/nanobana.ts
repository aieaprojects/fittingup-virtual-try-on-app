import { secret } from "encore.dev/config";
import { storage } from "../shared/storage";
import { generateFileName } from "../shared/utils";

// Gemini API configuration - set these as secrets in your Encore dashboard
const geminiApiKey = secret("GEMINI_API_KEY");
const geminiEndpoint = secret("GEMINI_ENDPOINT");
const geminiModel = secret("GEMINI_MODEL");

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text?: string;
      inline_data?: {
        mime_type: string;
        data: string;
      };
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
  safetySettings?: Array<{
    category: string;
    threshold: string;
  }>;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inline_data?: {
          mime_type: string;
          data: string;
        };
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
    finishReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

async function downloadImageAsBase64(imageUrl: string): Promise<{ data: string; mimeType: string }> {
  console.log('--- Starting image download ---');
  console.log('Image URL:', imageUrl);
  
  try {
    console.log('Fetching image...');
    const response = await fetch(imageUrl, {
      signal: AbortSignal.timeout(30000), // 30 second timeout
    });

    console.log('Fetch response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const contentLength = response.headers.get('content-length');
    console.log('Image metadata:', { contentType, contentLength });

    console.log('Converting to array buffer...');
    const arrayBuffer = await response.arrayBuffer();
    console.log('Array buffer size:', arrayBuffer.byteLength);

    // Convert to Buffer for processing
    const buffer = Buffer.from(arrayBuffer);
    
    // Check if it's WebP by content type or signature
    const isWebP = contentType === 'image/webp' || 
                   (buffer.length >= 12 && 
                    buffer.toString('ascii', 0, 4) === 'RIFF' && 
                    buffer.toString('ascii', 8, 12) === 'WEBP');
    
    console.log('Image format analysis:', {
      contentType,
      isWebP,
      bufferSize: buffer.length,
      firstBytes: buffer.subarray(0, 12).toString('hex')
    });

    let processedBuffer = buffer;
    let finalMimeType = contentType;
    
    // For WebP images, warn and convert MIME type to image/jpeg for Gemini compatibility
    if (isWebP) {
      console.log('WebP detected - converting MIME type to image/jpeg for Gemini compatibility');
      // Note: Ideally we'd convert the actual image data, but for now we'll
      // rely on Gemini's ability to handle WebP despite the MIME type change
      finalMimeType = 'image/jpeg';
      console.log('WebP MIME type adjusted:', {
        originalType: contentType,
        adjustedType: finalMimeType,
        bufferSize: buffer.length
      });
    }
    
    // Ensure we have a valid image MIME type
    if (!finalMimeType.startsWith('image/')) {
      finalMimeType = 'image/jpeg'; // Default fallback
    }

    console.log('Converting to base64...');
    const base64 = processedBuffer.toString('base64');
    
    console.log('Base64 conversion complete:', {
      originalSize: arrayBuffer.byteLength,
      processedSize: processedBuffer.length,
      base64Size: base64.length,
      finalMimeType,
      base64Preview: base64.substring(0, 100) + '...'
    });

    return { data: base64, mimeType: finalMimeType };
  } catch (err) {
    console.error('Image download failed:', {
      url: imageUrl,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined
    });
    throw new Error(`Failed to download image from ${imageUrl}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function submitNanoBananaJob(
  userId: string,
  avatarUrl: string,
  fitUrl: string,
  options?: any
): Promise<string> {
  console.log('=== Starting Gemini Job Submission ===');
  console.log('User ID:', userId);
  console.log('Avatar URL:', avatarUrl);
  console.log('Fit URL:', fitUrl);

  // Check if Gemini is configured
  let apiKey: string;
  let endpoint: string;
  let model: string;
  
  try {
    apiKey = await geminiApiKey();
    endpoint = await geminiEndpoint();
    model = await geminiModel();
    console.log('Gemini configuration loaded successfully');
  } catch (err) {
    console.log('Gemini not configured, using demo mode');
    return `demo-job-${Date.now()}`;
  }

  // Set default values if not configured
  if (!apiKey || !endpoint || !model || 
      apiKey === 'not-set' || endpoint === 'not-set' || model === 'not-set') {
    console.log('Gemini not properly configured, using demo mode');
    return `demo-job-${Date.now()}`;
  }

  console.log('Gemini config:', { 
    hasApiKey: !!apiKey, 
    endpoint: endpoint.substring(0, 50) + '...', 
    model 
  });

  // Use the model-specific endpoint if only the base URL is provided
  if (endpoint === 'https://generativelanguage.googleapis.com' || 
      endpoint === 'https://generativelanguage.googleapis.com/') {
    endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  } else if (!endpoint.includes('generateContent')) {
    endpoint = `${endpoint.replace(/\/$/, '')}/${model}:generateContent`;
  }

  try {
    console.log('=== Starting Image Downloads ===');
    
    // Download both images and convert to base64
    console.log('Step 1: Downloading avatar image...');
    const avatarResult = await downloadImageAsBase64(avatarUrl);
    console.log('Avatar download result:', {
      success: !!avatarResult.data,
      size: avatarResult.data?.length || 0,
      mimeType: avatarResult.mimeType,
      first_chars: avatarResult.data?.substring(0, 50) || 'EMPTY'
    });
    
    console.log('Step 2: Downloading fit image...');  
    const fitResult = await downloadImageAsBase64(fitUrl);
    console.log('Fit download result:', {
      success: !!fitResult.data,
      size: fitResult.data?.length || 0,
      mimeType: fitResult.mimeType,
      first_chars: fitResult.data?.substring(0, 50) || 'EMPTY'
    });

    // Validate that we have both images
    if (!avatarResult.data || avatarResult.data.length === 0) {
      throw new Error('Failed to download avatar image - got empty data');
    }
    if (!fitResult.data || fitResult.data.length === 0) {
      throw new Error('Failed to download fit image - got empty data');
    }

    console.log('=== Both Images Downloaded Successfully ===');
    console.log('Avatar:', { size: avatarResult.data.length, mimeType: avatarResult.mimeType });
    console.log('Fit:', { size: fitResult.data.length, mimeType: fitResult.mimeType });

    const instructionText = "Generate a photo of the person from the first image wearing the outfit from the second image. Fit the outfit naturally.  Keep the face, body, and background from the first image unchanged.";

    console.log('=== Building Gemini Request ===');
    console.log('MIME types:', { avatar: avatarResult.mimeType, fit: fitResult.mimeType });
    console.log('Instruction text:', instructionText);

    console.log('=== Building Request Structure ===');
    const request: GeminiRequest = {
      contents: [{
        parts: [
          // Part 1: Avatar image (the person)
          {
            inline_data: {
              mime_type: avatarResult.mimeType,
              data: avatarResult.data
            }
          },
          // Part 2: Fit image (the clothing)
          {
            inline_data: {
              mime_type: fitResult.mimeType, 
              data: fitResult.data
            }
          },
          // Part 3: Instruction text
          {
            text: instructionText
          }
        ]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log('Request built successfully with:', {
      contents_count: request.contents.length,
      parts_count: request.contents[0].parts.length,
      part_types: request.contents[0].parts.map((part, i) => ({
        index: i,
        has_inline_data: !!part.inline_data,
        has_text: !!part.text,
        mime_type: part.inline_data?.mime_type,
        data_length: part.inline_data?.data?.length || 0,
        text_length: part.text?.length || 0
      }))
    });

    console.log('=== Sending Request to Gemini ===');
    console.log('Endpoint:', endpoint);
    
    const requestBody = JSON.stringify(request);
    console.log('Request body size:', requestBody.length);
    console.log('Request has avatar data:', request.contents[0].parts[0].inline_data?.data?.length || 0);
    console.log('Request has fit data:', request.contents[0].parts[1].inline_data?.data?.length || 0);
    console.log('Request has instruction:', request.contents[0].parts[2].text?.length || 0);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: requestBody,
      signal: AbortSignal.timeout(60000), // 60 second timeout
    });

    console.log('=== Gemini Response Received ===');
    console.log('Response status:', response.status, response.statusText);
    console.log('Response headers:', {
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json() as GeminiResponse;
    console.log('Full Gemini response structure:', {
      has_candidates: !!result.candidates,
      candidates_count: result.candidates?.length || 0,
      has_error: !!result.error,
      error_code: result.error?.code,
      error_message: result.error?.message
    });

    // Log the full response for debugging (this will help us see what we're getting)
    console.log('Complete Gemini response:', JSON.stringify(result, null, 2));

    if (result.error) {
      console.error('Gemini API returned error:', result.error);
      throw new Error(`Gemini API error: ${result.error.message}`);
    }

    if (!result.candidates || result.candidates.length === 0) {
      console.error('No candidates in response. Full response:', result);
      throw new Error('Gemini API returned no candidates');
    }

    const candidate = result.candidates[0];
    console.log('First candidate details:', {
      has_content: !!candidate.content,
      parts_count: candidate.content?.parts?.length || 0,
      finish_reason: candidate.finishReason,
      safety_ratings: candidate.safetyRatings?.length || 0
    });

    // Check if content was blocked by safety filters
    if (candidate.finishReason === 'SAFETY') {
      console.error('Content blocked by safety filters:', candidate.safetyRatings);
      throw new Error('Content blocked by Gemini safety filters. Try different images.');
    }

    if (candidate.finishReason === 'RECITATION') {
      console.error('Content blocked due to recitation concerns');
      throw new Error('Content blocked due to recitation concerns. Try different images.');
    }

    if (!candidate.content?.parts || candidate.content.parts.length === 0) {
      console.error('No content parts in candidate. Candidate:', candidate);
      throw new Error(`Gemini API returned no content parts (finish reason: ${candidate.finishReason})`);
    }

    // Log all parts to see what we're getting
    console.log('All response parts:');
    candidate.content.parts.forEach((part, index) => {
      console.log(`Part ${index}:`, {
        has_text: !!part.text,
        has_inline_data: !!part.inline_data,
        text_preview: part.text?.substring(0, 200),
        inline_data_mime: part.inline_data?.mime_type
      });
    });

    // Try to find image data - check both camelCase and snake_case
    let imagePart = candidate.content.parts.find(part => 
      part.inline_data?.data || part.inlineData?.data
    );
    
    if (imagePart) {
      let imageData: string | undefined;
      let mimeType: string = 'image/jpeg'; // Default value
      
      // Handle both camelCase and snake_case response formats
      if (imagePart.inline_data?.data) {
        imageData = imagePart.inline_data.data;
        mimeType = imagePart.inline_data.mime_type || 'image/jpeg';
        console.log('Found image data in snake_case format (inline_data)');
      } else if (imagePart.inlineData?.data) {
        imageData = imagePart.inlineData.data;
        mimeType = imagePart.inlineData.mimeType || 'image/jpeg';
        console.log('Found image data in camelCase format (inlineData)');
      }
      
      if (imageData && (mimeType.includes('png') || mimeType.includes('jpeg') || mimeType.includes('jpg'))) {
        console.log('Valid image found:', { mimeType, dataLength: imageData.length });
        
        console.log('Storing generated image...');
        const storedUrl = await storeGeneratedImage(userId, imageData, mimeType);
        
        const jobId = `gemini-job-${Date.now()}-${storedUrl}`;
        console.log('Gemini generation completed, job ID:', jobId);
        
        return jobId;
      }
    }

    // If no image data found, log compact summary and show friendly error
    const textParts = candidate.content.parts.filter(part => part.text);
    const blockReason = candidate.safetyRatings?.find(rating => 
      rating.probability === 'HIGH' || rating.probability === 'MEDIUM'
    )?.category;
    
    // Log compact summary for debugging (server-side only)
    console.log('No image found in response. Summary:', {
      finishReason: candidate.finishReason,
      blockReason: blockReason || 'none',
      partsCount: candidate.content.parts.length,
      partKeys: candidate.content.parts.map((part, i) => ({
        index: i,
        keys: Object.keys(part),
        hasInlineData: !!part.inline_data,
        hasInlineDataCamel: !!part.inlineData,
        hasText: !!part.text
      }))
    });
    
    // Check if it's a text response that might indicate the model can't generate images
    if (textParts.length > 0) {
      const allText = textParts.map(p => p.text).join(' ');
      console.log('Gemini returned text instead of image:', allText);
      
      // Check if the text indicates this model doesn't support image generation
      const text = allText.toLowerCase();
      if (text.includes('cannot') || text.includes("can't") || text.includes('unable') || 
          text.includes('not able') || text.includes('text-only') || text.includes('language model')) {
        throw new Error(`Model doesn't support image generation. Please check configuration.`);
      }
    }

    // Show friendly retry message to user
    throw new Error('Couldn\'t generate the look — Try again.');

  } catch (err) {
    console.error('Gemini API error:', err);
    throw new Error(`Failed to generate with Gemini: ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function storeGeneratedImage(userId: string, base64Data: string, mimeType: string): Promise<string> {
  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Generate storage path
    const extension = mimeType.includes('png') ? 'png' : 'jpg';
    const fileName = generateFileName(userId, 'results', extension);
    
    // Upload to storage
    await storage.upload(fileName, imageBuffer, {
      contentType: mimeType,
    });

    console.log('Image stored at:', fileName);
    return fileName;
  } catch (err) {
    console.error('Error storing generated image:', err);
    throw new Error(`Failed to store generated image: ${err}`);
  }
}

export async function checkNanoBananaJobStatus(jobId: string): Promise<{
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result_url?: string;
  error?: string;
  created_at?: string;
  completed_at?: string;
}> {
  // Handle demo mode
  if (jobId.startsWith('demo-job-')) {
    const timestamp = parseInt(jobId.replace('demo-job-', ''));
    const elapsed = Date.now() - timestamp;
    
    // Simulate processing for 15 seconds, then return success with demo image
    if (elapsed < 15000) {
      return { 
        id: jobId, 
        status: 'processing',
        created_at: new Date(timestamp).toISOString()
      };
    } else {
      // Return a realistic fashion try-on demo image
      return { 
        id: jobId, 
        status: 'completed',
        result_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=768&h=1024&q=80',
        created_at: new Date(timestamp).toISOString(),
        completed_at: new Date().toISOString()
      };
    }
  }

  // Handle Gemini jobs - they complete immediately
  if (jobId.startsWith('gemini-job-')) {
    const parts = jobId.split('-');
    if (parts.length >= 4) {
      const timestamp = parseInt(parts[2]);
      const storedPath = parts.slice(3).join('-');
      
      return {
        id: jobId,
        status: 'completed',
        result_url: storedPath, // This will be converted to signed URL by the status endpoint
        created_at: new Date(timestamp).toISOString(),
        completed_at: new Date().toISOString()
      };
    }
  }

  throw new Error(`Unknown job type: ${jobId}`);
}

export async function downloadAndStoreResult(
  userId: string,
  resultUrl: string
): Promise<string> {
  // For external URLs (demo), return them directly
  if (resultUrl.includes('http')) {
    return resultUrl;
  }
  
  // For stored paths, return the path (will be converted to signed URL by status endpoint)
  return resultUrl;
}
