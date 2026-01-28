let var1 = document.querySelector('.accepted');
let var2 = document.querySelector('.declined');
let var3 = document.querySelector('.message');

let var4 = document.querySelector('#callStatus');


var1.addEventListener('click', (evt) => {
    
  var4.textContent = 'Call accepted';

})

var2.addEventListener('click', (evt) => {
    
  var4.textContent = 'Call declined';
})
var3.addEventListener('click', (evt) => {
    
  var4.textContent = 'Sending Message';
    setTimeout(() => {
 alert("I will call you later"); // Show alert after update
}, 200);

})