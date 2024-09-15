import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { Container, Typography, Card, CardContent, Stack, CircularProgress } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
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
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Tooltip,
  Legend
);

// Define the queries for recent swaps, token volume, top pairs, and daily volume
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

const TOKEN_VOLUME_QUERY = gql`
  {
    swaps(first: 10000, orderBy: timestamp, orderDirection: desc) {
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      amountUSD
    }
  }
`;

const PAIR_QUERY = gql`
  {
    swaps(first: 10000, orderBy: amountUSD, orderDirection: desc) {
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      amountUSD
    }
  }
`;

const DAILY_VOLUME_QUERY = gql`
  {
    swaps(first: 10000, orderBy: timestamp, orderDirection: desc) {
      amountUSD
      timestamp
    }
  }
`;

function Swaps() {
  const { loading, error, data } = useQuery(SWAP_QUERY);

  if (loading) return <CircularProgress />;
  if (error) {
    console.error('Error fetching data:', error);
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  // Prepare data for aggregation
  const swaps = data.swaps;

  // Aggregate every 100 swaps
  const aggregateData = [];
  for (let i = 0; i < swaps.length; i += 100) {
    const chunk = swaps.slice(i, i + 100);
    const totalAmountUSD = chunk.reduce((sum, swap) => sum + parseFloat(swap.amountUSD), 0);
    const startTime = new Date(parseInt(chunk[0].timestamp) * 1000);
    const endTime = new Date(parseInt(chunk[chunk.length - 1].timestamp) * 1000);

    aggregateData.push({
      x: startTime,
      y: totalAmountUSD,
      label: `${startTime.toLocaleString()} - ${endTime.toLocaleString()}`
    });
  }

  // Prepare aggregated data for chart
  const chartData = {
    datasets: [
      {
        label: 'Amount USD (Aggregated Every 100 Swaps)',
        data: aggregateData,
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
          unit: 'minute',
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
  const latestSwaps = swaps.slice(0, 5).map(swap => ({
    ...swap,
    timestamp: new Date(parseInt(swap.timestamp) * 1000).toLocaleString()
  }));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recent Swaps
      </Typography>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Swap Amounts Aggregated Every 100 Swaps</Typography>
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

function TokenVolume() {
  const { loading, error, data } = useQuery(TOKEN_VOLUME_QUERY);

  if (loading) return <CircularProgress />;
  if (error) {
    console.error('Error fetching data:', error);
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  // Process data to calculate volumes
  const tokenVolume = {};
  data.swaps.forEach(swap => {
    if (!tokenVolume[swap.token0.symbol]) tokenVolume[swap.token0.symbol] = 0;
    if (!tokenVolume[swap.token1.symbol]) tokenVolume[swap.token1.symbol] = 0;

    tokenVolume[swap.token0.symbol] += parseFloat(swap.amountUSD);
    tokenVolume[swap.token1.symbol] += parseFloat(swap.amountUSD);
  });

  const chartData = {
    labels: Object.keys(tokenVolume),
    datasets: [{
      label: 'Volume by Token',
      data: Object.values(tokenVolume),
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    }],
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Volume by Token</Typography>
        <Bar data={chartData} />
      </CardContent>
    </Card>
  );
}

function TopPairs() {
  const { loading, error, data } = useQuery(PAIR_QUERY);

  if (loading) return <CircularProgress />;
  if (error) {
    console.error('Error fetching data:', error);
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  // Process data to get top pairs
  const pairs = {};
  data.swaps.forEach(swap => {
    const pair = `${swap.token0.symbol}/${swap.token1.symbol}`;
    if (!pairs[pair]) pairs[pair] = 0;
    pairs[pair] += parseFloat(swap.amountUSD);
  });

  const sortedPairs = Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Top Token Pairs</Typography>
        <ul>
          {sortedPairs.map(([pair, volume]) => (
            <li key={pair}>{pair}: ${volume.toFixed(2)}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function DailyVolume() {
  const { loading, error, data } = useQuery(DAILY_VOLUME_QUERY);

  if (loading) return <CircularProgress />;
  if (error) {
    console.error('Error fetching data:', error);
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  const volumeData = {};

  data.swaps.forEach(swap => {
    const date = new Date(parseInt(swap.timestamp) * 1000).toISOString().split('T')[0];
    if (!volumeData[date]) volumeData[date] = 0;
    volumeData[date] += parseFloat(swap.amountUSD);
  });

  const chartData = {
    labels: Object.keys(volumeData),
    datasets: [{
      label: 'Daily Trading Volume',
      data: Object.values(volumeData),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
    }],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date',
        },
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Daily Trading Volume</Typography>
        <Line data={chartData} options={chartOptions} />
      </CardContent>
    </Card>
  );
}

function App() {
  return (
    <Container>
      <Typography variant="h2" gutterBottom align="center">
        Uniswap V3 Dashboard
      </Typography>
      <Swaps />
      <TokenVolume />
      <TopPairs />
      <DailyVolume />
    </Container>
  );
}

export default App;
