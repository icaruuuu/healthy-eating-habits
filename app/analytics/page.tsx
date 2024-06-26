"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2'; // Import necessary chart types
import 'chart.js/auto';
import styles from './Analytics.module.css'; // Ensure this CSS module exists

interface HealthSurvey {
  name: string;
  age: number;
  gender: string;
  fruits_vegetables: number;
  fast_food: number;
  diet: string;
  health_rating: number;
  gpa: string;
  course: string;
  study_hours: number;
  extracurricular: string;
  sleep_hours: number;
  stress_level: number;
  class_attendance: number;
}

const GraphCard: React.FC<{ title: string, chartData: any }> = ({ title, chartData }) => (
  <div className={styles.card}>
    <h2>{title}</h2>
    <div className={styles.chartWrapper}>
      {/* Choose appropriate chart type based on the data */}
      {chartData.type === 'bar' && <Bar data={chartData.data} options={{ maintainAspectRatio: false }} />}
      {chartData.type === 'line' && <Line data={chartData.data} options={{ maintainAspectRatio: false }} />}
      {chartData.type === 'pie' && <Pie data={chartData.data} options={{ maintainAspectRatio: false }} />}
    </div>
  </div>
);

const GraphPage: React.FC = () => {
  const [surveyData, setSurveyData] = useState<HealthSurvey[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/get-survey');
        console.log("Health survey data received:", response.data);
        setSurveyData(response.data);
      } catch (error) {
        console.error('Error fetching health survey data:', error);
        // Implement error handling, e.g., setSurveyData([]) or display error message
      }
    };
    fetchData();
  }, []);

  const processData = (data: HealthSurvey[]) => {
    // Process data for each question

    // Example: Count responses for each question
    const fruitsVegetablesCount = countResponses(data.map(entry => entry.fruits_vegetables));
    const fastFoodCount = countResponses(data.map(entry => entry.fast_food));
    const dietDistribution = countResponses(data.map(entry => entry.diet));
    const healthRatingCorrelation = data.map(entry => ({ x: entry.fruits_vegetables, y: entry.health_rating }));
    const gpaByDiet = calculateAverageGpaByDiet(data);

    return {
      fruitsVegetablesCount,
      fastFoodCount,
      dietDistribution,
      healthRatingCorrelation,
      gpaByDiet,
    };
  };

  const countResponses = (data: any[]) => {
    return data.reduce((acc: { [key: string]: number }, curr: any) => {
      const key = String(curr);
      if (acc[key]) {
        acc[key]++;
      } else {
        acc[key] = 1;
      }
      return acc;
    }, {});
  };

  const calculateAverageGpaByDiet = (data: HealthSurvey[]) => {
    const dietGpaData: { [key: string]: number[] } = {};
    data.forEach(entry => {
      if (!(entry.diet in dietGpaData)) {
        dietGpaData[entry.diet] = [];
      }
      dietGpaData[entry.diet].push(parseFloat(entry.gpa));
    });

    const averageGpaByDiet = Object.keys(dietGpaData).map(diet => ({
      diet,
      averageGpa: dietGpaData[diet].reduce((acc, val) => acc + val, 0) / dietGpaData[diet].length,
    }));

    return averageGpaByDiet;
  };

  const { fruitsVegetablesCount, fastFoodCount, dietDistribution, healthRatingCorrelation, gpaByDiet } = processData(surveyData);

  // Configure chart data
  const fruitVegetableChartData = {
    type: 'bar',
    data: {
      labels: Object.keys(fruitsVegetablesCount),
      datasets: [{
        label: 'Fruits and Vegetables Consumption',
        data: Object.values(fruitsVegetablesCount),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      }],
    },
  };

  const fastFoodChartData = {
    type: 'bar',
    data: {
      labels: Object.keys(fastFoodCount),
      datasets: [{
        label: 'Fast Food Consumption Frequency',
        data: Object.values(fastFoodCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      }],
    },
  };

  const dietDistributionChartData = {
    type: 'pie',
    data: {
      labels: Object.keys(dietDistribution),
      datasets: [{
        label: 'Diet Distribution',
        data: Object.values(dietDistribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }],
    },
  };

  const correlationChartData = {
    type: 'line',
    data: {
      labels: surveyData.map((_, index) => `Entry ${index + 1}`),
      datasets: [
        {
          label: 'Fruits and Vegetables Consumption',
          data: surveyData.map(entry => entry.fruits_vegetables),
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1,
        },
        {
          label: 'Health Rating',
          data: surveyData.map(entry => entry.health_rating),
          fill: false,
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          title: {
            display: true,
            text: 'Response',
          },
        },
        y: {
          type: 'linear',
          title: {
            display: true,
            text: 'Value',
          },
        },
      },
    },
  };
  

  const gpaByDietChartData = {
    type: 'bar',
    data: {
      labels: gpaByDiet.map(item => item.diet),
      datasets: [{
        label: 'Average GPA by Diet',
        data: gpaByDiet.map(item => item.averageGpa),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }],
    },
  };


    return (
        <div className={styles.pageBackground}>
        <h1 className={styles.title}>Healthy Eating Habits and Academic Performance Analysis</h1>
        <div className={styles.cardContainer}>
            <GraphCard title="Fruits and Vegetables Consumption" chartData={fruitVegetableChartData} />
            <GraphCard title="Fast Food Consumption Frequency" chartData={fastFoodChartData} />
            <GraphCard title="Diet Distribution" chartData={dietDistributionChartData} />
            <GraphCard title="Correlation between Eating Habits and Health Rating" chartData={correlationChartData} />
            <GraphCard title="Average GPA by Diet" chartData={gpaByDietChartData} />
        </div>
        </div>
     );
};

export default GraphPage;
