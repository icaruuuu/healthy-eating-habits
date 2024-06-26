"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from './Analytics.module.css';

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

const GraphCard: React.FC<{ title: string; chartData: any; counts: any }> = ({ title, chartData, counts }) => (
    <div className={styles.card}>
      <h2>{title}</h2>
      <div className={styles.chartWrapper}>
        {chartData.type === 'bar' && <Bar data={chartData.data} options={{ maintainAspectRatio: false }} />}
        {chartData.type === 'line' && <Line data={chartData.data} options={{ maintainAspectRatio: false }} />}
        {chartData.type === 'pie' && <Pie data={chartData.data} options={{ maintainAspectRatio: false }} />}
      </div>
      <div className={styles.counts}>
        <h3>Counts:</h3>
        <ul>
          {Object.keys(counts).map(key => (
            <li key={key}>
              {key}: {counts[key]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
  

const GraphPage: React.FC = () => {
  const [surveyData, setSurveyData] = useState<HealthSurvey[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/get-survey');
        setSurveyData(response.data);
      } catch (error) {
        console.error('Error fetching health survey data:', error);
        // Implement error handling
      }
    };
    fetchData();
  }, []);

  const processData = (data: HealthSurvey[]) => {
    const genderCount = countResponses(data.map(entry => entry.gender));
    const courseCount = countResponses(data.map(entry => entry.course));
    const fruitsVegetablesCount = countResponses(data.map(entry => entry.fruits_vegetables));
    const fastFoodCount = countResponses(data.map(entry => entry.fast_food));
    const dietDistribution = countResponses(data.map(entry => entry.diet));
    const healthRatingCorrelation = data.map(entry => ({ x: entry.fruits_vegetables, y: entry.health_rating }));
    const gpaByDiet = calculateAverageGpaByDiet(data);

    return {
      genderCount,
      courseCount,
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

  const { genderCount, courseCount, fruitsVegetablesCount, fastFoodCount, dietDistribution, healthRatingCorrelation, gpaByDiet } = processData(surveyData);

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

  const genderChartData = {
    type: 'pie',
    data: {
      labels: Object.keys(genderCount),
      datasets: [
        {
          label: 'Gender Distribution',
          data: Object.values(genderCount),
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
        },
      ],
    },
  };

  const courseChartData = {
    type: 'pie',
    data: {
      labels: Object.keys(courseCount),
      datasets: [
        {
          label: 'Course Distribution',
          data: Object.values(courseCount),
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
        },
      ],
    },
  };

  return (
    <div className={styles.pageBackground}>
      <h1 className={styles.title}>Healthy Eating Habits and Academic Performance Analysis</h1>
      <div className={styles.cardContainer}>
        <GraphCard title="Gender Distribution" chartData={genderChartData} counts={genderCount} />
        <GraphCard title="Course Distribution" chartData={courseChartData} counts={courseCount} />
        <GraphCard title="Fruits and Vegetables Consumption" chartData={fruitVegetableChartData} counts={fruitsVegetablesCount} />
        <GraphCard title="Fast Food Consumption Frequency" chartData={fastFoodChartData} counts={fastFoodCount} />
        <GraphCard title="Diet Distribution" chartData={dietDistributionChartData} counts={dietDistribution} />
        <GraphCard title="Correlation between Eating Habits and Health Rating" chartData={correlationChartData} counts={undefined} />
        <GraphCard title="Average GPA by Diet" chartData={gpaByDietChartData} counts={gpaByDiet} />
      </div>
    </div>
  );
};

export default GraphPage;

