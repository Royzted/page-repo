const capitalise = str =>
    str
    .split(" ")
    .map(w => w ? w[0].toUpperCase() + w.substring(1).toLowerCase() : "")
    .join(" ");


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
