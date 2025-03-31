// index.js

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

// Load sensitive data from .env
const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, REDIRECT_URI } = process.env;

app.get("/", (req, res) => {
  res.send(`<h2>Welcome to Strava Coach OAuth</h2><a href="/auth/strava">Connect your Strava account</a>`);
});

// Step 1: Redirect user to Strava's OAuth screen
app.get("/auth/strava", (req, res) => {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=auto&scope=read,activity:read_all`;
  res.redirect(authUrl);
});

// Step 2: Handle redirect from Strava and exchange code for access token
app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) return res.status(400).send("Missing authorization code.");

  try {
    const response = await axios.post("https://www.strava.com/oauth/token", {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    const { access_token, athlete } = response.data;

    // For now, just display token and athlete info (you can later store it securely)
    res.send(`
      <h3>✅ Connected as ${athlete.firstname} ${athlete.lastname}</h3>
      <p>Your access token is:</p>
      <pre>${access_token}</pre>
      <p>Now you can use this token to fetch activities from the Strava API.</p>
    `);
  } catch (error) {
    console.error("OAuth error:", error.message);
    res.status(500).send("❌ Failed to exchange code for access token.");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
