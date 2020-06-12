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


    //setting up the variables
    var trainName = "";
    var trainDestination = "";
    var trainFrequency = 0;
    var trainTime = "";
    var clickCounter = 1;

    //this sets up the on-click function
    $("#add-train").on("click", function(event){
        event.preventDefault();
        //this puts the values in
        if ($("#train-input").val(),$("#destination-input").val(),$("#time-input").val(), $("#frequency-input").val() === "") {
            alert("All input fields are mandatory. Enter data in all fields and click the submit button.");
        //gives an alert about the time
        } else if ($("#time-input").val() > 24) {
            alert("Pls enter the 24 hr time format and time cannot be greater than 24.");
        //adds values
        } else {
            trainName = $("#train-input").val().trim();
            trainDestination = $("#destination-input").val().trim();
            trainTime = $("#time-input").val().trim();
            trainFrequency = $("#frequency-input").val().trim(); 
            //console.logs the values/information
            console.log("Input Values");
            console.log(trainName);
            console.log(trainDestination);
            console.log(trainTime);
            console.log(trainFrequency);

            //the is an object that holds the train details
            var trainDetail = {
                name : trainName,
                destination : trainDestination,
                frequency : trainFrequency,
                time : trainTime
            };

            //this pushes the train values/information to firebase
            database.ref().push(trainDetail);
        
            //console.logs values/information
            console.log("Temporary object train values");
            console.log(trainDetail.name);
            console.log(trainDetail.destination);
            console.log(trainDetail.frequency);
            console.log(trainDetail.time);      
        
            //alerts that new train details have been added
            alert("A new train details has been added..");        

            //clears the fields when the button has been clicked
            $("#train-input").val("");
            $("#destination-input").val("");
            $("#time-input").val("");
            $("#frequency-input").val("");
        }
    });
        
    //adds the train to firebase and html
    database.ref().on("child_added", function(childSnapshot, prevChildKey){
        console.log("Hello2");
        console.log(childSnapshot.val());
       
        //variables to make it easier to type the code out
        var trainNumber = clickCounter++;
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainTime = childSnapshot.val().time;
        var trainFrequency = childSnapshot.val().frequency;

        //console.logging the variables
        console.log("database train value");
        console.log(trainName);
        console.log(trainDestination);
        console.log(trainTime);
        console.log(trainFrequency);

        //calculates the train's time
        var trainTimeConvert = moment(trainTime, "HH:mm").subtract(1, "years");
        console.log("trainTimeConvert", + trainTimeConvert);

        //calculates the train's time
        var currentTime = moment();

        //calculates the train's time
        var diffTime  = moment().diff(trainTimeConvert, "minutes");
        console.log(diffTime);

        var remainder = diffTime % trainFrequency;
        console.log("Remainder: " + remainder);

        //calculates the train's time
        var timeRemain = trainFrequency - remainder;
        console.log("Time Remain: " + timeRemain);

        //calculates the train's time
        var newTrainTime = moment().add(timeRemain, "minutes");
        var newTrainTimeFormat = moment(newTrainTime).format("HH:mm");

        //this variable holds the table and its information
        var row = $(("<tr class = 'tableRow'><td>" + trainNumber + "</td><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainTime + "</td><td>" + trainFrequency  + "</td><td>" + newTrainTimeFormat  + "</td><td>" + timeRemain + "</td></td>" + removeRow + "</td></tr>" ));
        $("<td>").html("<button>").on("click", function() {
            $(this).row.remove();
        })
        //puts row to the table
        $(".tableBody").append(row);
    });  
    //removes row
    function removeRow () {
        $(".row-" + $(this).attr("data-index")).empty();
        database.ref().child($(this).attr("data-key")).empty();
      };
      //edits the row with information to the html
      function editRow () {
        $(".row-" + $(this).attr("data-index")).children().eq(1).html("<textarea class='newName'></textarea>");
        $(".row-" + $(this).attr("data-index")).children().eq(2).html("<textarea class='newDestination'></textarea>");
        $(".row-" + $(this).attr("data-index")).children().eq(3).html("<textarea class='newFrequency' type='number'></textarea>");
        $(this).toggleClass("updateButton").toggleClass("submitButton");
      };
      //on click
      $(document).on("click", "Button", editRow);
      $(document).on("click", "Button", removeRow); 
});