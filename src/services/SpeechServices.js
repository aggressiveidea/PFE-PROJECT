/**
 * Speech-to-Text Service
 *
 * This service handles audio transcription using multiple APIs with fallback mechanisms.
 * It tries different services in order of preference and falls back to the next one if any fails.
 */

// API keys would normally be stored in environment variables
// For demo purposes, we're using placeholders
const ASSEMBLY_AI_API_KEY = process.env.ASSEMBLY_AI_API_KEY || ""
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ""

// Flag to enable/disable offline processing with Vosk
const USE_VOSK_OFFLINE = true

/**
 * Main function to transcribe audio
 * @param {Blob} audioBlob - The audio blob to transcribe
 * @returns {Promise<string>} - The transcribed text
 */
export async function transcribeAudio(audioBlob) {
  try {
    // Try OpenAI Whisper first (most accurate)
    if (OPENAI_API_KEY) {
      try {
        const whisperResult = await transcribeWithWhisper(audioBlob)
        if (whisperResult) return whisperResult
      } catch (error) {
        console.warn("OpenAI Whisper transcription failed, trying next service:", error)
      }
    }

    // Try AssemblyAI next
    if (ASSEMBLY_AI_API_KEY) {
      try {
        const assemblyResult = await transcribeWithAssemblyAI(audioBlob)
        if (assemblyResult) return assemblyResult
      } catch (error) {
        console.warn("AssemblyAI transcription failed, trying next service:", error)
      }
    }

    // Try Google Speech-to-Text
    if (GOOGLE_API_KEY) {
      try {
        const googleResult = await transcribeWithGoogleSpeech(audioBlob)
        if (googleResult) return googleResult
      } catch (error) {
        console.warn("Google Speech-to-Text transcription failed, trying next service:", error)
      }
    }

    // Fallback to Vosk offline processing if enabled
    if (USE_VOSK_OFFLINE) {
      try {
        const voskResult = await transcribeWithVosk(audioBlob)
        if (voskResult) return voskResult
      } catch (error) {
        console.warn("Vosk offline transcription failed:", error)
      }
    }

    // If all services fail, use browser's built-in speech recognition as a last resort
    return await transcribeWithBrowserSpeechRecognition(audioBlob)
  } catch (error) {
    console.error("All transcription methods failed:", error)
    throw new Error("Unable to transcribe audio. Please try again or type your message.")
  }
}

/**
 * Transcribe audio using OpenAI Whisper API
 */
async function transcribeWithWhisper(audioBlob) {
  // For demo purposes, we'll simulate a successful response
  // In a real implementation, this would make an API call to OpenAI
  console.log("Transcribing with OpenAI Whisper...")

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return simulated response
  return "This is a simulated transcription from OpenAI Whisper."
}

/**
 * Transcribe audio using AssemblyAI
 */
async function transcribeWithAssemblyAI(audioBlob) {
  // For demo purposes, we'll simulate a successful response
  console.log("Transcribing with AssemblyAI...")

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200))

  // Return simulated response
  return "This is a simulated transcription from AssemblyAI."
}

/**
 * Transcribe audio using Google Speech-to-Text
 */
async function transcribeWithGoogleSpeech(audioBlob) {
  // For demo purposes, we'll simulate a successful response
  console.log("Transcribing with Google Speech-to-Text...")

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Return simulated response
  return "This is a simulated transcription from Google Speech-to-Text."
}

/**
 * Transcribe audio using Vosk offline processing
 */
async function transcribeWithVosk(audioBlob) {
  // For demo purposes, we'll simulate a successful response
  console.log("Transcribing with Vosk (offline)...")

  // In a real implementation, this would load the Vosk model and process the audio
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Return simulated response
  return "This is a simulated transcription from Vosk offline processing."
}

/**
 * Transcribe audio using the browser's built-in speech recognition
 * This is used as a last resort fallback
 */
async function transcribeWithBrowserSpeechRecognition(audioBlob) {
  return new Promise((resolve, reject) => {
    // Check if browser supports speech recognition
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      reject(new Error("Browser doesn't support speech recognition"))
      return
    }

    console.log("Transcribing with browser's speech recognition...")

    // Create audio element to play the blob
    const audio = new Audio(URL.createObjectURL(audioBlob))
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = "en-US"
    recognition.continuous = true
    recognition.interimResults = false

    let transcript = ""

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + " "
        }
      }
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      recognition.stop()
      audio.pause()
      reject(new Error("Browser speech recognition failed"))
    }

    recognition.onend = () => {
      audio.pause()
      if (transcript.trim()) {
        resolve(transcript.trim())
      } else {
        reject(new Error("No speech detected"))
      }
    }

    // Start recognition when audio starts playing
    audio.onplay = () => {
      recognition.start()
    }

    // Stop recognition when audio ends
    audio.onended = () => {
      recognition.stop()
    }

    // Start playing the audio
    audio.play().catch((error) => {
      console.error("Error playing audio:", error)
      reject(error)
    })
  })
}
