function spread() {
    let firstHalf = [ 'one', 'two'] ;
    let secondHalf = [ 'three', 'four', ...firstHalf] ;
    document.getElementById("Spreader").innerHTML = secondHalf ;
}
function spreadStruct() {
    const hero = { name: 'Mike', realName: 'TopBanana'} ;
    const heroWSword = { ...hero, weapon: 'Sword'} ;
    const { name, realName, weapon } = heroWSword ; // obj destruc
    document.getElementById("Spreader").innerHTML = name + '/' + realName + '/' + weapon ;
}
function restEm(a, b, ...remaining) {
    document.getElementById("RestEm").innerHTML = remaining ;
}
function stringInterp() {
    const v1 = 'value 1' ;   const v2 = 'value 2' ;
    const bigStr = `First value is ${v1}
      second Value is ${v2}`
    document.getElementById("StringInterp").innerHTML = bigStr ;
}
function shortHandProps(xAc, yAc) {
    const cPt = { xAc, yAc } ;
//    const { xAc, yAc } = cPt ;      // obj destruc
    document.getElementById("shortHandProp").innerHTML = cPt.xAc + ' , ' + cPt.yAc ;
}
function methodProps(a, b) {
    const math = { 
        add(a, b) { return a + b; },
        subtract(a, b) { return a - b; },
        multiply(a, b) { return a * b; }
    }
    const sum = math.add(a, b) ;
    const diffe = math.subtract(a, b) ;
    const product = math.multiply(a, b) ;
    document.getElementById("methodProps").innrHTML = 
        sum + ' , ' + diffe + ' , ' + product ;
}
function objDestructure() {
    const bStruc = { addr: { street : '123 Main St', city : 'Plano', state: 'TX'},
        name : { first: 'John', last: 'Doe' } } ;
    const { addr: { street, city, state}, name: {first, last}} = bStruc ;
    document.getElementById("objDestruc").innerHTML = 
        `Addr: ${street} in ${city} in ${state}
         Name: ${first} of ${last}`
}
function arrDestructure() {
    const intList = [1, 2, 3, 4, 5, 6, 7] ;
    const [ , i1, , i3, , i5, ...remaining] = intList ;
    document.getElementById("arrDestruc").innerHTML = `i1: ${i1}  i3: ${i3} i5: ${i5}`
}
function parmMatching() {
    const boolList = { a: true, b: false, c: true, d: false } ;
    pMatch(boolList) ;

    function pMatch( { a, b, c, d }) {
        document.getElementById("parmMatching").innerHTML = 
            `a: ${a}  b: ${b} c: ${c} d: ${d}`
    }
}
