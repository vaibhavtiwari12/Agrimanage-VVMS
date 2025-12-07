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

const TopSellerKisans = ({ kisans }) => {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  // Sort by sum in descending order and take top 20
  const sortedKisans = kisans ? kisans.sort((a, b) => b.sum - a.sum).slice(0, 20) : [];

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return 'Sales: ₹' + context.parsed.y.toLocaleString();
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          callback: function (value) {
            return '₹' + value / 1000 + 'K';
          },
        },
      },
    },
  };

  const data = {
    labels: sortedKisans.map(kisan =>
      kisan.kisan_name.length > 12 ? kisan.kisan_name.substring(0, 12) + '...' : kisan.kisan_name
    ),
    datasets: [
      {
        label: 'Sales Amount',
        data: sortedKisans.map(kisan => kisan.sum),
        backgroundColor: [
          'rgba(24, 144, 255, 0.8)', // Ant Design Blue
          'rgba(82, 196, 26, 0.8)', // Ant Design Green
          'rgba(255, 77, 79, 0.8)', // Ant Design Red
          'rgba(250, 173, 20, 0.8)', // Ant Design Orange
          'rgba(114, 46, 209, 0.8)', // Ant Design Purple
          'rgba(19, 194, 194, 0.8)', // Ant Design Cyan
          'rgba(245, 34, 45, 0.8)', // Ant Design Volcano
          'rgba(250, 84, 28, 0.8)', // Ant Design Red-Orange
          'rgba(24, 144, 255, 0.6)', // Light Blue
          'rgba(82, 196, 26, 0.6)', // Light Green
          'rgba(255, 77, 79, 0.6)', // Light Red
          'rgba(250, 173, 20, 0.6)', // Light Orange
          'rgba(114, 46, 209, 0.6)', // Light Purple
          'rgba(19, 194, 194, 0.6)', // Light Cyan
          'rgba(245, 34, 45, 0.6)', // Light Volcano
          'rgba(250, 84, 28, 0.6)', // Light Red-Orange
          'rgba(24, 144, 255, 0.4)', // Lighter Blue
          'rgba(82, 196, 26, 0.4)', // Lighter Green
          'rgba(255, 77, 79, 0.4)', // Lighter Red
          'rgba(250, 173, 20, 0.4)', // Lighter Orange
        ],
        borderColor: [
          '#1890ff', // Ant Design Blue
          '#52c41a', // Ant Design Green
          '#ff4d4f', // Ant Design Red
          '#faad14', // Ant Design Orange
          '#722ed1', // Ant Design Purple
          '#13c2c2', // Ant Design Cyan
          '#f5222d', // Ant Design Volcano
          '#fa541c', // Ant Design Red-Orange
          '#1890ff', // Blue (repeat)
          '#52c41a', // Green (repeat)
          '#ff4d4f', // Red (repeat)
          '#faad14', // Orange (repeat)
          '#722ed1', // Purple (repeat)
          '#13c2c2', // Cyan (repeat)
          '#f5222d', // Volcano (repeat)
          '#fa541c', // Red-Orange (repeat)
          '#1890ff', // Blue (repeat)
          '#52c41a', // Green (repeat)
          '#ff4d4f', // Red (repeat)
          '#faad14', // Orange (repeat)
        ],
        borderWidth: 0,
        borderRadius: {
          topLeft: 4,
          topRight: 4,
        },
        borderSkipped: false,
      },
    ],
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default TopSellerKisans;
