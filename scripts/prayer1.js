const adorationArr = [
        "adoration 1",      "adoration 2",       "adoration 3",       "adoration 4",
        "adoration 5",      "adoration 6",       "adoration 7",       "adoration 8",
        "adoration 9",      "adoration 10",      "adoration 11"]
const confessionArr = ['confess1', 'confess2', 'confess3', 'confess4', 'confess5', 'confess6',
        'confess7', 'confess8', 'confess9', 'confess10' ];
const thanksArr = ['thanks1', 'thanks2', 'thanks3', 'thanks4', 'thanks5', 'thanks6',
        'thanks7', 'thanks8', 'thanks9' ];
const supplicationArr = ['supplication1', 'supplication2', 'supplication3', 'supplication4', 
        'supplication5', 'supplication6', 'supplication7', 'supplication8' ]

function refreshIt() {

    const adoration = document.getElementById("adoration") ;
    const confession = document.getElementById("confession") ;
    const thanks = document.getElementById("thanksgiving") ;
    const supplication = document.getElementById("suppication") ;

    const max4Each = 3 ;   
    adoration.innerHTML = genIt(adorationArr, max4Each) ;
    confession.innerHTML = genIt(confessionArr, max4Each) ;
    thanks.innerHTML = genIt(thanksArr, max4Each) ;
    supplication.innerHTML = genIt(supplicationArr, max4Each) ;
}

function genIt(inArr, inCnt) {
    let outList = '<ol>' ;   const arrLen = inArr.length ;
    for (let i = 0; i < inCnt; i++) {
        let curItem = inArr[Math.floor(Math.random() * arrLen)] ;
        while (outList.includes(curItem)) {
            curItem = inArr[Math.floor(Math.random() * arrLen)] ;
        }
        outList += `<li>${curItem}</li>` ;
    }
    outList += '</ol>' ;
    return outList ;
}

