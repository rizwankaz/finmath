import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Define the query for recent swaps
const SWAP_QUERY = gql`
  {
    swaps(first: 10, orderBy: timestamp, orderDirection: desc) {
      id
      amountUSD
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      amount0
      amount1
      timestamp
    }
  }
`;

// Define the query for pool information
const POOL_QUERY = gql`
  {
    pools(first: 5, orderBy: liquidity, orderDirection: desc) {
      id
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      liquidity
      volumeUSD
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
            {swap.token0.symbol}/{swap.token1.symbol}: {swap.amountUSD} USD
          </p>
          <p>
            Amount0: {swap.amount0}, Amount1: {swap.amount1}
          </p>
        </div>
      ))}
    </div>
  );
}

function Pools() {
  const { loading, error, data } = useQuery(POOL_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h2>Top Pools by Liquidity</h2>
      {data.pools.map((pool) => (
        <div key={pool.id}>
          <p>
            {pool.token0.symbol}/{pool.token1.symbol}: {pool.liquidity} Liquidity, {pool.volumeUSD} USD Volume
          </p>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div>
      <Swaps />
      <Pools />
    </div>
  );
}

export default App;