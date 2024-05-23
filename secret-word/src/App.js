import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { Game, GameOver, StartScreen } from './components';
import { wordsList } from './data/words';

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
]

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const guessesQtnd = 3

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQtnd);
  const [score, setScore] = useState(0);

  console.log(words)

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    console.log(category)

    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return { word, category }
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates()

    const { word, category } = pickWordAndCategory();
    console.log(word, category)

    let wordLetters = word.split('')
    console.log(wordLetters)
    wordLetters = wordLetters.map((l) => l.toLowerCase())
    console.log(wordLetters)

    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    setGameStage(stages[1].name)
    console.log(gameStage)
  }, [pickWordAndCategory, gameStage])

  const verifyLetter = (letter) => {
    console.log(letter)

    const normalizedLetter = letter.toLowerCase()

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }

    console.log(guessedLetters)
    console.log(wrongLetters)

  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates()
      setGameStage(stages[2].name)
    }
  }, [guesses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]
    console.log(uniqueLetters)

    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore += 100)
      startGame()
    }
  }, [guessedLetters, letters, startGame]);

  const retry = () => {
    setScore(0)
    setGuesses(guessesQtnd  )
    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === 'start'&& 
        <StartScreen 
          startGame={startGame}
        />
      }

      {gameStage === 'game' && 
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters} 
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}  
        />  
      }

      {gameStage === 'end'&& 
        <GameOver 
          retry={retry} 
          score={score}
        />
      }
    </div>
  );
}

export default App;
