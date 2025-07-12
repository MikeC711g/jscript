const fileSelector = document.getElementById('FileSelector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    document.getElementById("dater").innerText = 
        new Date().toLocaleDateString().replaceAll("/", ".") ;
    const file = fileList[0] ;
//      for (const file of fileList) {
    const name = file.name ? file.name : 'Not supported' ;
    const reader = new FileReader() ;
    const demoEl = document.getElementById("demo") ;
    reader.addEventListener('load', () => {
        demoEl.innerText = reader.result ;
        console.log(reader.result) ;
    }, false)
    reader.readAsText(file) ;
    // reader.readAsArrayBuffer(file)
    console.log(fileList)
})
