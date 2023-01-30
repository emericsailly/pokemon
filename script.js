const typesColours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const typesImg = {
  normal: "images/types/NormalIC_SV.png",
  fire: "images/types/FireIC_SV.png",
  water: "images/types/WaterIC_SV.png",
  electric: "images/types/ElectricIC_SV.png",
  grass: "images/types/GrassIC_SV.png",
  ice: "images/types/IceIC_SV.png",
  fighting: "images/types/FightingIC_SV.png",
  poison: "images/types/PoisonIC_SV.png",
  ground: "images/types/GroundIC_SV.png",
  flying: "images/types/FlyingIC_SV.png",
  psychic: "images/types/PsychicIC_SV.png",
  bug: "images/types/BugIC_SV.png",
  rock: "images/types/RockIC_SV.png",
  ghost: "images/types/GhostIC_SV.png",
  dragon: "images/types/DragonIC_SV.png",
  dark: "images/types/DarkIC_SV.png",
  steel: "images/types/SteelIC_SV.png",
  fairy: "images/types/FairyIC_SV.png",
};

async function getData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function populatePokemonInfo() {
  let alreadySelected = document.querySelector(".selected");
  if (alreadySelected !== null) alreadySelected.classList.remove("selected");
  this.classList.add("selected");
  let url = "https://pokeapi.co/api/v2/pokemon/" + this.dataset.id;
  let pokemonData = await getData(url);
  let pokemonHeaderHTML = `<img id=main-img src=${
    pokemonData["sprites"]["other"]["official-artwork"]["front_default"]
  }  />
                          <h1>${pokemonData.name}</h1>
                          <!--<h2>フシギダネ</h2>-->
                          <h2>#${String(pokemonData.id).padStart(4, "0")}</h2>
                          <div class="types">`;
  for (let index = 0; index < pokemonData.types.length; index++) {
    let type = pokemonData.types[index].type.name;
    pokemonHeaderHTML += `<img src=${typesImg[type]}>`;
  }
  pokemonHeaderHTML += "</div>";
  document.querySelector("#pokemon-info header").innerHTML = pokemonHeaderHTML;
}

async function populateSearchBar() {
  let pokedex = await getData(
    "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0"
  );
  let searchList = document.createElement("div");
  searchList.classList.add("search-list");
  document.querySelector("#search-section").appendChild(searchList);
  while (pokedex.next !== null) {
    pokedex.results.forEach(async (pokemon) => {
      let pokemonData = await getData(pokemon.url);
      let listEl = document.createElement("div");
      listEl.classList.add("list-item");
      if (pokemonData.id < 10000) {
        listEl.dataset.name = pokemonData.name;
        listEl.dataset.id = pokemonData.id;
        let imgsrc = pokemonData.sprites.front_default;
        if (imgsrc === null) {
          imgsrc =
            pokemonData["sprites"]["other"]["official-artwork"][
              "front_default"
            ];
        }
        listEl.innerHTML = `<img src=${imgsrc}  />
                            <div class=infos>
                              <p class=number>#${String(
                                pokemonData.id
                              ).padStart(4, "0")}</p>
                              <h3 class=name>${pokemonData.name}</h3>
                            </div>`;
        listEl.addEventListener("click", populatePokemonInfo);
        searchList.appendChild(listEl);
      }
    });
    pokedex = await getData(pokedex.next);
  }
}

function sortSearchBar() {}

populateSearchBar();

document.querySelector("#search").addEventListener("click", searchPokemon);
document
  .querySelector(".search-bar input")
  .addEventListener("keydown", (event) => {
    if (event.keyCode === 13) searchPokemon();
  });

function searchPokemon() {
  let searchedPokemon = document.querySelector(".search-bar input").value;
  document.querySelectorAll(".search-list .list-item").forEach((item) => {
    if (!item.dataset.name.includes(searchedPokemon)) {
      item.style.display = "none";
    } else {
      item.style.display = "flex";
    }
  });
}

document
  .querySelector("#delete-search")
  .addEventListener("click", deleteSearchPokemon);

function deleteSearchPokemon() {
  document.querySelector(".search-bar input").value = "";
  document.querySelectorAll(".search-list .list-item").forEach((item) => {
    item.style.display = "flex";
  });
}
