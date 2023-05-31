
// Loading the page and add event listner to the buttons page
document.addEventListener('DOMContentLoaded', function() {
  // assign variable refernce to the button element
  const buttons = document.getElementsByClassName("btn");
  for (const button of buttons) {
      // get an event listener to each button
      button.addEventListener("click", function() {
          if (button.getAttribute("data-type") === "new-game"){
             // navigate to each HTML page
              window.location.href = "game.html"; 

          } else if (button.getAttribute("data-type") === "end-game"){
              saveGame("savedPage");
              window.location.href = "index.html"
          } else if (button.getAttribute("data-type") === "continue-game"){
              window.location.href = "game.html"
              retrieveGame("savedPage");
              deleteGame("savedPage");
              
          } else if (button.getAttribute("data-type") === "start-game"){
              displayBoard();
              button.disabled = true;
          } else if (button.getAttribute("data-type") === "roll-dice"){
              rollDice();

          } else if (button.getAttribute("data-type") === "start"){
            startGame();

          } else if (button.getAttribute("data-type") === "restart-game"){
              restartGame();
              

          } else if (button.getAttribute("data-type") === "winner"){
            closeWinPopup();
            restartGame();

            } else {
              alert(`Unknown button type: ${button}`);
          }
          
      
      })
  }

     
});

// pop up pages start screen
var startScreen = document.getElementById("start");
// var startButton = document.getElementById("startButton");


//Game page
var gameScreen = document.getElementById("homePage");
var game = document.getElementById("page");


// Game over screen 
var gameOverScreen = document.getElementById("game-over");

var scoreElement = document.getElementById("moves");
var restartButton = document.getElementById("restartButton");


var highestScore = document.getElementById("total-score");
var scores = document.getElementById("game-score");
var steps = document.getElementById("moves");
var totalSteps = document.getElementById("total-steps");

// Game state variable
var gameStarted = false;

// Function to start the game
function startGame() {
  // Show the game screen and hide the start screen
  gameScreen.style.display = 'block';
  startScreen.style.display = 'none';

  // Set gameStarted flag to true
  gameStarted = true;

}

// Function to end the game
function endGame() {
  // Show the game over screen and hide the game screen
  gameOverScreen.style.display = 'block';
  game.style.display = 'none';



  steps = parseInt(document.getElementById("moves").textContent);
  totalSteps.textContent = steps;
  scores.textContent = 100 - parseInt(steps) * 2;
  highestScore.textContent = scores.textContent;

  // Set gameStarted flag to false
  gameStarted = false;

}


// Function to restart the game
function restartGame() {
  // Hide the game over screen and show the start screen
  gameOverScreen.style.display = 'none';
  window.location.href = "index.html";
  startScreen.style.display = 'block';

}


function checkGameOver() {
  let steps = parseInt(document.getElementById("moves").textContent);
  if (steps === 40) {
    // Player has lost all lives, end the game
    endGame();
  }
}

// Win popup

// Open the "You Win" popup
function showWinPopup() {
  document.getElementById("winPopup").style.display = "block";
}

// Close the "You Win" popup
function closeWinPopup() {
  document.getElementById("winPopup").style.display = "none";
}

// Attach event listener to the close button
document.getElementById("closeButton").addEventListener("click", closeWinPopup);


function checkWinGame(path) {

  for (element of path) {
    element.style.backgroundColor = "red";
  }
  showWinPopup();

}


/**
* displayBoard is called when the user starts
* new game or resets a game
*/
function displayBoard() {
  let hexagonsNum = document.getElementsByClassName("number");
  
  for (let hexagon of hexagonsNum) {
      hexagon.innerHTML = Math.floor(Math.random()*6)+1;
  };
   
  // Reset number of moves to zero
  steps.innerHTML = "0";
  // Set Initial Score to 100
  highestScore.innerHTML = "100";
 
}

function rollDice() {
  let diceOne = document.getElementById("dice-one");
  let diceTwo = document.getElementById("dice-two");
  let steps = document.getElementById("moves");
  let num = rollNumber();

  highestScore.textContent = 100 - (parseInt(steps.innerHTML) * 2);

  
  diceOne.src = `assets/images/${num}.png`;
  diceTwo.src = `assets/images/d${num}.png`;
  steps.innerHTML = parseInt(steps.innerHTML) + 1;
  
  let hexagons = document.getElementsByClassName("hexagon");
  checkGameOver();
    
  checkBox(num, hexagons);
  playGame(num, hexagons);
}


function playGame() {
  let hexagons = document.getElementsByClassName("number");
  let diceOne = document.getElementById("dice-one");
  let diceTwo = document.getElementById("dice-two");
  let steps = document.getElementById("moves");
  let num = Math.floor(Math.random() * 6) + 1;

  
  diceOne.src = `assets/images/${num}.png`;
  diceTwo.src = `assets/images/d${num}.png`;
  steps.innerHTML = parseInt(steps.innerHTML) + 1;
  checkBox(num, hexagons);
  let elements = Array.from(document.getElementsByClassName("hexagon"));
  let matrixElement = listToMatrix(elements, 5);
  // console.log(matrixElement);
  // y = resetHexagon(matrixElement, num);

  resetHexagon(matrixElement, num, clickedElement => {
    console.log("Clicked Element:", clickedElement);
    // Perform further operations with the clicked element here
  });
  // let clickedElement = resetHexagon(matrixElement, num);
  // console.log("Clicked Element:", clickedElement);
  // resetHexagon(matrixElement, num).then(clickedElement => {
  //   console.log("Clicked Element:", clickedElement);
    // Perform further operations with the clicked element here
  // });
  // let path1 = checkAndIncrementPath(y, matrixElement)
  // clickedBox();
  
  
}
//Array into matrix

