async function displayPokemon(pokemonData, firstIndex, lastIndex) {
    const slicedPokemons = pokemonData.slice(firstIndex, lastIndex);

    // empty main
    $('#main').empty();
    for (let i = 0; i < slicedPokemons.length; i++) {
        const pokemon = slicedPokemons[i];
        const pokemonResult = await axios.get(`http://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
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

    // Display the desired number of buttons
    for (let i = firstButtonIndex; i < lastButtonIndex; i++) {
        $('#paginationControls').append(`
        <button type="button" class="btn btn-primary" id="${i + 1}">${i + 1}</button>
        `)
    }

}

const setup = async () => {
    // Step 4.1 Pokemons Grid - Fetch all pokemons names from the API
    const result = await axios.get("http://pokeapi.co/api/v2/pokemon?limit=810")
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

        displayButton(startButtonIndex, endButtonIndex, activeButtonNumber, pokemons, PAGE_SIZE);

        // Step 5.3 Pagination - Add pagination logic to THE 81 buttons
        const startIndex = (activeButtonNumber - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;

        displayPokemon(pokemons, startIndex, endIndex);
    });

};

$(document).ready(setup);