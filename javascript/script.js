// DogApp object
const dogApp = {};

// Define variables
dogApp.apiKey = 'a9c9715ac699393acb4012b8e4f9a479';

dogApp.breedApiUrl = 'https://api.petfinder.com/breed.list';

dogApp.petFindUrl = 'https://api.petfinder.com/pet.find';

dogApp.proxyUrl = 'http://proxy.hackeryou.com'

dogApp.corsProxy = 'https://cors-anywhere.herokuapp.com/'

dogApp.getBreed = function() {
    // STEP ONE: Initial call to the Pet Finder API to get a list of dog breeds
    $.ajax({
        url: dogApp.corsProxy + dogApp.breedApiUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            key: dogApp.apiKey,
            format: 'json',
            animal: 'dog',
        }
    })
    // Get all dog breeds listed on the Pet Finder API
    .then(function(response) {
        const breeds = response.petfinder.breeds.breed;

        // Populate the breed selection drop down menu with all breeds listed in the Pet Finder API
        breeds.forEach(element => {
            $('#breed').append(`<option value="${element.$t}">${element.$t}</option>`);
        });      
    });
}

// STEP 2: On submit, get user's data from a quiz (form) through values (.val). 

// Empty object, where we'll store all of the user's answers
dogApp.userAnswers = {}

// Set the event listener for our form
dogApp.userPreferences = function() {
     //Prevent event default on submit
    $('#animal-finder').submit(function(event) {
        event.preventDefault();
        //Empty the options selected array each time the form is submitted so that the new results can be added
        dogApp.optionsSelectedArray = [];
        
        // Get the User's Values:
        // City
        dogApp.userAnswers.dogCityAnswer = $("#city").val();
        // State/Province
        dogApp.userAnswers.dogProvinceStateAnswer = $("#province-state").val();
        
        // Dog Location
        dogApp.userAnswers.dogLocationAnswer = dogApp.userAnswers.dogCityAnswer + "," + dogApp.userAnswers.dogProvinceStateAnswer;
        
        // Breed
        dogApp.userAnswers.breedAnswer = $("#breed").find(":selected").val();
        
        // Age
        dogApp.userAnswers.ageAnswer = $("#age").find(":selected").val();
        
        // Size
        dogApp.userAnswers.sizeAnswer = $("#size").find(":selected").val();
        
        // Gender
        dogApp.userAnswers.genderAnswer = $("#gender").find(":selected").val();;
        
        // House Trained
        dogApp.userAnswers.houseTrainedAnswer = $("#housetrained:checked").val();
        if (dogApp.userAnswers.houseTrainedAnswer === "housetrained") {
            dogApp.optionsSelectedArray.push(dogApp.userAnswers.houseTrainedAnswer)
        };
        
        // Has Shots
        dogApp.userAnswers.shotsAnswer = $("#hasShots:checked").val();
        if (dogApp.userAnswers.shotsAnswer === "hasShots"){
            dogApp.optionsSelectedArray.push(dogApp.userAnswers.shotsAnswer)
        };
        
        // Fixed
        dogApp.userAnswers.fixedAnswer = $("#altered:checked").val();
        if(dogApp.userAnswers.fixedAnswer === "altered"){
            dogApp.optionsSelectedArray.push(dogApp.userAnswers.fixedAnswer)
        }
        

        //STEP 3: We'll submit the key value pairs from the user's answers to our Petfinder API call 

        // Second Ajax call -- return dogs that align with user's answers
        $.ajax ({
            url: dogApp.corsProxy + dogApp.petFindUrl,
            method: 'GET',
            dataType: 'json',
            data: {
                key: dogApp.apiKey,
                format: 'json',
                animal: 'dog',
                location: dogApp.userAnswers.dogLocationAnswer,
                breed: dogApp.userAnswers.breedAnswer,
                age: dogApp.userAnswers.ageAnswer,
                size: dogApp.userAnswers.sizeAnswer,
                sex: dogApp.userAnswers.genderAnswer,
            }

        // If the user hasn't entered a city and/or province/state with North America run a Sweet Alert
        }).then(function(data){
            if (data.petfinder.pets === undefined) {
                swal("Please make sure you've entered a City and Province/State in North America.");
                return
            }
            //Take the data we get back
            dogApp.filterOptions(data);
            // Empty out container before appending new results (displayDogs)
            $("#grid-container").empty();
            //RUN STEP 4: Run displayDogs to append the available dogs that meet the user's requirements onto the page
            dogApp.displayDogs();
        })
    })
}

// STEP 3 CONTINUED: Filtering for additional user requirements:

// Array for three optional selections -- House Trained, Has Shots and Altered
// Creating the optionsSelectedArray that will be populated when the user selects their filter options
dogApp.optionsSelectedArray = []

// Function to filter through the returned array to return dogs with the user's three optional selections -- (A) House Trained, B) Has shots, C) Fixed
dogApp.filterOptions = function(data) {
    // The initial pets returned, before filtering for the three optional selections
    let petArray = data.petfinder.pets.pet;
    //If no dogs meeting the user's requirements are returned, run a Sweet Alert
    if (petArray === undefined) {
        swal("Sorry, no dogs match your requirements.");
        return;
    }
    //If the returns are not an array, turn it into one (this only happens when there is one item returned)
    if (Array.isArray(petArray) === false ) {
        petArray = [petArray];
    }
    // Filter through the initially returned array for dogs that match up with our user's chosen three optional selections -- (A) House Trained, B) Has shots, C) Fixed
    dogApp.optionsFilteredArray = petArray;
    dogApp.optionsSelectedArray.forEach(element => {
        const filterValue = element;
        // The options in the data returned by the API are stored as an array of objects that each have the same key ($t). The first filter creates an array of just the options returned for each element that can be further filtered to return just the options the user has selected
        dogApp.optionsFilteredArray = dogApp.optionsFilteredArray.filter(element => {
            if (element.options.option === undefined) return
            let optionsArray = element.options.option;
            if (Array.isArray(optionsArray) === false) {
                optionsArray = [optionsArray];
            }
            const housetrained = optionsArray.filter(element => {
                return element.$t === filterValue;
            })
            return housetrained.length > 0;
        })
    });
}

// STEP 4: Append the Dogs to the Results section
dogApp.displayDogs = function(){
    dogApp.optionsFilteredArray.forEach(function(dog){ 
        if (dog.media.photos === undefined) return; 
       const image = $("<img>").attr("src", dog.media.photos.photo[2].$t);
       const name = $("<h3>").text(dog.name.$t);
       const location = $("<p>").text(`${dog.contact.city.$t}, ${dog.contact.state.$t}`);
        const button = $("<a>").addClass("button").attr("href", `https://www.petfinder.com/petdetail/${dog.id.$t}`).text(`Meet your Mutt Match`);
        const contentFlex = $('<div>').addClass('content-flex-container').append(name,location,button)
        const imageDiv = $('<div>').addClass('image-container').append(image);
        const gridItem = $('<div>').addClass('grid-item').append(imageDiv, contentFlex)
       $("#grid-container").append(gridItem);
    })
}

// Defining our init function
dogApp.init = function() {
    dogApp.getBreed();
    dogApp.userPreferences();
}

// Run the init
$(function() {
    dogApp.init();
});