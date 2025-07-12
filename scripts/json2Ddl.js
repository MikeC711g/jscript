function clearQuotes(dRow) {
    for (const cProp in dRow) {
        if (typeof dRow[cProp] === 'string')  dRow[cProp] = dRow[cProp].replace(/'/g, '')
    }
}

function cvt2Ddl(tblNm, jsonData, columns, rowsPerInsert) {
    console.log('cvt2Ddl tblNm: %s Cnt: %d', tblNm, rowsPerInsert)
    const colNms = columns.map(col => col.name) ;
    const isrtTxt = 'insert into ' + tblNm + ' (' + colNms.join(', ') + ') values\r\n' ;
    console.log('isrtTxt: %s', isrtTxt)

    let fullData = '' ; let cma = '' ; let semic = ''
    for (let i = 0; i < jsonData.length; i++) {
        if (i % rowsPerInsert === 0) {    // Time to start a new SQL statement
            if (i > 0) fullData += ' ;\r\n' ;
            fullData += isrtTxt
            cma = '' ;  semic = ';'
        }
        fullData += cma + "(" ;
        for (let colInfo of columns) {
            let quot = (colInfo.type === 'TEXT' || colInfo.type === 'DATE') ? "'" : '' ;
            let colVal = jsonData[i][colInfo.name] ;
            if (colVal === undefined) {
                colVal = 'NULL' ;   quot = '' ;
            }
            if (quot) {
                if (colVal.includes("'")) colVal = colVal.replace(/'/g, "''") ;  // Escape single quote
                if (colVal.includes('"')) colVal = colVal.replace(/"/g, '""') ;  // Escape double quote}
            }
            fullData += quot + colVal + quot + ', '
        }
        fullData = fullData.slice(0, -2) ;  // Remove last comma and space
        fullData += ')' ; cma = ',\r\n' ;
    }
    fullData = fullData.replace(/#/g, 'lb;')
    fullData = fullData.replace(/&/g, 'amp;')
    const encodedUri = encodeURI("data:text/plain;charset=utf-8," + fullData + ' ;') ;
    writeFile(encodedUri, tblNm+'.ddl')
}

function cre8Tbl(tblNm, jsonData) {
    console.log('Creating table for: %s', tblNm);
    let columns = [{}] ;
    if (jsonData.length > 0) {
        const colNms  = Object.keys(jsonData[0]);
        console.log('Columns for table %s: %O', tblNm, colNms);
        const colVals = Object.values(jsonData[0]);
        for (let i = 0; i < colNms.length; i++) {       // Get types for each column
            columns[i] = { name: colNms[i], type: getColType(colVals[i]), isNullable: false };
        }
        getIsNullable(columns, jsonData) ;
    } else {
        console.warn('No data to create table for %s', tblNm);
    }
    let cre8TblStr = 'create table ' + tblNm + ' ( \r\n';
    for (let i = 0; i < columns.length; i++) {
        const colType = (columns[i].type === 'DATE') ? 'INT' : columns[i].type ;
        cre8TblStr += `  ${columns[i].name} ${colType}` ;
        cre8TblStr += (columns[i].isNullable) ? '' : ' NOT NULL' ;
        cre8TblStr += (i < columns.length - 1) ? ', \r\n' : ' ) ;\r\n' ;
    }
    const encodedUri = encodeURI("data:text/plain;charset=utf-8," + cre8TblStr ) ;
    writeFile(encodedUri, tblNm+'.tblCre8')
    return columns ;
}

function getColType(colVal) {
    const dfmtPattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (typeof colVal === 'string')
        return (colVal.match(dfmtPattern)) ? 'DATE' : 'TEXT';
    return (typeof colVal === 'number') ? 'REAL' : 'TEXT';
}

function getIsNullable(columns, jsonData) {
    for (let i = 1; i < jsonData.length; i++) {
        const rowCols = Object.keys(jsonData[i]);
        for (let j = 0; j < columns.length; j++) {
            if (jsonData[i][columns[j].name] === undefined) {
                columns[j].isNullable = true;
            }
        }
        for (let j = 0; j < rowCols.length; j++) {
            const colIndex = columns.findIndex(col => col.name === rowCols[j]);
            if (colIndex === -1) {      // This row has col we have not seen
                columns.push({ name: rowCols[j], type: getColType(jsonData[i][rowCols[j]]), isNullable: true })
            }
        }
    }
    console.log('columns post: %O', columns)
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

function startEventListener() {
    const fileSelector = document.getElementById("FileSelector");
    fileSelector.addEventListener('change', (event) => {
        const tblNm = document.getElementById("tableNm").value ;
        const rowsPerInsert = parseInt(document.getElementById("rowsPerDdl").value) ;
        console.log('startEvtList: tbl: %s  Cnt: %d', tblNm, rowsPerInsert)
        const fileList = event.target.files;
        const file = fileList[0] ;
        const name = file.name ? file.name : 'Not supported' ;
        const reader = new FileReader() ;
        reader.addEventListener('load', () => {
            const jsonData = JSON.parse(reader.result)
            console.log('Have fileNm: %s  tblNm: %s  RowsPerIsrt: %d  RowsInJSON: %d',
                name, tblNm, rowsPerInsert, jsonData.length)
            const columns = cre8Tbl(tblNm, jsonData)
            if (columns.length === 0) {
                console.warn('No data to create table for %s', tblNm);
                return ;
            }
            cvt2Ddl(tblNm, jsonData, columns, rowsPerInsert) ;
        }, false)
        reader.readAsText(file) ;
    })
}

startEventListener() ;
