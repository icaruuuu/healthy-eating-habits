"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from './Analytics.module.css'; // Ensure this CSS module exists
import Link from 'next/link';

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
      <Line data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  </div>
);

const GraphPage: React.FC = () => {
  const [surveyData, setSurveyData] = useState<HealthSurvey[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/get-health-survey-data'); // Adjust API endpoint
        console.log("Health survey data received:", response.data);
        setSurveyData(response.data);
      } catch (error) {
        console.error('Error fetching health survey data:', error);
      }
    };
    fetchData();
  }, []);

  const processData = (data: HealthSurvey[]) => {
    // Descriptive statistics on healthy eating habits (fruits_vegetables)
    const fruitVegetableData = data.map(entry => entry.fruits_vegetables);

    // Frequency distribution of fast food consumption
    const fastFoodData = data.map(entry => entry.fast_food);

    // Analysis of the prevalence of different diets
    const dietCounts: { [key: string]: number } = {};
    data.forEach(entry => {
      if (entry.diet in dietCounts) {
        dietCounts[entry.diet]++;
      } else {
        dietCounts[entry.diet] = 1;
      }
    });

    // Correlation analysis between eating habits (fruits_vegetables) and overall health rating
    const correlationData = data.map(entry => ({
      x: entry.fruits_vegetables,
      y: entry.health_rating,
    }));

    // Comparative analysis of GPA based on different dietary habits
    const dietGpaData: { [key: string]: number[] } = {};
    data.forEach(entry => {
      if (!(entry.diet in dietGpaData)) {
        dietGpaData[entry.diet] = [];
      }
      dietGpaData[entry.diet].push(parseFloat(entry.gpa)); // Assuming GPA is a string and needs parsing
    });

    const averageGpaByDiet = Object.keys(dietGpaData).map(diet => ({
      diet,
      averageGpa: dietGpaData[diet].reduce((acc, val) => acc + val, 0) / dietGpaData[diet].length,
    }));

    return {
      fruitVegetableData,
      fastFoodData,
      dietCounts,
      correlationData,
      averageGpaByDiet,
    };
  };

  const { fruitVegetableData, fastFoodData, dietCounts, correlationData, averageGpaByDiet } = processData(surveyData);

  const fruitVegetableChartData = {
    labels: Array.from(Array(fruitVegetableData.length).keys()).map(String),
    datasets: [{
      label: 'Fruits and Vegetables Consumption',
      data: fruitVegetableData,
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
    }]
  };

  const fastFoodChartData = {
    labels: Array.from(Array(fastFoodData.length).keys()).map(String),
    datasets: [{
      label: 'Fast Food Consumption Frequency',
      data: fastFoodData,
      fill: false,
      borderColor: 'rgba(153, 102, 255, 1)',
      tension: 0.1,
    }]
  };

  const dietDistributionChartData = {
    labels: Object.keys(dietCounts),
    datasets: [{
      label: 'Diet Distribution',
      data: Object.values(dietCounts),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }]
  };

  const correlationChartData = {
    labels: correlationData.map((_, index) => `Entry ${index + 1}`),
    datasets: [{
      label: 'Correlation between Eating Habits and Health Rating',
      data: correlationData,
      fill: false,
      borderColor: 'rgba(255, 159, 64, 1)',
      tension: 0.1,
    }]
  };

  const gpaByDietChartData = {
    labels: averageGpaByDiet.map(item => item.diet),
    datasets: [{
      label: 'Average GPA by Diet',
      data: averageGpaByDiet.map(item => item.averageGpa),
      fill: false,
      borderColor: 'rgba(54, 162, 235, 1)',
      tension: 0.1,
    }]
  };

  return (
    <div>
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

