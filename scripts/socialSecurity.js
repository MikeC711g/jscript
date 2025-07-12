let varsInitd = false
let firstYr = 0 ; let intRate = 0 ; let lastYr = 0 ; let empMatch = false
let wHoldRate = 7.65 ; retirementIncomeType = 'none' ; retirementAge = 0
mthAmt = 0 ; retireYear = 0

function createAnnualInputs() {
    if (!varsInitd) { initVals() }
    console.log('In createAnnualInputs with yr %d to %d and rate: %f',
        firstYr, lastYr, intRate)
    outStr = 'Report on annual contribution to Social Security <br>'
    outStr += '<table border="1"><tr><th>Year</th><th>SSEarnings</th>'+
        '<th>SSWitholding</th><th>Worth</th></tr>'
    for (let i = firstYr; i <= lastYr; i++) {
        outStr += '<tr><td>' + i + '</td><td><input type="number" id="ssEarn' + 
        i +'" onblur="calcYr(' + i + ')"></td><td><p id="withAmt' + i + '"></p>' +
        '</td><td><p id="cVal' + i + '"></p></td></tr>'
    }
    outStr += '</table>'
    document.getElementById('inputs').innerHTML = outStr
}

function calcYr(idSuffix) {
    if (!varsInitd) { initVals() }
    curYr = (typeof idSuffix === 'string') ? parseInt(idSuffix) : idSuffix
    oldBalIdx = 'cVal' + (curYr-1)     // ID for oldBal, if this is not first year
    oldBalPos = document.getElementById(oldBalIdx)      // Does oldBal exist
    oldBal = (oldBalPos) ? parseFloat(oldBalPos.innerText) : 0  // Retrieved val or 0
    console.log('calcYr: %d obIdx: %s  ob: %f', idSuffix, oldBalIdx, oldBal)
    earnPos = 'ssEarn' + curYr ; wHoldPos = 'withAmt' + curYr ; balPos = 'cVal' + curYr
    earnVal = parseFloat(document.getElementById(earnPos).value)
    wHoldVal = earnVal * wHoldRate / 100
    document.getElementById(wHoldPos).innerText = wHoldVal.toFixed(2)
    curYrInt = wHoldVal * intRate * .45 / 100 // Rough int as year goes on
    priorYrInt = oldBal * intRate / 100     // A year interest on old balance
    curYrVal = wHoldVal + oldBal + curYrInt + priorYrInt
    console.log('PreVal: %f  CurYrInt: %f  PriorBalInt: %f', oldBal, curYrInt, priorYrInt)
    document.getElementById(balPos).innerText = curYrVal.toFixed(2)
}

function refreshValues() {
    if (!varsInitd) { initVals() }
    for (let i = firstYr; i <= lastYr; i++) {
        calcYr(i)
    }
}

function finalSummary() {
    if (!varsInitd) { initVals() }
    curYr = new Date().getFullYear()
    locLastYr = lastYr
    idxToLastBal = 'cVal' + locLastYr
    idxToLastWithH = 'withAmt' + locLastYr
    lastYrVal = parseFloat(document.getElementById(idxToLastBal).innerText)
    lastYrWithH = parseFloat(document.getElementById(idxToLastWithH).innerText)
    retirementIncome = (retirementIncomeType === 'none') ? 0 : lastYrWithH 
    console.log('Take1 RetirementAge: ' + retirementAge)
    curTot = lastYrVal
    ageYrDelta = retireYear - retirementAge
    console.log('retirementAge: %d', retirementAge)
    for (let i = ++locLastYr; i <= retireYear; i++) {
        workInt = retirementIncome * intRate * .45 / 100
        oldInt = curTot * intRate / 100
        curTot += workInt + oldInt + retirementIncome
        if (retirementIncomeType === 'cola') {
            retirementIncome += retirementIncome * intRate / 100
        }
    }
    sumText = 'Social Security Retirement Summary<br>' +
        ' Total amount in retirement year: ' + curTot.toFixed(2) + '<br>' +
        ' If you continued earning ' + intRate + '% int in retirement and paid yourself <br>' +
        mthAmt + ' monthly, here are some details:<br> '
    yrAmt = mthAmt * 12
    if (yrAmt < oldInt) {
        finalYear = 'Never' ; moneyGone = 'Never'
    } else {
        locRetireYear = retireYear
        while (curTot > 0) {
            ++locRetireYear
            curTot -= yrAmt
            curTot += curTot * intRate / 100
            if (locRetireYear % 5 === 0) {
                sumText += '<br>Year: ' + locRetireYear + ' age: ' + (locRetireYear - ageYrDelta) +
                    ' Money left: ' + curTot
            }
            console.log('Yr: %d  curTot: %f', locRetireYear, curTot)
        }
        finalYear = locRetireYear ; moneyGone = finalYear - ageYrDelta
    }
    sumText += '<br><br>All gone at age: ' + moneyGone + ' In Year: ' + finalYear
    document.getElementById('summary').innerHTML = sumText
}

function initVals() {
    firstYr = parseInt(document.getElementById('firstYr').value)
    lastYr = parseInt(document.getElementById('lastYr').value)
    intRate = parseFloat(document.getElementById('intRate').value)
    empMatch = document.getElementById('empMatch').checked
    wHoldRate = parseFloat(document.getElementById('ssWPct').value)
    if (empMatch) { wHoldRate *= 2 }
    retirementAge = getChecked('retirementAge')
    retirementAge = (retirementAge) ? parseInt(retirementAge) : 70
    retirementIncomeType = getChecked('retirementIncome')
    mthAmt = parseFloat(document.getElementById('mthAmt').value)
    retireYear = parseFloat(document.getElementById('retireYear').value)
    varsInitd = true
}

function getChecked(name) {
    let radios = document.getElementsByName(name)
    for (let i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return radios[i].value
        }
    }
    return null
}
