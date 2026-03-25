taxCatList = ['BE', 'BI', 'CE' ] ;
houseList = ['107EI', '133RD', '187NP', '189NP', '251PB', '259PB', '29EG',
    '33PP', '395WW', '483ES', '495ES', '502S13', '502WD', '632CB', '805PB', '8416SC' ]
catMap = new Map([
    ['Administrative Expenses', 'Administrative Expenses'],
    ['Building Supplies', 'Building Supplies'],
    ['Electric', 'Electric'],
    ['Garbage', 'Trash and Recycling'],
    ['Gas & Propane', 'Gas'],
    ['Labor', 'Labor'],
    ['Mortgage Interest', 'Mortgage Interest'],
    ['Pest Control', 'Pest Control'],
    ['Property Insurance', 'Insurance'],
    ['Property Taxes', 'Property Tax'],
    ['Rent Income', 'Rent Income'],
    ['Tools and Supplies', 'Tools and Supplies'],
    ['Water & Sewer', 'Water and Sewer']    
]) ;
tabMap = new Map([
    ['OfficeNBusinessExpenses', ['Administrative Expenses']],
    ['BuildingSupplies', ['Building Supplies']],
    ['Utilities', ['Electric', 'Trash and Recycling', 'Gas', 'Water and Sewer']],
    ['Labor', ['Labor']],
    ['PestControl', ['Pest Control']],
    ['Insurance', ['Insurance']],
    ['PropertyTax', ['Property Tax']],
    ['Income', ['Rent Income']], 
    ['ToolsNSupplies', ['Tools and Supplies']] 
]) ;

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
            ({ House, TranDate, Amount, Category: catMap.get(Category), TranExtra, Annotation }))).
        sort((a, b) => {
            let cmp0 = (!a.Category || a.Category.localeCompare(b.Category)) ;
            if (cmp0 !== 0)  return cmp0 ; 
            else {
                cmp0 = a.House.localeCompare(b.House) ;
                if (cmp0 !== 0)  return cmp0 ; 
                else return a.TranDate.localeCompare(b.TranDate) ;
            }
        }) ;
    arr2csv(filtTrans) ;
}

function arr2csv(jsonArr) {
    let headerStr = 'House,TranDate,Amount,SubTotal,Category,TranExtra,Annotation\n' ;   // For categories not in structure
    const newCat1 = ', , , , , , \n , , , ,' ; const newCat2 = ' , , \n' ;
    const newHouseStr = ', , , , , , \n';
    let timeDelay = 1 ;
    for (let foldEnt of tabMap.entries()) {   // For each folder in structure, add folder row to appropriate string and add blank row for category rows
        const foldName = foldEnt[0] ;
        const catArr = foldEnt[1] ;
        const foldArr = jsonArr.filter(row => catArr.includes(row.Category)) ;
        console.log('foldName: %s  catArr: %o  foldArr len: %d', foldName, catArr, foldArr.length) ;
        if (foldArr.length === 0)  continue ;
        let curCat = '' ;    let curHouse = '' ;  let csvStr = headerStr
        foldArr.forEach(row => {
            if (row.Category !== curCat) {
                if (curCat !== '')  csvStr += newCat1 + row.Category + newCat2 ;
                curCat = row.Category ;
            } else if (row.House !== curHouse) {
                csvStr += newHouseStr ;
                curHouse = row.House ;
            }
            if (row.TranExtra.includes(','))  row.TranExtra = `"${row.TranExtra}"` ;
            if (row.Annotation.includes(','))  row.Annotation = `"${row.Annotation}"` ;
            csvStr += `${row.House},${row.TranDate},${row.Amount}, ,${row.Category},${row.TranExtra},${row.Annotation}\n` ;
        })
        const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvStr) ;
        writeFile(encodedUri, timeDelay++, foldName + '.csv') ;
    }
}

function writeFile(encodedData, timeDelay, fileName) {
    setTimeout(() => {
    console.log('writeFile filenm: %s  len: %d  delay: %d', fileName, encodedData.length, timeDelay)
    const dlAnchor = document.createElement('a')
    dlAnchor.setAttribute("href", encodedData)
    dlAnchor.setAttribute("download", fileName)
    document.body.appendChild(dlAnchor)
    dlAnchor.click()
    dlAnchor.remove()
    }, timeDelay*1000);
}

startEventListener() ;
