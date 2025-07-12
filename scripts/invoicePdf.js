/****************************************************************************************** 
 * Create an Invoice for Herman/Ryan if they are interested
 * Add in boolean question about signature line, add in signature line
******************************************************************************************/

tblNm = "expTable" ;

/**
 * Extract info from cust specific script and display in html
 */
function loadInfo() {
    const curCfg = getCfg() ;     // getCfg in invoiceData.js unique to customer
    const infoTarg = document.getElementById('coInfo'); // Target for company info
    infoTarg.innerHTML = `Invoice from: ${curCfg.idKey}<br>Address: ${curCfg.adStreet}` ;
}

/**
 * Read through fixed labels for customer and load into table. Also allow many 
 * customized entries where they can type in specific work types
 */
function showOptions() {
    const curCfg = getCfg() ;

    const blkRows = 7 ;    // Number of blank rows to allow for custom entries
        // Build html table for input of invoice bullet items
    const tbl = document.createElement("table") ; tbl.setAttribute("id", this.tblNm)
    curCfg.optList.forEach(opt => {     // For all fixed labels, list and do amt prompt
        const row = document.createElement('tr') ;  tbl.appendChild(row) ;
        const expType = document.createElement('td') ;  expType.textContent = opt ;
        row.appendChild(expType) ;
        const expAmtCol = document.createElement('td') ;  row.appendChild(expAmtCol) ;
        const expAmt = document.createElement('input') ; expAmt.setAttribute("type", "number") ;
        expAmtCol.appendChild(expAmt)
    })
    for (let i = 0; i < blkRows; i++) { // For custom entries, allow label and amt input
        const row = document.createElement('tr') ;  tbl.appendChild(row) ;
        const expTypeCol = document.createElement('td') ; row.appendChild(expTypeCol) ;
        const expType = document.createElement('input') ;  expTypeCol.setAttribute("type", "text")
        expTypeCol.appendChild(expType) ;
        const expAmtCol = document.createElement('td') ;  row.appendChild(expAmtCol) ;
        const expAmt = document.createElement('input') ; expAmt.setAttribute("type", "number") ;
        expAmtCol.appendChild(expAmt)
    }
    document.body.appendChild(tbl) ;    // Put table into body of html doc
    const button = document.createElement("button");  button.innerHTML = "Create invoice"
    button.addEventListener("click", function() { readTable() }) ;
    document.body.appendChild(button) ;
}

/** 
 * Extract labels and info from table and create data structure
*/
function readTable() {
    const table = document.getElementById(this.tblNm);
    rows = table.rows;
    let catAmt = [] ;
    for (let curRow of rows) { // For each table row, extract category and amount
        const tds = curRow.querySelectorAll("td") ;
        let category = tds[0].textContent ;
        if (!category) {        // Could be input fields now
            let textInputs = tds[0].querySelectorAll("input") ;
            if (textInputs.length > 0) category = textInputs[0].value ;
        }
        if (category) {     // Category not blank (and truthy)
            const amtVals = tds[1].querySelectorAll("input") ;
            const amtVal = amtVals[0].value ;
            if (amtVal) catAmt.push({category: category, amount: amtVal})
        }
    }
    if (catAmt.length > 0)  createInvoice(catAmt) ; // Pass struc to pdf creator
}

/**
 * Take data structure of categories and amounts and write out PDF invoice
 */
function createInvoice(catAmt) {        // Layer to async wait for image load
    const curCfg = getCfg() ;

    const jobNm = document.getElementById('jobName');
    let doc = new jsPDF('p', 'pt', 'letter');
    console.log('Into createInvoice w/catAmtArr: ', catAmt);
    const xCenter = doc.internal.pageSize.width / 2 ;
    const xPageLen = doc.internal.pageSize.height ;
    console.log('xPageLen: ', xPageLen, ' xCenter: ', xCenter) ;
    const yStart = 20, xColAmt = xCenter*1.5 ;
    const rectVert = 15, rectHCat = xCenter*1.25, rectHAmt = xCenter*0.35 ;
    let yCoord = yStart ; let xCoord = 10 ; let invoiceTot = 0 ;
    doc.setTextColor(0, 0, 255).setFont('Helvetica', 'bold').setFontSize(18).
        text(curCfg.idKey, xCenter, 20, 'center') ;    yCoord += 16 ;
    doc.setTextColor(0, 0, 0).setFontSize(12).setFont('Helvetica', 'normal') ;
    if (curCfg.adStreet)
        doc.text(curCfg.adStreet, xCenter, yCoord, 'center') ;  yCoord += 13 ;
    if (curCfg.adCity)
        doc.text(curCfg.adCity, xCenter, yCoord, 'center') ;  yCoord += 13 ;
    if (curCfg.adPhone)
        doc.text(curCfg.adPhone, xCenter, yCoord, 'center') ;  yCoord += 13 ;
    if (curCfg.adEmail)
        doc.text(curCfg.adEmail, xCenter, yCoord, 'center') ;  yCoord += 19 ;
    const dtStr = new Date().toLocaleDateString() ;
    doc.setTextColor(0, 0, 255).text('Invoice date: '+dtStr, xCenter, yCoord, 'center') ;
    yCoord += 18 ;
    doc.setFontSize(14).setFont('Helvetica', 'bold').
        text('Invoice for:', xCoord, yCoord) ;  yCoord += 15 ;
    doc.setTextColor(0, 0, 0).setFontSize(12).setFont('Helvetica', 'normal').
        text(jobNm.value, xCoord, yCoord) ;  yCoord += 20 ;
    doc.setFont('Helvetica', 'bold').
        rect(xCoord, yCoord-rectVert, rectHCat, rectVert+7).  // Larger adjust for header
        rect(xCoord+rectHCat, yCoord-rectVert, rectHAmt, rectVert+7) ;
    doc.setFontSize(14).text('Category', xCoord, yCoord).text('Amount', xCoord+xColAmt,
        yCoord, 'right') ;  yCoord += 20 ;
    doc.setFontSize(12).setFont('Helvetica', 'normal') ;
    for (let invExp of catAmt) {
        doc.rect(xCoord, yCoord-rectVert+2, rectHCat, rectVert+1).
            rect(xCoord+rectHCat, yCoord-rectVert+2, rectHAmt, rectVert+1) ;
        doc.text(invExp.category, xCoord, yCoord).text(invExp.amount, xCoord+xColAmt, yCoord, 'right')
        yCoord = pdfAddPg(doc, yCoord+15, xPageLen)
        invoiceTot += +invExp.amount ;
        console.log(`cat ${invExp.category} Amt ${invExp.amount} tot ${invoiceTot}  ycoord ${yCoord}`) ;
    }
    yCoord += 14 ;
    console.log('Final invoice Tot: ', invoiceTot) ;
    doc.setFont('Helvetica', 'bold').
        rect(xCoord, yCoord-rectVert-10, rectHCat, rectVert+14).  // Larger adjust for totals
        rect(xCoord+rectHCat, yCoord-rectVert-10, rectHAmt, rectVert+14) ;
    doc.setFontSize(14).setTextColor(0, 0, 255).text('Total', xCoord, yCoord).
        text(invoiceTot.toString(), xCoord+xColAmt, yCoord,'right')
    doc.save('Invoice.pdf') ;
}

function pdfAddPg(doc, yCoord, pageLen) {
    if (yCoord < (pageLen - 60))  return yCoord ;
    doc.addPage() ;   return 10 ;
  }