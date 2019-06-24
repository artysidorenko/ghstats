import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-boost'
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import './styles/index.css';
import App from './components/App';
import Auth from './auth/Auth';
import history from './history';
import * as serviceWorker from './serviceWorker';

const auth = new Auth();

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
})

// let token = process.env.REACT_APP_GHTOKEN
let token = null

const authLink = setContext((_, { headers }) => {
  // const token = process.env.REACT_APP_GHTOKEN
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App history={history} auth={auth} setToken={(githubAccess) => {
      token = githubAccess
    }}/>
  </ApolloProvider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
