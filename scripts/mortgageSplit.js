var Mortgages = [ { "Name": "251PB", "Rate": 3.0, "Term": 15, "StartYr": 2012, "StartMth": 9,
    "StartAmt": 77500, "Pmt": 535.20, "BalYr": 2024, "BalMth": 1, "CBal": 22046.69 },
    { "Name": "5422EI", "Rate": 2.75, "Term": 15, "StartYr": 2017, "StartMth": 3,
    "StartAmt": 223430, "Pmt": 1526.90, "BalYr": 2020, "BalMth": 1, "CBal":  190374.82},
    { "Name": "1317SM", "Rate": 2.975, "Term": 30, "StartYr": 2023, "StartMth": 1,
        "StartAmt": 154645.09, "Pmt": 1303.23, "BalYr": 2023, "BalMth": 1, "CBal":  154645.09} ]
let radios = '', ckVal = 'checked' ;
for (let mtgDtl of Mortgages) {
    radios += `<input type="radio" name="mtg" value="${mtgDtl.Name}" ${ckVal}> ${mtgDtl.Name}<br>` ;
    ckVal = '' ;
}
document.getElementById("Radios").innerHTML = radios ;
let today = new Date() ;
document.getElementById("Month").value = today.getMonth() + 1 ;
document.getElementById("Year").value = today.getFullYear() ;

function getPmtDetails() {
    let mtg = document.querySelector('input[name="mtg"]:checked').value;
    let mtgDtl = Mortgages.find(m => m.Name === mtg);
    const rate = mtgDtl.Rate / 1200, months = mtgDtl.Term * 12 ;

    const mMonth = parseInt(document.getElementById("Month").value) -1 ;
    const mYear = parseInt(document.getElementById("Year").value) ;
    const dateDiff = getMonthDiff(mtgDtl.BalYr, mtgDtl.BalMth - 1, mYear, mMonth)
    console.log('Mtg: %O  Month: %d  Year: %d  DateDiff: %d', mtgDtl, mMonth, mYear, dateDiff)
    let runPrin = mtgDtl.CBal, curInt = 0.0 , curPrin = 0.0 ;
    console.log('runPrin: %f payment: %f', runPrin, mtgDtl.Pmt) ;
    for (let i = 0; i < dateDiff; i++) {
        curInt = runPrin * rate ;
        curPrin = mtgDtl.Pmt - curInt ;
        runPrin -= curPrin ;
        console.log('%d  runPrin: %f  int: %f  prin: %f', i, runPrin.toFixed(2),
            curInt.toFixed(2), curPrin.toFixed(2)) ;
    }

    let mtgOut = `<b>Principal</b>: ${curPrin.toFixed(2)}  <b>Interest</b>: ${curInt.toFixed(2)}<br>`
    mtgOut +=  `Remaining Principal ${runPrin.toFixed(2)}  Month: ${mMonth + 1} Year: ${mYear}` ;
    document.getElementById("PaymentDtls").innerHTML = mtgOut ;
}
    
function getPmtDetailsOld() {
    let mtg = document.querySelector('input[name="mtg"]:checked').value;
    let mtgDtl = Mortgages.find(m => m.Name === mtg);
    const rate = mtgDtl.Rate / 1200, months = mtgDtl.Term * 12 ;

    const mMonth = parseInt(document.getElementById("Month").value) -1 ;
    const mYear = parseInt(document.getElementById("Year").value) ;
    const dateDiff = getMonthDiff(mtgDtl.StartYr, mtgDtl.StartMth, mYear, mMonth) + 3 ;
    console.log('Mtg: %O  Month: %d  Year: %d', mtgDtl, mMonth, mYear)
    console.log('DateDiff: ', dateDiff)
    const monthMult = (1 + rate) ** months;
    console.log('StartAmt: %f  rate: %f  monthMult: %f  months: %d', mtgDtl.StartAmt, rate, monthMult, months)
    const payment = mtgDtl.StartAmt * rate * monthMult / (monthMult - 1) ;
    let runPrin = mtgDtl.StartAmt, curInt = 0.0 , curPrin = 0.0 ;
    console.log('runPrin: %f payment: %f', runPrin, payment) ;
    for (let i = 0; i < dateDiff; i++) {
        curInt = runPrin * rate ;
        curPrin = payment - curInt ;
        runPrin -= curPrin ;
    }

    const mtgOut = `Pmt:Prin ${curPrin.toFixed(2)} Int ${curInt.toFixed(2)} Rmn ${runPrin.toFixed(2)}` ;

    console.log('Payment: %f  Interest: %f  Principal: %f  RmnPrin: %f', payment, curInt, curPrin, runPrin)
    document.getElementById("PaymentDtls").innerHTML = mtgOut ;
}

function getMonthDiff(startYr, startMo, endYr, endMo) {
    return (endYr - startYr) * 12 + (endMo - startMo) ;
}
