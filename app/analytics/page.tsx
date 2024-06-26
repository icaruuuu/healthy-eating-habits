"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from './Analytics.module.css'; // Import the CSS module

// Define the SurveyData interface to match the structure of your survey data
interface SurveyData {
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

// GraphCard component to display individual charts
const GraphCard: React.FC<{ title: string, chartData: any, type?: 'Line' | 'Pie' | 'Bar' }> = ({ title, chartData, type = 'Line' }) => {
  console.log(`Rendering ${title} with data:`, chartData);

  return (
    <div className={styles.card}>
      <h2>{title}</h2>
      <div className={styles.chartWrapper}>
        {type === 'Pie' ? (
          <Pie data={chartData} options={{ maintainAspectRatio: false }} />
        ) : type === 'Bar' ? (
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        ) : (
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        )}
      </div>
    </div>
  );
};

// Main component to fetch and process survey data, and render charts
const GraphPage: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);

  // Fetch survey data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/get-survey');
        console.log("Survey data received:", response.data);
        setSurveyData(response.data);
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };
    fetchData();
  }, []);

  // Process data for healthy eating habits chart
  const processHealthyEatingData = (data: SurveyData[]) => {
    const labels = ["Fruits & Vegetables Consumption", "Fast Food Consumption"];
    const fruitsVegetables = data.reduce((acc, cur) => acc + cur.fruits_vegetables, 0) / data.length;
    const fastFood = data.reduce((acc, cur) => acc + cur.fast_food, 0) / data.length;

    return {
      labels,
      datasets: [{
        data: [fruitsVegetables, fastFood],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      }],
    };
  };

  // Process data for fast food consumption frequency chart
  const processFastFoodData = (data: SurveyData[]) => {
    const fastFoodLevels = [0, 1, 2, 3, 4, 5, 6, 7];
    const fastFoodCounts = fastFoodLevels.map(level => data.filter(d => d.fast_food === level).length);

    return {
      labels: fastFoodLevels,
      datasets: [{
        data: fastFoodCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      }],
    };
  };

  // Process data for diet prevalence chart
  const processDietData = (data: SurveyData[]) => {
    const diets = ["None", "Vegetarian", "Vegan", "Keto", "Other"];
    const dietCounts = diets.map(diet => data.filter(d => d.diet === diet).length);

    return {
      labels: diets,
      datasets: [{
        data: dietCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(175, 252, 192, 0.6)',
        ],
      }],
    };
  };

  // Process data for correlation between eating habits and health rating chart
  const processCorrelationData = (data: SurveyData[]) => {
    const labels = data.map(d => d.age);
    const fruitsVegetables = data.map(d => d.fruits_vegetables);
    const healthRatings = data.map(d => d.health_rating);

    return {
      labels,
      datasets: [
        {
          label: 'Fruits & Vegetables Consumption',
          data: fruitsVegetables,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          type: 'line',
        },
        {
          label: 'Health Rating',
          data: healthRatings,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          type: 'line',
        }
      ],
    };
  };

// Process data for GPA by diet chart
const processGpaByDietData = (data: SurveyData[]) => {
    const diets = ["None", "Vegetarian", "Vegan", "Keto", "Other"];
    const dietGpas = diets.map(diet => {
      const gpas = data.filter(d => d.diet === diet && d.gpa !== 'N/A').map(d => parseFloat(d.gpa));
      const averageGpa = gpas.length > 0 ? gpas.reduce((acc, cur) => acc + cur, 0) / gpas.length : 0;
      return averageGpa;
    });
  
    console.log('GPA by diet data:', dietGpas);
  
    return {
      labels: diets,
      datasets: [{
        label: 'Average GPA',
        data: dietGpas,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(175, 252, 192, 0.6)',
        ],
      }],
    };
  };
  

  // Generate chart data for each graph
  const healthyEatingData = processHealthyEatingData(surveyData);
  const fastFoodData = processFastFoodData(surveyData);
  const dietData = processDietData(surveyData);
  const correlationData = processCorrelationData(surveyData);
  const gpaByDietData = processGpaByDietData(surveyData);

  return (
    <div>
      <h1 className={styles.title}>Healthy Eating Habits and Academic Performance Analysis</h1>
      <div className={styles.cardContainer}>
        <GraphCard title="Statistics on Healthy Eating Habits" chartData={healthyEatingData} type="Pie" />
        <GraphCard title="Frequency Distribution of Fast Food Consumption" chartData={fastFoodData} type="Bar" />
        <GraphCard title="Analysis of Different Diets" chartData={dietData} type="Pie" />
        <GraphCard title="Correlation between Eating Habits and Health Rating" chartData={correlationData} type="Line" />
        <GraphCard title="Comparative Analysis of GPA based on Different Dietary Habits" chartData={gpaByDietData} type="Bar" />
      </div>
    </div>
  );
};

export default GraphPage;
