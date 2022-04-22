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
  return 
}

const DashLine1Item2 = ({kisan, purchaser}) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );
      const options = {
        
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Cash Paid',
          },
        },
      };
      
      const labels = purchaser.map(phr => phr.month);
      
      const data = {
        labels,
        datasets: [
          {
            label: 'Paid To Kisan',
            data: kisan.map(ksn=>ksn.monthWiseAdvanceData.cashPaidToKisan),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Paid By Purchaser',
            data: purchaser.map(phr=>phr.monthwisepurchaserData.purchaserPaid),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
    return (
        <div>
            <Line options={options} data={data} />
        </div>
    );
}

export default DashLine1Item2;
