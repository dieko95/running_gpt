// debug.js - Utility script for debugging your application
require('dotenv').config();
const axios = require('axios');

// Debug environment variables
function checkEnvironment() {
  console.log('Checking environment variables:');
  const requiredVars = [
    'STRAVA_CLIENT_ID',
    'STRAVA_CLIENT_SECRET',
    'REDIRECT_URI',
    'SESSION_SECRET'
  ];

  let missingVars = [];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
      console.error(`❌ Missing ${varName}`);
    } else {
      console.log(`✅ ${varName} is set`);
    }
  }

  if (missingVars.length > 0) {
    console.error('\n⚠️ Fix the missing environment variables in your .env file');
  } else {
    console.log('\n✅ All required environment variables are set');
  }
}

// Test Strava API connection
async function testStravaConnection() {
  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET) {
    console.error('❌ Cannot test Strava connection without credentials');
    return;
  }

  try {
    console.log('Testing Strava API connection...');
    // Just a basic auth check
    const response = await axios.post('https://www.strava.com/api/v3/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'client_credentials'
    }).catch(err => {
      // This will likely fail but will tell us if the API is reachable
      if (err.response && err.response.status === 400) {
        console.log('✅ Strava API is reachable (expected auth error)');
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error('❌ Failed to connect to Strava API:', error.message);
  }
}

// Run debug checks
async function runDebugChecks() {
  console.log('=== RUNNING DEBUG CHECKS ===\n');
  checkEnvironment();
  console.log('\n');
  await testStravaConnection();
  console.log('\n=== DEBUG CHECKS COMPLETE ===');
}

runDebugChecks().catch(console.error); 