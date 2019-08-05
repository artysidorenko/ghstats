const AUTH_CONFIG = {
  domain: 'dev-8-2xd3l4.eu.auth0.com',
  clientId: 'xvOAhkUjsDBqDfFcPTaiwyf2Cn8gCQ7D',
}

if (process.env.REACT_APP_CONTEXT === 'localmachine') {
  AUTH_CONFIG.callbackUrl = 'http://localhost:8080'
} else AUTH_CONFIG.callbackUrl = 'https://ghstats-arty.herokuapp.com/'

export default AUTH_CONFIG


// https://ghstats-arty.herokuapp.com/

// gh dcab8318b05230785950

// oa xvOAhkUjsDBqDfFcPTaiwyf2Cn8gCQ7D