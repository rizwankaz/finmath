import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register ChartJS components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend
);

// Define the query for recent swaps
const SWAP_QUERY = gql`
  {
    swaps(first: 100, orderBy: timestamp, orderDirection: desc) {
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

  // Filter data to show only the last 24 hours
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const filteredSwaps = data.swaps.filter(swap => {
    const swapTime = new Date(parseInt(swap.timestamp) * 1000);
    return swapTime >= twentyFourHoursAgo;
  });

  // Prepare data for chart
  const chartData = {
    labels: filteredSwaps.map(swap => new Date(parseInt(swap.timestamp) * 1000)),
    datasets: [
      {
        label: 'Amount USD',
        data: filteredSwaps.map(swap => parseFloat(swap.amountUSD)),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  // Chart options to format time
  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute', // Adjust unit as needed
          tooltipFormat: 'Pp', // Date and time format for tooltips
          displayFormats: {
            minute: 'HH:mm', // Format for minute granularity
            hour: 'HH:mm',   // Format for hour granularity
            day: 'MMM D'     // Format for day granularity
          }
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount USD',
        },
      },
    },
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Latest Swaps (Last 24 Hours)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Swap Amounts Over Time</Typography>
              <Line data={chartData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Swap Details</Typography>
              {filteredSwaps.map((swap) => (
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
