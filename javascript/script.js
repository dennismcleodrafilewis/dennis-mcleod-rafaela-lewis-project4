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

// Set the event listener for our form
dogApp.userPreferences = function() {
    $('#animal-finder').submit(function(event) {
        event.preventDefault();
        // console.log('I was changed!');
        // Get the User's Values
        // City
        const dogCityAnswer = $("#city").val();
        console.log(dogCityAnswer);

        // State/Province
        const dogProvinceStateAnswer = $("#province-state").val();
        console.log(dogProvinceStateAnswer);

        // Dog Location
        const dogLocationAnswer = dogCityAnswer + "," + dogProvinceStateAnswer;
        console.log(dogLocationAnswer);

        // Breed
        const breedAnswer = $("#breed").find(":selected").val();
        console.log(breedAnswer);

        // Age
        const ageAnswer = $("#age").find(":selected").val();
        console.log(ageAnswer);

        // Size
        const sizeAnswer = $("#size").find(":selected").val();
        console.log(sizeAnswer);

        // Gender
        const genderAnswer = $("#gender").find(":selected").val();;
        console.log(genderAnswer);

        // House Trained
        const houseTrainedAnswer = $("input[id=house-trained]:checked").val();
        // console.log();

        // Has Shots
        const shotsdAnswer = $("input[id=has-shots]:checked").val();
        // console.log();

        // Fixed
        const fixeddAnswer = $("input[id=fixed]:checked").val();
    // console.log();

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
                location: dogLocationAnswer,
                breed: breedAnswer,
                age: ageAnswer,
                size: sizeAnswer,
                sex: genderAnswer,
            }
        }).then(function(data){
            // console.log(data);
            const petArray = data.petfinder.pets.pet;
            // console.log(petArray);
            const houseTrainedArray = petArray.filter(element => {
                if (element.options.option === undefined) return
                let optionsArray = element.options.option;
                if (Array.isArray(optionsArray) === false) {
                    optionsArray = [optionsArray];
                }
                // console.log(optionsArray);
                const housetrained = optionsArray.filter(element => {
                    // console.log(element.$t);
                    return element.$t === 'housetrained';
                })
                return housetrained.length > 0;
            })
            console.log(houseTrainedArray);

        })
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