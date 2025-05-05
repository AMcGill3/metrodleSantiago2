const arrowSvgs = import.meta.glob("../assets/DirectionArrows/*.svg", { eager: true });

const arrowMap = Object.fromEntries(
  Object.entries(arrowSvgs).map(([path, mod]) => {
    const arrow = path.split("/").pop().replace(".svg", "");
    return [arrow, mod.default];
  })
);

export default arrowMap;
