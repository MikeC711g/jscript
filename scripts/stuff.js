function stuff() {
    // const dfmtPattern = /\d{4}-0[1-9]|1[0-2]-0[1-9]|[12]\d|3[01]
    const dfmtPattern = /\d{4}-0[1-9]|1[0-2]-0[1-9]|[12]\d|3[01]/;
    const dStr = '2023-10-02', dstr2 = 'Mike', dstr3 = 7 ;
    if (dStr.match(dfmtPattern)) {  console.log('Date: %s', dStr) }
    else { console.log('Invalid date: %s', dStr) }
    if (dstr2.match(dfmtPattern)) { console.log('Date: %s', dstr2) }
    else { console.log('Invalid date: %s', dstr2) }
    /*************************************************** */
    let littleNum = 12 ;  let bigNum = 7123456789.012
    littleVal = dispFmt(littleNum, 2)
    bigVal = dispFmt(bigNum, 2)
    document.getElementById("putStuffHere").innerHTML = littleVal + ' ' + bigVal ;
}
function dispFmt(inNo, prec = 2) {
    let oNum = inNo.toFixed(prec) ;
    let dotPo = oNum.indexOf('.') ;
    let intPart = oNum.slice(0, dotPo)
    let curStr = oNum.slice(dotPo)
    console.log('Int: %s  dot: %s', intPart, curStr)
    for (let iLen = intPart.length; iLen > 3; iLen -= 3) {
        curStr = ',' + intPart.slice(iLen - 3) + curStr
        intPart = intPart.slice(0, iLen-3)
        console.log('iLen: %d IntPart: %s  curStr: %s', iLen, intPart, curStr)
    }
    curStr = intPart + curStr
    return curStr
}