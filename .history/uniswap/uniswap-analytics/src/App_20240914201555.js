import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Typography, Card, CardContent, Stack, CircularProgress } from '@mui/material';
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
    swaps(first: 10000, orderBy: timestamp, orderDirection: desc) {
      id
      amountUSD
      timestamp
      token0 {
        symbol
      }
      token1 {
        symbol
      }
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
    datasets: [
      {
        label: 'Amount USD',
        data: data.swaps.map(swap => ({
          x: new Date(parseInt(swap.timestamp) * 1000),
          y: parseFloat(swap.amountUSD)
        })),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
      },
    ],
  };

  // Chart options to format time and display a proper range
  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute', // Display format for minutes
          tooltipFormat: 'Pp',
          displayFormats: {
            minute: 'HH:mm',
            hour: 'HH:mm',
            day: 'MMM D'
          }
        },
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20 // Adjust based on data density
        }
      },
      y: {
        title: {
          display: true,
          text: 'Amount USD',
        },
        beginAtZero: true
      },
    },
  };

  // Limit to the 5 latest swaps
  const latestSwaps = data.swaps.slice(0, 5).map(swap => ({
    ...swap,
    timestamp: new Date(parseInt(swap.timestamp) * 1000).toLocaleString() // Convert timestamp to readable format
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recent Swaps
      </Typography>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Swap Amounts Over Time</Typography>
            <Line data={chartData} options={chartOptions} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h6">Recent Swap Details</Typography>
            {latestSwaps.map((swap) => (
              <Card key={swap.id} sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="body1">
                    {swap.token0.symbol}/{swap.token1.symbol}: {swap.amountUSD} USD
                  </Typography>
                  <Typography variant="body2">
                    Timestamp: {swap.timestamp}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </Stack>
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
