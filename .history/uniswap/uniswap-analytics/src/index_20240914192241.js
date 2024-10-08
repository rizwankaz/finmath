import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

// Create Apollo Client
const client = new ApolloClient({
  uri: 'https://subgraph.satsuma-prod.com/rizwan-sobhans-team--799140/community/uniswap-v3-mainnet/graphql',
  cache: new InMemoryCache(),
});

// Create the root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);