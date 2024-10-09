let sec = 0;
let minu = 0;
let hrs = 0;
let speed = 51; // Speed of the clock

let stopHrs = 2;  // Time when the clock should stop (2:00 AM)
let stopMin = 0;
let stopSec = 0;
let clockStopped = false;
let button;
let restartButton;
let alarmSound; // Declare variable for the sound
let soundDuration = 2000; // Duration of the alarm sound in milliseconds (2 seconds)
let screenDelayStarted = false; // Track if the delay for the screen has started
let hasPlayedAlarm = false; // Flag to check if alarm has played

// Array of category data for each screen (out of 5, multiplied by 20 to fit the bar logic)
let categoryScreens = [
  { depression: 3.6 * 20, anxiety: 3.6 * 20, isolation: 4 * 20, pressure: 4.6 * 20 },
  { depression: 3.42 * 20, anxiety: 3.46 * 20, isolation: 3.36 * 20, pressure: 3.96 * 20 },
  { depression: 2.84 * 20, anxiety: 2.78 * 20, isolation: 2.94 * 20, pressure: 3.38 * 20 }
];

// Array of sleep data for each screen
let sleepData = [
  { percentage: 5.7, hours: "2-4" },
  { percentage: 57.5, hours: "4-6" },
  { percentage: 36.8, hours: "7-8" }
];

let currentScreen = 0; // Track the current screen index

// Define colors for background transition
let startColor;
let endColor;
let filledColor;

function preload() {
  // Load the alarm sound from the assets folder
  alarmSound = loadSound('alarm-sound.mp3'); // Replace 'alarm-sound.mp3' with your actual file path
}

function setup() {
  createCanvas(480, 480);
  frameRate(30); // Control frame rate
  button = createButton('Continue');
  button.position(width / 2 - 50, height / 2 + 160);
  button.size(100, 40);
  button.hide(); // Initially hide the button
  button.mousePressed(continueClock); // Attach button action

  restartButton = createButton('Restart');
  restartButton.position(width / 2 - 50, height / 2 + 160);
  restartButton.size(100, 40);
  restartButton.hide(); // Initially hide the restart button
  restartButton.mousePressed(restartClock); // Attach restart action

  // Initialize start and end colors
  startColor = color(255, 0, 0); // Red
  endColor = color(0, 0, 255); // Blue
  filledColor = color(255, 0, 0)//Red
}

function draw() {
  background(lerpColor(startColor, endColor, map(sec + minu * 60 + hrs * 3600, 0, 28800, 0, 1))); // Change color smoothly over time
  
  // If the clock has reached the stop time, play alarm and start delay for the new screen
  if (hrs === stopHrs && minu === stopMin && int(sec) === stopSec) {
    if (!clockStopped) {
      playAlarm(); // Play the alarm sound when the clock stops
      screenDelayStarted = true; // Start the delay for showing the screen
      displayClock();
    }
    
    if (screenDelayStarted && !alarmSound.isPlaying() && hasPlayedAlarm) {
      if (currentScreen < categoryScreens.length) {
        showCategoryLevelsScreen(); // Show the new screen only after the sound is over
      } else {
        showEndScreen(); // Show end screen after all category screens
      }
      clockStopped = true; // Stop the clock updates
    }
    return; // Stop the clock updates
  }
  
  if (!clockStopped) {
    // Increase time normally
    sec += speed;

    // Handle overflow for seconds, minutes, and hours
    if (sec >= 60) {
      sec = 0;
      minu += 1;
      if (minu >= 60) {
        minu = 0;
        hrs = (hrs + 1) % 24; // 24-hour clock
      }
    }
    
    // Display the clock
    displayClock();
  }
}

function displayClock() {
  // Format time
  let mer = hrs < 12 ? "AM" : "PM";
  let displayHrs = formatting(hrs % 12 || 12); // Ensure 0 is shown as 12
  let displayMinu = formatting(minu);
  let displaySec = formatting(int(sec));
  
  // Display the time
  fill(255);
  textSize(70);
  textAlign(CENTER, CENTER);
  text(displayHrs + ":" + displayMinu + ":" + displaySec + " " + mer, width / 2, height / 2);
}

