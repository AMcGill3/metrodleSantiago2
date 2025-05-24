const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getUser(username) {
  try {
    const requestOptions = {
      method: "GET",
      body: JSON.stringify({ username }),
    };
    const response = await fetch(`${BACKEND_URL}/users`, requestOptions);

    if (response.status !== 200) {
      throw new Error("Unable to fetch users");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}
export async function updateUser(username, win = null, guessNumber = null) {
  try {
    const response = await fetch(`${BACKEND_URL}/users/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateUser",
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to update user");
    }

    const updatedData = await response.json();
    return updatedData;
  } catch (err) {
    console.error("Update Error:", err.message);
    throw err;
  }
}

export async function createUser() {
  try {
    const response = await fetch(`${BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to create user");
    }

    const data = await response.json();
    console.log("Generated username:", data);
    return data.username; // Return just the username string
  } catch (err) {
    console.error("Create Error:", err.message);
    throw err;
  }
}

export async function makeGuess(username, station) {
  try {
    const response = await fetch(`${BACKEND_URL}/users/guess`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        guess: {
          name: station.name,
          lines: station.lines,
          coordinates: station.coordinates,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Failed to make guess");
    }
  } catch (err) {
    console.error("Create Error:", err.message);
    throw err;
  }
}
