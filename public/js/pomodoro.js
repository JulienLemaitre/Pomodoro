window.onload = function() {
  // init variables
  var sessionTime = 25,breakTime = 5,timeCount = 0,phase,phaseColor = "#fc6472",timeColor1 = "rgb(244,178,166)",timeColor2 = "rgb(188,239,208)",timeColor,bgColor = "rgb(195,236,238)",counting,totalTime,pause = false;
  var current = "session";
  var sessionArea = document.getElementById("session-length");
  var breakArea = document.getElementById("break-length");
  var timerArea = document.getElementById("screen");
  var timerWrapper = document.getElementById("timer");
  var phaseArea = document.getElementById("phase");
  var sessionSound = document.getElementById("audio-session");
  var breakSound = document.getElementById("audio-break");

  // Set event listener for buttons
  var allButtons = document.getElementsByTagName("button");
  for ( var i = 0 ; i < allButtons.length ; i++) {
    allButtons[i].addEventListener("click",handleClick);
  }

  //handle the button pressed
  function handleClick() {
    var action = this.value;
    switch(action) {
      case "session minus":
        sessionTime = changeVal(sessionTime,"minus");
        refreshPanel();
        if (timeCount === 0) {
          refreshTimer(sessionTime * 60);
        }
        break;
      case "session plus":
        sessionTime = changeVal(sessionTime,"plus");
        refreshPanel();
        if (timeCount === 0) {
          refreshTimer(sessionTime * 60);
        }
        break;
      case "break minus":
        breakTime = changeVal(breakTime,"minus");
        refreshPanel();
        break;
      case "break plus":
        breakTime = changeVal(breakTime,"plus");
        refreshPanel();
        break;
      case "start":
        start(current);
        break;
      case "stop":
        stop();
        break;
      case "pause":
        // Pause is just a flag checked at some poitn in the code
        if (timeCount > 0) {
          pause = !pause;
        }
        break;
      default :
        break;
    }
  }

  // To change value of session and break length
  function changeVal(variable,change) {
    var result = variable;
    if (change === "plus")
      result = variable + 1;
    else if (change === "minus" && variable > 1)
      result = variable - 1;
    return result;
  }

  // Refresh session and break length displayed
  function refreshPanel() {
    sessionArea.innerText = sessionTime;
    breakArea.innerText = breakTime;
  }

  // Launch the timer if there is no one already ongoing
  function start(type) {
    if (pause)
      pause = !pause;
    else if (timeCount >= 0) {

      phaseArea.innerText = type;
      phaseArea.style.color = phaseColor;
      phase = type.concat("Time");
      timeCount = eval(phase) * 60;
      totalTime = timeCount;
      // We clear the interval to be shure we don't add one to another
      clearInterval(counting);
      counting = setInterval(decrementTimer,1000);
    }
  }

  // Decrease remaining time by one second.
  function decrementTimer() {
    // We decrement the timer only if we are not paused
    if (!pause) {
      timeCount--;
      // If time is over
      if (timeCount <= 0) {
        clearInterval(counting);
        switchCurrent();
        alarm();
        start(current);
      }
      refreshBackground(timeCount,totalTime);
      refreshTimer(timeCount);
    }
  }

  // Switch from session to break and the other way around
  function switchCurrent() {
    current = (current == "session" ? "break" : "session");
    phaseColor = (phaseColor == "#fc6472" ? "#23c8b2" : "#fc6472");
  }

  // refresh the time displayed
  function refreshTimer(time) {
    var minutes = (Math.floor(time/60)).toString();
    var seconds = (Math.round((time%60))).toString();
    if (seconds.length === 1)
      seconds = "0" + seconds;
    timerArea.innerText = minutes + ":" + seconds;
  }

  // refresh the background of the etimer
  function refreshBackground(timeLeft,totalTime) {
    var ratio = (totalTime - timeLeft)/totalTime;
    var portion1 = 90 + ( 360 * ratio);
    var portion2 = 90;
    var formule;
    timeColor = current === "session" ? timeColor1 : timeColor2;
    if (ratio > 0.5) {
      formule = "linear-gradient(" + (portion1 + 180) + "deg, transparent 50%, " + timeColor + " 50%),linear-gradient(" + (portion2 + 180) + "deg, " + timeColor + " 50%, " + bgColor + " 50%)";

    } else {
      formule = "linear-gradient(" + portion1 + "deg, transparent 50%, " + bgColor + " 50%),linear-gradient(" + portion2 + "deg, " + bgColor + " 50%, " + timeColor + " 50%)";
    }
    timerWrapper.style.backgroundImage = formule;
  }

  // play a sound, depending on which phase we enter (session or break)
  function alarm() {
    if (current === "session")
      sessionSound.play();
    else
      breakSound.play();
  }

  // Stop the timer and reset variables
  function stop() {
    // Only if a timer is ongoing
    if(timeCount > 0) {
      clearInterval(counting);
      current = "session";
      phaseColor = "#fc6472";
      timeCount = 0;
      refreshTimer(sessionTime * 60);
      phaseArea.innerText = current;
      phaseArea.style.color = phaseColor;
      timerWrapper.style.backgroundImage = "none";
      pause = false;
    }
  }
};