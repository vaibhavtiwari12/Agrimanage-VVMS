import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';

const TopSoldItem = ({ items }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const data = {
    labels: items.map(item => item.itemName),
    datasets: [
      {
        label: 'Outstanding',
        data: items.map(item => item.totalWeight),
        backgroundColor: [
          'rgba(24, 144, 255, 0.2)', // Ant Design Blue
          'rgba(82, 196, 26, 0.2)', // Ant Design Green
          'rgba(255, 77, 79, 0.2)', // Ant Design Red
          'rgba(250, 173, 20, 0.2)', // Ant Design Orange
          'rgba(114, 46, 209, 0.2)', // Ant Design Purple
          'rgba(19, 194, 194, 0.2)', // Ant Design Cyan
        ],
        borderColor: [
          '#1890ff', // Ant Design Blue
          '#52c41a', // Ant Design Green
          '#ff4d4f', // Ant Design Red
          '#faad14', // Ant Design Orange
          '#722ed1', // Ant Design Purple
          '#13c2c2', // Ant Design Cyan
        ],
        borderWidth: 0,
      },
    ],
  };
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
      }}
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default TopSoldItem;
