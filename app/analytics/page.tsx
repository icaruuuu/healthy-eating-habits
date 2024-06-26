// app/admin/page.tsx
"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from './Analytics.module.css'; // Import the CSS module
import Link from 'next/link';

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
      <Line data={chartData} options={{ maintainAspectRatio: false }} />
    </div>
  </div>
);

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
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1
    }]
  };

  const studyHoursChartData = {
    labels: ["0-5 hours", "6-10 hours", "11-15 hours", "16+ hours"],
    datasets: [{
      label: 'Average GPA by Study Hours',
      data: processData(surveyData).studyHoursData,
      fill: false,
      borderColor: 'rgba(153, 102, 255, 1)',
      tension: 0.1
    }]
  };

  const healthRatingChartData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [{
      label: 'Average GPA by Health Rating',
      data: processData(surveyData).healthRatingData,
      fill: false,
      borderColor: 'rgba(255, 159, 64, 1)',
      tension: 0.1
    }]
  };

  return (
    <div>
      <nav className={styles.topnav}>
        <div className={styles.left}>
          <Link href="/dashboard">Profile</Link>
        </div>
        <div className={styles.middle}>
          <Link href="/dashboard/admin">Dashboard</Link>
          <Link href="/dashboard/admin/survey-answers">Survey Answers</Link>
        </div>
      </nav>
      <h1 className={styles.title}>Healthy Eating Habits and Academic Performance</h1>
      <div className={styles.cardContainer}>
        <GraphCard title="Average GPA by Diet" chartData={dietChartData} />
        <GraphCard title="Average GPA by Study Hours" chartData={studyHoursChartData} />
        <GraphCard title="Average GPA by Health Rating" chartData={healthRatingChartData} />
      </div>
    </div>
  );
};

export default GraphPage;
