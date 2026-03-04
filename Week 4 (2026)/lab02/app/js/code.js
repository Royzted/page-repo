const capitalise = (str) => {
  let formattedName = "";
  let words = str.split(" ");
  for (let i = 0; i < words.length; i++) {
    formattedName += words[i].charAt(0).toUpperCase()+words[i].substring(1).toLowerCase() + " "
  }
  return formattedName.substring(0,formattedName.length-1);
}

const redClick = (evt) => {
  let username = prompt("What's your name?");   
  document.querySelector("h1").textContent = `Welcome to the App, ${capitalise(username)}!`;
}

const blueClick = (evt) => {
  let readMoreDiv = document.querySelector("#readmore");
  readMoreDiv.classList.toggle("hideshow");
}

const greenbtn = document.querySelector(".green");
greenbtn.addEventListener("click", () => alert("Thanks! You're okay too"));

const bluebtn = document.querySelector(".blue");
bluebtn.addEventListener("click", blueClick);

const redbtn = document.querySelector(".red");
redbtn.addEventListener("click", redClick);
