async function displayPokemon(pokemonData, firstIndex, lastIndex) {
    const slicedPokemons = pokemonData.slice(firstIndex, lastIndex);

    // Step 5.7 Pagination - Display total number of Pokémons and the number of Pokémon being displayed
    if (lastIndex > pokemonData.length) {
        lastIndex = pokemonData.length;
    } if (pokemonData.length < 1) {
        firstIndex = -1;
    }

    $('#head').empty();
    $('#head').append(`
        <div class="container text-center">
            <h1>Showing ${firstIndex + 1}-${lastIndex} of ${pokemonData.length} pokemons</h1>
        </div>
    `)

    // empty main
    $('#main').empty();
    for (let i = 0; i < slicedPokemons.length; i++) {
        const pokemon = slicedPokemons[i];
        const pokemonResult = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        // console.log(pokemonResult.data);

        // Step 4.2 Pokemons Grid - Create a pokemon card for each pokemon
        // Step 4.3 Pokemons Grid - Create a modal to display the pokemon's details
        // Step 4.4 Pokemons Grid - Display the pokemon's details in the modal
        $('#main').append(`
            <div class="card text-center" style="width: 18rem;">
                <img class="card-img-top" 
                src=
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonResult.data.id}.png" alt="Pokemon official artwork">
                <div class="card-body">
                    <h5 class="card-title">${pokemon.name.toUpperCase()}</h5>

                <!-- Button trigger modal -->
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal${pokemon.name}">
                    Show more
                </button>

                <!-- Modal -->
                <div class="modal fade" id="modal${pokemon.name}" tabindex="-1 aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <div class="modal-title text-start">
                                    <h1>${pokemon.name.toUpperCase()}</h1>
                                    <h4>ID: ${pokemonResult.data.id}</h4>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body text-start">
                                <img class="card-img-top"
                                src=
                                "${pokemonResult.data.sprites.other.home.front_default}" alt="Pokemon 3d artwork">
                                <h2>Abilities</h2>
                                <ul>
                                ${pokemonResult.data.abilities.map(slot =>
            `<li>${slot.ability.name}</li>`).join('')
            }
                                </ul>                                
                                <h2>Stats</h2>
                                <ul>
                                ${pokemonResult.data.stats.map(slot =>
                `<li>${slot.stat.name}: ${slot.base_stat}</li>`).join('')
            }
                                </ul>
                                <h2>Type(s):</h2>
                                <ul>
                                ${pokemonResult.data.types.map(slot =>
                `<li>${slot.type.name}</li>`).join('')
            }
                                </ul>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    };
}

function displayButton(firstButtonIndex, lastButtonIndex, activeButtonIndex, pokemonData, PAGE_SIZE) {
    // Step 5.2 Pagination - Get The All the 81 - pages buttons
    const lastPageNumber = Math.ceil(pokemonData.length / PAGE_SIZE);
    if (lastButtonIndex > lastPageNumber) {
        lastButtonIndex = lastPageNumber
    }

    // empty the buttons
    $('#paginationControls').empty();

    // Step 5.5.1 Pagination - Display the previous button
    $('#paginationControls').append(`
    <button type="button" class="btn btn-primary" id="previous"><<</button>
    `)
    // Display the desired number of buttons
    for (let i = firstButtonIndex; i < lastButtonIndex; i++) {
        $('#paginationControls').append(`
        <button type="button" class="btn btn-primary" id="${i + 1}">${i + 1}</button>
        `)
        // Step 5.6.1 Pagination - Highlight the current page's button
        if (i + 1 === activeButtonIndex) {
            $(`#${i + 1}`).addClass('active')
        }
    }

    // Step 5.5.2 Pagination - Display the next button
    $('#paginationControls').append(`
            <button type="button" class="btn btn-primary" id="next">>></button>
    `)

    // Step 5.6.2 Pagination - Hide the next and previous buttons when there is no next or previous page
    if (activeButtonIndex === 1 || pokemonData.length < 1) {
        $('#previous').hide();
    } if (activeButtonIndex === lastPageNumber || pokemonData.length < 1) {
        $('#next').hide();
    }
}

async function displayFilters() {
    // Step 6.1 Filtration - Fetch the Pokémon types from the API and display them in a checkbox group
    const typeResult = await axios.get(`https://pokeapi.co/api/v2/type`);
    $('#filterNav').append(`
    ${typeResult.data.results.map(slot =>
        `<input type="checkbox" id="${slot.name}">${slot.name}</input>`).join('<br>')
        }
    `)

}

const setup = async () => {
    // Step 4.1 Pokemons Grid - Fetch all pokemons names from the API
    const result = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=810")
    const pokemons = result.data.results

    // Step 5.1 Pagination - Get The first page of pokemon cards
    const PAGE_SIZE = 10;
    displayPokemon(pokemons, 0, PAGE_SIZE);

    // Step 5.4 Pagination - Display only at max 5 pages at a time
    BUTTONS_PER_PAGE = 5;
    let startButtonIndex = 0;
    let activeButtonNumber = 1;

    // Display the initial 5 buttons
    displayButton(startButtonIndex, BUTTONS_PER_PAGE, activeButtonNumber, pokemons, PAGE_SIZE);

    // Display the filters
    displayFilters();

    let typeList = []
    let filteredPokemons = pokemons
    // Step 6.2 Filtration - Add event listener to the checkboxes
    $('#filterNav').on('click', "input", async (event) => {
        filteredPokemons = []
        if (event.target.checked) {
            typeList.push(event.target.id)
        } else {
            typeList.pop(event.target.id)
        }
        console.log(typeList)

        // Step 6.3 Filtration - Filter the Pokémon cards based on the selected types
        if (typeList == []) {
            filteredPokemons = pokemons
        } else {
            for (let i = 0; i < pokemons.length; i++) {
                const pokemon = pokemons[i];
                const pokemonDetails = await axios.get(pokemon.url);
                let pokemonTypes = []
                pokemonDetails.data.types.map(slot => pokemonTypes.push(slot.type.name))
                if (typeList.every(type => pokemonTypes.includes(type))) {
                    filteredPokemons.push(pokemon)
                }
            }
        }

        // display the first page of the filtered pokemons
        displayPokemon(filteredPokemons, 0, PAGE_SIZE);

        activeButtonNumber = 1;
        displayButton(startButtonIndex, BUTTONS_PER_PAGE, activeButtonNumber, filteredPokemons, PAGE_SIZE);
    })

    // add event listener to the buttons
    $('#paginationControls').on('click', ".btn", async (event) => {
        let endButtonIndex = startButtonIndex + BUTTONS_PER_PAGE;
        if (event.target.id === 'next') {
            if (activeButtonNumber === endButtonIndex) {
                startButtonIndex++;
                endButtonIndex++;
                activeButtonNumber++;
            } else {
                activeButtonNumber++;
            }
        } else if (event.target.id === 'previous') {
            if (activeButtonNumber === startButtonIndex + 1) {
                startButtonIndex--;
                endButtonIndex--;
                activeButtonNumber--;
            } else {
                activeButtonNumber--;
            }
        } else {
            console.log(event.target.innerText)
            activeButtonNumber = parseInt(event.target.innerText);
        }

        displayButton(startButtonIndex, endButtonIndex, activeButtonNumber, filteredPokemons, PAGE_SIZE);

        // Step 5.3 Pagination - Add pagination logic to THE 81 buttons
        const startIndex = (activeButtonNumber - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;

        displayPokemon(filteredPokemons, startIndex, endIndex);
    })

}

$(document).ready(setup);