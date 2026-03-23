const thisInit = 27 ;
const balAdjs = [{acct: '1001', adj: 25},
                {acct: '1002', adj: -10},
                {acct: '1010', adj: 15},
                {acct: '1009', adj: -5},
                {acct: '1005', adj: 30},
                {acct: '1006', adj: -20},
                {acct: '1003', adj: 10},
                {acct: '1004', adj: -15},
                {acct: '1009', adj: 5},
                {acct: '1010', adj: -25}
            ]

function reduceEm() {   // Won't use reduce where I'm building structure
    const totAdj = balAdjs.reduce( (acc, cur) => acc + cur.adj , thisInit) ;
    console.log('Total Adjusted Balance: %d', totAdj) ;
    const outEle = document.getElementById("putStuffHere") ;
    const sortBal = balAdjs.sort( (a,b) => b.acct.localeCompare(a.acct) ) ;
    document.getElementById("putStuffHere").innerHTML = 'Total Adjusted Balance: ' + totAdj +
     '<br><br>Sorted Adjustments:<br>' + sortBal.map( a => a.acct + ': ' + a.adj ).join('<br>');
}
