const playerInfo = [{ name: 'Lamine Yamal', picUrl: 
    'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRsIfRxGTK3q1HG2bK1I9xdarVBsn1d5Mmgp-4-mFzMtvv7toEZSyyo3pNHrEQ7VwLEgmLUuuzP&s=19',
    matches: 35, goals: 9, assists: 13, yellowCards: 3 },
  { name: 'Marcus Rashford', picUrl: 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD2tOJP5YDCfa3fSdG-RzWclNBbo_zzJwBV6V7gq0Y-nERvaTMXvBvtEg&s=10',
    matches: 10, goals: 2, assists: 2, yellowCards: 0 },
  { name: 'Rafinha', picUrl:
    'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcR20MR4cBCazv5Q0DQEpaH18Q56BYaUXlCNYAAgdp2Fr4QwfUa0h2IeQBLXmAo4Yb6lOe0sJiU&s=19',
    matches: 11, goals: 5, assists: 2, yellowCards: 4 },
  { name: 'Robert Lewandowski', picUrl: 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd8LvkoqFN9801gBxneJvrYx6vjaeSscKWPI3fcMeh2tPA7DGw6AaRwAQ&s=10',
    matches: 34, goals: 27, assists: 2, yellowCards: 1 },
  { name: 'Pedri', picUrl: 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuJYqGkzRjf26dKdV47jhl9yotwJLlWQuPzCVf&s=0',
    matches: 37, goals: 4, assists: 5, yellowCards: 3 },
  { name: 'Gavi', picUrl:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAq5-dSWP7cNMfSpaepRcMUfe9T0JvE8ooSBb81mJ3rGUA5B3_yFcD&s=0',
    matches: 26, goals: 1, assists: 1, yellowCards: 4 }
];
// Dani Olmo  https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQE2eqL7GZoY-C7UN2ObdM0gYX2LA7ds3jTieIBllv8lJYyrZl33ctK19HQ_PurNP-6j3lUpoH8&s=19
// 25 10 3 1
// Wojciech Szczesny  https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQ1b2g3c4k6j5J7X8W3Y1Zy2a4f5e8m6s7n9x4qV9v0z1r3F5b2l3kK9s0&s=19
// 15 0 0 0
// Jules Kounde  https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTcYpWCo6qoZSJELCtlYFk-itfiiWTWM0Rk0XVK71vLxecoqsPdmWi6QmMliaCDFUUR4sBJFbF-&s=19
// 13 0 3 1
// Alejandro Balde  https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQx-EYfDHxT5UfiAjocRNasKcHne5FDx0JajrMkopGZmj2KU6NC3i6EDeKRrPvSsGSuIQW00ywp&s=19
// 32 0 4 2
// Marc-Andre ter Stegen https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScldHI-xotD-l9dB2JNOxXAYs_f4CTG8TlDZ3eCGUdF5BGGcGUpdDDyIU&s=10
// 8 0 0 0
// Ferran Torres https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSRL7f_BNqtWkRLLqW8Wn6CfFsRfJon2rrQiKhr9GC3lgIDvbSdug4MMEXfxuFF24e87KC9iFc&s=19
// 27 10 6 1

var selectElement = document.getElementById("playerSelect") ;
let selectHtml = "" ;
for (let i = 0; i < playerInfo.length; i++) {
    selectHtml += `<option value="${i}">${playerInfo[i].name}</option>  ` ;
}
selectElement.innerHTML += selectHtml ;

function playerSelected() {
    selectedPlayer = selectElement.options[selectElement.selectedIndex] ;
    if (selectedPlayer.value === "") {
        document.getElementById("playerStats").innerHTML = "Please select a player." ;
        return ;
    }
    let playerIndex = parseInt(selectedPlayer.value) ;
    let player = playerInfo[playerIndex] ;
    let statsHtml = `<h2>${player.name}</h2>
    <img src="${player.picUrl}" alt="${player.name}" style="width: 200px; height: auto;">
    <p>Matches: ${player.matches}</p>
    <p>Goals: ${player.goals}</p> 
    <p>Assists: ${player.assists}</p>
    <p>Yellow Cards: ${player.yellowCards}</p>` ;
    document.getElementById("playerStats").innerHTML = statsHtml ;
    console.log(`Selected Player: ${player.name}`) ;
}
