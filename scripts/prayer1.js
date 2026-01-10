const lsNames = { adoration: "prayer1_adoration" , confession: "prayer1_confession" ,
                    thanksgiving: "prayer1_thanksgiving" , supplication: "prayer1_suppication" } ;
const headerNms = { adoration: "Adoration prayers" , confession: "Confession prayers" ,
                    thanksgiving: "Thanksgiving prayers" , suppication: "Supplication prayers" } ;

const adorationDflt = [
 "Isa: 6:3 Holy Holy Holy is the Lord God Almighty",
 "1Sam2: There is none holy like the Lord",
 "Rev 15:4 You alone are Holy",
 "Exo 15:11 Majestic in holiness",
 "Psa 19:1 The heavens declare the glory of God, and the skies proclaim the works of His hands.",
 "Isa 40:12: Who has measured the waters in the hollow of his hand, or with the breadth of his hands, marked out the heavens",
 "Psa 147:4-5: He determines the number of the stars and calls them each by name. Great is our Lord and mighty in power; His understanding has no limit",
 "Deu 10:17: For the Lord your God is God of gods and Lord of lords, the great God Mighty and Awesome who shows no partiality and accepts no bribes." ,
 "Psa 86:13: For great is Your love toward me; You have delivered me from the depths, from the realm of the dead",
 "Psa145:13: Your Kingdom is an everlasting Kingdom, and your dominion endures through all generations. The Lord is trustworthy in all He promises and faithful in all He does.",
 "1Chron 29:11 Yours, Lord, is the greatness and the power and the glory and the majesty and the splendor, for everything in heaven and earth is yours. Yours, Lord, is the kingdom; you are exalted as head over all.",
 "Psa 8:3-4: When I consider your heavens, the work of your fingers, the moon and the stars, which you have set in place, what is mankind that you are mindful of them, human beings that you care for them?",
 "Jer 23:24: Can anyone hide in secret places so that I cannot see them? ... 'Do not I fill heaven and earth?' declares the LORD",
 "Rev 4:11: You are worthy, our Lord and God, to receive glory and honor and power, for you created all things, and by your will they were created and have their being",
 "Psa 145:3: Great is the LORD and most worthy of praise; his greatness no one can fathom",
 "Psa 111:2: Great are the works of the LORD, studied by all who delight in them",
 "Psa 139:14: I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well",
 "Zeph 3:17: The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing"
]
const adorationArr = getLsItem( lsNames.adoration, adorationDflt ) ;
const confessionDflt = [ "sexual immorality", "impurity and debauchery", "idolatry and witchcraft",
 "hatred", "discord", "jealousy", "fits of rage", "selfish ambition",
 "dissensions", "factions and envy", "drunkenness", "orgies", "Greed", "Not loving spouse" 
 ];
const confessionArr = getLsItem( lsNames.confession, confessionDflt ) ;
const thanksDflt = [ "Health", "Prosperity Or Stability Of Provision", "Marriage",
 "Family", "Church", "Persecution (for the right reason)", "Religious freedom"
];
const thanksArr = getLsItem( lsNames.thanksgiving, thanksDflt ) ;   
const supplicationDflt = ["Salvation of Lori and Maureen and their families",
 "Specific for Mandy and her family and for Angelina to become Angelina again",
 "Strength for Joe's kids (salvation if needed)",
 "Salvation and protection for Cheyenne, Jason, Sparrow, Sequoia, Nekoda, Eli",
 "All of the marriages in nuclear and extended family",
 "Driving us to evangelism, discerning people to evangelize, softening hearts to God's Word",
 "Relief for the persecuted church worldwide", "Wisdom for political leaders in the US and worldwide",
 "Revival in our church, community, country, and the world", "Spiritual growth for all believers",
 "Boldness to share the gospel"
 ]
const supplicationArr = getLsItem( lsNames.suppication, supplicationDflt ) ;

function refreshIt() {

    const adoration = document.getElementById("adoration") ;
    const confession = document.getElementById("confession") ;
    const thanks = document.getElementById("thanksgiving") ;
    const supplication = document.getElementById("suppication") ;

    const max4Each = 3 ;   
    adoration.innerHTML = genIt("Adoration prayers", adorationArr, max4Each) ;
    confession.innerHTML = genIt("Confession prayers", confessionArr, max4Each) ;
    thanks.innerHTML = genIt("Thanksgiving prayers", thanksArr, max4Each) ;
    supplication.innerHTML = genIt("Supplication prayers", supplicationArr, max4Each) ;
}

function manageLists() {
    const manageDiv = document.getElementById("manageLists");
    if (manageDiv.classList.contains("section-hidden")) {
        manageDiv.classList.remove("section-hidden");
        manageDiv.classList.add("section-visible");
        const listAnchor = document.getElementById("listAnchor") ;
        let manageDivs = '' ;
        for (const key of Object.keys( lsNames ) ) {
            manageDivs += `<div id="${lsNames[key]}"> ${headerNms[key]} </div>` ;
        }
        listAnchor.innerHTML = manageDivs ;
        renderLists() ;
    } else {
        manageDiv.classList.remove("section-visible");
        manageDiv.classList.add("section-hidden");
    }
}

