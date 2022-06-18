var GLOB_BG = chrome.extension.getBackgroundPage();

var GLOB_SET_BTN = document.getElementById('btn__set-all-timers');
var GLOB_KILL_BTN = document.getElementById('btn__reset-all-timers');
var GLOB_PAUSE_BTN = document.getElementById("btn__pause");

GLOB_SET_BTN.addEventListener('click',()=>{
    // reset timers
    resetAll();

    // get the durations of each timer
    var timer01_dur = parseInt(minToSec(document.getElementById('timer01_min').value),10) +
                            parseInt(document.getElementById('timer01_sec').value,10);

    // if nothing set, show error
   
    if(isNaN(timer01_dur) || timer01_dur == 0){
        alert("Please set a time for timer 1.");
    }
    else{
        resetAll();

        GLOB_BG.timer01.setStartTime(timer01_dur);

        GLOB_BG.timer01.startTimer();
    }
})

GLOB_KILL_BTN.addEventListener('click',()=>{
    resetAll();
});


GLOB_PAUSE_BTN.addEventListener('click',()=>{
    // check the current timer
    if(GLOB_BG.timer01.IS_CURRENT_TIMER){
        GLOB_BG.timer01.pauseUnpause();

        if(GLOB_BG.timer01.IS_PAUSED){
            GLOB_PAUSE_BTN.innerText = "Unpause";
        }else{
            GLOB_PAUSE_BTN.innerText = "Pause";
        }
    }
});

function checkIfPaused(){
    // check if any timer paused, if so change the html text
    // this is for reloads of popup page
    if(GLOB_BG.timer01.IS_PAUSED){
        GLOB_PAUSE_BTN.innerText = "Unpause";
    }
}



function minToSec(aMin){
    return 60 * aMin;
}


function getFormData(form_id){
    return document.getElementById(form_id);
}

function resetAll(){
    document.getElementById('timer-01__time').innerText = "00:00";

    GLOB_PAUSE_BTN.innerText = "Pause";

    GLOB_BG.resetAll();
}

function IntervalUpdate(){
    // the required tasks on each update

    // update the html display
    document.getElementById('timer-01__time').innerText = GLOB_BG.timer01.getDisplayTime()
}
function onlyButtonInput(inputField){
    // this makes it so you can only change the numbers via buttons on side, no keyboard
    inputField.addEventListener("keydown",e=>e.preventDefault());
    inputField.addEventListener("keydown",e=>e.keyCode !=38 && e.keyCode != 40 && e.preventDefault());
}

function getCurVal(inputField){
    return parseInt(inputField.value,10);
}

function mapButton(btn_id,func,value_id){
    document.getElementById(btn_id).addEventListener("click",()=>{
        func(value_id)
    })
}

var timer01_min = document.getElementById("timer01_min")
var timer01_sec = document.getElementById("timer01_sec")

// for checking correct inputs
var inputArr = [timer01_min,timer01_sec];
inputArr.forEach(i=>onlyButtonInput(i));

// change text "pause" / "unpause" if pause or not
checkIfPaused();

setInterval(()=>{
    IntervalUpdate();
},20);


//===============TODO_APP===============//

var taskArr = [];

const updateView = () => {
    const tasksList = document.getElementById("tasksList");

    var child = tasksList.lastChild;
    while(child) {
        tasksList.removeChild(child);
        child = tasksList.lastChild;
    }

    taskArr.forEach((Element, index) => {

        const newTask = document.createElement("div");
        newTask.setAttribute("class", "task-div");

        const taskText = document.createElement("div");
        taskText.setAttribute("class", Element.isDone ? "task-text task-completed" : "task-text");
        taskText.innerHTML = Element.task;

        const taskControls = document.createElement("div");
        taskControls.setAttribute("class", "task-controls");

        const taskEdit = document.createElement("button");
        taskEdit.innerHTML = "🔁";
        taskEdit.setAttribute("id", index + "edit");
        taskEdit.setAttribute("class", "dot-size");
        taskEdit.addEventListener("click", (event) => editTask(event.target.id));

        const taskDelete = document.createElement("button");
        taskDelete.innerHTML = "❌";
        taskDelete.setAttribute("id", index + "delete");
        taskDelete.setAttribute("class", "dot-size");
        taskDelete.addEventListener("click", (event) => deleteTask(event.target.id));

        const taskDo = document.createElement("button");
        taskDo.innerHTML = Element.isDone ? "🔁" : "✅";
        taskDo.setAttribute("id", index + "do");
        taskDo.setAttribute("class", "dot-size");
        taskDo.addEventListener("click", (event) => doTask(event.target.id));

        taskControls.appendChild(taskEdit);
        taskControls.appendChild(taskDelete);
        taskControls.appendChild(taskDo);

        newTask.appendChild(taskText);
        newTask.appendChild(taskControls);

        tasksList.appendChild(newTask);
        newTask.prepend(taskDo);
    });
}

const addTask = (isDone) => {

    const task = document.getElementById("task-input").value;
    if(task === null || task.trim() === "") return;
    taskArr.push({task, isDone});
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();

    const taskInput = document.getElementById("task-input");
    taskInput.value = "";
}

const editTask = (id) => {

    const taskIndex = parseInt(id[0]);
    const taskText = taskArr[taskIndex].task;
    taskArr.splice(taskIndex, 1);
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();

    const taskInput = document.getElementById("task-input");
    taskInput.value = taskText;
}

const deleteTask = (id) => {

    const taskIndex = parseInt(id[0]);
    taskArr.splice(taskIndex, 1);
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
}

const doTask = (id) => {

    const taskIndex = parseInt(id[0]);
    taskArr[taskIndex].isDone = !taskArr[taskIndex].isDone;
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
}

document.addEventListener("DOMContentLoaded", () => {

    const savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
    if(savedTasks !== null) taskArr = [...savedTasks];
    updateView();
})

document.getElementById("task-submit-btn").addEventListener("click", () => addTask(false));

document.getElementById("task-clear-btn").addEventListener("click", () => {

    localStorage.clear();
    taskArr = [];
    updateView();
})







