import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

export function App() {
  return;
}

const DashLine1Item3 = ({ advanceData }) => {
  console.log('advanceData', advanceData);
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Advance',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + 'M';
            } else if (value >= 1000) {
              return (value / 1000).toFixed(0) + 'k';
            }
            return value;
          },
        },
      },
    },
  };

  const labels = advanceData.map(month => month.month);

  const data = {
    labels,
    datasets: [
      {
        label: 'Given to Kisans',
        data: advanceData.map(eachMonth => eachMonth.monthWiseAdvanceData.advanceTaken),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
        pointBorderWidth: 0,
      },
      {
        label: 'settled By Kisans',
        data: advanceData.map(eachMonth => eachMonth.monthWiseAdvanceData.advanceSettled),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 2,
        pointBorderWidth: 0,
      },
    ],
  };
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export default DashLine1Item3;
