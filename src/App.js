import React, { useState, useEffect } from "react";
import { getAllPokemon, getPokemon } from "./fetch/pokemon";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";
import Spinner from "./components/Spinner/Spinner";
import Footer from "./components/Footer/Footer";

import "./App.css";

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState("");
  const [prevUrl, setPrevUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const initialUrl = "https://pokeapi.co/api/v2/pokemon";

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(initialUrl);
      setNextUrl(response.next);
      setPrevUrl(response.previous);
      await loadingPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, []);

  const next = async () => {
    setLoading(true);
    let data = await getAllPokemon(nextUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };
  const prev = async () => {
    if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokemon(prevUrl);
    await loadingPokemon(data.results);
    setNextUrl(data.next);
    setPrevUrl(data.previous);
    setLoading(false);
  };

  const loadingPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Navbar />
          <div className="btn">
            <button className="prev" onClick={prev}>
              prev
            </button>
            <button className="next" onClick={next}>
              next
            </button>
          </div>
          <div className="grid-container">
            {pokemonData.map((pokemon, i) => {
              return <Card key={i} pokemon={pokemon} />;
            })}
          </div>
          <div className="btn">
            <button className="prev" onClick={prev}>
              prev
            </button>
            <button className="next" onClick={next}>
              next
            </button>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
