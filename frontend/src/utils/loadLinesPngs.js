const linePngs = import.meta.glob("../assets/Lines/*.png", { eager: true });

const lineMap = Object.fromEntries(
  Object.entries(linePngs).map(([path, mod]) => {
    const name = path.split("/").pop().replace(".png", "");
    return [name, mod.default];
  })
);

export default lineMap;
