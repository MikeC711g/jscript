mthMax = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

function makeCal() {
    const calLoc = document.getElementById('calendar');
    const mthVal = parseInt(document.getElementById("dateMth").value) - 1 ;
    const yearVal = parseInt(document.getElementById("dateYear").value) ;
    const showJulian = document.getElementById("showJulian").checked ;
    if (mthVal === 1 && ((yearVal % 4 === 0 && yearVal % 100 !== 0) || (yearVal % 400 === 0))) {
        mthMax[mthVal] = 29 ;
    }
    const mthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] ;
    const mthDays = mthMax[mthVal] ;
    let curDate = new Date(yearVal, mthVal, 1) ;
    let jan1Date = new Date(yearVal, 0, 1) ;
    Date.prototype.getJulian = function() {
        return (this / 86400000) - (this.getTimezoneOffset() / 1440) + 2440587.5;
    }
    // let julianDay = Math.floor((curDate - new Date(yearVal, 0, 1)) / (1000 * 60 * 60 * 24)) ;
    // let julianDay = (curDate.getMilliseconds / 86400000) - (curDate.getTimezoneOffset() / 1440) + 2440587.5;
    let julianDay = Math.floor(curDate.getJulian()) - Math.floor(jan1Date.getJulian()) ;
    console.log("Julian Day: " + julianDay) ;
    let curDay = curDate.getDay() ;  // day of week (0-6) for 1st day of month
    let curCal = `<table class="calTable" border="1"><tr><th colspan="7">${mthName[mthVal]} ${yearVal}</th></tr>` ;
    curCal += `<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>` ;
    curCal += `<tr>` ;
    for (let i = 0; i < curDay; i++) {
        curCal += `<td class="calEmpty"></td>` ;
    }
    for (let i = 1; i <= mthDays; i++) {
        curCal += (showJulian) ? `<td class="calDay">${i} <br> ${julianDay + i}</td>` : `<td class="calDay">${i}</td>` ;
        if ((curDay + i) % 7 === 0) {
            curCal += `</tr><tr>` ;
        }
    }
    curCal += `</tr></table>` ;
    calLoc.innerHTML = curCal ;
}
