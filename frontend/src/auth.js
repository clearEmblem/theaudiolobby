export const clientId = "60939438f5f34a8ea0e77187f56a8af1"
export const params = new URLSearchParams(window.location.search);
export const code = params.get("code");
/*
if (!code){
    redirectToAuthCodeFlow(clientId)
}
else{
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken).
    populateUI(profile);
}ß
*/
export async function redirectToAuthCodeFlow(clientId) {
    // Generate and store verifier
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("verifier", verifier);
    console.log("Stored verifier:", verifier); // Debug log

    // Build authorization URL
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:5173/callback");
    params.append("scope", "user-read-private user-read-email");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    // Log the full URL for debugging
    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    console.log("Redirecting to:", authUrl);

    // Perform the redirect
    window.location.href = authUrl;
}
export function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

export async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}
export async function getAccessToken(clientId) {
    const verifier = localStorage.getItem("verifier");
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    
    if (!verifier || !code) {
        throw new Error("No verifier or code found");
    }
    
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://127.0.0.1:5173/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const response = await result.json();
    console.log("Token response:", response);
    
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}, message: ${response.error}`);
    }

    // Clear verifier after successful token exchange
    localStorage.removeItem("verifier");
    return response.access_token;
}    


export async function fetchProfile(token) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${token}` }
    });

    return await result.json();    
}

export async function populateUI(profile) {
    
}