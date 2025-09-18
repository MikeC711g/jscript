function reverseIt() {
    const srcStr = document.getElementById('inString').value.trim() ;
    document.getElementById('result').innerText = [...srcStr].reverse().join('') ;
}