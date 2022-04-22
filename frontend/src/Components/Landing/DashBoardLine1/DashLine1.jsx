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
  return 
}

const Dashline1 = ({commissions}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
            text: 'Comissions',
          },
        },
      };
      
      const labels = commissions.map(comission=>  comission.date);
      
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
        <div>
            <Bar options={options} data={data} />
        </div>
    );
}

export default Dashline1;
