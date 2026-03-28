const taxCatList = ['BE', 'BI', 'CE' ] ;
const houseList = ['107EI', '133RD', '187NP', '189NP', '251PB', '259PB', '29EG',
    '33PP', '395WW', '483ES', '495ES', '502S13', '502WD', '632CB', '805PB', '8416SC' ]
const catMap = new Map([
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
const tabMap = new Map([
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
const startDt = '2025-03-01' ; const endDt = '2026-02-28' ;  
const incomeFolder = 'Income' ;

const { jsPDF } = window.jspdf;

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
    const divLine = '--------------------------------------------------------------------' +
      '-------------------------'
    let pdfPart = '' ;  let pdfStr = '' ;  let  xCoord = 10 ; let yCoord = 10 ;
    let expenseTot = 0 ;  let incomeTot = 0 ;  let folderTot = 0 ;
    const doc = new jsPDF();
    const pgLen = doc.internal.pageSize.height - 10 ;
    const xCenter = doc.internal.pageSize.width / 2 ;
    yCoord = pdfHeader(doc, yCoord, xCenter) ;
    let incCats = tabMap.get(incomeFolder) ;    // PnL report has order requirements
    [folderTot, pdfPart, xCoord, yCoord] = processFolder(jsonArr, incomeFolder, incCats, doc, xCoord, yCoord, pgLen) ;
    pdfStr += pdfPart ;
    incomeTot += folderTot ;    
    yCoord += 2
    doc.setFontSize(14).text('Total Income', xCoord, yCoord).
      text(formatNum(incomeTot), xCoord+128, yCoord, {align: 'right'})
    doc.text(divLine, xCenter, yCoord+6, {align: 'center'}) ;
    doc.text('Expense', xCoord, yCoord+10) ;  yCoord += 20 ;
 
    for (let foldEnt of tabMap.entries()) {   // For each folder in structure, add folder row to appropriate string and add blank row for category rows
        const foldName = foldEnt[0] ;       const catArr = foldEnt[1] ;
        if (foldName === incomeFolder)  continue ;      // This handled already, just expenses now
        [folderTot, pdfPart, xCoord, yCoord] = processFolder(jsonArr, foldName, catArr, doc, xCoord, yCoord, pgLen) ;
        pdfStr += pdfPart ;
        expenseTot += folderTot ;
    }
    pdfTrailer(doc, xCoord, yCoord, expenseTot, incomeTot, divLine, xCenter, pgLen) ;
    console.log('pdfStr: %s', pdfStr) ;
    doc.save('xPnL.pdf')
}

function processFolder(jsonArr, foldName, catArr, doc, xCoord, yCoord, pgLen) {
    const newCat1 = ', , , , , , \n , , , ,' ; const newCat2 = ' , , \n' ;
    const newHouseStr = ', , , , , , \n';
    let headerStr = 'House,TranDate,Amount,SubTotal,Category,TranExtra,Annotation\n' ;   // For categories not in structure
    let timeDelay = 1 ;
    const foldArr = jsonArr.filter(row => catArr.includes(row.Category)) ;
    console.log('foldName: %s  catArr: %o  foldArr len: %d', foldName, catArr, foldArr.length) ;
    let foldTot = 0 ; let pdfStr = '' ;
    if (foldArr.length === 0)  return [foldTot, xCoord, yCoord] ;       // No transactions for this folder, so skip it
    if (yCoord > pgLen - (7 * catArr.length + 20))  yCoord = pdfAddPg(doc) ; // Move to new page for PDF
    [pdfStr, foldTot, xCoord, yCoord] = processPdfString(foldArr, foldName, catArr, doc, xCoord, yCoord) ;
    let curCat = '' ;    let curHouse = '' ;  let csvStr = headerStr
    foldArr.forEach(row => {
        if (row.Category !== curCat) {
            if (curCat !== '')  csvStr += newCat1 + row.Category + newCat2 ;
            curCat = row.Category ;     curHouse = row.House ;
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
    return [foldTot, pdfStr, xCoord, yCoord]
}

function pdfHeader(doc, yCoord, xCenter) {
    yCoord = 10 ;  let xCoord = 10 ;
    doc.setFont('Helvetica', 'bold').setFontSize(18).
      text("Profit & Loss", xCenter, yCoord, {align: 'center'}) ;
    yCoord += 7 ;
    const dtStr = `Start Date: ${this.startDt}   End Date: ${this.endDt}` ;
    doc.setFontSize(10).text(dtStr, xCenter, yCoord, {align: 'center'}) ;  yCoord += 8
    doc.text("Houses:" + houseList.join(' '), xCenter, yCoord, {align: 'center'}) ;  yCoord += 8
    doc.setFontSize(14).text('Income', xCoord, yCoord) ;  yCoord += 10 ;
    return yCoord
}

function pdfTrailer(doc, xCoord, yCoord, expenseTot, incomeTot, divLine, xCenter, pgLen) {
    yCoord += 2
    doc.setFontSize(14).text('Total Expense', xCoord, yCoord).
      text(formatNum(expenseTot), xCoord+128, yCoord, {align: 'right'})
    doc.text(divLine, xCenter, yCoord+6, {align: 'center'}) ;  yCoord += 14

    if (yCoord > pgLen - 40) yCoord = this.pdfAddPg(doc, yCoord) ;
    const netInc = incomeTot - expenseTot ;
    doc.text('Net Income', xCoord, yCoord).
      text(formatNum(netInc), xCoord+128, yCoord, {align: 'right'})
    doc.text('Net Income Summary', xCoord, yCoord+10) ;  yCoord += 16
    doc.setFontSize(12).setFont('Helvetica', 'normal').text('Income', xCoord+8, yCoord).
      text(formatNum(incomeTot), xCoord+128, yCoord, {align: 'right'}); yCoord += 6 ;
    doc.text('Expense', xCoord+8, yCoord).
      text('-' + formatNum(expenseTot), xCoord+128, yCoord, {align: 'right'}) ; yCoord += 4 ;
    doc.text('---------------', xCoord+128, yCoord, {align: 'right'}) ; yCoord += 4 ;
    doc.setFontSize(14).setFont('Helvetica', 'bold').text('Net Income', xCoord+4, yCoord).
      text(formatNum(netInc), xCoord+128, yCoord, {align: 'right'});
 
}

function pdfAddPg(doc) {
    doc.addPage() ;
    return 10 ;
}

function formatNum(num) {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) ;
}

function processPdfString(tranArr, header, catArray, doc, xCoord, yCoord) {
    let foldTot = 0 ;
    doc.setFontSize(12).text(header, xCoord+4, yCoord) ;   yCoord += 10 ;
    doc.setFontSize(10).setFont('Helvetica', 'normal')
    let outStr = `Info for folder: ${header}\n\n` ;
    catArray.forEach(cat => {
        const catArr = tranArr.filter(row => row.Category === cat) ;
        if (catArr.length > 0) {
            let totCat = catArr.reduce((tot, row) => tot + row.Amount, 0) ;
            if (totCat < 0)  totCat = -totCat ;
            doc.text(cat, xCoord+10, yCoord).text(formatNum(totCat), xCoord+128, yCoord, {align: 'right'})
            yCoord += 7 ;
            foldTot += totCat ;
            outStr += `Category: ${cat}  Total: ${formatNum(totCat)}\n` ;
        }
    }) ;
    doc.text('---------------', xCoord+128, yCoord, {align: 'right'}) ; yCoord += 5 ;
    doc.setFont('Helvetica', 'bold').setFontSize(12).text('Total '+header, xCoord+10, yCoord).
        text(formatNum(foldTot), xCoord+128, yCoord, {align: 'right'}) ;
    yCoord += 10
    return [outStr, foldTot, xCoord, yCoord] ;
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
