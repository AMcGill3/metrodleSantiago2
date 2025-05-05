const lineSvgs = import.meta.glob("../assets/Lines/*.svg", { eager: true });

const lineMap = Object.fromEntries(
  Object.entries(lineSvgs).map(([path, mod]) => {
    const name = path.split("/").pop().replace(".svg", "");
    return [name, mod.default];
  })
);

export default lineMap;
