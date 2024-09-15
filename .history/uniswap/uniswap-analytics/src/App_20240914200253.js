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
  query GetRecentSwaps {
    swaps(
      first: 1000
      orderBy: timestamp
      orderDirection: desc
      where: {
        timestamp_gte: ${Math.floor(Date.now() / 1000) - 24 * 60 * 60} // Last 24 hours
      }
    ) {
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

  // Calculate the 24-hour window
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Ensure timestamp is correctly parsed and filtered
  const filteredSwaps = data.swaps.filter(swap => {
    const swapTime = new Date(parseInt(swap.timestamp) * 1000);
    return swapTime >= twentyFourHoursAgo;
  });

  // Aggregate data every 30 minutes
  const aggregateData = {};
  filteredSwaps.forEach(swap => {
    const swapTime = new Date(parseInt(swap.timestamp) * 1000);
    // Round down to the nearest 30-minute interval
    const intervalStart = new Date(Math.floor(swapTime.getTime() / (30 * 60 * 1000)) * (30 * 60 * 1000));
    if (!aggregateData[intervalStart]) {
      aggregateData[intervalStart] = 0;
    }
    aggregateData[intervalStart] += parseFloat(swap.amountUSD);
  });

  // Prepare aggregated data for chart
  const chartData = {
    datasets: [
      {
        label: 'Amount USD (30-minute intervals)',
        data: Object.keys(aggregateData).map(key => ({
          x: new Date(key),
          y: aggregateData[key]
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
        min: twentyFourHoursAgo, // Set minimum time to 24 hours ago
        max: now, // Set maximum time to now
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
        Latest Swaps (Last 24 Hours)
      </Typography>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Swap Amounts Aggregated Every 30 Minutes</Typography>
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
