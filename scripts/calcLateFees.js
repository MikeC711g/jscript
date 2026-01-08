function calcLateFees() {
    const startDtStr = document.getElementById("startDt").value ;
    const endDtStr = document.getElementById("endDt").value ;
    const rentDueDom = parseInt(document.getElementById("rentDueDom").value) ;
    const lateFee = parseFloat(document.getElementById("lateFee").value) ;
    const gracePeriod = parseInt(document.getElementById("gracePeriod").value) ;
    const startBal = parseFloat(document.getElementById("startBal").value) ;
    console.log('startDt: %s  endDt: %s  rentDueDom: %d  lateFee: %f  gracePeriod: %d  startBal: %f',
        startDtStr, endDtStr, rentDueDom, lateFee, gracePeriod, startBal) ;
    const dayOfLateFee = rentDueDom + gracePeriod ;
    let curYr = parseInt(startDtStr.slice(0, 4)) ;  let curMth = parseInt(startDtStr.slice(5, 7)) ;
    let lateDate = curYr.toString() + '-' + curMth.toString().padStart(2, '0') + '-' +
        dayOfLateFee.toString().padStart(2, '0') ;
    console.log('First lateDate: %s  startDt: %s', lateDate, startDtStr) ;
    if (lateDate < startDtStr) {   // First late fee is next month
        console.log('First late fee is next month') ;
        curMth++ ;
        if (curMth > 12) { curMth = 1 ; curYr++ ; }
        lateDate = curYr.toString() + '-' + curMth.toString().padStart(2, '0') + '-' +
            dayOfLateFee.toString().padStart(2, '0') ;
    }
    console.log('dayOfLateFee: %d  curYr: %s  curMth: %s  dt: %s', dayOfLateFee, curYr, curMth, lateDate) ;
    const lateFees = [] ;
    while (lateDate <= endDtStr) {
        lateFees.push(lateDate) ;
        curMth++ ;  if (curMth > 12) { curMth = 1 ; curYr++ ; }
        lateDate = curYr.toString() + '-' + curMth.toString().padStart(2, '0') + '-' +
            dayOfLateFee.toString().padStart(2, '0') ;
    }

    document.getElementById("ProblemOutput").innerText = 'Array of lateDates: ' + lateFees ;
    // let procDate = new Date(startDtStr) ;  let curMth = procDate.getMonth() ;
    // Find out if we can create date from date w/out just getting new address
    // If getDate() > dayOfLateFee, then first late fee is next month
    // Once we have first late fee date, keep adding months until > endDt
    /* const lateFeeDates: String[] = [] ;
    let firstLateFeeDate = new Date(procDate.getFullYear(), procDate.getMonth(), dayOfLateFee) ;
    if (firstLateFeeDate <= startDt) {   // Set first late fee date based on lease startDt
        if (++curMth > 11) { 
            curMth = 0 ; firstLateFeeDate.setFullYear(firstLateFeeDate.getFullYear() + 1) ;
        }
        firstLateFeeDate.setMonth(curMth) ;
    }
    while (firstLateFeeDate <= endDt) {
        lateFeeDates.push(firstLateFeeDate) ;
        curMth++ ;
    for (let i = 0; i <= mthDiff; i++) {
        let testDate = new Date(procDate.getFullYear(), procDate.getMonth(), dayOfLateFee) ;
        if (testDate > endDt) { break ; }
        if (testDate > startDt) { lateFeeDates.push(testDate) ; }
        curMth++ ;
        if (curMth > 11) { curMth = 0 ; procDate.setFullYear(procDate.getFullYear() + 1) ; }
        procDate.setMonth(curMth) ;
    } */
}
