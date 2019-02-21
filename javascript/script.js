// Step 1: Get user's data from a quiz (form) through values (.val). 

//Step 2: We'll submit the parameters from the user's answers to our Petfinder API call 

// Step 3: We'll display the results based on user selection. Specifically (A) Image (B) Name (C) Gender (D) Age (E)Location, and a button to learn more about the dog on Petfinder 

// Quiz Questions:
// 1) Location
// 2) Drop down menu for age (ie. baby, young, adult, senior) that aligns with AGE filters on Pet Finder
// 3) Size (ie. small, medium, large) that aligns with SIZE filters on Pet Finder
// 4) Gender (ie. male, female, don't care) that aligns with GENDER filters on Pet Finder
// 5) Hypoallergenic (yes, no, don't care). We'll filter through the breeds.list that Pet Finder returns (terrier = hypoallergenic, all others = not) -- WE'LL COME BACK TO THAT ...
// 6) House trained (yes, no, don't care).
// 7) Has shots (yes, no, don't care)
// 8) Spayed/Neutered (yes, no, don't care.)
// 9) Do you have a desired breed? Aiming for dropdown menu for breed or button option for don't care

const dogApp = {};

// Define variables
dogApp.apiKey = 'a9c9715ac699393acb4012b8e4f9a479';

dogApp.breedApiUrl = 'https://api.petfinder.com/breed.list';

dogApp.petFindUrl = 'https://api.petfinder.com/pet.find';

dogApp.proxyUrl = 'http://proxy.hackeryou.com'

dogApp.corsProxy = 'https://cors-anywhere.herokuapp.com/'



dogApp.getBreed = function() {
    // Initial call to the Pet Finder API to get a list of dog breeds
    // $.ajax({
    //     url: dogApp.proxyUrl,
    //     method: 'GET',
    //     dataType: 'json',
    //     data: {
    //         reqUrl: dogApp.breedApiUrl,
    //         params: {
    //             key: dogApp.apiKey,
    //             format: 'json',
    //             animal: 'dog',
    //         },
    //         proxyHeaders: {
    //             'Some-Header': 'goes here'
    //         },
    //         xmlToJSON: false,
    //         useCache: false            
    //     }
    // })
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

// Empty object, where we'll store the user's answers
dogApp.userAnswers = {}
console.log(dogApp.userAnswers);

// Set the event listener for our form
dogApp.userPreferences = function() {
    $('#animal-finder').submit(function(event) {
        event.preventDefault();
        dogApp.optionsSelectedArray = [];

        // Get the User's Values
        // City
        dogApp.userAnswers.dogCityAnswer = $("#city").val();
        console.log(dogApp.userAnswers.dogCityAnswer);

        // State/Province
        dogApp.userAnswers.dogProvinceStateAnswer = $("#province-state").val();
        console.log(dogApp.userAnswers.dogProvinceStateAnswer);

        // Dog Location
        dogApp.userAnswers.dogLocationAnswer = dogApp.userAnswers.dogCityAnswer + "," + dogApp.userAnswers.dogProvinceStateAnswer;
        console.log(dogApp.userAnswers.dogLocationAnswer);

        // Breed
        dogApp.userAnswers.breedAnswer = $("#breed").find(":selected").val();
        console.log(dogApp.userAnswers.breedAnswer);

        // Age
        dogApp.userAnswers.ageAnswer = $("#age").find(":selected").val();
        console.log(dogApp.userAnswers.ageAnswer);

        // Size
        dogApp.userAnswers.sizeAnswer = $("#size").find(":selected").val();
        console.log(dogApp.userAnswers.sizeAnswer);

        // Gender
        dogApp.userAnswers.genderAnswer = $("#gender").find(":selected").val();;
        console.log(dogApp.userAnswers.genderAnswer);

        // House Trained
        dogApp.userAnswers.houseTrainedAnswer = $("#housetrained:checked").val();
        if (dogApp.userAnswers.houseTrainedAnswer === "housetrained") {
            dogApp.optionsSelectedArray.push(dogApp.userAnswers.houseTrainedAnswer)
        };
        console.log(dogApp.userAnswers.houseTrainedAnswer);

        // Has Shots
        dogApp.userAnswers.shotsAnswer = $("#hasShots:checked").val();
        if (dogApp.userAnswers.shotsAnswer === "hasShots"){
            dogApp.optionsSelectedArray.push(dogApp.userAnswers.shotsAnswer)
        };
        console.log(dogApp.userAnswers.shotsAnswer);

        // Fixed
        dogApp.userAnswers.fixedAnswer = $("#altered:checked").val();
        if(dogApp.userAnswers.fixedAnswer === "altered"){
            dogApp.optionsSelectedArray.push(dogApp.userAnswers.fixedAnswer)
        }
        console.log(dogApp.userAnswers.fixedAnswer);

        

        // Second Ajax call -- return dogs that align with user's choices

        // $.ajax({
        //     url: dogApp.proxyUrl,
        //     method: 'GET',
        //     dataType: 'json',
        //     data: {
        //         reqUrl: dogApp.petFindUrl,
        //         params: {
        //             key: dogApp.apiKey,
        //             format: 'json',
        //             animal: 'dog',
        //             location: dogLocationAnswer,
        //             breed: breedAnswer,
        //             age: ageAnswer,
        //             size: sizeAnswer,
        //             sex: genderAnswer,
        //         },
        //         xmlToJSON: false,
        //         useCache: false
        //     }
    
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
        // Filter through the returned array to return dogs with the user's three optional selections
        }).then(function(data){
            dogApp.filterOptions(data);
            
        })
        if (dogApp.optionsFilteredArray <= 1){
            console.log("Sorry! No dogs!")
        }
    })
    
}

// Array for three optional selections -- House Trained, Has Shots and Altered
dogApp.optionsSelectedArray = []
console.log(dogApp.optionsSelectedArray);

// Function to filter through the returned array to return dogs with the user's three optional selections
dogApp.filterOptions = function(data) {
    const petArray = data.petfinder.pets.pet;
    dogApp.optionsFilteredArray = petArray;
    dogApp.optionsSelectedArray.forEach(element => {
        const filterValue = element;
        dogApp.optionsFilteredArray = dogApp.optionsFilteredArray.filter(element => {
            if (element.options.option === undefined) return
            let optionsArray = element.options.option;
            if (Array.isArray(optionsArray) === false) {
                optionsArray = [optionsArray];
            }
            // console.log(optionsArray);
            const housetrained = optionsArray.filter(element => {
                // console.log(element.$t);
                return element.$t === filterValue;
            })
            return housetrained.length > 0;
        })
        
    });
}

console.log(dogApp.optionsFilteredArray);
// Defining our init function
dogApp.init = function() {
    dogApp.getBreed();
    dogApp.userPreferences();
}

// Run the init
$(function() {
    dogApp.init();
});