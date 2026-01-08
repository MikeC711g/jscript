fileInfo = [{'name': 'Transaction', 'idFlds': ['TranType'], 'DateFlds': ['TranDate']},
            {'name': 'Project', 'idFlds': ['Description', 'House'], 'DateFlds': ['StartDt', 'EndDt']},
            {'name': 'Reconciliation', 'idFlds': ['BeginBal'], 'DateFlds': ['StartDt', 'EndDt']}]

function startEventListener() {
    const fileSelector = document.getElementById("FileSelector");
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        const file = fileList[0] ;
        const name = file.name ? file.name : 'Not supported' ;
        const reader = new FileReader() ;
        reader.addEventListener('load', () => {
            const jsonData = JSON.parse(reader.result)
            // console.log('Json data read from file:', jsonData) ;
            procJson(jsonData) ;
        }, false)
        reader.readAsText(file) ;
    })
}

function procJson(jsonData) {
    if (!jsonData || !Array.isArray(jsonData)) {
        console.error('Invalid JSON data format. Expected an array.') ;
        return ;
    }
    const el0 = jsonData[0] ;
    let fInfo = {} ;
    for (const info of fileInfo) {
        const allIdFldsPresent = info.idFlds.every(field => Object.hasOwn(el0, field)) ;
        if (allIdFldsPresent) {  fInfo = info ;  break ;  }
    }
    if (Object.keys(fInfo).length === 0) {
        console.error('No matching file info found for the given JSON data.') ;
        return ;
    }
    console.log('Identified file type:', fInfo.name) ;
        // First date drives logic, so sort by first date field
    sortArr = jsonData.sort((a, b) => {a[fInfo.DateFlds[0]].localeCompare(b[fInfo.DateFlds[0]])}) ;
    for (const srtV of sortArr) {     console.log('Sorted value: ', srtV[fInfo.DateFlds[0]]) ;  }
    const maxDate = sortArr[sortArr.length - 1][fInfo.DateFlds[0]] ;
    const curDays = Math.ceil((new Date().getTime()) / (1000 * 3600 * 24)) ;
    const maxDays = Math.ceil((new Date(maxDate).getTime()) / (1000 * 3600 * 24)) ;
    const dayDiff = curDays - maxDays ;
    for (const cRow of sortArr) {
        for (const dFld of fInfo.DateFlds) {
            if (Object.hasOwn(cRow, dFld)) {
                const cDate = cRow[dFld] ;
                const cDays = Math.ceil((new Date(cDate).getTime()) / (1000 * 3600 * 24)) ;
                let newDays = cDays + dayDiff ;
                    // Adjust by half the distance to current date
                newDays += Math.floor((curDays - newDays) / 2) ;
                const newDate = new Date(newDays * (1000 * 3600 * 24)) ;
                const newDateStr = newDate.toISOString().split('T')[0] ;
                cRow[dFld] = newDateStr ;
            }
        }
    }
    console.log('--------------------') ;
    for (const srtV of sortArr) {     console.log('Adjusted value: ', srtV[fInfo.DateFlds[0]]) ;  }
    prepFile(sortArr, fInfo.name) ;
}

function prepFile(jsonArr, outName) {
    const encodedUri = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonArr)) ;
    writeFile(encodedUri, outName + 'Adjussted.json') ;
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

startEventListener() ;
