import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// Define the query for recent swaps
const SWAP_QUERY = gql`
  {
    swaps(first: 30, orderBy: timestamp, orderDirection: desc) {
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

  if (loading) return <CircularProgress />;
  if (error) {
    console.error('Error fetching data:', error); // Log error details
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  // Prepare data for chart
  const chartData = {
    labels: data.swaps.map(swap => new Date(parseInt(swap.timestamp) * 1000).toLocaleDateString()),
    datasets: [
      {
        label: 'Amount USD',
        data: data.swaps.map(swap => parseFloat(swap.amountUSD)),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Latest Swaps
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Swap Amounts Over Time</Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Swap Details</Typography>
              {data.swaps.map((swap) => (
                <Card key={swap.id} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="body1">
                      {swap.token0.symbol}/{swap.token1.symbol}: {swap.amountUSD} USD
                    </Typography>
                    <Typography variant="body2">
                      Amount0: {swap.amount0}, Amount1: {swap.amount1}
                    </Typography>
                    <Typography variant="body2">
                      Timestamp: {new Date(parseInt(swap.timestamp) * 1000).toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function App() {
  return (
    <Container>
      <Typography variant="h2" gutterBottom align="center">
        Uniswap V3 Dashboard
      </Typography>
      <Swaps />
    </Container>
  );
}

export default App;