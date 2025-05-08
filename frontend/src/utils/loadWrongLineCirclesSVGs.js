const wrongCircleSvgs = import.meta.glob("../assets/LineCirclesWrong/*.svg", {
  eager: true,
});

const wrongCircleMap = Object.fromEntries(
  Object.entries(wrongCircleSvgs).map(([path, mod]) => {
    const line = path.split("/").pop().replace(".svg", "");
    return [line, mod.default];
  })
);

export default wrongCircleMap;
