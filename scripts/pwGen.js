const bibleBookArr = [
        "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy",
        "Joshua", "Judges", "Ruth", "Samuel1", "Samuel2",
        "Kings1", "Kings2", "Chronicles1", "Chronicles2",
        "Ezra", "Nehemiah", "Esther", "Job", "Psalms",
        "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah",
        "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
        "Hosea", "Joel", "Amos", "Obadiah", "Jonah",
        "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai",
        "Zechariah", "Malachi", "Matthew", "Mark", "Luke",
        "John", "Acts", "Romans", "Corinthians1", "Corinthians2",
        "Galatians", "Ephesians", "Philippians", "Colossians",
        "Thessalonians1", "Thessalonians2", "Timothy1",
        "Timothy2", "Titus", "Philemon", "Hebrews",
        "James", "Peter1", "Peter2", "John1", "John2",
        "John3", "Jude", "Revelation"] ;
const datePerms = ['1790920', '1810827', '1850802', '1861203', '1960110', '2120101',
        '2130823', '2170216', '2200604', '2250525' ];
const dateNames = ['Erik', 'Mira', 'Ryan', 'Carla', 'Cheyenne', 'Jason',
        'Sparrow', 'Sequoia', 'Nekoda', 'Elias' ];
const dogList = ['Kira', 'Elvis', 'Bear', 'Jasmine', 'Danny', 'Diesel', 'Leo', 'Bowie', 'Kelly']

function loadHtml() {

    const bookSel = document.getElementById("bookList") ;
    const dateSel = document.getElementById("dateSel") ;
    const dogSel = document.getElementById("dogSel") ;

    let bookSelHtml = 'Bible Book:  <select required id="bBook" name="bBook">' ;
    bibleBookArr.forEach(book => {
        bookSelHtml += `<option value="${book}">${book}</option>` ;
    });
    bookSelHtml += '</select>' ;
    bookSel.innerHTML = bookSelHtml ;

    let dateSelHtml = 'PersonDt: <select required id="dDate" name="dDate">' ;
    for (let i = 0; i < datePerms.length; i++) {
        dateSelHtml += `<option value="${datePerms[i]}">${dateNames[i]}</option>` ;
    }
    dateSelHtml += '</select>' ;
    dateSel.innerHTML = dateSelHtml ;

    let dogSelHtml = 'DogName: <select required id="dDog" name="dDog">' ;
    dogList.forEach(dog => {
        dogSelHtml += `<option value="${dog[0]}">${dog}</option>` ;
    });
    dogSelHtml += '</select>' ;
    dogSel.innerHTML = dogSelHtml ;
}

function genIt() {
    const bookSel = document.getElementById("bBook") ;
    const dateSel = document.getElementById("dDate") ;
    const dogSel = document.getElementById("dDog") ;

    let incr = parseInt(document.getElementById("incrVal").value) ;
    const totalLen = parseInt(document.getElementById("totalLen").value) ;
    const bookDir = document.getElementById("bookDir").checked ;
    console.log(`Incr: ${incr} TotalLen: ${totalLen} BookDir: ${bookDir}`) ;

    const startBook = bookSel.value ;
    const dateVal = dateSel.value ;
    const dogVal = dogSel.value ;
    console.log(`StartBook: ${startBook} DateVal: ${dateVal} DogVal: ${dogVal}`) ;

    if (!bookDir)  incr *= -1 ;
    let bookIdx = bibleBookArr.indexOf(startBook) ;
    let bookStr = '' ;
    const bookCount = bibleBookArr.length ;
    for (let i = bookIdx, curLen = 0; curLen < totalLen; i += incr, curLen++) {
        if (i < 0)  i += bookCount ;
        else if (i >= bookCount)  i -= bookCount ;
        bookStr += bibleBookArr[i][0] ;
    }
    bookStr += '@' + dateVal + '@' + dogVal ;
    console.log(`BookStr: ${bookStr}`) ;
}