function renderLists() {
    renderOneList( headerNms.adoration, adorationArr, lsNames.adoration ) ;
    renderOneList( headerNms.confession, confessionArr, lsNames.confession ) ;
    renderOneList( headerNms.thanksgiving, thanksArr, lsNames.thanksgiving ) ;
    renderOneList( headerNms.supplication, supplicationArr, lsNames.supplication ) ;
}

function renderOneList( header, inArr, divId ) {
    const hDiv = document.getElementById( divId ) ;
    if ( !hDiv ) {  console.error("Div not found:", divId ) ; return ; }
    let outList = `<h3>${header}</h3>
        <button type="button" onclick="prepRow('${divId}', '${header}', -1, '')"
        title="Add row to ${header} list"   class="btn btn-primary"
        style="background-color: blue;color: white;">Add new ${header}</button>
        <ol>` ;
        const arrLen = inArr.length ;
    for (let i = 0; i < arrLen; i++) {
        let curItem = inArr[i] ;
        outList += `<li>${curItem} <br>
        <button type="button" onclick="prepRow('${divId}', '${header}', ${i}, '${curItem}')"
        title="Update this item"   class="btn btn-primary"
        style="background-color: green;color: white;">Update</button>
        <button type="button" onclick="deleteItem('${divId}', ${i}, '${header}')"
        title="Delete this item"   class="btn btn-primary"
        style="background-color: red;color: white;">Delete</button>
        </li>` ;
    }
    hDiv.innerHTML = outList + '</ol>' ;
}

function prepRow( listName, header, itemIndex, curItem ) {
    const addUpdateP = document.getElementById("addUpdate") ;
    let action = ( itemIndex < 0 ) ? "addItem" : "updateItem" ;
    addUpdateP.innerHTML = `<h3>${action} to ${header} list</h3>
        <label for="itemInput">${action}: </label>
        <input type="text" id="itemInput" name="itemInput" value="${curItem}">
        <button type="button" onclick="${action}('${listName}', ${itemIndex}, document.getElementById('itemInput').value, '${header}')"
        title="${action} to ${header} list"   class="btn btn-primary"
        style="background-color: green;color: white;">${action}</button>
        <button type="button" onclick="document.getElementById('addUpdate').innerHTML='';"
        title="Cancel"   class="btn btn-primary"
        style="background-color: gray;color: white;">Cancel</button>
    ` ;
}

function addItem( listName, itemIndex, newItem, header ) {
    const targetArr = getArrayByName( listName ) ;
    targetArr.push(newItem) ;
    saveList(listName, targetArr) ;
    renderOneList(header, targetArr, listName) ;
    document.getElementById('addUpdate').innerHTML='' ;
}

function updateItem( listName, itemIndex, newItem, header ) {
    const targetArr = getArrayByName( listName ) ;
    if ( targetArr && itemIndex >= 0 && itemIndex < targetArr.length ) {
        targetArr[itemIndex] = newItem ;
        saveList(listName, targetArr) ;
        renderOneList(header, targetArr, listName) ;
    } else {
        console.error("Invalid list name or item index:", listName, itemIndex);
    }
    document.getElementById('addUpdate').innerHTML='' ;
}

function deleteItem( listName, itemIndex, header ) {
    const targetArr = getArrayByName( listName ) ;
    if ( targetArr && itemIndex >= 0 && itemIndex < targetArr.length ) {
        targetArr.splice( itemIndex, 1 ) ;
        saveList(listName, targetArr) ;
        renderOneList(header, targetArr, listName) ;
    } else {
        console.error("Invalid list name or item index:", listName, itemIndex);
    }
}
 
function getArrayByName( listName ) {
    switch ( listName ) {
        case lsNames.adoration:     return adorationArr ;
        case lsNames.confession:    return confessionArr ;
        case lsNames.thanksgiving:  return thanksArr ;
        case lsNames.suppication:   return supplicationArr ;
        default:   console.error("Invalid list name:", listName);  return null;
    }
}

function saveList(clsName, inArr) {
    setLsItem( clsName, inArr ) ;
}

function deleteLists() {
    for (const key in lsNames) {
        localStorage.removeItem( lsNames[key] ) ;
    }
}

function genIt(header, inArr, inCnt) {
    let outList = `<h2>${header}</h2><ol>` ;   const arrLen = inArr.length ;
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

function getLsItem( keyVal, defaultVal ) {
    let retVal = localStorage.getItem( keyVal ) ;
    return (retVal === null ) ? defaultVal : JSON.parse(retVal) ;
}

function setLsItem( keyVal, inVal ) {
    try {
        localStorage.setItem( keyVal, JSON.stringify( inVal ) ) ;
    } catch (e) {
        console.error("Error setting localStorage item:", e);
    }
}