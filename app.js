// $('body').append(`<p>Working</p>`);

//Credentials for the API
let myID = "X1I1P1ZSAXMV3RT2D0UIDMSMKIDTZBDXGNTESGP25ZPIA0SR";
let secID = "I5VE3LIRGLCW2SNUI0PWXA2IPEJ5U4NMBGMYGD20C5TBTGZL";
let ver = "20190601";

//Placeholder for what will be the search inputs and can also use for testing
let place;
let interest;
let results = [];

//Hiding so interests only shows up after a location is submitted
$('.hideMe').hide(); 

$('#placeSubmit').click(function(e) {
    $('.interests').show();
    e.preventDefault();
    
    //clearing out prior search results
    results = [];
    $('#userResults').empty('');            

    //setting new search parameters for API pull
    place = $('#placeEntry').val();
    interest = $('#interestEntry').val();
    console.log(`${place} and ${interest}`);
    
    //API pull OVERALL (includes a nested pull)
    //First API pull for Reccomendations
    const searchResults = {
        url: `https://api.foursquare.com/v2/venues/explore?client_id=${myID}&client_secret=${secID}&v=${ver}&near=${place}&query=${interest}`,
        success: (data) => {
            console.log(data);

            //puts search results into an array
            for(let i = 0; i < data.response.groups[0].items.length; i++) {
                results.push({ name: "", id: "", type:"", address:"", rating:"", photo:""});
                results[i].name = `${data.response.groups[0].items[i].venue.name}`
                results[i].id = `${data.response.groups[0].items[i].venue.id}`
                results[i].type = `${data.response.groups[0].items[i].venue.categories[0].name}` 
                results[i].address = `${data.response.groups[0].items[i].venue.location.formattedAddress[0]}` 
            }
            console.log(results);

            //Loop to go through the top 10 recommendations from the first pull
            for(let i = 0; i < 5; i++) {
                //Adding the details from the first pull to a card 
                $('#userResults').append(
                    `<div id="${i}resultItem" class = resultItem">
                        <div class="pSection">
                            <p class = "rName">${results[i].name}</p>
                            <p class = "rType" >${results[i].type}</p>
                            <p class = "rAddress">${results[i].address}</p>
                        </div>
                        <button value = "0" class="saveItem">+</button>
                    </div>`
                )  

                //Assigning a variable for the venue ID (from the first API call) to use in the second API call.
                let vid = results[i].id;
                //Second API pull to get an image for each reccomendation from first pull
                const venueResults = {
                    url: `https://api.foursquare.com/v2/venues/${vid}/photos?client_id=${myID}&client_secret=${secID}&v=${ver}`,
                    success: (venueData) => {
                        console.log(venueData);
                        results[i].photo = `${venueData.response.photos.items[1].prefix}220x220${venueData.response.photos.items[1].suffix}`
                        console.log(results[i].photo);

                        //Adding image from pull as the background of each card.
                        $(`#${i}resultItem`).css("background-image", `url('${results[i].photo}')`);

                        //Add items to save list when Save button clicked
                        $('.saveItem').click(function(e) {
                            console.log(this.value);
                            //Need to set as an if statement to prevent duplication issues with the loop through top 10
                            if(this.value === "0") {
                                this.value = 1;
                                let addItem = $(this).parent().children('.pSection');
                                //cloning the info so it copys into the aside, and doesn't move it from the original card
                                $(addItem).clone().appendTo('aside');                       //Info found here: https://codepen.io/susanwinters/pen/gadgGY               
                                
                                //adding class to divs in the aside to reset formatting
                                $('aside div').addClass("saveListVersion");
                                $('aside div').removeClass("pSection");

                                //disabling the button so it doesn't run in loop or add multiple times
                                $(this).attr("disabled", true);                             //Info found here: https://www.mkyong.com/jquery/how-to-disable-submit-button-after-clicked-with-jquery/
                            }
                        }) 
                    },
                    error: ()=> {
                        console.log('bad request');
                    }
                }
                $.ajax(venueResults);    
            }    
            console.log(results);
        },
        error: ()=> {
            console.log('bad request');
        }
    }
    $.ajax(searchResults);
});
console.log(results);

$('aside').append(`<h6>Saved List</h6>`);  
  