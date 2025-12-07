import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

export function App() {
  return;
}

const Dashline1 = ({ commissions }) => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Comissions',
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

  const labels = commissions.map(comission => comission.date);

  const data = {
    labels,
    datasets: [
      {
        label: 'Commisions',
        data: commissions.map(comission => comission.commissions),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      /*  {
         label: 'Dataset 2',
         data: [900,800,20,358,100,233,98],
         borderColor: 'rgb(53, 162, 235)',
         backgroundColor: 'rgba(53, 162, 235, 0.5)',
       }, */
    ],
  };
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default Dashline1;
