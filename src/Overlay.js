import React, { useState, useEffect } from "react";
import { Texts } from "./SnowGlobeModel";

export default function Overlay({ inside, setInside, name }) {
  const [headerStyle, setHeaderStyle] = useState({});

  const hu = ["Rita", "Ani", "Natasa", "Anyu", "Laci", "Ibolya", "Magdi"];

  useEffect(() => {
    if (inside) {
      // Start fade out
      setHeaderStyle({
        opacity: 0,
        transition: "opacity 1s ease-in-out",
      });
      // Remove header from layout after transition
      setTimeout(() => setHeaderStyle({ display: "none" }), 1000);
    } else {
      // Make header visible but with opacity 0
      setHeaderStyle({
        display: "block",
        opacity: 0,
        transition: "opacity 0s", // No transition for immediate effect
      });
      // Start fade in after a brief moment
      setTimeout(
        () =>
          setHeaderStyle({
            display: "block",
            opacity: 1,
            transition: "opacity 1s ease-in-out",
          }),
        10
      ); // Small timeout to ensure transition takes effect
    }
  }, [inside]);

  return (
    <>
      <header style={headerStyle}>
        <img draggable={false} width="100%" src="/merry_xmas.svg" />
      </header>
      <footer className="footer">
        <button className="button--explore" onClick={() => setInside(!inside)}>
          {hu.includes(name) ? `Meglepetés 🎄` : `Click me 🎄`}
        </button>
        <br />
      </footer>
    </>
  );
}
