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
        const fileName = "/tmp/jsOutV1.text" ;
        const blob = new Blob([reader.result], {type:'text/plain'}) ;
        const link = document.createElement("a") ;
        link.download = fileName ;
        link.innerHTML = "Json Out File" ;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link) ;
    }, false);
    reader.readAsText(file) ;
    console.log(fileList);
});
