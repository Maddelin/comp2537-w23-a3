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

const setup = async () => {
    // Step 4.1 Pokemons Grid - Fetch all pokemons names from the API
    const result = await axios.get("http://pokeapi.co/api/v2/pokemon?limit=810")
    const pokemons = result.data.results

    // Step 5.1 Pagination - Get The first page of pokemon cards
    const PAGE_SIZE = 10;
    displayPokemon(pokemons, 0, PAGE_SIZE);
};

$(document).ready(setup);