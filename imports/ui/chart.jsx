import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Chart = ({ stock, historicalData }) => {
  const [timeRange, setTimeRange] = useState('1D');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const clickChart = () => {
      if (historicalData) {
        let filteredData;
        const now = new Date();

        switch (timeRange) {
          case '1D':
            const oneDayAgo = new Date(now);
            oneDayAgo.setDate(oneDayAgo.getDate() - 1 );
            oneDayAgo.setHours(0, 0, 0, 0); 
            filteredData = historicalData.filter(data => new Date(data[0]) >= oneDayAgo);
            break;
          case '1W':
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            oneWeekAgo.setHours(0, 0, 0, 0); 
            filteredData = historicalData.filter(data => new Date(data[0]) >= oneWeekAgo);
            break;
          case 'All':
            filteredData = historicalData;
            break;
          default:
            filteredData = historicalData;
            break;
        }

        setChartData(filteredData.map(data => [new Date(data[0]).getTime(), data[1]]));
      }
    };

    clickChart(); 
  }, [timeRange, historicalData]);

  const options = {
    chart: {
      width: 580,
      height: 260
    },
    title: {
      text: `${stock.name}`
    },
    xAxis: {
      type: 'datetime',
      gridLineWidth: 0,
      lineWidth: 0,
      labels: {
        enabled: false
      },
      tickWidth: 0
    },
    yAxis: {
      title: {
        text: null
      },
      gridLineWidth: 0,
      lineWidth: 0,
      labels: {
        enabled: false
      },
      tickWidth: 0
    },
    series: [{
      name: 'Price',
      data: chartData,
      color: stock.net_change < 0 ? '#ef4444' : '#22c55e'
    }],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
      <div className='flex justify-center mt-4'>
        <button className='hover:bg-indigo-200 mx-3 rounded-full px-4 py-2 semibold' onClick={() => setTimeRange('1D')}>1D</button>
        <button className='hover:bg-indigo-200 mx-3 rounded-full px-4 py-2 semibold' onClick={() => setTimeRange('1W')}>1W</button>
        <button className='hover:bg-indigo-200 mx-3 rounded-full px-4 py-2 semibold' onClick={() => setTimeRange('All')}>All</button>
      </div>
    </div>
  );
};

export default Chart;





