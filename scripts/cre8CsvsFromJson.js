taxCatList = ['BE', 'BI', 'CE' ] ;
houseList = ['107EI', '133RD', '187NP', '189NP', '251PB', '259PB', '29EG',
    '33PP', '395WW', '483ES', '495ES', '502S13', '502WD', '632CB', '805PB', '8416SC' ]

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
    const filtTrans = jsonData.
        filter(tran => taxCatList.includes(tran.TaxCat) && houseList.includes(tran.House)).
        map((({ House, TranDate, Amount, Category, TranExtra, Annotation }) => 
            ({ House, TranDate, Amount, Category, TranExtra, Annotation }))).
        sort((a, b) => {
            let cmp0 = a.Category.localeCompare(b.Category) ;
            if (cmp0 !== 0)  return cmp0 ; 
            else {
                cmp0 = a.House.localeCompare(b.House) ;
                if (cmp0 !== 0)  return cmp0 ; 
                else return a.TranDate.localeCompare(b.TranDate) ;
            }
        }) ;
    prepFile(filtTrans, "cre.csv") ;
}

function arr2csv(jsonArr) {
    let csv = 'House,TranDate,Amount,SubTotal,Category,TranExtra,Annotation\n' ;
    let curCat = jsonArr[0].Category ;    let curHouse = jsonArr[0].House ;
    jsonArr.forEach(row => {
        if (row.Category !== curCat) {
            csv += writeBlnkCsvRow() ;    csv += writeBlnkCsvRow() ;
            curCat = row.Category ;
        } else if (row.House !== curHouse) {
            csv += writeBlnkCsvRow() ;
            curHouse = row.House ;
        }
        if (row.TranExtra.includes(','))  row.TranExtra = `"${row.TranExtra}"` ;
        if (row.Annotation.includes(','))  row.Annotation = `"${row.Annotation}"` ;
        csv += `${row.House},${row.TranDate},${row.Amount}, ,${row.Category},${row.TranExtra},${row.Annotation}\n` ;
    })
    return csv ;
}

function writeBlnkCsvRow() {
    return ', , , , , , \n' ;
}

function prepFile(jsonArr, outName) {
    const csv = arr2csv(jsonArr) ;
    const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv) ;
    writeFile(encodedUri, outName) ;
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
