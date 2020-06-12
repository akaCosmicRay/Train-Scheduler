$(document).ready(function(){

    //this is setting up the firebase
    var firebaseConfig = {
        apiKey: "AIzaSyAPoAYkhiMabHpFpge1oYVntV83_aY_xn8",
        authDomain: "train-project-72cc9.firebaseio.com",
        databaseURL: "https://train-project-72cc9.firebaseio.com",
        projectId: "train-project-72cc9",
        storageBucket: "train-project-72cc9.appspot.com",
        messagingSenderId: "1399711981138",
        appId: "1:399711981138:web:4a7f81d7a3ba0391d8998b"
    };
    //initializes the firebase
    firebase.initializeApp(firebaseConfig);
    //sets firebase.database(); to a variable
    var database = firebase.database();
  
    var name = "";
    var destination = "";
    var time = "";
    var frequency = "";
    var trainNumber = 1;
    //clears the fields/values
    function clearFields(){
      $("#train-input").val("");
      $("#destination-input").val("");
      $("#time-input").val("");
      $("#frequency-input").val("");
    }
    //sends the trains information to the database
    function addTrainToDatabase(){
      name = $("#train-input").val(); 
      destination = $("#destination-input").val();
      time = $("#time-input").val();
      frequency = $("#frequency-input").val();
  
      if (name === "") {
        alert("Please add train name.");
      } else if(destination === ""){
        alert("Please add a destination.");
      } else if(time === ""){
        alert("Please add an arrival/departure time.");
      } else if(frequency === ""){
        alert("Please add a train frequency.");
      } else{
        var hTrain = {
          "name": name,
          "destination": destination,
          "time": time,
          "frequency": frequency
        };
        database.ref().push(hTrain);
        clearFields();
      }
    }
  
    function getNextTrainTime(firstTrainTimeString, frequency){
      //get the time right now
      var currentTime = moment();
      //change the first train time from a string to a moment time
      var firstTrainTime = moment(firstTrainTimeString, "HH:mm");
      //create variable for next train time and start it equal to the first train time
      var nextTrainTime = firstTrainTime;
      //Keep adding the next train time until we get a time in the future (we dont care about trains we missed already)
      while(nextTrainTime.isBefore(currentTime)){
        nextTrainTime = nextTrainTime.add(frequency,"minutes");
      }
      //format the next train time back to a string and return it as the answer
      return nextTrainTime.format("HH:mm");
  
    }
  
    function getTimeRemainingToNextTrain(nextTrainTimeString){
      //change the next train time from a string to a moment time
      var nextTrainTime = moment(nextTrainTimeString, "HH:mm");
      //ask moment.js to calculate how long from now the next train is and return it.
      return nextTrainTime.fromNow();
    }
    //adds the train to the list
    function addTrainToList(train){
      name = train.name;
      destination = train.destination;
      time = train.time;
      frequency = train.frequency;
      nextTrainTime=getNextTrainTime(time,frequency);
      timeToNextTrain=getTimeRemainingToNextTrain(nextTrainTime);
      //adds train to the table
      var row = $(("<tr class = 'tableRow'><td>" + trainNumber + "</td><td>" + name + "</td><td>" + destination + "</td><td>" + time + "</td><td>" + frequency  + "</td><td>" + nextTrainTime  + "</td><td>" + timeToNextTrain + "</td></td>" + "</td></tr>" ));
      trainNumber++;
      //puts row to the table
      $(".tableBody").append(row);
      
    }
    //keeps page from refreshing with the form
    $("#add-train").on("click", function(event){
      event.preventDefault();
      addTrainToDatabase();
    });
    //updates train scheduler and firebase
    database.ref().on("child_added", function(childSnapshot, prevChildKey){
    addTrainToList(childSnapshot.val());
    });
  
  });