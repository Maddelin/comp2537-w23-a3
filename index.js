async function displayPokemon(pokemonData, firstIndex, lastIndex) {
    const slicedPokemons = pokemonData.slice(firstIndex, lastIndex);

    // empty main
    $('#main').empty();
    for (let i = 0; i < slicedPokemons.length; i++) {
        const pokemon = slicedPokemons[i];
        const pokemonResult = await axios.get(`http://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        // console.log(pokemonResult.data);

        // Step 4.2 Pokemons Grid - Create a pokemon card for each pokemon
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
        `)
    };
}

const setup = async () => {
    // Step 4.1 Pokemons Grid - Fetch all pokemons names from the API
    const result = await axios.get("http://pokeapi.co/api/v2/pokemon?limit=810")
    const pokemons = result.data.results

    displayPokemon(pokemons, 0, 10);
};

$(document).ready(setup);