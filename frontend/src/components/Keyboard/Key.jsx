import "./Key.css";

export const Key = ({ letter, setSearch, search, filteredStations, normalize }) => {
  const isNextLetter = (letter) => {
    const filteredNames = filteredStations.map((station) => normalize(station.name).replace(/\s+/g, ""));
  
    return filteredNames.some((name) => {
      return name[search.length]?.toLowerCase() === letter.toLowerCase();
    });
  };

  const next = 
  search.length > 0 ? isNextLetter(letter) : true;
  return (
    <button
      onClick={() => setSearch(search + letter)}
      className={`key ${next ? "" : "not-next"}`}
      data-testid={`key${next ? "" : "-not-next"}`}
    >
      {letter}
    </button>
  );
};
