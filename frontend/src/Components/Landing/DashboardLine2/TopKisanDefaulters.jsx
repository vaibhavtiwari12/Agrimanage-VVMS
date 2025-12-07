import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { exportKisanDefaulters } from '../../../Utility/excelExport';

const Topkisandefaulters = ({ defaulters }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const handleExport = async () => {
    try {
      await exportKisanDefaulters();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

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
    labels: defaulters.map(df => df.name),
    datasets: [
      {
        label: 'Outstanding',
        data: defaulters.map(df => df.balance.toString()),
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
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          marginBottom: '12px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: isMobile ? 'flex-start' : 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          paddingBottom: '8px',
          borderBottom: '1px solid #f0f0f0',
          gap: isMobile ? 5 : 0,
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#262626',
          }}
        >
          Top Kisan Defaulters
        </div>
        <a
          onClick={handleExport}
          style={{
            color: '#1890ff',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '2px 0',
            width: isMobile ? '100%' : 'auto',
          }}
          onMouseEnter={e => {
            e.target.style.color = '#40a9ff';
            e.target.style.textDecoration = 'underline';
          }}
          onMouseLeave={e => {
            e.target.style.color = '#1890ff';
            e.target.style.textDecoration = 'none';
          }}
        >
          <DownloadOutlined style={{ fontSize: '12px' }} />
          Export All Defaulter List
        </a>
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
        }}
      >
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default Topkisandefaulters;
