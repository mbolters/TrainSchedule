

//Firebase

  // Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBw1ek7iqxwHyE7I4rGDY7Q8WMkTZ9k9mY",
    authDomain: "trainschedule-af70d.firebaseapp.com",
    databaseURL: "https://trainschedule-af70d.firebaseio.com",
    projectId: "trainschedule-af70d",
    storageBucket: "trainschedule-af70d.appspot.com",
    messagingSenderId: "1089600547219",
    appId: "1:1089600547219:web:b9de649077ceb156aee066"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database().ref();
  // Moment.js

function update() {
  $('#currentTime').html(moment().format('MMMM DD, YYYY - H:mm:ss a')); //sets time and date to html

  $("#trainTable > tbody").empty();

  
  database.on("child_added", function(childSnapshot) {

    queryAndUpdateTable(childSnapshot);

  });


}

setInterval(update, 1000);//updates time by the second
  
//Firebase

  // Train button 
$("#addTrainBtn").on("click", function() {
  event.preventDefault();
  var trainName = $("#trainName").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = moment($("#firstTrain").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var frequency = $("#frequency").val().trim();

  // Train object
  let newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
  }

  // Uploads train data to the database
  database.push(newTrain);

  // Clear entry boxes
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");

  return false;
});

function queryAndUpdateTable(childSnapshot){
  let data = childSnapshot.val();
  let trainNames = data.name;
  let trainDestin = data.destination;
  let trainFrequency = data.frequency;
  let theFirstTrain = data.firstTrain;
  // Calculate the minutes until arrival using hardcore math
  // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time and find the modulus between the difference and the frequency  
  let tRemainder = moment().diff(moment.unix(theFirstTrain), "minutes") % trainFrequency;
  let tMinutes = trainFrequency - tRemainder;

  // To calculate the arrival time, add the tMinutes to the currrent time
  let tArrival = moment().add(tMinutes, "m").format("hh:mm A");

  // Add each train's data into the table 
  $("#trainTable > tbody").append("<tr><td>" + trainNames + "</td><td>" + trainDestin + "</td><td class='min'>" + trainFrequency + "</td><td class='min'>" + tArrival + "</td><td class='min'>" + tMinutes + "</td></tr>");

}


// Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.on("child_added", function(childSnapshot) {
  queryAndUpdateTable(childSnapshot);

});




