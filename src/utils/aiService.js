// AI Service - Simulates AI responses with realistic delays
// In production, this would connect to actual AI APIs

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Simulate API call with delay
const simulateAI = async (prompt, responseGenerator, minDelay = 1000, maxDelay = 2500) => {
  const delayTime = Math.floor(Math.random() * (maxDelay - minDelay) + minDelay)
  await delay(delayTime)
  return responseGenerator(prompt)
}

// Extract text content (remove HTML tags)
const extractText = (content) => {
  if (!content) return ''
  return content.replace(/<[^>]*>/g, '').replace(/\n+/g, ' ').trim()
}

// Summarize text
export const summarizeText = async (text) => {
  return simulateAI(text, (input) => {
    const sentences = extractText(input).split(/[.!?]+/).filter(s => s.trim())
    const wordCount = sentences.join(' ').split(/\s+/).length
    
    // Generate summary based on length
    if (wordCount < 50) {
      return input // Too short to summarize
    }
    
    const summaryLength = Math.max(2, Math.floor(sentences.length * 0.3))
    const summary = sentences.slice(0, summaryLength).join('. ') + '.'
    
    return `**Summary:**\n\n${summary}\n\n*This summary captures the main points of your note in a concise format.*`
  })
}

// Explain complex concepts
export const explainText = async (text) => {
  return simulateAI(text, (input) => {
    const content = extractText(input)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim())
    
    return `**Simplified Explanation:**\n\n${sentences.map((s, i) => {
      if (i === 0) return `**Main Idea:** ${s.trim()}`
      if (i < 3) return `• ${s.trim()}`
      return null
    }).filter(Boolean).join('\n\n')}\n\n*This explanation breaks down complex concepts into simpler, more understandable terms.*`
  })
}

// Generate study questions
export const generateQuestions = async (text) => {
  return simulateAI(text, (input) => {
    const content = extractText(input)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim() && s.length > 20)
    
    const questions = []
    sentences.slice(0, 5).forEach((sentence, index) => {
      // Generate different types of questions
      if (index % 3 === 0) {
        questions.push(`**Q${index + 1}:** What is ${sentence.split(' ').slice(0, 5).join(' ')}?`)
      } else if (index % 3 === 1) {
        questions.push(`**Q${index + 1}:** Explain how ${sentence.split(' ').slice(0, 8).join(' ')}.`)
      } else {
        questions.push(`**Q${index + 1}:** Why is ${sentence.split(' ').slice(0, 6).join(' ')} important?`)
      }
    })
    
    return `**Study Questions:**\n\n${questions.join('\n\n')}\n\n*Use these questions to test your understanding of the material.*`
  })
}

// Extract key points
export const extractKeyPoints = async (text) => {
  return simulateAI(text, (input) => {
    const content = extractText(input)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim() && s.length > 15)
    
    const keyPoints = sentences
      .slice(0, 6)
      .map((sentence, index) => {
        const cleaned = sentence.trim()
        return `**${index + 1}.** ${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)}`
      })
    
    return `**Key Points:**\n\n${keyPoints.join('\n\n')}\n\n*These are the main takeaways from your note.*`
  })
}

// Generate flashcards from text
export const generateFlashcards = async (text, count = 5) => {
  return simulateAI(text, (input) => {
    const content = extractText(input)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim() && s.length > 20)
    
    const flashcards = []
    sentences.slice(0, count).forEach((sentence, index) => {
      const words = sentence.trim().split(/\s+/)
      const midPoint = Math.floor(words.length / 2)
      
      flashcards.push({
        question: words.slice(0, midPoint).join(' ') + '?',
        answer: words.slice(midPoint).join(' ')
      })
    })
    
    return flashcards
  })
}

// Summarize video (placeholder - would need video transcript in production)
export const summarizeVideo = async (videoUrl) => {
  return simulateAI(videoUrl, (url) => {
    return `**Video Summary:**\n\nThis video covers important concepts related to the topic. Key points include:\n\n• Main concept explanation\n• Practical applications\n• Important examples and case studies\n• Summary of key takeaways\n\n*Note: For a detailed summary, a video transcript would be required. This is a placeholder summary.*`
  })
}

// Generate puzzle
export const generatePuzzle = async (difficulty = 'medium', topic = 'general') => {
  return simulateAI(`${difficulty} ${topic}`, (input) => {
    const puzzles = {
      easy: [
        {
          question: "What number comes next: 2, 4, 6, 8, ?",
          options: ["10", "12", "14", "16"],
          correctAnswer: 0,
          explanation: "This is a simple arithmetic sequence where each number increases by 2."
        },
        {
          question: "If all birds can fly, and a penguin is a bird, can a penguin fly?",
          options: ["Yes", "No", "Sometimes", "Cannot be determined"],
          correctAnswer: 1,
          explanation: "While the premise states all birds can fly, in reality penguins cannot fly. This tests logical reasoning."
        }
      ],
      medium: [
        {
          question: "What is the next number in the sequence: 1, 4, 9, 16, 25, ?",
          options: ["30", "36", "40", "49"],
          correctAnswer: 1,
          explanation: "These are perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, so 6²=36."
        },
        {
          question: "In a group of 50 people, 30 like coffee and 25 like tea. If 10 like both, how many like neither?",
          options: ["5", "10", "15", "20"],
          correctAnswer: 0,
          explanation: "Using inclusion-exclusion: 30 + 25 - 10 = 45 like coffee or tea. So 50 - 45 = 5 like neither."
        }
      ],
      hard: [
        {
          question: "A train travels 120 km in 2 hours. If it maintains the same speed, how long will it take to travel 300 km?",
          options: ["4 hours", "5 hours", "6 hours", "7 hours"],
          correctAnswer: 1,
          explanation: "Speed = 120/2 = 60 km/h. Time for 300 km = 300/60 = 5 hours."
        },
        {
          question: "If the pattern is: A, C, E, G, I, ? What comes next?",
          options: ["J", "K", "L", "M"],
          correctAnswer: 1,
          explanation: "The pattern skips one letter: A (skip B) C (skip D) E (skip F) G (skip H) I (skip J) K"
        }
      ]
    }
    
    const puzzleSet = puzzles[difficulty] || puzzles.medium
    return puzzleSet[Math.floor(Math.random() * puzzleSet.length)]
  })
}

// Generate AI advice
export const generateAdvice = async (userData) => {
  return simulateAI(JSON.stringify(userData), (data) => {
    const advice = [
      "**Study Tip:** Break your study sessions into 25-minute focused blocks with 5-minute breaks. This Pomodoro technique helps maintain concentration.",
      "**Motivation:** Remember why you started. Every expert was once a beginner. Keep pushing forward!",
      "**Productivity:** Review your notes within 24 hours of learning. This helps transfer information from short-term to long-term memory.",
      "**Wellness:** Don't forget to take care of yourself. A healthy mind needs a healthy body - get enough sleep and exercise.",
      "**Strategy:** Active recall is more effective than passive reading. Test yourself regularly with flashcards and practice questions.",
      "**Balance:** It's okay to take breaks. Your brain needs time to process and consolidate what you've learned."
    ]
    
    return advice[Math.floor(Math.random() * advice.length)]
  })
}

// Enhanced text summarizer
export const enhancedSummarize = async (text, length = 'medium') => {
  return simulateAI(text, (input) => {
    const content = extractText(input)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim())
    
    const lengthMap = { short: 0.2, medium: 0.4, long: 0.6 }
    const numSentences = Math.max(1, Math.floor(sentences.length * lengthMap[length]))
    const summary = sentences.slice(0, numSentences).join('. ') + '.'
    
    return summary
  })
}