function showCategoryLevelsScreen() {
  // Display category levels from the current screen
  let categories = categoryScreens[currentScreen];
  let sleepStat = sleepData[currentScreen];

  background(50, 0, 100); // Different background for the new screen
  fill(255);
  textSize(35);
  textAlign(CENTER, CENTER);
  
  // Display the title at the top
  text("Student Mental Health", width / 2, 40); // Title display
  
  
  textSize(30);
  textAlign(LEFT, CENTER);
  // Display category names and levels
  text("Depression", 20, 100);
  text("Anxiety", 20, 160);
  text("Isolation", 20, 220);
  text("Pressure", 20, 280);

  // Display bars and values for each category
  drawLevelBar(categories.depression, 170, 85, "Depression");
  drawLevelBar(categories.anxiety, 170, 145, "Anxiety");
  drawLevelBar(categories.isolation, 170, 205, "Isolation");
  drawLevelBar(categories.pressure, 170, 265, "Pressure");

  // Display the sleep statistic at the bottom
  textSize(20);
  textAlign(CENTER, CENTER);
  text(sleepStat.percentage + "% of college students sleep for " + sleepStat.hours + " hours", width / 2, height - 120);

  button.show(); // Show the continue button
}

let filledColors = []; // Array to store filled colors for each screen

function drawLevelBar(level, x, y, label) {
  // Draw a bar representing the level (out of 100)
  fill(200); // Empty bar color
  rect(x, y, 200, 30); // Empty bar

  // Set the filled color to be more green based on the level decrease from the previous screen
  if (currentScreen === 0) {
    filledColors[currentScreen] = color(255, 0, 0); // Start with red color for the first screen
  } else {
    let prevLevel = categoryScreens[currentScreen - 1][label.toLowerCase()];
    let change = prevLevel - level; // Find how much the level has decreased
    let percentageChange = map(change, 0, 20, 0, 1); // Scale change to 0-1 for color adjustment
    percentageChange = constrain(percentageChange, 0, 1); // Constrain to the range [0, 1]
    percentageChange *= 0.7;

    // Use lerpColor to smoothly transition from red to green
    let startColor = filledColors[currentScreen - 1]; // previous color
    let endColor = color(0, 255, 0); // Green
    filledColors[currentScreen] = lerpColor(startColor, endColor, percentageChange); // Interpolate color
  }

  fill(filledColors[currentScreen]); // Apply the stored filled color
  rect(x, y, level * 2, 30); // Filled portion based on the level

  // Display the numerical value next to the bar
  fill(255);
  textSize(20);
  textAlign(LEFT, CENTER);
  text((level / 20).toFixed(2), x + 210, y + 15); // Convert back to the 5-point scale

  // Show the change from the previous screen
  if (currentScreen > 0) {
    let prevLevel = categoryScreens[currentScreen - 1][label.toLowerCase()];
    let change = level - prevLevel;
    let changeText = (change / 20).toFixed(2); // Convert back to 5-point scale
    let sign = change >= 0 ? "+" : ""; // Add "+" for positive changes

    text("(" + sign + changeText + ")", x + 250, y + 15); // Display the change
  } else {
    text("(N/A)", x + 250, y + 15); // No change for the first screen
  }
}




function continueClock() {
  // Move to the next screen or show end screen if it's the last one
  if (currentScreen < categoryScreens.length - 1) {
    stopHrs += 3;  // Move the stop time 3 hours ahead
    clockStopped = false;
    button.hide(); // Hide the button again
    alarmSound.stop(); // Stop the alarm when the user continues
    hasPlayedAlarm = false;
    currentScreen++;
  } else {
    showEndScreen();
  }
}

function showEndScreen() {
  background(0); // Set background to black
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("End of Cycle", width / 2, height / 2 - 60);
  textSize(20);
  text("Thank you for completing the process!", width / 2, height / 2);

  restartButton.show(); // Show the restart button
}

function restartClock() {
  // Reset all variables to restart the clock
  sec = 0;
  minu = 0;
  hrs = 0;
  stopHrs = 2; // Reset to the initial stop time
  clockStopped = false;
  currentScreen = 0; // Reset to the first screen
  restartButton.hide(); // Hide the restart button
}

function playAlarm() {
  if (!alarmSound.isPlaying() && !hasPlayedAlarm) {
    alarmSound.play(); // Play the alarm sound
    hasPlayedAlarm = true; // Set flag to true to indicate that the alarm has played
  }
}

function formatting(num) {
  return num < 10 ? "0" + num : num;
}