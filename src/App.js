import "./App.css";

import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

/*
   make a text version of the pokemoncard
   when you click a pokemon card, open a new page with full details
*/

function App() {
  //const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [state, setState] = useState({
    deck: [], // available cards to render (unrendered cards)
    hand: [], // rendered cards
    all: [], // all initial cards
    numberOfCards: 1, // number of cards that will be pushed from deck to hand
  });

  // on page load, make a fetch call to load in the pokemon data
  useEffect(() => {
    console.log("use effect ran");

    fetch("https://api.pokemontcg.io/v2/cards?q=types:dragon&pageSize=20")
      .then((response) => response.json())
      .then(({ data, count }) => {
        const nextState = {
          ...state,
          hand: data.slice(0, 5),
          deck: data.slice(5),
          all: data,
        };
        setState(nextState);
      });

    // do another fetch call
  }, []);

  //
  const handleRandomClick = () => {
    const nextState = { ...state };

    // pull a random card from the deck and put in our hand
    const drawRandomCard = () => {
      // generate a random index within the number of cards in deck
      const randomIndex = Math.floor(Math.random() * nextState.deck.length);

      // find the card from the deck array in the randomIndex
      const randomCard = nextState.deck.splice(randomIndex, 1)[0];
      // const randomCard = nextState.deck[randomIndex];
      nextState.hand.push(randomCard);
    };

    let iterations = parseInt(nextState.numberOfCards, 10);
    while (iterations--) {
      drawRandomCard();
    }

    setState(nextState);
  };

  // reset our state to our initial values
  const handleResetClick = () => {
    const nextState = { ...state };
    nextState.hand = nextState.all.slice(0, 5);
    nextState.deck = nextState.all.slice(5);
    nextState.numberOfCards = 1;
    setState(nextState);
  };

  const handleInputChange = (e) => {
    setState({ ...state, numberOfCards: e.target.value });
  };

  const handleCardClick = (e) => {
    const popupDiv = e.currentTarget.querySelector("div");
    popupDiv.classList.toggle("hidden");
  };

  const isNewCardButtonDisabled =
    !state.deck.length || state.deck.length < state.numberOfCards;

  return (
    <>
      <h1
        style={{ color: "gold", textAlign: "center", fontFamily: "monospace" }}
      >
        Click card for details!
      </h1>
      <div className="App">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {state.hand.map((card) => (
            <div
              style={{ position: "relative" }}
              key={card.id}
              onClick={handleCardClick}
            >
              <img src={card.images.small} className="fadeIn2" alt="" />
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  background: "rgba(0,0,0,0.8)",
                  borderRadius: "10px",
                  color: "white",
                  padding: "10px",
                }}
                className="hidden fadeIn"
              >
                <strong>Artist</strong> <br /> {card.artist}
                <br />
                <strong>Attacks</strong>
                <br />
                {card.attacks.map((attack, index) => (
                  <div key={`${card.id}-${index}-attack`}>
                    {attack.name}
                    {attack.damage
                      ? `(${attack.damage} damage)`
                      : "(no damage)"}
                  </div>
                ))}
                {card.evolvesTo &&
                  card.evolvesTo.map((evolution, index) => (
                    <div key={`${card.id}-${index}-evolution`}>
                      <strong>Evolves to</strong> <br />
                      {evolution}
                    </div>
                  ))}
                <strong>HP</strong>
                <br />
                {card.hp}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "5rem",
          bottom: "0",
          position: "relative",
        }}
      >
        <Button onClick={handleRandomClick} disabled={isNewCardButtonDisabled}>
          NEW CARD!
        </Button>
        <Button onClick={handleResetClick}>RESET</Button>
        <input
          type="number"
          min={1}
          value={state.numberOfCards}
          onChange={handleInputChange}
        ></input>
        <br />
      </div>
      <h3 style={{ color: "white", textAlign: "center" }}>
        Cards left:{state.deck.length}
      </h3>
      <p style={{ color: "red", textAlign: "center" }}>
        {isNewCardButtonDisabled && "NO CARDS LEFT!"}
      </p>
    </>
  );
}

export default App;
