export const buildGraph = (edges) => {
  const graph = {};
  for (const [a, b] of edges) {
    if (!graph[a]) graph[a] = [];
    if (!graph[b]) graph[b] = [];
    graph[a].push(b);
    graph[b].push(a);
  }
  return graph;
};

export const bfsDistance = (graph, start, end) => {
  if (start === end) return 0;

  const visited = new Set();
  const queue = [[start, 0]];

  while (queue.length > 0) {
    const [current, dist] = queue.shift();
    if (current === end) return dist;

    for (const neighbor of graph[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }

  return -1;
};
