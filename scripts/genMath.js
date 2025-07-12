function calcIt() {
    const curEqn = document.getElementById("ProblemInput").value ;
    const curAnswer = eval(curEqn) ;

    document.getElementById("ProblemOutput").innerHTML = `<b>Answer</b>: ${curAnswer}` ;
}

function genProblems() {
    let curList = "" ;  randArr = [] ;
    const numProbs = parseInt(document.getElementById("NumProbs").value) ;
    const doSolutions = document.getElementById("IncludeSolutions").checked ; 
    console.log("NumProbs: " + numProbs + " doSolutions: " + doSolutions) ;
    for (let i = 0; i < numProbs; i++) {
        curList += `<br><b>Problem ${i + 1}</b><br>` ;
        for (let probVals = 0; probVals < 8; probVals++) {
            let cVal = Math.floor(Math.random() * 5) - 1 ; // -1 to 4 (w/0s cvted to 1s)
            if (!cVal)  cVal = 1 ;
            randArr.push(cVal) ;
        }
        let [xVal, yVal, coEff1a, coEff1b, coEff2a, coEff2b, lit1, lit2] = [...randArr] ;
        randArr = [] ;
        if (coEff1a === coEff2a && coEff1b === coEff2b) coEff1b = coEff1b + 1 ;
        let curLeft = xVal * coEff1a + yVal * coEff1b + lit1 ;
        let curRight = xVal * coEff2a + yVal * coEff2b + lit2 ;
        curList += `${fixCo(coEff1a)}X + ${fixCo(coEff1b)}Y + ${lit1} = ${curLeft}<br>` ;
        curList += `${fixCo(coEff2a)}X + ${fixCo(coEff2b)}Y + ${lit2} = ${curRight}<br>` ;
        curList += `X = ${xVal} Y = ${yVal}  <br><br>`;
        if (doSolutions)  curList +=
            solveProb(coEff1a, coEff1b, coEff2a, coEff2b, lit1, lit2, curLeft, curRight) ;
    }
    document.getElementById("ProblemList").innerHTML = `<b>Problem List</b>: ${curList}` ;
}

function solveProb(coEffX1, coEffY1, coEffX2, coEffY2, lit1, lit2, rLit1, rLit2) {
    let curList = "<b>Solution:</b><br>";  let yVal = 0.0, xVal = 0.0 ;
    rLit1 -= lit1 ;
    curList += `${fixCo(coEffX1)}X + ${fixCo(coEffY1)}Y = ${rLit1}  (add/subt to remove ${lit1} on left)<br>` ;
    coEffY1 *= -1 ; 
    curList += `${fixCo(coEffX1)}X = ${fixCo(coEffY1)}Y + ${rLit1}  (add/subt ${fixCo(coEffY1*-1)}Y from both sides)<br>` ;
    coEffY1 /= coEffX1 ;   rLit1 /= coEffX1 ;
    curList += `<b>X = ${fixCo(coEffY1.toFixed(2))}Y + ${rLit1.toFixed(2)} </b> (divide by ${coEffX1.toFixed(2)})<br><br>` ;

    curList += `${fixCo(coEffX2)}(${fixCo(coEffY1.toFixed(2))}Y + ${rLit1.toFixed(2)}) +
        ${fixCo(coEffY2)}Y + ${lit2} = ${rLit2.toFixed(2)}  (repl X with Y term in 2nd equation)<br>` ;
    coEffY1 *= coEffX2 ;  rLit1 *= coEffX2 ;
    curList += `${fixCo(coEffY1.toFixed(2))}Y + ${rLit1.toFixed(2)} + ${fixCo(coEffY2)}Y + ${lit2} = ${rLit2.toFixed(2)}  (simplify)<br>` ;
    coEffY1 += coEffY2 ;  rLit1 += lit2 ;
    curList += `${fixCo(coEffY1.toFixed(2))}Y + ${rLit1.toFixed(2)} = ${rLit2.toFixed(2)}  (combine like terms)<br>` ;
    yVal = rLit2 - rLit1 ;
    curList += `${fixCo(coEffY1.toFixed(2))}Y = ${yVal.toFixed(2)}  (subtract ${rLit1.toFixed(2)} from both sides)<br>` ;
    yVal /= coEffY1 ;
    curList += `<b>Y = ${yVal.toFixed(2)}  </b>(divide by ${coEffY1.toFixed(2)})<br><br>` ;

    curList += `${coEffX2}X + ${fixCo(coEffY2)} * ${yVal.toFixed(2)} + (${lit2.toFixed(2)}) = ${rLit2.toFixed(2)}  (repl Y in 1st eqn)<br>` ;
    coEffY2 *= yVal ;
    curList += `${fixCo(coEffX2)}X + ${coEffY2.toFixed(2)} + (${lit2.toFixed(2)}) = ${rLit2.toFixed(2)}  (Simplify)<br>` ;
    lit2 += coEffY2 ;
    curList += `${fixCo(coEffX2)}X + ${lit2.toFixed(2)} = ${rLit2.toFixed(2)}  (combine like terms)<br>` ;
    rLit2 -= lit2 ;
    curList += `${fixCo(coEffX2)}X = ${rLit2.toFixed(2)}  (subtract ${lit2.toFixed(2)} from both sides)<br>` ;
    xVal = rLit2 / coEffX2 ;
    curList += `<b> X = ${xVal.toFixed(2)}  </b> (divide by ${coEffX2.toFixed(2)})<br>` ;

    return curList
}

function fixCo(inCoEff)  { return (inCoEff === 1) ? "" : (inCoEff === -1) ? "-" : inCoEff; }