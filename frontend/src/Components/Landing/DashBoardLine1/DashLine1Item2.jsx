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

const DashLine1Item2 = ({ kisan, purchaser }) => {
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
        text: 'Cash Paid',
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

  const labels = purchaser.map(phr => phr.month);

  const data = {
    labels,
    datasets: [
      {
        label: 'Paid To Kisan',
        data: kisan.map(ksn => ksn.monthWiseAdvanceData.cashPaidToKisan),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
        pointBorderWidth: 0,
      },
      {
        label: 'Paid By Purchaser',
        data: purchaser.map(phr => phr.monthwisepurchaserData.purchaserPaid),
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

export default DashLine1Item2;
