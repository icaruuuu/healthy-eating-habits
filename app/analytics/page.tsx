"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from './Analytics.module.css'; // Import the CSS module
import Link from 'next/link';

// Define the survey data interface
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

// Component for rendering each graph card
const GraphCard: React.FC<{ title: string, chartData: any, type?: 'Line' | 'Pie' }> = ({ title, chartData, type = 'Line' }) => (
  <div className={styles.card}>
    <h2>{title}</h2>
    <div className={styles.chartWrapper}>
      {type === 'Pie' ? (
        <Pie data={chartData} options={{ maintainAspectRatio: false }} />
      ) : (
        <Line data={chartData} options={{ maintainAspectRatio: false }} />
      )}
    </div>
  </div>
);

// Main component for the graph page
const GraphPage: React.FC = () => {
  const [surveyData, setSurveyData] = useState<SurveyData[]>([]);

  useEffect(() => {
    // Fetch survey data from the API endpoint
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

  // Function to process data for gender distribution pie chart
  const processGenderData = (data: SurveyData[]) => {
    const genders = ["Male", "Female", "Prefer not to say", "Other"];
    const genderCounts = genders.map(gender => {
      const count = data.filter(d => d.gender === gender).length;
      return count;
    });

    return {
      labels: genders,
      datasets: [{
        data: genderCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      }],
    };
  };

  // Function to process data for diet distribution pie chart
  const processDietData = (data: SurveyData[]) => {
    const diets = ["Vegetarian", "Vegan", "Omnivore", "Other"];
    const dietCounts = diets.map(diet => {
      const count = data.filter(d => d.diet === diet).length;
      return count;
    });

    return {
      labels: diets,
      datasets: [{
        data: dietCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      }],
    };
  };

  // Function to process data for GPA distribution pie chart
  const processGpaData = (data: SurveyData[]) => {
    const gpas = ["3.0 - 3.5", "3.5 - 4.0", "Below 3.0"];
    const gpaCounts = gpas.map(gpa => {
      const count = data.filter(d => d.gpa === gpa).length;
      return count;
    });

    return {
      labels: gpas,
      datasets: [{
        data: gpaCounts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
        ],
      }],
    };
  };

  // Function to process data for a line chart of stress levels over age
  const processStressData = (data: SurveyData[]) => {
    const ages = Array.from(new Set(data.map(d => d.age))).sort((a, b) => a - b);
    const stressLevels = ages.map(age => {
      const ageData = data.filter(d => d.age === age);
      const averageStress = ageData.reduce((acc, cur) => acc + cur.stress_level, 0) / ageData.length;
      return averageStress;
    });

    return {
      labels: ages,
      datasets: [{
        label: 'Average Stress Level by Age',
        data: stressLevels,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }]
    };
  };

  // Prepare data for different charts
  const genderChartData = processGenderData(surveyData);
  const dietChartData = processDietData(surveyData);
  const gpaChartData = processGpaData(surveyData);
  const stressChartData = processStressData(surveyData);

  return (
    <div>
      {/* Page title */}
      <h1 className={styles.title}>Healthy Eating Habits and Academic Performance Analysis</h1>
      {/* Graph cards container */}
      <div className={styles.cardContainer}>
        {/* Pie charts for gender, diet, and GPA */}
        <GraphCard title="Total Responses by Gender" chartData={genderChartData} type="Pie" />
        <GraphCard title="Distribution of Diets" chartData={dietChartData} type="Pie" />
        <GraphCard title="Distribution of GPAs" chartData={gpaChartData} type="Pie" />
        <GraphCard title="Average Stress Level by Age" chartData={stressChartData} type="Line" />
        {/* Additional charts as needed */}
      </div>
    </div>
  );
};

export default GraphPage;
