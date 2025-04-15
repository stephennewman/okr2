import OpenAI from 'openai'

// Ensure OPENAI_API_KEY is set in your environment variables (.env.local)
if (!process.env.OPENAI_API_KEY) {
  // In a real app, you might want to throw an error or handle this differently
  // For development, we can log a warning.
  console.warn(
    'OpenAI API key not found. Please set OPENAI_API_KEY in your .env.local file.'
  )
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Example function to interact with the OpenAI API.
 * Replace this with your actual AI feature logic.
 *
 * @param prompt The prompt to send to the AI model.
 * @returns The AI model's response.
 */
export async function getAiCompletion(prompt: string): Promise<string | null> {
  if (!openai.apiKey) {
    console.error('OpenAI client not initialized. Check API key.')
    return 'OpenAI client not initialized. Check API key.'; // Return an error message or handle appropriately
  }
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o-mini', // Or your preferred model
    })

    return completion.choices[0]?.message?.content
  } catch (error) {
    console.error('Error fetching AI completion:', error)
    // Handle the error appropriately (e.g., return a specific error message, null, or throw)
    if (error instanceof OpenAI.APIError) {
      // Handle specific OpenAI API errors
      return `OpenAI API Error: ${error.status} ${error.message}`;
    }
    return 'An error occurred while processing the AI request.';
  }
}

// Add more specific OpenAI service functions as needed
// e.g., analyzeText, generateImage, etc. 