import { useState, useEffect, useRef } from 'react'
import { Timer, Clock, FileText, BarChart3, Calculator, Sparkles, RotateCcw, Play, Pause, Square, Type, Loader2 } from 'lucide-react'
import { enhancedSummarize } from '../utils/aiService'

const StudyTools = () => {
  const [activeTab, setActiveTab] = useState('pomodoro')

  const tabs = [
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'stopwatch', label: 'Stopwatch', icon: Clock },
    { id: 'wordcounter', label: 'Word Counter', icon: BarChart3 },
    { id: 'formatter', label: 'Formatter', icon: FileText },
    { id: 'summarizer', label: 'Summarizer', icon: Sparkles },
    { id: 'converter', label: 'Unit Converter', icon: Calculator },
    { id: 'formalizer', label: 'Formalizer', icon: Type },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-cozy-900">Study Tools</h1>
        <p className="text-cozy-600 mt-1">Helpful utilities to enhance your study sessions.</p>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex flex-wrap gap-2 border-b border-cozy-200 pb-4 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                    : 'text-cozy-600 hover:bg-cozy-100'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'pomodoro' && <PomodoroTimer />}
          {activeTab === 'stopwatch' && <Stopwatch />}
          {activeTab === 'wordcounter' && <WordCounter />}
          {activeTab === 'formatter' && <FileFormatter />}
          {activeTab === 'summarizer' && <TextSummarizer />}
          {activeTab === 'converter' && <UnitConverter />}
          {activeTab === 'formalizer' && <TextFormalizer />}
        </div>
      </div>
    </div>
  )
}