function listToMatrix(list, elementsPerSubArray) {
  let matrix = [], i, k;

  for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
          k++;
          matrix[k] = [];
      }

      matrix[k].push(list[i]);
  }

  return matrix;
}


// function returns a highlight of numbers
function checkBox(num, hexagons) {
  for (let element of hexagons) {
      let clickElement = parseInt(element.innerHTML);
      if (clickElement === num) {
          element.parentNode.style.backgroundColor = "gold";
      } else {
          element.parentNode.style.backgroundColor = "#ccc";
      }

  }
  
  return hexagons;

}

function completePath() {

}



function resetHexagon(hexagonElements, value, callback) {
  function handleClick(event) {
    const element = event.target;
    if (Number(element.textContent) === value) {
      element.style.backgroundColor = "green";
      element.textContent = "";
      callback(element);
    } else {
      // Reset the background color of all elements except the clicked one
      hexagonElements.forEach(row => {
        row.forEach(div => {
          if (div !== element && div.textContent !== "") {
            div.style.backgroundColor = "#ccc";
            div.removeEventListener("click", handleClick);
          }
        });
      });
    }
  }

  // Enable event listeners for all elements
  hexagonElements.forEach(row => {
    row.forEach(element => {
      element.addEventListener("click", handleClick, { once: true });
    });
  });
}









// function resetHexagon(hexagonElements, value) {
//   let clickedElement = null;

//   let numClicks = 0;
//   // Iterate through all div elements
//   hexagonElements.forEach(row => {
//     row.forEach(element => {
//       const initialColor = window.getComputedStyle(element).backgroundColor;
//       element.addEventListener("click", function handleClick() {
//         // Check if the element's number content matches the given value
//         if (Number(element.textContent) === value && numClicks === 0) {
//           // Set the background color of the clicked element to green
//           element.style.backgroundColor = "green";
//           element.textContent = "";
//           element.removeEventListener("click", handleClick);

//           // Set the clicked element
//           clickedElement = element;
//         } else {
//           // Reset the background color of all elements except the clicked one
//           hexagonElements.forEach(row => {
//             row.forEach(div => {
//               if (div !== element && div.textContent !== "") {
//                 div.style.backgroundColor = "#ccc";
//                 div.removeEventListener("click", handleClick);
//                 element.removeEventListener("click", handleClick);
//               }
//             });
//           });
//         }

//         numClicks++;
//       });
//     });
//   });

//   // Return the clicked element
//   return clickedElement;
// }




function getIndexesOfElement(array2D, element) {
  for (let row = 0; row < array2D.length; row++) {
    const colIndex = array2D[row].findIndex(el => el === element);
    if (colIndex !== -1) {
      return { row, col: colIndex };
    }
  }
  
  // Element not found
  return { row: -1, col: -1 };
}



function checkAndIncrementPath1(clickedElement, elements) {
  const targetElements = [
    elements[0][0],
    elements[1][0],
    elements[2][0],
    elements[3][0],
    elements[4][0]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}

function checkAndIncrementPath2(clickedElement, elements) {
  const targetElements = [
    elements[0][0],
    elements[1][1],
    elements[2][0],
    elements[3][1],
    elements[4][0]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}


function checkAndIncrementPath3(clickedElement, elements) {
  const targetElements = [
    elements[0][1],
    elements[1][1],
    elements[2][1],
    elements[3][1],
    elements[4][1]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}
function checkAndIncrementPath4(clickedElement, elements) {
  const targetElements = [
    elements[0][1],
    elements[1][2],
    elements[2][1],
    elements[3][2],
    elements[4][1]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}
function checkAndIncrementPath5(clickedElement, elements) {
  const targetElements = [
    elements[0][2],
    elements[1][2],
    elements[2][2],
    elements[3][2],
    elements[4][2]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}
function checkAndIncrementPath6(clickedElement, elements) {
  const targetElements = [
    elements[0][2],
    elements[1][3],
    elements[2][2],
    elements[3][3],
    elements[4][2]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}
function checkAndIncrementPath7(clickedElement, elements) {
  const targetElements = [
    elements[0][3],
    elements[1][3],
    elements[2][3],
    elements[3][3],
    elements[4][3]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}
function checkAndIncrementPath8(clickedElement, elements) {
  const targetElements = [
    elements[0][3],
    elements[1][4],
    elements[2][3],
    elements[3][4],
    elements[4][3]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}
function checkAndIncrementPath9(clickedElement, elements) {
  const targetElements = [
    elements[0][4],
    elements[1][4],
    elements[2][4],
    elements[3][4],
    elements[4][4]
  ];
  
  if (targetElements.includes(clickedElement)) {
    return 1; // Increment path2
  }

  return 0; // No increment
}



function countScore() {

}

function saveGame(key) {
  const htmlContent = document.documentElement.outerHTML;
  localStorage.setItem(key, htmlContent);
}


function retrieveGame(key) {
  const htmlContent = localStorage.getItem(key);
  if (htmlContent) {
    document.open();
    document.write(htmlContent);
    document.close();
  }
}

function deleteGame(key) {
  localStorage.removeItem(key);
}


