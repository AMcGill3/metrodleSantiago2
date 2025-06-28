const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getTargetStation() {
  const requestOptions = {
    method: "GET",
  };

  const response = await fetch(`${BACKEND_URL}/stations`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch station");
  }

  const data = await response.json();
  return data;
}

export async function getAllStations() {
  const requestOptions = {
    method: "GET",
  };

  const response = await fetch(`${BACKEND_URL}/stations/all`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch stations");
  }

  const data = await response.json();
  return data;
}
