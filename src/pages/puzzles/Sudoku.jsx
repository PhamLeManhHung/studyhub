import { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react'

const Sudoku = ({ onBack }) => {
  const [grid, setGrid] = useState([])
  const [solution, setSolution] = useState([])
  const [selectedCell, setSelectedCell] = useState(null)
  const [isComplete, setIsComplete] = useState(false)

  // Generate a simple 9x9 Sudoku puzzle (simplified version)
  const generatePuzzle = () => {
    // This is a simplified example - a real Sudoku generator would be more complex
    const initialGrid = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]

    const solutionGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ]

    setGrid(initialGrid.map(row => [...row]))
    setSolution(solutionGrid.map(row => [...row]))
    setIsComplete(false)
  }

  useEffect(() => {
    generatePuzzle()
  }, [])

  const handleCellClick = (row, col) => {
    if (grid[row][col] === 0) {
      setSelectedCell({ row, col })
    }
  }

  const handleNumberInput = (num) => {
    if (selectedCell) {
      const newGrid = grid.map(row => [...row])
      newGrid[selectedCell.row][selectedCell.col] = num
      setGrid(newGrid)
      checkCompletion(newGrid)
    }
  }

  const handleClear = () => {
    if (selectedCell && grid[selectedCell.row][selectedCell.col] !== 0) {
      const newGrid = grid.map(row => [...row])
      newGrid[selectedCell.row][selectedCell.col] = 0
      setGrid(newGrid)
      setIsComplete(false)
    }
  }

  const checkCompletion = (currentGrid) => {
    let isCorrect = true
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (currentGrid[i][j] !== solution[i][j]) {
          isCorrect = false
          break
        }
      }
      if (!isCorrect) break
    }
    setIsComplete(isCorrect)
  }

  const isInitialCell = (row, col) => {
    const initialGrid = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
    return initialGrid[row][col] !== 0
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-cozy-900">Sudoku</h1>
            <p className="text-cozy-600 mt-1">Fill the grid so every row, column, and 3x3 box contains digits 1-9.</p>
          </div>
        </div>
        <button onClick={generatePuzzle} className="btn-primary flex items-center space-x-2">
          <RotateCcw size={20} />
          <span>New Puzzle</span>
        </button>
      </div>

      {isComplete && (
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 size={24} className="text-green-600" />
            <p className="text-lg font-semibold text-green-900">Congratulations! You solved the puzzle!</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-9 gap-1 border-2 border-cozy-900 p-1">
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                const isInitial = isInitialCell(rowIndex, colIndex)
                const isCorrect = cell === 0 || cell === solution[rowIndex][colIndex]
                
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={`w-12 h-12 border border-cozy-300 text-lg font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary-100 border-primary-500 ring-2 ring-primary-300'
                        : isInitial
                        ? 'bg-cozy-100 text-cozy-900'
                        : 'bg-white text-cozy-900 hover:bg-cozy-50'
                    } ${
                      !isCorrect && cell !== 0 ? 'text-red-600' : ''
                    } ${
                      (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-2 border-cozy-900' : ''
                    } ${
                      (colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-2 border-cozy-900' : ''
                    }`}
                  >
                    {cell !== 0 ? cell : ''}
                  </button>
                )
              })
            )}
          </div>

          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="grid grid-cols-9 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberInput(num)}
                  className="w-12 h-12 bg-primary-100 text-primary-700 rounded-xl font-bold text-lg hover:bg-primary-200 transition-colors"
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={handleClear}
              className="btn-secondary"
            >
              Clear Cell
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sudoku

