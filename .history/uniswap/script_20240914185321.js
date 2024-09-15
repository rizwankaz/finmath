import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://subgraph.satsuma-prod.com/rizwan-sobhans-team--799140/community/uniswap-v3-mainnet/graphql',
  cache: new InMemoryCache(),
});

const SWAP_QUERY = gql`
  {
    swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
      id
      amountUSD
      pair {
        token0 {
          symbol
        }
        token1 {
          symbol
        }
      }
      timestamp
    }
  }
`;

function Swaps() {
  const { loading, error, data } = useQuery(SWAP_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Latest Swaps</h2>
      {data.swaps.map((swap) => (
        <div key={swap.id}>
          <p>
            {swap.pair.token0.symbol}/{swap.pair.token1.symbol}: {swap.amountUSD} USD
          </p>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Swaps />
    </ApolloProvider>
  );
}

export default App;