"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, RotateCcw, Mic, Smile, X, Play, Pause, StopCircle, Volume2, VolumeX } from "lucide-react"
import { getUserById } from "../../services/Api"
import { synthesizeSpeech } from "../../services/TextToSpeech"
import "./IctAssistant.css"

const initialMessages = [
  {
    type: "bot",
    content: "Hello! I'm your ICT Terms Assistant 🤖. Ask me about Information and Communication Technology terms!",
    id: "welcome-msg",
  },
]

const sampleSuggestions = [
  {
    text: "What is a computer network?",
  },
  {
    text: "Explain database in ICT.",
  },
  {
    text: "What is cloud computing?",
  },
  {
    text: "Define artificial intelligence.",
  },
]

// Common emojis for quick access
const commonEmojis = [
  "😊",
  "😂",
  "👍",
  "❤️",
  "🙏",
  "👏",
  "🎉",
  "🤔",
  "👀",
  "💡",
  "🔥",
  "✅",
  "⭐",
  "🚀",
  "💻",
  "📱",
  "🌐",
  "📊",
  "📈",
  "🤖",
]

// Emoji categories
const emojiCategories = [
  {
    name: "Smileys",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "🤣",
      "😂",
      "🙂",
      "🙃",
      "😉",
      "😊",
      "😇",
      "🥰",
      "😍",
      "🤩",
      "😘",
      "😗",
      "😚",
      "😙",
    ],
  },
  {
    name: "Gestures",
    emojis: [
      "👍",
      "👎",
      "👌",
      "✌️",
      "🤞",
      "🤟",
      "🤘",
      "🤙",
      "👈",
      "👉",
      "👆",
      "👇",
      "☝️",
      "👋",
      "🤚",
      "🖐️",
      "✋",
      "🖖",
      "👏",
      "🙌",
    ],
  },
  {
    name: "Tech",
    emojis: [
      "💻",
      "🖥️",
      "💾",
      "💿",
      "📀",
      "🖨️",
      "🖱️",
      "🖲️",
      "📱",
      "☎️",
      "📞",
      "📟",
      "📠",
      "📺",
      "📻",
      "🎮",
      "🕹️",
      "🎧",
      "🎤",
      "📷",
    ],
  },
  {
    name: "Objects",
    emojis: [
      "⌚",
      "📱",
      "💻",
      "⌨️",
      "🖥️",
      "🖨️",
      "🖱️",
      "🖲️",
      "🕹️",
      "🗜️",
      "💽",
      "💾",
      "💿",
      "📀",
      "📼",
      "📷",
      "📸",
      "📹",
      "🎥",
      "📽️",
    ],
  },
]

function getBotResponse(question) {
  const lower = question.trim().toLowerCase()
  if (["what is ict", "define ict", "ict meaning", "ict?"].some((q) => lower.includes(q))) {
    return "ICT stands for Information and Communication Technology. It refers to all technologies used for handling telecommunications, media, broadcast, and audio-visual processing."
  }
  if (lower.includes("algorithm"))
    return "An algorithm is a series of steps or rules used to solve a problem or perform a task in ICT."
  if (lower.includes("database"))
    return "A database is an organized collection of data, generally stored and accessed electronically."
  if (lower.includes("network")) return "A network connects computers and other devices to share data and resources."
  if (lower.includes("protocol")) return "A protocol is a set of rules that devices follow to communicate in a network."
  if (lower.includes("cloud computing"))
    return "Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ('the cloud')."
  if (lower.includes("artificial intelligence") || lower.includes("ai"))
    return "Artificial Intelligence (AI) refers to systems or machines that mimic human intelligence to perform tasks and can iteratively improve themselves based on the information they collect."
  if (lower.includes("coucou") || lower.includes("hello") || lower.includes("hi"))
    return "Hello there! 👋 How can I help you with ICT terms today?"
  return "I'm still learning! Try asking about ICT definitions, like 'What is a database?' or 'Explain cloud computing.'"
}

