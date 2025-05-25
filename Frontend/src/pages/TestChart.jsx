import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const TestChart = ({ testName, result, normalRange, explaination }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const renderChart = () => {
      if (!chartRef.current || !normalRange) return;

          const resultValue = parseFloat(result);
          const [normalRangeLower, normalRangeHigher] = normalRange.split('-').map(value => parseFloat(value));

      // Chart.js initialization
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          // Chart configuration options
          // ...
          type: 'bar',
          data: {
            labels: ['Result'],
            datasets: [
              {
                label: 'Normal Range Lower',
                data: [normalRangeLower],
                backgroundColor: 'rgba(0, 130, 0, 0.8)', // Red color for the lower limit
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1
              },
              {
                label: 'Result',
                data: [resultValue],
                backgroundColor: resultValue < normalRangeLower || resultValue > normalRangeHigher ? 'rgba(255, 3, 62, 0.8)' : 'rgba(54, 162, 235, 0.8)', // Blue color for the result bar
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1
              },
              {
                label: 'Normal Range Higher',
                data: [normalRangeHigher],
                backgroundColor: 'rgba(0, 50, 0, 0.8)', // Red color for the higher lim
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1
              }]
          },
           options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.2)' // White color for the grid lines
            }  
          },
          
        },
      }
        });
      }
    };

    renderChart();

    // Cleanup chart instance when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [normalRange]); // Ensure chart is re-rendered whenever the normalRange changes

  return (
    <div className='w-[400px] border-2 border-black p-2 rounded-lg shadow-lg'>
      <h1 className='m-2 mb-8'><span className='text-2xl font-bold'>{testName}:</span> <span className='text-xl'>{explaination}</span></h1>
      <canvas ref={chartRef}></canvas>
      <p className='font-bold text-lg'>Result: {result}</p>
      <p className='text-lg font-semibold text-blue-800'>Normal Range: {normalRange}</p>
    </div>
  );
};

export default TestChart;
