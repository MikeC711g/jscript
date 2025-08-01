function cleanFinal(xmlArr) {
    console.debug('Looking for anything left behind') ;
    for (let i = 0; i < xmlArr.length; i++) {
        if (xmlArr[i].startsWith('<')) {
            console.log('Unprocessed/unclosed row %s', xmlArr[i]) ;
        }
    }
}

function closeTags(xmlArr, closeIdx, openIdx, tag) {
    console.debug('closeTags close: %d  open: %d  tag: %s', closeIdx, openIdx, tag) ;
    let combineStr = '  ' + xmlArr[openIdx] ;   // Indent to avoid future finds
    for (let i = openIdx+1; i < closeIdx; i++) {    // Close interim rows
        if (xmlArr[i].startsWith('<')) {    // If not already handled row
            let closeBrack = xmlArr[i].indexOf('>') ;   // Construct closing tag
            let closeTag = '</' + xmlArr[i].substring(1, closeBrack+1) ;
            combineStr += ' ' + xmlArr[i] + ' ' + closeTag    // Add this to combined element
            console.debug('Added %s to close row %d  so combined now %s',
                closeTag, i, combineStr) ;
        } else {
            combineStr += ' ' + xmlArr[i]
        }
    }
    combineStr += ' ' + xmlArr[closeIdx] ;
    xmlArr[openIdx] = combineStr ;      // Stash combined into open element
    // Now rmv older rows. So now 1 row, all items closed, row indented to avoid srches
    xmlArr.splice(openIdx+1, closeIdx - openIdx) ;
}

function findClosers(xmlArr) {
    for (let i = 1; i < xmlArr.length; i++) {   // Look for closers and match
        if (xmlArr[i].startsWith('</')) {
            let posClose = xmlArr[i].indexOf('>') ;
            let srchStr = '<' + xmlArr[i].substring(2, posClose+1) ;
            console.debug('i: %d  pos: %d  Str: %s', i, posClose, srchStr) ;
            for (let j = i-1; j >= 0; j--) {    // Go back to find open tag
                if (xmlArr[j].startsWith(srchStr)) {
                    closeTags(xmlArr, i, j, srchStr) ;
                    return true ; 
                }
            }
            console.warn('Got close for %s but did not find open', srchStr) ;
            xmlArr[i] = '  ' + xmlArr[i] ;      // Indent so not picked up again
        }
    }
    return false ;      // No closing tags found
}

function tagSplit(brokenXML) {
    brokenXML = brokenXML.replaceAll('\n', '') ;
    let tagCatcher = /(<.[^(><)]+>[^<]*)/g ;
    let outTokens = brokenXML.match(tagCatcher) ;
    return outTokens ;
}

const fileSelector = document.getElementById('FileSelector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    document.getElementById("dater").innerText = 
        new Date().toLocaleDateString().replaceAll("/", ".") ;
    const file = fileList[0] ;
//      for (const file of fileList) {
    const name = file.name ? file.name : 'Not supported' ;
    const reader = new FileReader() ;
    const demoEl = document.getElementById("demo") ;
    reader.addEventListener('load', () => {
        demoEl.innerText = reader.result ;
        xmlTokens = tagSplit(reader.result) ;
        console.debug(xmlTokens) ;
        let tags2Go = true ;
        while (tags2Go) {       // While we have more tags to close
            tags2Go = findClosers(xmlTokens)
        }
        cleanFinal(xmlTokens) ;
        console.debug(xmlTokens) ;
        let finalStr = xmlTokens.join(' ') ;    // hereiam .. add in & escaping
        const fileName = "/tmp/jsOutV1.text" ;
        const blob = new Blob([finalStr], {type:'text/xml'}) ;
        const link = document.createElement("a") ;
        link.download = fileName ;
        link.innerHTML = "XML Out File" ;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link) ;
    }, false);
    reader.readAsText(file) ;
    console.debug(fileList);
});