const IctAssistant = ({ darkMode }) => {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userAvatar, setUserAvatar] = useState("/placeholder.svg?height=200&width=200")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null)

  // Text-to-speech states
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true)
  const [isProcessingTTS, setIsProcessingTTS] = useState(false)
  const [currentTTSMessage, setCurrentTTSMessage] = useState(null)

  const chatEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const chatContainerRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const audioRefs = useRef({})
  const ttsAudioRef = useRef(null)

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First try to get user data from localStorage
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}")

        if (storedUser && storedUser.profileImgUrl) {
          setUserAvatar(storedUser.profileImgUrl)
        } else {
          // If not in localStorage, try to fetch from API
          const authData = JSON.parse(localStorage.getItem("authData") || "{}")
          if (authData && authData.token) {
            try {
              const userData = await getUserById()
              if (userData && userData.profileImgUrl) {
                setUserAvatar(userData.profileImgUrl)
              }
            } catch (apiError) {
              console.error("Error fetching user data from API:", apiError)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user avatar:", error)
        // Keep default avatar if there's an error
      }
    }

    fetchUserData()

    // Initialize TTS audio element
    ttsAudioRef.current = new Audio()
    ttsAudioRef.current.onended = () => {
      setCurrentTTSMessage(null)
    }

    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
      console.warn("Browser doesn't support speech synthesis")
    }

    // Load speech preference from localStorage
    const speechEnabled = localStorage.getItem("speechEnabled") !== "false"
    setIsSpeechEnabled(speechEnabled)

    return () => {
      // Clean up audio elements
      if (ttsAudioRef.current) {
        ttsAudioRef.current.pause()
        ttsAudioRef.current = null
      }

      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
        }
      })
    }
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)
  }, [isRecording])

  // Stop all audio when a new one is played
  useEffect(() => {
    if (currentlyPlaying) {
      Object.keys(audioRefs.current).forEach((key) => {
        if (key !== currentlyPlaying) {
          const audio = audioRefs.current[key]
          if (audio && !audio.paused) {
            audio.pause()
            audio.currentTime = 0
          }
        }
      })

      // Also stop TTS if playing
      if (ttsAudioRef.current && !ttsAudioRef.current.paused) {
        ttsAudioRef.current.pause()
        setCurrentTTSMessage(null)
      }
    }
  }, [currentlyPlaying])

  // Handle TTS for new bot messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1]
    if (
      lastMessage &&
      lastMessage.type === "bot" &&
      lastMessage.messageType === "text" &&
      isSpeechEnabled &&
      !isLoading
    ) {
      speakBotMessage(lastMessage.content, lastMessage.id)
    }
  }, [messages, isLoading, isSpeechEnabled])

  const sendMessage = (value, type = "text") => {
    if (type === "text") {
      const val = typeof value === "string" ? value : input
      if (!val.trim()) return
      const userMsg = { type: "user", content: val, messageType: "text", id: `msg-${Date.now()}` }
      setMessages((msgs) => [...msgs, userMsg])
      setInput("")
      setIsLoading(true)

      setTimeout(() => {
        const botReply = getBotResponse(val)
        setMessages((msgs) => [
          ...msgs,
          {
            type: "bot",
            content: botReply,
            messageType: "text",
            id: `msg-${Date.now()}`,
          },
        ])
        setIsLoading(false)
      }, 900)
    } else if (type === "audio") {
      if (!value) return
      const audioUrl = URL.createObjectURL(value)
      const messageId = `msg-${Date.now()}`

      const userMsg = {
        type: "user",
        content: audioUrl,
        messageType: "audio",
        duration: recordingTime,
        blob: value,
        id: messageId,
      }
      setMessages((msgs) => [...msgs, userMsg])
      setAudioBlob(null)
      setRecordingTime(0)
      setIsLoading(true)

      setTimeout(() => {
        const botReply = "I received your voice message! However, I can only respond to text messages at the moment."
        setMessages((msgs) => [
          ...msgs,
          {
            type: "bot",
            content: botReply,
            messageType: "text",
            id: `msg-${Date.now()}`,
          },
        ])
        setIsLoading(false)
      }, 900)
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const fileName = file.name
      sendMessage(`I'm uploading a file: ${fileName}`)
      // Reset the input to allow uploading the same file again
      e.target.value = ""
    }
  }

  const handleRegenerate = () => {
    if (messages.length > 1) {
      setIsLoading(true)

      setTimeout(() => {
        // Get the last question (user message)
        const lastUserMessage = [...messages].reverse().find((msg) => msg.type === "user")

        if (lastUserMessage && lastUserMessage.messageType === "text") {
          const botReply = getBotResponse(lastUserMessage.content)
          // Replace the last bot message or add a new one
          setMessages((msgs) => {
            const newMsgs = [...msgs]
            const lastBotIndex = newMsgs.map((m) => m.type).lastIndexOf("bot")

            if (lastBotIndex !== -1 && lastBotIndex === msgs.length - 1) {
              newMsgs[lastBotIndex] = {
                type: "bot",
                content: botReply,
                messageType: "text",
                id: `msg-${Date.now()}`,
              }
            } else {
              newMsgs.push({
                type: "bot",
                content: botReply,
                messageType: "text",
                id: `msg-${Date.now()}`,
              })
            }

            return newMsgs
          })
        } else {
          setMessages((msgs) => [
            ...msgs,
            {
              type: "bot",
              content: "I can only regenerate responses to text messages.",
              messageType: "text",
              id: `msg-${Date.now()}`,
            },
          ])
        }

        setIsLoading(false)
      }, 900)
    }
  }

  const handleEmojiClick = (emoji) => {
    setInput((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev)
  }

  const toggleSpeech = () => {
    const newState = !isSpeechEnabled
    setIsSpeechEnabled(newState)
    localStorage.setItem("speechEnabled", newState.toString())

    // Stop current TTS if disabling
    if (!newState && ttsAudioRef.current && !ttsAudioRef.current.paused) {
      ttsAudioRef.current.pause()
      setCurrentTTSMessage(null)
    }
  }

  const speakBotMessage = async (text, messageId) => {
    // Don't speak if speech is disabled or already speaking this message
    if (!isSpeechEnabled || currentTTSMessage === messageId) return

    // Stop current TTS if playing
    if (ttsAudioRef.current && !ttsAudioRef.current.paused) {
      ttsAudioRef.current.pause()
    }

    try {
      setIsProcessingTTS(true)
      setCurrentTTSMessage(messageId)

      // Get audio URL from TTS service
      const audioUrl = await synthesizeSpeech(text)

      if (audioUrl) {
        ttsAudioRef.current.src = audioUrl
        ttsAudioRef.current.play()
      } else {
        throw new Error("Failed to generate speech")
      }
    } catch (error) {
      console.error("TTS error:", error)
      setCurrentTTSMessage(null)

      // Fallback to browser's speech synthesis if available
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(utterance)
      }
    } finally {
      setIsProcessingTTS(false)
    }
  }

  const handleSpeakMessage = (text, messageId) => {
    if (currentTTSMessage === messageId) {
      // Stop speaking if already speaking this message
      if (ttsAudioRef.current && !ttsAudioRef.current.paused) {
        ttsAudioRef.current.pause()
        setCurrentTTSMessage(null)
      } else if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel()
        setCurrentTTSMessage(null)
      }
    } else {
      speakBotMessage(text, messageId)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check your browser permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAudioBlob(null)
      setRecordingTime(0)
    }
  }

  const handlePlayAudio = (audioUrl, messageId) => {
    if (!audioRefs.current[messageId]) {
      audioRefs.current[messageId] = new Audio(audioUrl)

      audioRefs.current[messageId].onended = () => {
        setCurrentlyPlaying(null)
      }

      audioRefs.current[messageId].onpause = () => {
        if (currentlyPlaying === messageId) {
          setCurrentlyPlaying(null)
        }
      }
    }

    const audioElement = audioRefs.current[messageId]

    if (currentlyPlaying === messageId) {
      audioElement.pause()
      setCurrentlyPlaying(null)
    } else {
      // Stop TTS if playing
      if (ttsAudioRef.current && !ttsAudioRef.current.paused) {
        ttsAudioRef.current.pause()
        setCurrentTTSMessage(null)
      }

      audioElement.play()
      setCurrentlyPlaying(messageId)
    }
  }

  return (
    <div className={`chatbot-glass-wrapper ${darkMode ? "dark-mode" : ""}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-avatar">
          <span className="chatbot-bot-face">🤖</span>
        </div>
        <div className="chatbot-header-content">
          <div className="chatbot-title">ICT Terms Assistant</div>
          <div className="chatbot-subtitle">Ask your ICT questions below</div>
        </div>
        <div className="chatbot-header-actions">
          <button
            className={`chatbot-speech-toggle ${isSpeechEnabled ? "active" : ""}`}
            onClick={toggleSpeech}
            aria-label={isSpeechEnabled ? "Disable speech" : "Enable speech"}
            title={isSpeechEnabled ? "Disable speech" : "Enable speech"}
          >
            {isSpeechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>
      {/* Suggestion bubbles */}
      <div className="chatbot-suggestion-bar">
        {sampleSuggestions.map((s, idx) => (
          <button key={idx} className="chatbot-suggestion" onClick={() => sendMessage(s.text)} type="button">
            {s.text}
          </button>
        ))}
      </div>
      {/* Chat messages */}
      <div className="chatbot-chat-container" ref={chatContainerRef}>
        {messages.map((msg, i) => (
          <div
            key={msg.id || i}
            className={`chatbot-chat-row ${msg.type === "user" ? "chatbot-chat-user" : "chatbot-chat-bot"}`}
          >
            {msg.type === "bot" && (
              <div className="chatbot-bot-avatar-sm">
                <span role="img" aria-label="Bot" className="chatbot-emoji">
                  🤖
                </span>
              </div>
            )}
            <div className={`chatbot-chat-bubble ${msg.type}`}>
              {msg.messageType === "audio" ? (
                <div className="chatbot-audio-message">
                  <button
                    className="chatbot-audio-play-btn"
                    onClick={() => handlePlayAudio(msg.content, msg.id)}
                    aria-label={currentlyPlaying === msg.id ? "Pause audio" : "Play audio"}
                  >
                    {currentlyPlaying === msg.id ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <div className="chatbot-audio-waveform">
                    <div className="chatbot-audio-waveform-bar"></div>
                    <div className="chatbot-audio-waveform-bar"></div>
                    <div className="chatbot-audio-waveform-bar"></div>
                    <div className="chatbot-audio-waveform-bar"></div>
                    <div className="chatbot-audio-waveform-bar"></div>
                  </div>
                  <span className="chatbot-audio-duration">{formatTime(msg.duration)}</span>
                </div>
              ) : (
                <>
                  {msg.content}
                  {msg.type === "bot" && (
                    <button
                      className={`chatbot-speak-btn ${currentTTSMessage === msg.id ? "speaking" : ""}`}
                      onClick={() => handleSpeakMessage(msg.content, msg.id)}
                      aria-label={currentTTSMessage === msg.id ? "Stop speaking" : "Speak message"}
                    >
                      {currentTTSMessage === msg.id ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  )}
                </>
              )}
            </div>
            {msg.type === "user" && (
              <div className="chatbot-user-avatar-sm">
                {userAvatar && userAvatar.includes("data:image") ? (
                  <img src={userAvatar || "/placeholder.svg"} alt="User" className="chatbot-user-img" />
                ) : (
                  <img
                    src={userAvatar || "/placeholder.svg"}
                    alt="User"
                    className="chatbot-user-img"
                    onError={(e) => {
                      e.target.onError = null
                      e.target.src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="chatbot-chat-row chatbot-chat-bot">
            <div className="chatbot-bot-avatar-sm">
              <span role="img" aria-label="Bot" className="chatbot-emoji">
                🤖
              </span>
            </div>
            <div className="chatbot-chat-bubble bot">
              <div className="chatbot-typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* Input Bar */}
      <div className="chatbot-input-container">
        {isRecording ? (
          <div className="chatbot-recording-container">
            <div className="chatbot-recording-indicator">
              <div className="chatbot-recording-pulse"></div>
              <span className="chatbot-recording-time">{formatTime(recordingTime)}</span>
            </div>
            <div className="chatbot-recording-controls">
              <button
                className="chatbot-recording-btn chatbot-recording-cancel"
                onClick={cancelRecording}
                aria-label="Cancel recording"
              >
                <X size={20} />
                <span>Cancel</span>
              </button>
              <button
                className="chatbot-recording-btn chatbot-recording-stop"
                onClick={stopRecording}
                aria-label="Stop recording"
              >
                <StopCircle size={20} />
                <span>Stop</span>
              </button>
            </div>
          </div>
        ) : audioBlob ? (
          <div className="chatbot-audio-preview">
            <div className="chatbot-audio-message">
              <button
                className="chatbot-audio-play-btn"
                onClick={() => handlePlayAudio(URL.createObjectURL(audioBlob), "preview")}
                aria-label={currentlyPlaying === "preview" ? "Pause audio" : "Play audio"}
              >
                {currentlyPlaying === "preview" ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <div className="chatbot-audio-waveform">
                <div className="chatbot-audio-waveform-bar"></div>
                <div className="chatbot-audio-waveform-bar"></div>
                <div className="chatbot-audio-waveform-bar"></div>
                <div className="chatbot-audio-waveform-bar"></div>
                <div className="chatbot-audio-waveform-bar"></div>
              </div>
              <span className="chatbot-audio-duration">{formatTime(recordingTime)}</span>
            </div>
            <div className="chatbot-audio-preview-controls">
              <button
                className="chatbot-audio-preview-btn chatbot-audio-discard"
                onClick={() => setAudioBlob(null)}
                aria-label="Discard recording"
              >
                <X size={20} />
                <span>Discard</span>
              </button>
              <button
                className="chatbot-audio-preview-btn chatbot-audio-send"
                onClick={() => sendMessage(audioBlob, "audio")}
                aria-label="Send recording"
              >
                <Send size={20} />
                <span>Send</span>
              </button>
            </div>
          </div>
        ) : (
          <form
            className="chatbot-input-form"
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            autoComplete="off"
            spellCheck="false"
          >
            <div className="chatbot-input-wrapper">
              <button
                type="button"
                className="chatbot-action-btn chatbot-attachment-btn"
                onClick={handleFileClick}
                disabled={isLoading}
                aria-label="Attach file"
              >
                <Paperclip size={20} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="chatbot-hidden" />
              <input
                className="chatbot-input-field"
                type="text"
                placeholder="Type your ICT question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
              />
              <button
                type="button"
                className={`chatbot-action-btn chatbot-emoji-btn ${showEmojiPicker ? "active" : ""}`}
                onClick={toggleEmojiPicker}
                disabled={isLoading}
                aria-label="Insert emoji"
                aria-expanded={showEmojiPicker}
              >
                <Smile size={20} />
              </button>
              <button
                type="button"
                className="chatbot-action-btn chatbot-mic-btn"
                onClick={startRecording}
                disabled={isLoading}
                aria-label="Voice input"
              >
                <Mic size={20} />
              </button>
            </div>
            {showEmojiPicker && (
              <div className="chatbot-emoji-picker" ref={emojiPickerRef}>
                <div className="chatbot-emoji-picker-header">
                  <span>Common</span>
                </div>
                <div className="chatbot-emoji-picker-common">
                  {commonEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      className="chatbot-emoji-item"
                      onClick={() => handleEmojiClick(emoji)}
                      aria-label={`Emoji ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="chatbot-emoji-picker-categories">
                  {emojiCategories.map((category, catIndex) => (
                    <div key={catIndex} className="chatbot-emoji-category">
                      <div className="chatbot-emoji-category-header">{category.name}</div>
                      <div className="chatbot-emoji-category-items">
                        {category.emojis.map((emoji, emojiIndex) => (
                          <button
                            key={emojiIndex}
                            className="chatbot-emoji-item"
                            onClick={() => handleEmojiClick(emoji)}
                            aria-label={`${category.name} emoji ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="chatbot-button-group">
              <button
                className="chatbot-reload-btn"
                type="button"
                onClick={handleRegenerate}
                disabled={messages.length <= 1 || isLoading}
                title="Regenerate response"
                aria-label="Regenerate response"
              >
                <RotateCcw size={20} />
              </button>
              <button
                className="chatbot-send-btn"
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Send message"
              >
                <Send size={20} />
                <span>Send</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default IctAssistant
