const vocabWords = [ 'Coefficient', 'Quadratic', 'Irrational', 'Slope', 'Tangent', 'Function'] ;
const vocabDefs = ['Number by which the dependent variable is multiplied',
    'Formula for calculating numbers at which an equation = 0',
    'Number that is not repeating or terminating (see Mia)', 
    'Speed at which a line ascends or descends based on horizontal distance',
    'Formula for a line that hits the graph at a particular point (see Pap thinking)',
    'Relation where each input (domain) has a single output (range) (see conjunction junction)' ] ;
const goodGood = ["Not bad grasshopper", "Ah, the young one is correct again",
    "Kudos Dude", "Now you're just showing off" ]       // Good streak, good answer
const goodMiss = ["So close ... but no cigar", "Ugh ... that was ugly",     // First miss
    "And you were doing so well", "Ouch ... this one still needs some work" ]
    // badGood = correct answer after some misses.  BadMiss = 2+ misses in a row
const badGood = ["Got it, now let's get back on track", "look who just woke up",
    "Good answer, now let's keep going", "Wait a minute ... this one MIGHT just have a clue" ]
const badMiss = ["Is it just me or is eomething rotten in Denmark?", "Seriously dude!!??",
    "Well, you now have LOTS of room for improvement", "Not so good, let's get back on track" ]
const itemAsked = [] ;  const itemCorrect = [] ;  let correctStreak = 0 ;  let missStreak = 0 ;
const numAns4Match = 3 ;  let numAttempts = 0 ;  let numCorrect = 0 ;

// hereiam ... Look for images (animated gifs?) to augment responses
//  After success or fail ... do I pop up next question?

function refreshIt() {
    const arrLen = vocabWords.length ;
    itemAsked.splice(0, arrLen) ;  itemCorrect.splice(0, arrLen)
    for (let i = 0; i < arrLen; i++) {
        itemAsked.push(false) ;  itemCorrect.push(false) ;
    }
    correctStreak = missStreak = numAttempts = numCorrect = 0 ;
    setupQuestion() ;
}

function setupQuestion() {
    const htmlQues = document.getElementById( 'questionNum' ) ;
    const htmlAns = document.getElementById( 'selectList' ) ;
    const htmlResp = document.getElementById( 'response' ) ;
    const quesNum = getQuestionNum() ;      // Select which question
    if (quesNum < 0) {
        const successMsg = getSuccessMsg(numCorrect * 100 / numAttempts) ;
        htmlResp.innerText = 
            `All questions answered correctly, you got ${numCorrect} out of ${numAttempts}  ${successMsg}`
        htmlQues.innerText = '' ;  htmlAns.innerText = '' ;
    } else {
        htmlQues.innerText = vocabWords[quesNum] ;
        htmlResp.innerText = '' ;

        const ansList = getAnswers(numAns4Match, quesNum) ;    // Get list of answers (including right one)
        const whichAns = Math.floor(Math.random() * numAns4Match)   // Which place gets right answer
        let selectString = '<label for="matchAns">Select an option</label>'
        selectString += `<select id="matchAns" onChange="respond2Ans(${quesNum}, this.value)" size="${numAns4Match+1}">`
        for (let i = 0; i < numAns4Match; i++) {
            if (i === whichAns)  selectString += `<option value="true">${vocabDefs[quesNum]}</option>`
            selectString += `<option value="false">${vocabDefs[ansList[i]]}</option>`
        }
        selectString += "</select>"
        htmlAns.innerHTML = selectString ;
    }
}

function getQuestionNum() {
    let quesNum = Math.floor(Math.random() * itemAsked.length)
    if (itemAsked[quesNum] && [itemCorrect[quesNum]]) {     // Already answered correctly
        quesNum = itemCorrect.findIndex(ic => ic === false) ;   // Find ques not correctly answered
    }
    return quesNum ;
}

function getSuccessMsg(sRate) {
    if (sRate > 90) return 'Rockin the house'
    if (sRate > 80) return 'Almost there'
    if (sRate > 70) return 'Not bad, but room for improvement'
    if (sRate > 60) return 'Hmm .. we have work to do'
    return 'Ugh ... we should probably work on this'
}

function getAnswers(numAns, skipItem) {
    if (numAns > vocabDefs.length)  numAns = vocabDefs.length 
    answerList = [skipItem] ;       // Prime with the one correct answer
    while (answerList.length <= numAns) {       // It will be one too long and then shortened
        let idx = Math.floor(Math.random() * vocabDefs.length)
        while (answerList.includes(idx)) {
            idx = Math.floor(Math.random() * vocabDefs.length)
        }
        answerList.push(idx) ;
    }
    answerList.shift() ;        // Remove correct answer
    return answerList
}

function respond2Ans(goodIdx, ansGood) {
    const ansBool = (ansGood === 'true') ;
    numAttempts++ ; 
    const htmlResp = document.getElementById( 'response' ) ;
    const histGood = (missStreak < 1)
    itemAsked[goodIdx] = true ;
    let respArr = goodGood ;
    if (ansBool) {   // They got it right
        missStreak = 0 ;  correctStreak++ ;  numCorrect++ ; itemCorrect[goodIdx] = true ;
        respArr = (histGood) ? goodGood : badGood ;
    } else {
        correctStreak = 0 ;  missStreak++ ;
        respArr = (histGood) ? goodMiss : badMiss ;
    }
    const respText = respArr[Math.floor(Math.random() * respArr.length)] ;
    let rtnResp = `<p> ${respText}</p>`
    if (!ansBool)  rtnResp += `<p>Correct answer: ${vocabDefs[goodIdx]}</p>` ;
    rtnResp += `<p> ${numCorrect} correct out of ${numAttempts}</p>`
    htmlResp.innerHTML = rtnResp
    return rtnResp ;
}