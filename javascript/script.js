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

dogApp.apiKey = 'a9c9715ac699393acb4012b8e4f9a479';

dogApp.breedApiUrl = 'https://api.petfinder.com/breed.list';

dogApp.petFindUrl = 'https://api.petfinder.com/pet.find';

dogApp.proxyUrl = 'http://proxy.hackeryou.com'

dogApp.getBreed = function() {
    $.ajax({
        url: dogApp.proxyUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            reqUrl: dogApp.breedApiUrl,
            params: {
                key: dogApp.apiKey,
                format: 'json',
                animal: 'dog',
            },
            xmlToJSON: false,
            useCache: false            
        }
    })
    .then(function(response) {
        const breeds = response.petfinder.breeds.breed;

        breeds.forEach(element => {
            $('#breed').append(`<option value="${element.$t}">${element.$t}</option>`);
        });
            
    });
}

dogApp.userPreferences = function() {
    $('#animal-finder').change(function() {
        console.log('I was changed!');
    })
}


dogApp.init = function() {
    dogApp.getBreed();
    dogApp.userPreferences();
}


$(function() {
    dogApp.init();
});