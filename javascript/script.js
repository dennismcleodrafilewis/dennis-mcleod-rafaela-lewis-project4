// Step 1: Get user's data from a quiz (form) through values (.val). 

//Step 2: We'll submit the parameters from the user's answers to our Petfinder API call 

// Step 3: We'll display the results based on user selection. Specifically (A) Image (B) Name (C) Gender (D) Age (E)Location, and a button to learn more about the dog on Petfinder 

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

// Set the event listener for our form
dogApp.userPreferences = function() {
    $('#animal-finder').submit(function(event) {
        event.preventDefault();
        dogApp.optionsSelectedArray = [];
        
        // Get the User's Values
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
            if (data.petfinder.pets === undefined) {
                swal("Please make sure you've entered a City and Province/State in North America");
                return
            }
            dogApp.filterOptions(data);
            console.log(dogApp.optionsFilteredArray)
            // Empty out container after search has been run
            $("#grid-container").empty();
            dogApp.displayDogs();
        })
    })
    
}

// Array for three optional selections -- House Trained, Has Shots and Altered
dogApp.optionsSelectedArray = []

// Function to filter through the returned array to return dogs with the user's three optional selections
dogApp.filterOptions = function(data) {
    console.log(data);
    let petArray = data.petfinder.pets.pet;
    if (petArray === undefined) {
        swal("No dogs match your requirements");
        return;
    }
    if (Array.isArray(petArray) === false ) {
        petArray = [petArray];
    }
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

// Append the Dogs to the Results section

// OPTION 1 -- Can't get the anchor to work
dogApp.displayDogs = function(){
    dogApp.optionsFilteredArray.forEach(function(dog){
       const image = $("<img>").attr("src", dog.media.photos.photo[2].$t);
       const name = $("<h3>").text(dog.name.$t);
       const location = $("<p>").text(dog.contact.city.$t);
        // const nameLowerCase = name.toLowerCase()
        const button = $("<a>").addClass("button").attr("href", `https://www.petfinder.com/petdetail/${dog.id.$t}`).text(`Meet ${dog.name.$t}`);
       const allDogInfo = $("<div>").addClass("grid-item").append(image, name, location, button);
       $("#grid-container").append(allDogInfo);
    })
}

// OPTION 2
// dogApp.displayDogs = function () {
//     dogApp.optionsFilteredArray.forEach(function (dog) {
//         $("#grid-container").append(
//            `<div class="grid-item">
//             <img src="${dog.media.photos.photo[2].$t}">
//             <h3 class="dog-name">${dog.name.$t}</h3>
//             <p>${dog.contact.city.$t}, ${dog.contact.state.$t}</p>
//             <a class="button" href="https://www.petfinder.com/petdetail/${dog.id.$t}">Meet ${dog.name.$t}</a>
//             </div>`
//         )
//     })
// }

// Defining our init function
dogApp.init = function() {
    dogApp.getBreed();
    dogApp.userPreferences();
}

// Run the init
$(function() {
    dogApp.init();
});