# Gemini API Configuration for Clozet

This document explains how to configure Google's Gemini API for virtual try-on image generation in your Clozet app.

## Required Secrets

Set these secrets in your Encore dashboard or via CLI:

### 1. GEMINI_API_KEY
- **Value**: Your Gemini API key from Google AI Studio
- **How to get**: 
  1. Go to [Google AI Studio](https://aistudio.google.com/)
  2. Create a new project or use existing
  3. Generate an API key
  4. Copy the key (starts with `AIza...`)

### 2. GEMINI_ENDPOINT  
- **Value**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`
- **Note**: This is the exact endpoint for Gemini's image generation model
- **Alternative**: You can also use just `https://generativelanguage.googleapis.com` and the app will construct the full endpoint

### 3. GEMINI_MODEL
- **Value**: `gemini-2.5-flash-image-preview`
- **Note**: This model supports both image input and image output generation
- **Alternative**: `gemini-2.0-flash-preview-image-generation` (also supports image generation)

## Setting Up Secrets

### Option 1: Encore Dashboard
1. Go to your Encore dashboard
2. Navigate to your app settings
3. Add secrets:
   - Name: `GEMINI_API_KEY`, Value: `AIza...your_actual_key...`
   - Name: `GEMINI_ENDPOINT`, Value: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`
   - Name: `GEMINI_MODEL`, Value: `gemini-2.5-flash-image-preview`

### Option 2: Encore CLI
```bash
# Production environment
encore secret set --type prod GEMINI_API_KEY
# Enter your API key when prompted: AIza...your_actual_key...

encore secret set --type prod GEMINI_ENDPOINT
# Enter: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent

encore secret set --type prod GEMINI_MODEL
# Enter: gemini-2.5-flash-image-preview

# Development environment  
encore secret set --type dev GEMINI_API_KEY
encore secret set --type dev GEMINI_ENDPOINT
encore secret set --type dev GEMINI_MODEL
```

## How It Works

### 1. Image Generation Flow
1. User uploads avatar and selects fit
2. Backend downloads both images via signed URLs
3. Converts images to base64 format
4. Sends single request to Gemini with:
   - Avatar image (inline data)
   - Fit image (inline data)  
   - Instruction text
5. Gemini returns generated image as base64
6. Backend saves image to storage
7. Returns signed URL to frontend

### 2. Security Features
- ✅ **API key never exposed** to frontend
- ✅ **No logging** of API keys
- ✅ **Server-side only** image processing
- ✅ **Signed URLs** for secure image access
- ✅ **Timeout protection** (60 seconds)

### 3. Instruction Prompt
The exact prompt sent to Gemini:
```
"Use the first image as the avatar. Keep identity, face, body, and hands the same. Replace only the clothing with the fit image. Respect pose, lighting, texture, and drape. Produce one realistic photo of the avatar wearing the fit. No body morphing or facial changes."
```

## Testing

### Demo Mode
If secrets are not configured, the app runs in demo mode:
- 15-second simulation
- Returns sample fashion image
- Full UI flow works

### Production Mode  
With secrets configured:
- Real Gemini API calls
- Generated virtual try-on images
- Instant results (no polling needed)

### Test Endpoints
```bash
# Test Gemini integration
POST /api/admin/test-gemini
{
  "avatar_url": "https://example.com/avatar.jpg",
  "fit_url": "https://example.com/fit.jpg"
}

# Check job status
GET /api/admin/check-job/{job_id}
```

## Error Handling

### Common Issues
1. **Invalid API Key**: Check key is correct and has proper permissions
2. **Quota Exceeded**: Check Google Cloud billing and quotas
3. **Image Download Fails**: Ensure signed URLs are accessible
4. **Model Not Available**: Verify Gemini model name is correct

### Error Messages
- ✅ **Clear user feedback**: "Couldn't generate the look — Try again."
- ✅ **Retry functionality**: Automatic retry button
- ✅ **Detailed logging**: Server-side error tracking
- ✅ **Graceful fallback**: Demo mode if API unavailable

## Cost Optimization

### Gemini Pricing
- Image generation calls are charged per request
- Monitor usage in Google Cloud Console
- Set budget alerts to control costs

### App Optimization
- ✅ **Single API call** per generation (no polling)
- ✅ **Efficient image processing** with proper compression
- ✅ **Error handling** prevents unnecessary retries
- ✅ **User validation** ensures quality inputs

## Support

If you encounter issues:
1. Check Encore logs for detailed error messages
2. Verify all three secrets are set correctly
3. Test with demo mode first
4. Check Google Cloud Console for API status
5. Ensure billing is enabled in Google Cloud

## Security Notes

- **Never commit API keys** to version control
- **Use environment-specific secrets** (dev/staging/prod)
- **Monitor API usage** for unusual activity
- **Rotate keys regularly** for security