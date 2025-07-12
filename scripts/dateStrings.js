function makeArr() {
    let numArr = [1, 2, 3]
    console.log('len preTweak: ', numArr.length)
    tweakArr(numArr) ;
    console.log('len postTweak: ', numArr.length)
    document.getElementById("DateCalcs").innerHTML = numArr ;
}
function tweakArr(inArr) {
    inArr.push(4)
    inArr.push(5)
    console.log('tweaked len: ', inArr.length)
}
function dateCalcs() {
    let rentAmt = 1000 ;  let startDt = '2023-06-01' ;   let endDt = '2024-06-30' ;
    let beginBal = 0 ; let lateFee = 50 ;  let rentDue = 2 ;  let lateDue = 7 ;
    let runBal = [] ;   // running balance
    let tranArr = [ 
        {dt: '2023-06-01', tp: 'Rent Income', amt: 1000},
        {dt: '2023-07-01', tp: 'Rent Income', amt: 1000},
        {dt: '2023-08-01', tp: 'Rent Income', amt: 1000},
        {dt: '2023-09-01', tp: 'Rent Income', amt: 1000},
        {dt: '2023-10-01', tp: 'Rent Income', amt: 1000},
        {dt: '2023-11-01', tp: 'Rent Income', amt: 1000},
        {dt: '2023-12-01', tp: 'Rent Income', amt: 1000},
        {dt: '2024-01-01', tp: 'Rent Income', amt: 1000},
        {dt: '2024-02-01', tp: 'Rent Income', amt: 1000},
        {dt: '2024-03-01', tp: 'Rent Income', amt: 1000},
        {dt: '2024-04-01', tp: 'Rent Income', amt: 1000},
        {dt: '2024-05-15', tp: 'Rent Income', amt: 1050},
        {dt: '2024-06-01', tp: 'Rent Income', amt: 1000}
    ]
    console.log('TranArr: ', tranArr)
    addRecs(tranArr, rentDue, rentAmt, 'Rent Due', startDt, endDt) ;
    addRecs(tranArr, lateDue, lateFee, 'Late Fee', startDt, endDt) ;
    tranArr.sort((a, b) => {return a.dt.localeCompare(b.dt)}) ;
    let curBal = beginBal ;
    for (let i = 0; i < tranArr.length; i++) {
        switch (tranArr[i].tp) {
            case 'Late Fee':
                if (curBal <= 0) {  // Late fee not applicable here
                    tranArr[i].amt = 0
                }
                curBal += tranArr[i].amt ; break ;
            case 'Rent Due':
                curBal += tranArr[i].amt ; break ;
            case 'Rent Income':
                curBal -= tranArr[i].amt ; break ;
            default: console.warn('Invalid tranType of %s', tranArr[i].tp)
        }
        runBal.push(curBal) ;
    }
    console.log('TranArr: %O  runBal: %O', tranArr, runBal)
}

function addRecs(tranArr, dayOfMth, amount, tType, startDt, endDt) {
    let rentDt = new Date(startDt) ;  let rentEnd = new Date(endDt)
    let startDay = rentDt.getDate() ;   rentDt.setDate(dayOfMth-1) ;
    if (dayOfMth < startDay)  rentDt.setMonth(rentDt.getMonth() + 1)
    console.log('RentDt: %s  dayOfMth: %d  startDay: %d',
        rentDt.toISOString().slice(0, 10), dayOfMth, startDay)
    while (rentDt < rentEnd) {
        console.log('RentDt: %s  rentEnd: %s  rd < re %s',
            rentDt.toISOString().slice(0, 10), rentEnd.toISOString().slice(0, 10), rentDt < rentEnd)
        tranArr.push({dt: rentDt.toISOString().slice(0, 10), tp: tType, amt: amount}) ;
        rentDt.setMonth(rentDt.getMonth() + 1)
    }
}
