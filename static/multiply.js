const button = document.getElementById("button");
const main = document.getElementsByTagName("main")[0];
const leftOperand = document.getElementById("left-operand");
const rightOperand = document.getElementById("right-operand");
const calcResult = document.getElementById("calc-result");
const score = document.querySelector(".score");
const timer = document.querySelector(".timer");
const answers = document.querySelector(".answers");
const variants = document.getElementsByClassName("variant");

createNewExample();

let int = 0;
let counter = 0;
let running = false;

const start = () => {
  createNewExample();
  counter = 0;
  let i = 60;
  score.innerHTML = `Счёт: ${counter}`;
  int = setInterval(() => {
    i--;
    timer.innerHTML = `${i} сек`;
  }, 1000);
  setTimeout(() => {
    clearInterval(int);
    stop();
  }, 60000);
  button.textContent = "Закончить";
  button.classList.add("started");
  createVariants();
};

const stop = () => {
  clearInterval(int);
  timer.innerHTML = "60 сек";
  button.textContent = "Начать";
  button.classList.remove("started");
  answers.innerHTML = "";
};

window.addEventListener("keydown", (e) => {
  console.log(variants[0].innerText);
  switch (e.key) {
    case "q":
      checkAnswer(0);
      break;
    case "w":
      checkAnswer(1);
      break;
    case "e":
      checkAnswer(2);
      break;
    case "a":
      checkAnswer(3);
      break;
    case "s":
      checkAnswer(4);
      break;
    case "d":
      checkAnswer(5);
      break;
  }
});

button.addEventListener("click", () => {
  running ? stop() : start();
  running = !running;
});

answers.addEventListener("click", (e) => {
  for (let i = 0; i < variants.length; i++) {
    if (variants[i].innerText == e.target.innerText) checkAnswer(i);
  }
});

function checkAnswer(i) {
  variants[i].classList.add("pressed");
  setTimeout(() => {
    variants[i].classList.remove("pressed");
  }, 100);
  if (variants[i].innerText == calcResult.innerText) {
    console.log("correct");
    calcResult.classList.remove("no-answer");
    calcResult.classList.remove("wrong");
    calcResult.classList.add("correct");
    score.innerHTML = `Счёт: ${++counter}`;
    createNewExample();
    createVariants();
  } else {
    calcResult.classList.remove("no-answer");
    calcResult.classList.add("wrong");
    calcResult.classList.add("accepted");
    setTimeout(() => {
      calcResult.classList.remove("accepted");
    }, 500);
    console.log("wrong");
  }
}
function createVariants() {
  answers.innerHTML = "";
  let variantButtons = [];
  let numbers = getNumbers();
  for (let i = 0; i < 6; i++) {
    let btn = document.createElement("button");
    btn.classList.add("variant");
    btn.innerHTML = numbers[i];
    variantButtons.push(btn);
  }
  showButtons(shuffleButtons(variantButtons));
}

function showButtons(arr) {
  arr.forEach((element) => {
    answers.appendChild(element);
  });
}

function shuffleButtons(arr) {
  for (let i = 0; i < arr.length; i++) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getNumbers() {
  let numbers = [];
  let res = +calcResult.innerText;
  numbers.push(res);
  numbers.push(2 + res);
  numbers.push(res - 3);
  numbers.push(res + 10);
  numbers.push(res - 5);
  numbers.push(res + 1);
  return numbers;
}

function createNewExample() {
  let i = 0;
  let j = 0;
  do {
    i = Math.floor(Math.random() * 10);
    j = Math.floor(Math.random() * 10);
  } while (i < 2 || j < 2);

  leftOperand.innerText = i;
  rightOperand.innerText = j;
  calcResult.innerText = i * j;
  calcResult.classList.remove("correct");
  calcResult.classList.add("no-answer");
}
