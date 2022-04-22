import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";

const TopPurchaserDefaulter = ({defaulters}) => {
   ChartJS.register(ArcElement, Tooltip, Legend);
   const options = {
        
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '',
      },
      legend: {
        display: false
     }
    },
  };
   const data = {
      labels:  defaulters.map(df => df.name),
      datasets: [
         {
            label: "Outstanding",
            data: defaulters.map(df => df.balance.toString()),
            backgroundColor: [
               "rgba(255, 99, 132, 0.2)",
               "rgba(54, 162, 235, 0.2)",
               "rgba(255, 206, 86, 0.2)",
               "rgba(75, 192, 192, 0.2)",
               "rgba(153, 102, 255, 0.2)",
               "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
               "rgba(255, 99, 132, 1)",
               "rgba(54, 162, 235, 1)",
               "rgba(255, 206, 86, 1)",
               "rgba(75, 192, 192, 1)",
               "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
         },
      ],
   };
   return (
      <div>
          <Doughnut data={data} options={options}/>
      </div>
   );
};

export default TopPurchaserDefaulter;
