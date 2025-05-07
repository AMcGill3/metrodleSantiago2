// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getGameStats() {
    const requestOptions = {
        method: "GET"
    };

    const response = await fetch(`${BACKEND_URL}/game`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch game");
    }

    const data = await response.json();
    return data;
}

export async function makeGuess() {
    const requestOptions = {
        method: "PUT"
    };

    const response = await fetch(`${BACKEND_URL}/game`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch game");
    }

    const data = await response.json();
    return data;
}

export async function startGame(userId) {
    const payload = {
        userId: userId
      };
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(payload)
    };

    const response = await fetch(`${BACKEND_URL}/game`, requestOptions);

    if (response.status !== 200) {
        throw new Error("Unable to fetch game");
    }

    const data = await response.json();
    return data;
}

