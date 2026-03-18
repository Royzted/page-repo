const factorial = (field) => {
  if (field === 0 || field === 1) 
    return 1
  
 let total = 1
 for (let i = field-1; i > 1; i--) {
	 field *= i
 }
   return field
}


const form = document.querySelector('form');


form.addEventListener("submit", (e) => {
  e.preventDefault(); 

  let num = parseInt(form.elements.num.value);
  form.elements.factorial.value = factorial(num);
});