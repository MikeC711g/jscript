function reportGlobal(jsonData) {
    jsonData.sort((a, b) => a.RKey.localeCompare(b.RKey) )
    let outRpt = ''
    for (const curRow of jsonData) {
        switch (curRow.RKey) {
            case 'accounts':
            case 'taxCats':
            case 'categoryFolders':
            case 'categoryTaxcat':
                outRpt += curRow.RKey + ' K: ' + curRow.RVal.RKey + ' V: ' + curRow.RVal.RVal + '\r\n'
                break
            case 'accountType':
            case 'tranType':
                outRpt += curRow.RKey + ' ' + curRow.RVal + '\r\n' ; break ;
            case 'houses':
                console.log('houseRVal: %O', curRow.RVal)
                outRpt += curRow.RKey + ' ' + curRow.RVal.name + '\r\n' ; break ;
            case 'ruleData':
                console.log('ruleRVal: %O', curRow.RVal)
                outRpt += curRow.RKey + ' SS: ' + curRow.RVal.srchStr + ' SA: ' + curRow.RVal.srchAmt +
                    ' Cat: ' + curRow.RVal.Category + ' acc: ' + curRow.RVal.accounts + ' Hse: ' +
                    curRow.RVal.House + ' TC: ' + curRow.RVal.TaxCat + '\r\n' ; break ;
            default: console.warn('Invalid rkey val of: %s', curRow.RKey)
        }
    }
    console.log(outRpt)
    const encodedUri = encodeURI("data:text/plain;charset=utf-8," + outRpt + ' ;') ;
    writeFile(encodedUri, 'globalReport.text')
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

function startEventListener(docId, tblNm, ddlBreakCnt) {
    console.log('startEvtList: id: %s', docId)
    const fileSelector = document.getElementById(docId);
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        const file = fileList[0] ;
        const reader = new FileReader() ;
        reader.addEventListener('load', () => {
            const jsonData = JSON.parse(reader.result)
            reportGlobal(jsonData)
        }, false)
        reader.readAsText(file) ;
    })
}

startEventListener('GlobalFileSelector') ;