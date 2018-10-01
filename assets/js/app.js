  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDKgrtyipYSKOQRi6GCFmhCrmxsMsjtU3E",
    authDomain: "time-train-c0f60.firebaseapp.com",
    databaseURL: "https://time-train-c0f60.firebaseio.com",
    projectId: "time-train-c0f60",
    storageBucket: "time-train-c0f60.appspot.com",
    messagingSenderId: "841974367111"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

$("#add-train").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var $trainName = $("#train-name").val().trim();
  var $destination = $("#destination").val().trim();
  var $trainTime = moment($("#train-time").val().trim(), "HH:mm").format("LT");
  var $frequency = $("#frequency").val().trim();

  console.log($trainName);
  console.log($destination);
  console.log($trainTime);
  console.log($frequency);
  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: $trainName,
    destination: $destination,
    trainTime: $trainTime,
    frequency: $frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.trainTime);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name").val("");
  $("#destination").val("");
  $("#train-time").val("");
  $("#frequency").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var $trainName = childSnapshot.val().name;
  var $destination = childSnapshot.val().destination;
  var $trainTime = childSnapshot.val().trainTime;
  var $frequency = childSnapshot.val().frequency;

  // Train Info
  console.log($trainName);
  console.log($destination);
  console.log($trainTime);
  console.log($frequency);

  // var startTime = moment.unix($trainTime).format("hh:mm");
  var firstTimeConverted = moment($trainTime, "HH:mm").subtract(1, "years");
  // var startTime = $trainTime.format()
  console.log(firstTimeConverted);

  // var currentTime = moment();
  // console.log(currentTime);

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  var tRemainder = diffTime % $frequency;
  var tMinutesTillTrain = $frequency - tRemainder;
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainFormatted = moment(nextTrain).format("LT");
  //Figure out how to translate this into minutes and hours so that 60 min gets placed as 1:00
  // var frequencyFormatted = moment($frequency, "minutes").format("hh:mm");

  console.log(diffTime);
  console.log(tMinutesTillTrain);
  console.log(nextTrain);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text($trainName),
    $("<td>").text($destination),
    $("<td>").text($frequency),
    $("<td>").text(nextTrainFormatted),
    $("<td>").text(tMinutesTillTrain),
  );

  // Append the new row to the table
  $("#table").append(newRow);
});