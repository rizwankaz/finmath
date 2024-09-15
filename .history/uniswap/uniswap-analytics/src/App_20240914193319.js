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

function Swaps() {
  const { loading, error, data } = useQuery(SWAP_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Error fetching data:', error); // Log error details
    return <p>Error: {error.message}</p>;
  }

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
          <p>Timestamp: {new Date(parseInt(swap.timestamp) * 1000).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Uniswap V3 Dashboard</h1>
      <Swaps />
    </div>
  );
}

export default App;