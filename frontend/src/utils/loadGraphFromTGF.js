export const loadGraphFromTGF = async (url) => {
  const response = await fetch(url);
  const text = await response.text();

  const lines = text.trim().split('\n');
  const nodes = {};
  const edges = [];

  let isEdgeSection = false;

  for (const line of lines) {
    if (line === '#') {
      isEdgeSection = true;
      continue;
    }

    if (!isEdgeSection) {
      const [id, ...nameParts] = line.split(' ');
      nodes[Number(id)] = nameParts.join(' ');
    } else {
      const [from, to] = line.split(' ').map(Number);
      edges.push([from, to]);
    }
  }

  return { nodes, edges };
};
