# NanoBanana API Configuration

To integrate with the real NanoBanana API, you need to configure the following secrets in your Encore dashboard:

## Required Secrets

1. **NanoBananaApiKey**: Your NanoBanana API key
   - Get this from your NanoBanana dashboard
   - Example: `nb_1234567890abcdef`

2. **NanoBananaEndpoint**: The NanoBanana API endpoint URL
   - Production: `https://api.nanobana.ai` (or your specific endpoint)
   - Staging: `https://staging-api.nanobana.ai`

## Setting Up Secrets

### Option 1: Encore Dashboard
1. Go to your Encore dashboard
2. Navigate to your app settings
3. Add secrets:
   - Name: `NanoBananaApiKey`, Value: `your_api_key_here`
   - Name: `NanoBananaEndpoint`, Value: `https://api.nanobana.ai`

### Option 2: Encore CLI
```bash
encore secret set --type prod NanoBananaApiKey
encore secret set --type prod NanoBananaEndpoint

encore secret set --type dev NanoBananaApiKey  
encore secret set --type dev NanoBananaEndpoint
```

## Demo Mode

If secrets are not configured or set to 'not-set', the app will run in demo mode with:
- Simulated 15-second processing time
- Sample fashion image as result
- Full error handling and retry functionality

## API Integration Details

The integration expects these endpoints:

### Submit Try-On Job
- **POST** `/v1/try-on`
- **Headers**: `Authorization: Bearer {api_key}`
- **Body**:
```json
{
  "person_image": "https://signed-url-to-avatar",
  "garment_image": "https://signed-url-to-fit", 
  "prompt": "Professional photography, high quality, realistic lighting",
  "options": {
    "width": 768,
    "height": 1024,
    "guidance_scale": 7.5,
    "num_inference_steps": 20
  }
}
```

### Check Job Status
- **GET** `/v1/jobs/{job_id}`
- **Headers**: `Authorization: Bearer {api_key}`
- **Response**:
```json
{
  "id": "job_123",
  "status": "completed|processing|failed",
  "result_url": "https://result-image-url",
  "error": "error message if failed"
}
```

## Error Handling

The integration includes:
- ✅ Automatic retry on failure
- ✅ 5-minute timeout with 5-second polling
- ✅ Clear error messages to users
- ✅ Fallback to demo mode if API unavailable
- ✅ Proper signed URL generation for image access

## Testing

1. **Demo Mode**: Works immediately without any configuration
2. **Production Mode**: Set the secrets and test with real API
3. **Error Handling**: Try with invalid credentials to test error flows

## Support

If you need help with NanoBanana API integration:
1. Check the NanoBanana documentation
2. Verify your API credentials
3. Test endpoints with curl first
4. Check Encore logs for detailed error messages