// Pomodoro Timer Component
const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [sessionCount, setSessionCount] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isActive && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            setMinutes(prev => {
              if (prev === 0) {
                handleComplete()
                return 0
              }
              return prev - 1
            })
            return 59
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, minutes, seconds])

  const handleComplete = () => {
    setIsActive(false)
    if (!isBreak) {
      setSessionCount(prev => prev + 1)
      setIsBreak(true)
      setMinutes(5)
      setSeconds(0)
      // Play notification sound (if available)
      if (typeof window !== 'undefined' && 'Notification' in window) {
        new Notification('Pomodoro Complete!', { body: 'Time for a break!' })
      }
    } else {
      setIsBreak(false)
      setMinutes(25)
      setSeconds(0)
    }
  }

  const handleStart = () => {
    setIsActive(true)
  }

  const handlePause = () => {
    setIsActive(false)
  }

  const handleReset = () => {
    setIsActive(false)
    setIsBreak(false)
    setMinutes(25)
    setSeconds(0)
  }

  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const progress = isBreak 
    ? ((5 * 60 - (minutes * 60 + seconds)) / (5 * 60)) * 100
    : ((25 * 60 - (minutes * 60 + seconds)) / (25 * 60)) * 100

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-cozy-900 mb-2">Pomodoro Timer</h2>
        <p className="text-cozy-600">Focus for 25 minutes, then take a 5-minute break</p>
      </div>

      <div className="flex flex-col items-center">
        <div className={`relative w-64 h-64 rounded-full flex items-center justify-center mb-6 ${
          isBreak ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <div className="absolute inset-0 rounded-full border-8 border-cozy-200"></div>
          <div 
            className="absolute inset-0 rounded-full border-8 border-primary-600 transition-all duration-1000"
            style={{
              clipPath: `polygon(0 0, 100% 0, 100% ${100 - progress}%, 0 ${100 - progress}%)`,
              transform: 'rotate(-90deg)'
            }}
          ></div>
          <div className="relative z-10 text-center">
            <div className="text-6xl font-bold text-cozy-900 mb-2">
              {formatTime(minutes, seconds)}
            </div>
            <p className="text-lg text-cozy-600">
              {isBreak ? 'Break Time' : 'Focus Time'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          {!isActive ? (
            <button onClick={handleStart} className="btn-primary flex items-center space-x-2">
              <Play size={20} />
              <span>Start</span>
            </button>
          ) : (
            <button onClick={handlePause} className="btn-secondary flex items-center space-x-2">
              <Pause size={20} />
              <span>Pause</span>
            </button>
          )}
          <button onClick={handleReset} className="btn-secondary flex items-center space-x-2">
            <RotateCcw size={20} />
            <span>Reset</span>
          </button>
        </div>

        <div className="text-center">
          <p className="text-cozy-600">Sessions completed today: <span className="font-bold text-primary-600">{sessionCount}</span></p>
        </div>
      </div>
    </div>
  )
}

// Stopwatch Component
const Stopwatch = () => {
  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [laps, setLaps] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10)
      }, 10)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive])

  const handleStart = () => setIsActive(true)
  const handlePause = () => setIsActive(false)
  const handleReset = () => {
    setIsActive(false)
    setTime(0)
    setLaps([])
  }
  const handleLap = () => {
    setLaps(prev => [...prev, time])
  }

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const centiseconds = Math.floor((ms % 1000) / 10)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold text-cozy-900 mb-2">Stopwatch</h2>
        <p className="text-cozy-600">Track your time precisely</p>
      </div>

      <div className="text-center">
        <div className="text-7xl font-bold text-cozy-900 mb-8 font-mono">
          {formatTime(time)}
        </div>

        <div className="flex items-center justify-center space-x-4 mb-6">
          {!isActive ? (
            <button onClick={handleStart} className="btn-primary flex items-center space-x-2">
              <Play size={20} />
              <span>Start</span>
            </button>
          ) : (
            <button onClick={handlePause} className="btn-secondary flex items-center space-x-2">
              <Pause size={20} />
              <span>Pause</span>
            </button>
          )}
          <button onClick={handleLap} disabled={!isActive} className="btn-secondary flex items-center space-x-2 disabled:opacity-50">
            <Clock size={20} />
            <span>Lap</span>
          </button>
          <button onClick={handleReset} className="btn-secondary flex items-center space-x-2">
            <Square size={20} />
            <span>Reset</span>
          </button>
        </div>

        {laps.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-cozy-900 mb-4">Lap Times</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {laps.map((lap, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-cozy-50 rounded-xl">
                  <span className="text-cozy-700">Lap {index + 1}</span>
                  <span className="font-mono font-bold text-cozy-900">{formatTime(lap)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Word Counter Component
const WordCounter = () => {
  const [text, setText] = useState('')

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const charCount = text.length
  const charCountNoSpaces = text.replace(/\s/g, '').length
  const paragraphCount = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cozy-900 mb-2">Word Counter</h2>
        <p className="text-cozy-600">Count words, characters, and more in your text</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600 mb-1">{wordCount}</p>
          <p className="text-sm text-cozy-600">Words</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-blue-600 mb-1">{charCount}</p>
          <p className="text-sm text-cozy-600">Characters</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600 mb-1">{charCountNoSpaces}</p>
          <p className="text-sm text-cozy-600">No Spaces</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-600 mb-1">{paragraphCount}</p>
          <p className="text-sm text-cozy-600">Paragraphs</p>
        </div>
      </div>

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="input-field"
          placeholder="Paste or type your text here..."
          rows="12"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <p className="text-sm text-cozy-600 mb-1">Sentences</p>
          <p className="text-2xl font-bold text-cozy-900">{sentenceCount}</p>
        </div>
        <div className="card">
          <p className="text-sm text-cozy-600 mb-1">Average Words per Sentence</p>
          <p className="text-2xl font-bold text-cozy-900">
            {sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0}
          </p>
        </div>
      </div>
    </div>
  )
}

// File Formatter Component
const FileFormatter = () => {
  const [input, setInput] = useState('')
  const [formatted, setFormatted] = useState('')
  const [formatType, setFormatType] = useState('json')

  const handleFormat = () => {
    try {
      switch (formatType) {
        case 'json':
          const parsed = JSON.parse(input)
          setFormatted(JSON.stringify(parsed, null, 2))
          break
        case 'minify':
          setFormatted(input.replace(/\s+/g, ' ').trim())
          break
        case 'uppercase':
          setFormatted(input.toUpperCase())
          break
        case 'lowercase':
          setFormatted(input.toLowerCase())
          break
        case 'capitalize':
          setFormatted(input.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' '))
          break
        default:
          setFormatted(input)
      }
    } catch (error) {
      setFormatted(`Error: ${error.message}`)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted)
    alert('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cozy-900 mb-2">File Formatter</h2>
        <p className="text-cozy-600">Format and transform your text</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-cozy-700 mb-2">Format Type</label>
        <select
          value={formatType}
          onChange={(e) => setFormatType(e.target.value)}
          className="input-field"
        >
          <option value="json">JSON Pretty Print</option>
          <option value="minify">Minify Text</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize Words</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cozy-700 mb-2">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field font-mono text-sm"
            rows="12"
            placeholder="Enter text to format..."
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-cozy-700">Output</label>
            <button onClick={handleCopy} className="btn-secondary text-sm">Copy</button>
          </div>
          <textarea
            value={formatted}
            readOnly
            className="input-field font-mono text-sm bg-cozy-50"
            rows="12"
            placeholder="Formatted output will appear here..."
          />
        </div>
      </div>

      <button onClick={handleFormat} className="btn-primary w-full">
        Format Text
      </button>
    </div>
  )
}

// Text Summarizer Component
const TextSummarizer = () => {
  const [input, setInput] = useState('')
  const [summary, setSummary] = useState('')
  const [summaryLength, setSummaryLength] = useState('medium')

  const [isSummarizing, setIsSummarizing] = useState(false)

  const handleSummarize = async () => {
    if (!input.trim()) return
    
    setIsSummarizing(true)
    try {
      const summaryText = await enhancedSummarize(input, summaryLength)
      setSummary(summaryText)
    } catch (error) {
      alert('Error generating summary. Please try again.')
    } finally {
      setIsSummarizing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cozy-900 mb-2">Text Summarizer</h2>
        <p className="text-cozy-600">Generate concise summaries of your text</p>
      </div>

      <div className="card bg-primary-50 border-primary-200">
        <p className="text-sm text-cozy-700">
          <strong>✨ AI-Powered:</strong> This summarizer uses advanced AI to create concise summaries of your text.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-cozy-700 mb-2">Summary Length</label>
        <select
          value={summaryLength}
          onChange={(e) => setSummaryLength(e.target.value)}
          className="input-field"
        >
          <option value="short">Short (20%)</option>
          <option value="medium">Medium (40%)</option>
          <option value="long">Long (60%)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cozy-700 mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            rows="12"
            placeholder="Paste your text here to summarize..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cozy-700 mb-2">Summary</label>
          <textarea
            value={summary}
            readOnly
            className="input-field bg-cozy-50"
            rows="12"
            placeholder="Summary will appear here..."
          />
        </div>
      </div>

      <button 
        onClick={handleSummarize} 
        disabled={!input.trim() || isSummarizing} 
        className="btn-primary w-full disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        {isSummarizing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Generating Summary...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Generate AI Summary</span>
          </>
        )}
      </button>
    </div>
  )
}

// Unit Converter Component
const UnitConverter = () => {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [value, setValue] = useState('')
  const [result, setResult] = useState('')

  const units = {
    length: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34
    },
    weight: {
      gram: 1,
      kilogram: 1000,
      pound: 453.592,
      ounce: 28.3495,
      ton: 1000000
    },
    temperature: {
      celsius: 'celsius',
      fahrenheit: 'fahrenheit',
      kelvin: 'kelvin'
    },
    volume: {
      liter: 1,
      milliliter: 0.001,
      gallon: 3.78541,
      quart: 0.946353,
      pint: 0.473176,
      cup: 0.236588
    }
  }

  const handleConvert = () => {
    if (!value || !fromUnit || !toUnit) return

    if (category === 'temperature') {
      const val = parseFloat(value)
      let converted = 0
      
      if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        converted = (val * 9/5) + 32
      } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        converted = (val - 32) * 5/9
      } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        converted = val + 273.15
      } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        converted = val - 273.15
      } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        converted = ((val - 32) * 5/9) + 273.15
      } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        converted = ((val - 273.15) * 9/5) + 32
      } else {
        converted = val
      }
      
      setResult(converted.toFixed(2))
    } else {
      const val = parseFloat(value)
      const fromValue = units[category][fromUnit]
      const toValue = units[category][toUnit]
      const converted = (val * fromValue) / toValue
      setResult(converted.toFixed(4))
    }
  }

  const currentUnits = Object.keys(units[category])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cozy-900 mb-2">Unit Converter</h2>
        <p className="text-cozy-600">Convert between different units</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-cozy-700 mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setFromUnit('')
            setToUnit('')
            setResult('')
          }}
          className="input-field"
        >
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temperature">Temperature</option>
          <option value="volume">Volume</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-cozy-700 mb-2">From</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="input-field"
          >
            <option value="">Select unit</option>
            {currentUnits.map(unit => (
              <option key={unit} value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-cozy-700 mb-2">Value</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="input-field"
            placeholder="Enter value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-cozy-700 mb-2">To</label>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="input-field"
          >
            <option value="">Select unit</option>
            {currentUnits.map(unit => (
              <option key={unit} value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleConvert} disabled={!value || !fromUnit || !toUnit} className="btn-primary w-full disabled:opacity-50">
        Convert
      </button>

      {result && (
        <div className="card bg-primary-50 border-primary-200">
          <p className="text-sm text-cozy-600 mb-1">Result</p>
          <p className="text-3xl font-bold text-primary-600">
            {result} {toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}
          </p>
        </div>
      )}
    </div>
  )
}

// Text Formalizer Component
const TextFormalizer = () => {
  const [input, setInput] = useState('')
  const [formalized, setFormalized] = useState('')
  const [formalityLevel, setFormalityLevel] = useState('formal')

  const handleFormalize = () => {
    let output = input

    if (formalityLevel === 'formal') {
      // Basic formalization rules
      output = output
        .replace(/\bcan't\b/gi, 'cannot')
        .replace(/\bwon't\b/gi, 'will not')
        .replace(/\bdon't\b/gi, 'do not')
        .replace(/\bisn't\b/gi, 'is not')
        .replace(/\baren't\b/gi, 'are not')
        .replace(/\bI'm\b/gi, 'I am')
        .replace(/\byou're\b/gi, 'you are')
        .replace(/\bit's\b/gi, 'it is')
        .replace(/\bthat's\b/gi, 'that is')
        .replace(/\bhere's\b/gi, 'here is')
        .replace(/\bthere's\b/gi, 'there is')
        .replace(/\bwhat's\b/gi, 'what is')
        .replace(/\bwho's\b/gi, 'who is')
        .replace(/\bwhere's\b/gi, 'where is')
        .replace(/\bhow's\b/gi, 'how is')
        .replace(/\bI've\b/gi, 'I have')
        .replace(/\byou've\b/gi, 'you have')
        .replace(/\bwe've\b/gi, 'we have')
        .replace(/\bthey've\b/gi, 'they have')
        .replace(/\bI'll\b/gi, 'I will')
        .replace(/\byou'll\b/gi, 'you will')
        .replace(/\bwe'll\b/gi, 'we will')
        .replace(/\bthey'll\b/gi, 'they will')
        .replace(/\bI'd\b/gi, 'I would')
        .replace(/\byou'd\b/gi, 'you would')
        .replace(/\bwe'd\b/gi, 'we would')
        .replace(/\bthey'd\b/gi, 'they would')
        .replace(/\bgonna\b/gi, 'going to')
        .replace(/\bwanna\b/gi, 'want to')
        .replace(/\bgotta\b/gi, 'got to')
        .replace(/\blemma\b/gi, 'let me')
        .replace(/\bya\b/gi, 'yes')
        .replace(/\bye\b/gi, 'yes')
        .replace(/\byeah\b/gi, 'yes')
        .replace(/\bok\b/gi, 'okay')
        .replace(/\bokay\b/gi, 'alright')
    } else if (formalityLevel === 'casual') {
      // Basic casualization rules
      output = output
        .replace(/\bcannot\b/gi, "can't")
        .replace(/\bwill not\b/gi, "won't")
        .replace(/\bdo not\b/gi, "don't")
        .replace(/\bis not\b/gi, "isn't")
        .replace(/\bare not\b/gi, "aren't")
        .replace(/\bI am\b/gi, "I'm")
        .replace(/\byou are\b/gi, "you're")
        .replace(/\bit is\b/gi, "it's")
        .replace(/\bthat is\b/gi, "that's")
        .replace(/\bhere is\b/gi, "here's")
        .replace(/\bthere is\b/gi, "there's")
        .replace(/\bwhat is\b/gi, "what's")
        .replace(/\bwho is\b/gi, "who's")
        .replace(/\bwhere is\b/gi, "where's")
        .replace(/\bhow is\b/gi, "how's")
        .replace(/\bI have\b/gi, "I've")
        .replace(/\byou have\b/gi, "you've")
        .replace(/\bwe have\b/gi, "we've")
        .replace(/\bthey have\b/gi, "they've")
        .replace(/\bI will\b/gi, "I'll")
        .replace(/\byou will\b/gi, "you'll")
        .replace(/\bwe will\b/gi, "we'll")
        .replace(/\bthey will\b/gi, "they'll")
        .replace(/\bI would\b/gi, "I'd")
        .replace(/\byou would\b/gi, "you'd")
        .replace(/\bwe would\b/gi, "we'd")
        .replace(/\bthey would\b/gi, "they'd")
        .replace(/\bgoing to\b/gi, "gonna")
        .replace(/\bwant to\b/gi, "wanna")
        .replace(/\bgot to\b/gi, "gotta")
        .replace(/\blet me\b/gi, "lemma")
        .replace(/\byes\b/gi, "yeah")
        .replace(/\bokay\b/gi, "ok")
        .replace(/\balright\b/gi, "ok")
    }

    setFormalized(output)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(formalized)
    alert('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-cozy-900 mb-2">Text Formalizer</h2>
        <p className="text-cozy-600">Convert text between formal and casual styles</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-cozy-700 mb-2">Formality Level</label>
        <select
          value={formalityLevel}
          onChange={(e) => setFormalityLevel(e.target.value)}
          className="input-field"
        >
          <option value="formal">Make Formal</option>
          <option value="casual">Make Casual</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-cozy-700 mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            rows="12"
            placeholder="Enter text to formalize or casualize..."
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-cozy-700">Output Text</label>
            <button onClick={handleCopy} className="btn-secondary text-sm">Copy</button>
          </div>
          <textarea
            value={formalized}
            readOnly
            className="input-field bg-cozy-50"
            rows="12"
            placeholder="Formalized/casualized text will appear here..."
          />
        </div>
      </div>

      <button onClick={handleFormalize} disabled={!input.trim()} className="btn-primary w-full disabled:opacity-50">
        {formalityLevel === 'formal' ? 'Make Formal' : 'Make Casual'}
      </button>
    </div>
  )
}

export default StudyTools
