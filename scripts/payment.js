var pmt = 0.0, principal = 0.0, rate = 0.0, months = 0.0, monthMult = 0.0 ;

function calcPayment() {
    principal = parseFloat(document.getElementById("Principal").value) ;
    months = parseInt(document.getElementById("Years").value) * 12 ;
    rate = parseFloat(document.getElementById("Rate").value) / 100 / 12 ;
    monthMult = (1 + rate) ** months ;
    console.log('Principal: %f  Months: %d  Rate: %f  MthMult: %f', principal, months, rate, monthMult)

    pmt = principal * rate * monthMult / (monthMult - 1) ;
    document.getElementById("PaymentAmt").innerHTML = `<b>Payment amount</b>: ${pmt.toFixed(2)}` ;
}

function amortizeYear() {
    const extraPmt = parseFloat(document.getElementById("ExtraPmt").value) ;
    let runPrin = principal
    console.log('ExtraPmt: %f', extraPmt)
    let amortStr = '<table border="1"> <tr> <th>Pmt#</th> <th>Payment</th> <th>PrinAmt</th>' +
        '<th>IntAmt</th> <th>PrinRemain</th> </tr>'
    for (let i = 0; i < 12; i++) {
        const interest = runPrin * rate ;
        const principalPaid = pmt - interest + extraPmt ;
        runPrin -= principalPaid ;
        amortStr += `<tr><td>${i + 1}</td> <td>${(pmt + extraPmt).toFixed(2)}</td>`
        amortStr += `<td>${principalPaid.toFixed(2)}</td> <td>${interest.toFixed(2)}</td>`
        amortStr += `<td>${runPrin.toFixed(2)}</td></tr>` ;
    }
    amortStr += '</table>'
    document.getElementById("Amortization").innerHTML = amortStr ;
}