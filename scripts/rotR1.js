// Put in write of file to ~/Downloads. Don't move ec link to downloads, only repl when needed

const fileSelector = document.getElementById('FileSelector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    const file = fileList[0] ;
    // const name = file.name ? file.name : 'Not supported' ;
    const reader = new FileReader() ;
    reader.addEventListener('load', () => {
        cvtR1s(reader.result) ;
        console.log(reader.result) ;
    }, false)
    reader.readAsText(file) ;
    // reader.readAsArrayBuffer(file)
    console.log(fileList)
})

function cvtR1s(inText) {   // Currently no embedded <r1> and no first char in file <r1>
    const r1s = inText.split('<r1>') ;
    let destStr = r1s[0] ;  // First part of string is not a <r1> so just copy it
    for (let i = 1; i < r1s.length; i++) {
        const r1e = r1s[i].indexOf('</r1>') ;
        if (r1e > 0)  destStr += '<r1>' + cvtString(r1s[i].slice(0, r1e)) + r1s[i].slice(r1e) ;
        else  destStr += '<r1>' + r1s[i] ;
    }
    const encodedUri = encodeURI("data:text/plain;charset=utf-8," + destStr ) ;
    writeFile(encodedUri, 'bizphones.text') ;
}

function cvtInput() {
    inItem = document.getElementById('strBefore') ;
    const inStr = inItem.value ;
    inItem.value = (inStr.length > 0) ? cvtString(inStr) : inStr ;
}

function cvtString(inStr) {
    const srcArr  = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' ;
    const destArr = 'nopqrstuvwxyzabcdefghijklmNOPQRSTUVWXYZABCDEFGHIJKLM5678901234' ;
    let destStr = '' ;
    if (inStr.length === 0) return inStr ;
    for (let x of inStr) {
        const idx = srcArr.indexOf(x) ;
        destStr += (idx < 0) ? x : destArr[idx] ;
    }
    // console.log(' inStr: %s  destStr: %s', inStr, destStr) ;
    return destStr ;
}

function writeFile(encodedData, fileName) {
    console.log('writeFile filenm: %s', fileName)
    const dlAnchor = document.createElement('a')
    dlAnchor.setAttribute("href", encodedData)
    dlAnchor.setAttribute("download", fileName)
    document.body.appendChild(dlAnchor)
    dlAnchor.click()
    dlAnchor.remove()
}
