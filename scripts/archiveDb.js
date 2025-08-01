function getYear() {  return '2020' }
function getAccounts() { return ['bbt9312', 'bbt9723', 'cfcugg', 'chase', 'sams', 'lowes']}
function loadTaxRpts() {
    const cYear = getYear()
    const taxInfo = [ { rName: "ProjectSummaryByHouseDate", csvName: "ProjectSummaryByHouseDate.csv",
      query: `SELECT a.house, a.startDt, a.description, sum(b.amount)
        FROM projects a, annotatedstmts b
        WHERE a.projectid = b.project and
        a.endDt > '${cYear}-01-01' and startDt < '${cYear}-12-31'
        and trandate between '${cYear}-01-01' and '${cYear}-12-31'
        GROUP BY a.house, a.startDt, a.description ;`
    }, { rName: "RentIncomeByHouse", csvName: "RentIncomeByHouse.csv",
      query: `SELECT house, sum(amount) FROM annotatedstmts
        WHERE amount > 0 and trandate between '${cYear}-01-01' and '${cYear}-12-31' 
        and description = 'Rent Income' and house != '' GROUP BY house ;`
    }, { rName: "RentIncomeDetailsByHouse", csvName: "RentIncomeDetailsByHouse.csv",
      query: `SELECT house, trandate, amount FROM annotatedstmts 
        WHERE amount > 0 and trandate between '${cYear}-01-01' and '${cYear}-12-31' 
        and description = 'Rent Income' and house != '' order by house, trandate ;`
    }, { rName: "CREAdminTools", csvName: "CREAdminTools.csv",
      query: `SELECT description, strftime('%m', trandate), sum(amount) FROM annotatedstmts
        WHERE description in ('CRE Admin', 'CRE Tools n Supplies') and 
        trandate between '${cYear}-01-01' and '${cYear}-12-31' 
        GROUP BY strftime('%m', trandate) ; `
        // … details if needed from: select * from annotatedstmts 
        // where description in ('CRE Admin', 'CRE Tools n Supplies') and 
        // trandate between '2020-01-01' and '2020-12-31' order by trandate ;
    }, { rName: "InsuranceAndPropTx", csvName: "InsuranceAndPropTx.csv",
      query: `SELECT house, description, sum(amount) FROM annotatedstmts 
        WHERE taxcat = 'BE' and description in ('Insurance', 'Property Tax') and 
        trandate between '${cYear}-01-01' and '${cYear}-12-31' GROUP BY house, description ;`
    }, { rName: "MtgAcctPMRestau", csvName: "MtgAcctPMRestau.csv",
      query: `SELECT description, trandate, amount FROM annotatedstmts 
        WHERE trandate between '${cYear}-01-01' and '${cYear}-12-31' and 
        description in ('Mortgage Payment', 'Accountant', 'Property Mgmt', 'Restaurant') 
        and taxcat = 'BE' ORDER BY description, trandate ;`
    }   ]
    return taxInfo ;
}
function loadAccountRpts() {
    const cYear = getYear()
    const acctList = getAccounts()
    let accountInfo = []
    acctList.forEach((acct, i) => {
        accountInfo.push({ rName: acct, csvName: `${acct}.csv`,
        query: `SELECT a.tranDate, a.Account, a.Description, a.TranType, a.Amount, 
        a.TranExtra, a.house, b.description, a.Annotation, a.taxcat 
        FROM annotatedstmts a LEFT JOIN projects b ON a.project = b.projectid 
        where a.account = '${acct}' and a.trandate between '${cYear}-01-01' and '${cYear}-12-31' 
        order by a.trandate ;`})
    })

    return accountInfo ;
}

function runRpts(rptType) {
    let taxInfo = (rptType === 'tax') ? loadTaxRpts() : loadAccountRpts() 
    let tStr = `<h2> Tax list </h2> <table border="1">
        <tr> <th> Name </th> <th> Query </th> </tr>`
    let fStr = '.headers on <br> .mode csv <br>'
    taxInfo.forEach((rpt, i) => {
        tStr += `<tr> <td> ${rpt.rName} </td> <td> ${rpt.query} </td> </tr>`
        fStr += `.output ${rpt.csvName} <br> ${rpt.query} <br>`
    });
    tStr += '</table>'
    console.log(tStr) ;
    document.getElementById("RunRpts").innerHTML = tStr ;
    document.getElementById("SqlFile").innerHTML = fStr ;
}