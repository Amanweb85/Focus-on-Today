const checkBoxes = document.querySelectorAll(".custom-checkbox");
const errorMsg = document.querySelector(".error-msg");
const inputs = document.querySelectorAll(".goal-input");
const progressValue = document.querySelector(".progress-value");
const progressPara = document.querySelector(".progress-para");
const addGoal = document.querySelector(".add-goal");
console
const allGoals = JSON.parse(localStorage.getItem("allGoals")) || {
  count: 0,
};
let checkBoxList = [...checkBoxes]; // converting nodeList to array
let inputFields = [...inputs];
let inputFieldLength = inputFields.length;

// adding goal containers and details after refreshing the page

let i = 0;
for (let goal in allGoals) {
  //don't add already existing 3-goal containers
  if (i > 3) {
    let newGoalContainer = document.createElement("div");
    newGoalContainer.classList.add("goal-container");
    newGoalContainer.innerHTML = `
      <div class="custom-checkbox"></div>
      <input class="goal-input" id="${goal}" type="text" placeholder="Add new goal ..."></input>
      `;
    if (allGoals["goal"]) {
      newGoalContainer.lastElementChild.value = allGoals["goal"].val;
    }
    addGoal.parentElement.before(newGoalContainer);
    inputFieldLength++;

    const newCheckBox = newGoalContainer.firstElementChild;
    const newInputField = newGoalContainer.lastElementChild;
    // if(goal.completed){
    //    newGoalContainer.classList.add("completed")
    // }
    addEventLitenersOnInputField(newInputField);
    addEventLitenersOncheckBox(newCheckBox);
  }
  i++;
}

function updateProgress() {
  progressValue.style.width = `${(allGoals.count * 100) / inputFieldLength}%`;
  progressPara.innerText = `${allGoals.count}/${inputFieldLength} completed`;
  progressValue.style.backgroundColor = `hwb(${65*allGoals.count/ inputFieldLength+60} 4% 15%)`

}
updateProgress();

// add new Goal container
addGoal.addEventListener("click", (e) => {
  // execute only when no any goal completed
  if (allGoals.count === 0) {
    let newGoalContainer = document.createElement("div");
    newGoalContainer.classList.add("goal-container");
    newGoalContainer.innerHTML = `
        <div class="custom-checkbox"></div>
        <input class="goal-input" id="goal${
          inputFieldLength + 1
        }" type="text" placeholder="Add new goal ..."></input>
    `;
    addGoal.parentElement.before(newGoalContainer);
    inputFieldLength++;

    const newCheckBox = newGoalContainer.firstElementChild;
    const newInputField = newGoalContainer.lastElementChild;

    checkBoxList.push(newCheckBox);
    inputFields.push(newInputField);

    addEventLitenersOnInputField(newInputField);
    addEventLitenersOncheckBox(newCheckBox);
    updateProgress();
  } else {
    errorMsg.innerText = "you can't add goal now";
    errorMsg.classList.add("show-error");
  }
});


function addEventLitenersOnInputField(inputField) {
  // execute only when allGoals is not empty
  if (allGoals[inputField.id]) {
    // OR..  if(allGoals){
    inputField.value = allGoals[inputField.id].val;
    if (allGoals[inputField.id].completed) {
      inputField.parentElement.classList.add("completed");
    }
  }
  inputField.addEventListener("focus", (e) => {
    errorMsg.classList.remove("show-error");
  });
  inputField.addEventListener("input", (e) => {
    // executed when goal is already completed (don't let the user to modify the goal)
    if (
      [...inputField.parentElement.classList].some(
        (classname) => classname === "completed"
      )
    ) {
      inputField.value = allGoals[inputField.id].val;
      errorMsg.innerText = "can't change goal this time";
      errorMsg.classList.add("show-error");
    } else {
      allGoals[inputField.id] = {
        val: inputField.value,
        completed: false,
      };
      localStorage.setItem("allGoals", JSON.stringify(allGoals));
    }
  });
}

function addEventLitenersOncheckBox(checkBox) {
  checkBox.addEventListener("click", (e) => {
    let allGoalEntered = [...inputFields].every((enteredGoal) => {
      return enteredGoal.value;
    });
    if (allGoalEntered) {
      let flag = e.target.parentElement.classList.toggle("completed");
      if (flag) {
        allGoals[e.target.nextElementSibling.id].completed = true;
        allGoals.count++;
      } else {
        errorMsg.classList.remove("show-error"); // can't change Goal error
        allGoals[e.target.nextElementSibling.id].completed = false;
        allGoals.count--;
      }
      updateProgress();
      localStorage.setItem("allGoals", JSON.stringify(allGoals));
    } else {
      errorMsg.classList.add("show-error");
      errorMsg.innerText = `please set all ${inputFieldLength} goals`;
    }
  });
}
// adding EventListeners on all inputs and Checkboxes
inputFields.forEach((inputField) => {
  addEventLitenersOnInputField(inputField);
});
checkBoxList.forEach((checkBox) => {
  addEventLitenersOncheckBox(checkBox);
});
