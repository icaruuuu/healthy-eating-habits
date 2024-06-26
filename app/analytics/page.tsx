"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from './Analytics.module.css';

import { ChartOptions } from 'chart.js';

interface FormData {
  name: string;
  age: string;
  course: string;
  gender: string;
  fruits_vegetables: string;
  fast_food: string;
  diet: string;
  health_rating: string;
  gpa: string;
  study_hours: string;
  extracurricular: string;
  sleep_hours: string;
  stress_level: string;
  class_attendance: string;
}

const GraphCard: React.FC<{ title: string, chartData: any }> = ({ title, chartData }) => (
  <div className={styles.card}>
    <h2>{title}</h2>
    <div className={styles.chartWrapper}>
      <Pie data={chartData} options={{ maintainAspectRatio: false }} width={400} height={400} />
    </div>
  </div>
);

const ResponseChart: React.FC<{ question: string, responses: number[] }> = ({ question, responses }) => {
  const data = {
    labels: responses.map((_, index) => `Response ${index + 1}`),
    datasets: [{
      label: question,
      data: responses,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderWidth: 1
    }]
  };

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'top', // Adjust position as needed
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const value = typeof tooltipItem.raw === 'number' ? tooltipItem.raw.toFixed(2) : tooltipItem.raw;
            return `${tooltipItem.label}: ${value}`;
          }
        }
      }
    }
  };

  return <Pie data={data} options={options} />;
};

const GraphPage: React.FC = () => {
  const [surveyData, setSurveyData] = useState<FormData[]>([]);

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

  const processData = (data: FormData[]) => {
    const dietCategories = ["None", "Vegetarian", "Vegan", "Keto", "Other"];
    const dietData = dietCategories.map(diet => {
      const dietSurveyData = data.filter(d => d.diet === diet);
      const averageGPA = dietSurveyData.reduce((acc, cur) => acc + parseFloat(cur.gpa), 0) / dietSurveyData.length;
      return averageGPA ? averageGPA.toFixed(2) : 0;
    });

    const studyHoursCategories = ["0-5 hours", "6-10 hours", "11-15 hours", "16+ hours"];
    const studyHoursData = studyHoursCategories.map(hours => {
      const hoursSurveyData = data.filter(d => d.study_hours === hours);
      const averageGPA = hoursSurveyData.reduce((acc, cur) => acc + parseFloat(cur.gpa), 0) / hoursSurveyData.length;
      return averageGPA ? averageGPA.toFixed(2) : 0;
    });

    const healthRatings = ["1", "2", "3", "4", "5"];
    const healthRatingData = healthRatings.map(rating => {
      const ratingSurveyData = data.filter(d => d.health_rating === rating);
      const averageGPA = ratingSurveyData.reduce((acc, cur) => acc + parseFloat(cur.gpa), 0) / ratingSurveyData.length;
      return averageGPA ? averageGPA.toFixed(2) : 0;
    });

    return { dietData, studyHoursData, healthRatingData };
  };

  const dietChartData = {
    labels: ["None", "Vegetarian", "Vegan", "Keto", "Other"],
    datasets: [{
      label: 'Average GPA by Diet',
      data: processData(surveyData).dietData,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderWidth: 1
    }]
  };

  const studyHoursChartData = {
    labels: ["0-5 hours", "6-10 hours", "11-15 hours", "16+ hours"],
    datasets: [{
      label: 'Average GPA by Study Hours',
      data: processData(surveyData).studyHoursData,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
      borderWidth: 1
    }]
  };

  const healthRatingChartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [{
      label: 'Average GPA by Health Rating',
      data: processData(surveyData).healthRatingData,
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderWidth: 1
    }]
  };

  return (
    <div>
      <h1 className={styles.title}>Healthy Eating Habits and Academic Performance</h1>
      
      {/* Render individual response charts */}
      {surveyData.map((response, index) => (
        <div key={index}>
          <h3>Response Chart for Question {index + 1}</h3>
          <ResponseChart question={`Question ${index + 1}`} responses={[parseFloat(response.gpa)]} />
          {/* Replace `parseFloat(response.gpa)` with appropriate response data */}
        </div>
      ))}

      <div className={styles.cardContainer}>
        <GraphCard title="Average GPA by Diet" chartData={dietChartData} />
        <GraphCard title="Average GPA by Study Hours" chartData={studyHoursChartData} />
        <GraphCard title="Average GPA by Health Rating" chartData={healthRatingChartData} />
      </div>
    </div>
  );
};

export default GraphPage;
