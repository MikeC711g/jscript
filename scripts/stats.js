// Jason with pass().dribble().shoot() analogy (pros and cons)
// This script calculates statistics from a list of numbers provided by the user.
function calcStats() {
    const fullList = document.getElementById('numList').value.trim() ;
    const numList = fullList.split(/\s+/).map(Number).filter(n => !isNaN(n)) ;
    const results = document.getElementById('results') ;
    if (numList.length === 0) {   results.innerHTML = "No valid numbers provided." ;  return ;  }
    const sum = numList.reduce((acc, val) => acc + val, 0) ;
    const mean = sum / numList.length ;
    const stdDev = Math.sqrt(numList.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numList.length) ;
    const min = Math.min(...numList) ;
    const max = Math.max(...numList) ;
    results.innerHTML = `
        <p>Sum: ${sum}</p>    <p>Mean: ${mean.toFixed(2)}</p>
        <p>Standard Deviation: ${stdDev.toFixed(2)}</p>
        <p>Minimum: ${min}</p>   <p>Maximum: ${max}</p>` ;
    let [nmin, nmax, nstdDevTotal, nsum] = [Infinity, -Infinity, 0, 0] ;
    numList.forEach(n => {      // Could also have been:  for (const n of numList)
        if (n < nmin) nmin = n ;
        if (n > nmax) nmax = n ;
        nstdDevTotal += Math.pow(n - mean, 2) ;
        nsum += n ;
    }) ;
    const nmean = nsum / numList.length ;
    const nstdDev = Math.sqrt(nstdDevTotal / numList.length) ;
    results.innerHTML += `
        <p>Custom Min: ${nmin}</p>
        <p>Custom Max: ${nmax}</p>
        <p>Custom Mean: ${nmean.toFixed(2)}</p>
        <p>Custom Standard Deviation: ${nstdDev.toFixed(2)}</p> ` ;
}