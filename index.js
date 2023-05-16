const setup = async () => {
    console.log("Hello World")
    const result = await axios.get("http://pokeapi.co/api/v2/pokemon?limit=810")
    const pokemons = result.data.results
    console.log(pokemons)

};

$(document).ready(setup);