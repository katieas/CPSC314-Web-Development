window.addEventListener("DOMContentLoaded", domLoaded);

function domLoaded() {
    const startButton = document.getElementById('start-btn')
    const nextButton = document.getElementById('next-btn')
    const backButton = document.getElementById('back-btn')

    const settings = document.getElementsByClassName('settings')
    const shuffledBox = document.getElementById('shuffle')
    const timerOnBox = document.getElementById('timed')
    const removeQuestionsBox = document.getElementById('remove-correct')

    const questionContainerElement = document.getElementById('question-container')
    const questionElement = document.getElementById('question')
    const answerButtonsElement = document.getElementById('answer-buttons')
    const displayQuestionElement = document.getElementById('question-counter')
    const answerContainerElement = document.getElementById('answer-container')
    const timerElement = document.getElementById('timer')

    let questions, correctQuestions, currentQuestionIndex, untouchedArray
    let selectedButton, answerContainer
    let timerID, timerCounter, blinkID, minutes, seconds
    let shuffled = true
    let timerOn = false 
    let removeQuestions = false
    let restart = false
    //using the domLoaded function because the buttons need to be rendered before we can
    //add an event listener
    
    startButton.addEventListener('click', startGame)

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++
        setNextQuestion()
    })

    backButton.addEventListener('click', () => {
        currentQuestionIndex--
        setBackQuestion()
    })

    shuffledBox.addEventListener('click', () => {
        shuffled = shuffledBox.checked
    })

    timerOnBox.addEventListener('click', () => {
        timerOn = timerOnBox.checked
    })

    removeQuestionsBox.addEventListener('click', () => {
        removeQuestions = removeQuestionsBox.checked
    })

    function startGame() {
        saveSettings()
        console.log(questions)
        currentQuestionIndex = 0
        questionContainerElement.classList.remove('hide')
        checkNumQuestions()
        setNextQuestion()
    }

    function saveSettings() {
        if (shuffled && !restart) {
            questions = []
            questions = questionsList.slice(0)
            questions = questions.sort(() => Math.random() - .5)
            console.log(questions)
            untouchedArray = questions.slice(0)
        }
        else if (restart) {
            questions = untouchedArray.slice(0)
        } 
        else {
            questions = []
            questions = questionsList.slice(0).sort() // not shuffled
            untouchedArray = questions.slice(0)
            console.log(questionsList)
        }

        if (timerOn) {
            timerCounter = 0
            minutes = 0
            seconds = 0
            clearInterval(timerID)
            clearInterval(blinkID)
            timerElement.classList.remove('hide')
            timerElement.innerText = "00m " + timerCounter + "0s"
            timedSession()
        }

        if (removeQuestions) {
            correctQuestions = []
        }

        settings[0].classList.add('hide')
    }
    
    function setNextQuestion() {
        resetState()
        showQuestion(questions[currentQuestionIndex])
    }

    function setBackQuestion() {
        resetState()
        showQuestion(questions[currentQuestionIndex])
    }

    function timedSession() {
        console.log("Timer Start")
        timerID = setInterval(increaseTime, 1000)
        blinkID = setInterval(blinkRed, 30000) // every 30 seconds
    }

    function increaseTime() {
        timerCounter++
        seconds = timerCounter % 60
        seconds = seconds < 10 ? '0' + seconds : seconds
        minutes = Math.floor(timerCounter / 60)
        minutes = minutes < 10 ? '0' + minutes : minutes
        timerElement.innerText = minutes + "m " + seconds + "s" 
    }

    function blinkRed() {
        let blinkCounter = 0
        timerElement.classList.toggle('blink')
        let blinking = setInterval(function() {
            blinkCounter++
            timerElement.classList.toggle('blink')
            if (blinkCounter == 3) {
                clearInterval(blinking) 
            } 
        }, 1000) 
    }
    
    function showQuestion(question) {
        questionElement.innerText = question.question
        displayQuestion()

        question.answers.forEach(answer => {
            const button = document.createElement('button')
            button.innerText = answer.text
            button.classList.add('btn')
            if (answer.correct) {
                button.dataset.correct = answer.correct
            }
            checkNumQuestions()
            button.addEventListener('click', selectAnswer)
            
            answerButtonsElement.appendChild(button) 
            checkIfDone()
        })
    }

    function showAnswer(correct) {
        if (answerContainer != null) return

        answerContainer = document.createElement('div')
        answerContainer.classList.add('answer-response')
        answerContainerElement.appendChild(answerContainer)

        if (correct) {
            answerContainer.innerHTML = "Your answer is correct! Good job!"
        } else {
            answerContainer.innerText = "Your answer is incorrect.\n" + questions[currentQuestionIndex].prompt
        }
    }

    function resetState() {
        clearStatusClass(document.body)
        selectedButton = null

        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild)
        }

        if (answerContainer != null) {
            answerContainer.classList.remove('answer-response')
            answerContainerElement.removeChild(answerContainer)
            answerContainer = null
        }
    }

    function selectAnswer(e) {

        if (selectedButton != null) return
        selectedButton = e.target
        const correct = selectedButton.dataset.correct
        
        setStatusClass(document.body, correct)
        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct)
        })

        showAnswer(correct)
        addCorrectQuestion(correct)
    }

    function checkNumQuestions() {
        if (currentQuestionIndex == 0) { // first question
            startButton.classList.add('hide')
            nextButton.classList.remove('hide')
            backButton.classList.add('hide')
        }

        else if (questions.length == currentQuestionIndex + 1) { // last question
            nextButton.classList.add('hide')
        } 
        
        else {
            startButton.classList.add('hide') 
            nextButton.classList.remove('hide')
            backButton.classList.remove('hide')
        } 
    }

    function checkIfDone() {
        if (questions.length == currentQuestionIndex + 1) {
            startButton.innerText = 'Restart'
            startButton.classList.remove('hide')
            nextButton.classList.add('hide')
            console.log("restart")
            restart = true;
        }
    }

    function addCorrectQuestion(correct) {
        if (correct && removeQuestions) {
            correctQuestions.push(questions.splice(currentQuestionIndex, 1))
            currentQuestionIndex--
        }
    }

    function setStatusClass(element, correct) {
        clearStatusClass(element)
        if (correct) {
            element.classList.add('correct')
        } else {
            element.classList.add('wrong')
        }
    }

    function clearStatusClass(element) {
        element.classList.remove('correct')
        element.classList.remove('wrong')
    }

    function displayQuestion() {
        displayQuestionElement.innerHTML = (currentQuestionIndex + 1) + " / " + (questions.length)
    }

    const questionsList = [
        {
            question: 'How do you get a rainbow sheep?',
            prompt: 'The correct answer is "Craft and use a name tag named "jeb_."" Jeb was the lead game designer for the game.',
            answers: [
                { text: 'Use every single dye on the sheep', correct: false },
                { text: 'You cant', correct: false },
                { text: 'Craft and use a name tag named "jeb_"', correct: true},
                { text: 'Craft and use a name tag named "rainbow"', corrent: false}
            ]
        },
        {
            question: 'What do you need to build a crafting table?',
            prompt: 'The correct answer is "4 wood planks."',
            answers: [
                { text: '4 wood planks', correct: true },
                { text: 'a stick', correct: false },
                { text: '2 sticks', correct: false },
                { text: 'a piece of wood', correct: false }
            ]
        },
        {
            question: 'What biome do emeralds spawn in?',
            prompt: 'The correct answer is "Extreme Hills Biome."',
            answers: [
                { text: 'Plains Biome', correct: false },
                { text: 'Swamp Biome', correct: false },
                { text: 'Mountains Biome', correct: false },
                { text: 'Extreme Hills Biome', correct: true }
            ]
        },
        {
            question: 'What are creepers afraid of?',
            prompt: 'The correct answer is "Ocelots."',
            answers: [
                { text: 'Pigs', correct: false },
                { text: 'Ocelots', correct: true },
                { text: 'Llamas', correct: false },
                { text: 'Wolves', correct: false }
            ]
        },
        {
            question: 'How long did it take to make the first release of Minecraft?',
            prompt: 'The correct answer is "6 days."',
            answers: [
                { text: '6 Days', correct: true },
                { text: '25 Days', correct: false },
                { text: '14 Days', correct: false },
                { text: '12 Days', correct: false }
            ]
        },
        {
            question: 'Which is not a natural color for the axolotl mob?',
            prompt: 'The correct answer is "purple." There is no purple axolotls in Minecraft.',
            answers: [
                { text: 'Brown', correct: false },
                { text: 'Pink', correct: false },
                { text: 'Purple', correct: true },
                { text: 'Yellow', correct: false }
            ]
        },
        {
            question: 'How do you beat Minecraft?',
            prompt: 'The correct answer is "Go the the End and defeat the Ender Dragon." Of course this is not the only way to play Minecraft. That is how you complete the story.',
            answers: [
                { text: 'Go to the End and defeat the Ender Dragon', correct: true },
                { text: 'Build a house', correct: false },
                { text: 'Theres a way to beat it?', correct: false },
                { text: 'Go to the nether to fight Endermen', correct: false }
            ]
        },
        {
            question: 'Whats the best weapon?',
            prompt: 'The correct answer is "An axe." I personally prefer to use a stick but an axe does more damage.',
            answers: [
                { text: 'A stick', correct: false },
                { text: 'A shovel', correct: false },
                { text: 'Bucket of fish', correct: false },
                { text: 'An axe', correct: true }
            ]
        },
        {
            question: 'How do you cure a lingering status effect?',
            prompt: 'The correct answer is "Milk." Milk gives you strong bones.',
            answers: [
                { text: 'Brew an antidote', correct: false },
                { text: 'Milk', correct: true },
                { text: 'Submerge in water', correct: false },
                { text: 'Eat a golden apple', correct: false }
            ]
        },
        {
            question: 'How many blocks are in a chunk?',
            prompt: 'The correct answer is "65,536".',
            answers: [
                { text: '65,536', correct: true },
                { text: '65,500', correct: false },
                { text: '65,535', correct: false },
                { text: '65,550', correct: false }
            ]
        }
    ]
}