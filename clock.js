//Main Timer
const session = document.querySelector(".session");
const timer = document.querySelector(".timer");
//Timer breakdown
const workTime = document.querySelector(".workTime");
const breakTime = document.querySelector(".breakTime");
//Timer controls
const controls = document.querySelectorAll(".control");
const increment = document.querySelectorAll(".increase");
const decrement = document.querySelectorAll(".decrease");


var startTime = new Date();     //Global variable for a starting time
var isOn = false;               //A sentinel value to see if the timer is running
var active = false;             //Sentinel value for checking if the timer has been activated

var sessionTracker = 0;             //Variable used to keep track of which session is currently active, 0 is for work, 1 is for break
var titleArr = ["Work", "Break"];   //An array containing the names of the sessions

var timeInterval;               //Global variable to stop and start the timer

//Adding event listeners to each of the controls
controls.forEach((ctrl) => {
    ctrl.addEventListener('click', (e) => {
        if(ctrl.id == "start" && !isOn){
            isOn = true;
            active = true;
            startTime = Date.parse(new Date()) + timeRemaining();
            startTimer(startTime)
        }
        if(ctrl.id == "pause"){
            pause();
            console.log("paused");
        }
        if(ctrl.id == "stop"){
            stop();
            console.log("stopped");
        }
        //A hard reset of the timer
        if(ctrl.id == "reset"){
            workTime.textContent = "25";
            breakTime.textContent = "5"
            stop();
        }
    });
});

//Adding event listeners to the buttons that increase the value of the sessions
increment.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        //The buttons only work when the timer isn't running
        if(!isOn && !active){
            if(btn.parentNode.className == "work"){
                workTime.textContent = (parseInt(workTime.textContent) + 1).toString();
                //If the timer is greater than or equal to 60 minutes then adjust the timer display
                if(parseInt(workTime.textContent) >= 60)
                    timer.textContent = ('0' + Math.floor(parseInt(workTime.textContent) / 60)).slice(-2) + ":" + ("0" + (parseInt(workTime.textContent) % 60)).slice(-2) + ":00";
                else
                    timer.textContent = ("0" + workTime.textContent).slice(-2) + ":00";
            }
            else if(btn.parentNode.className == "break")
                breakTime.textContent = (parseInt(breakTime.textContent) + 1).toString();
        }
    });
});

//Adding event listeners to the buttons that decrease the value of the sessions
decrement.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        //Buttons only work when the timer isn't running
        if(!isOn && !active){
            //To prevent the values from being unreasonably small (less than 1 minute), the value of the sessions must be at least 1
            if(btn.parentNode.className == "work" && parseInt(workTime.textContent) > 1){
                workTime.textContent = (parseInt(workTime.textContent) - 1).toString();
                 //If the timer is greater than or equal to 60 minutes then adjust the timer display
                if(parseInt(workTime.textContent) >= 60)
                    timer.textContent = ('0' + Math.floor(parseInt(workTime.textContent) / 60)).slice(-2) + ":" + ("0" + (parseInt(workTime.textContent) % 60)).slice(-2) + ":00";
                else
                    timer.textContent = ("0" + workTime.textContent).slice(-2) + ":00";
            }
            else if(btn.parentNode.className == "break" && parseInt(breakTime.textContent) > 1)
                breakTime.textContent = (parseInt(breakTime.textContent) - 1).toString();
        }
    });
});

//Calculates the difference between the start time and the current time
function countdown(start){
    var t = (new Date(start)) - (new Date());
    var seconds = Math.floor( (t/1000) % 60 )
    var minutes = Math.floor( (t/1000/60) % 60);
    var hours = Math.floor( (t/1000/60/60) % 60);
    return { 
        'total': t,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

//Used when the pause buttong is pressed to determine how much time is remaining (in milliseconds)
function timeRemaining(){
    var strArr = timer.textContent.split(":").map(num => parseInt(num)); //Takes the numbers displayed on the timer, converts them to integers then stores them in an array
    var timeLeft = 0;
    //Converts the integers stored in the array into seconds, minutes and hours
    for(var i=0; i<strArr.length; i++){
        timeLeft += strArr[i] * 1000 * Math.pow(60, (strArr.length - 1 - i));
    }
    return timeLeft;
}

//The actual timer functionality
function startTimer(start){
    //This function gets the time remaining and updates the display
    function update(){
        var time = countdown(start)
        timer.textContent = '';
        //If the time remaining exceeds 1 hour, adjust the display to include hours
        if(time.total > 3600000)
            timer.textContent += ('0' + time.hours).slice(-2) + ":";
        timer.textContent += ('0' + time.minutes).slice(-2) + ":";
        timer.textContent += ('0' + time.seconds).slice(-2);

        //If the time remaining is less than or equal to 0, change sessions
        if(time.total <= 0){
            sessionTracker = (sessionTracker + 1) % 2;          //Update the session tracker
            session.textContent = titleArr[sessionTracker];     //Change the session title accordingly
            //Change display timer accordingly
            timer.textContent = (sessionTracker == 0) ? (("0" + workTime.textContent).slice(-2) + ":00") : (("0" + breakTime.textContent).slice(-2) + ":00");
            start = Date.parse(new Date()) + timeRemaining() + 1000;    //Update the time remaining, + 1000 to adjust for time lag
        }
    }

    update();
    timeInterval = setInterval(update, 1000);   //Call the update function every second
}


//Pauses the timer
function pause(){
    clearInterval(timeInterval);
    isOn = false;
}

//Stops the timer and does a soft reset
function stop(){
    pause();
    active = false;
    sessionTracker = 0;
    timer.textContent = ("0" + workTime.textContent).slice(-2) + ":00";
    session.textContent = titleArr[0];
}