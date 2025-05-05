const circleSvgs = import.meta.glob("../assets/LineCircles/*.svg", { eager: true });

const circleMap = Object.fromEntries(
  Object.entries(circleSvgs).map(([path, mod]) => {
    const line = path.split("/").pop().replace(".svg", "");
    return [line, mod.default];
  })
);

export default circleMap;
