const stationSvgs = import.meta.glob('../assets/StationLabels/*.svg', { eager: true });

const stationMap = Object.fromEntries(
  Object.entries(stationSvgs).map(([path, mod]) => {
    const name = path.split('/').pop().replace('.svg', '');
    return [name, mod.default];
  })
);

export default stationMap;