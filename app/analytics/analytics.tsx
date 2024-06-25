// SurveyAnalytics.tsx
"use client"
// SurveyAnalytics.tsx

import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2'; // Assuming you may need different chart types
import styles from './AnalyticsPage.module.css'; // Import styles if needed

const Analytics: React.FC = () => {
  const [surveyData, setSurveyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/submit-survey');
        if (response.ok) {
          const data = await response.json();
          setSurveyData(data.surveys);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };

    fetchData();
  }, []);

  const prepareHealthRatingsChartData = () => {
    const healthRatings = surveyData.map((survey) => survey.health_rating);
    const ratingCounts = [0, 0, 0, 0, 0]; // Initialize counts for each rating
    healthRatings.forEach((rating) => {
      ratingCounts[parseInt(rating) - 1]++; // Assuming ratings are from 1 to 5
    });

    return {
      labels: ['1 - Very Poor', '2 - Poor', '3 - Average', '4 - Good', '5 - Very Good'],
      datasets: [
        {
          label: 'Health Ratings',
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.6)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data: ratingCounts,
        },
      ],
    };
  };

  const prepareGenderChartData = () => {
    const genderData = surveyData.reduce((acc, survey) => {
      if (!acc[survey.gender]) {
        acc[survey.gender] = 0;
      }
      acc[survey.gender]++;
      return acc;
    }, {});

    const labels = Object.keys(genderData);
    const data = Object.values(genderData);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Gender Distribution',
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          data: data,
        },
      ],
    };
  };

  const prepareAgeDistributionChartData = () => {
    const ageData = surveyData.map((survey) => parseInt(survey.age));
    const ageLabels = Array.from(new Set(ageData)).sort((a, b) => a - b); // Unique ages sorted

    const ageCounts = ageLabels.map((age) =>
      ageData.filter((data) => data === age).length
    );

    return {
      labels: ageLabels.map((age) => age.toString()),
      datasets: [
        {
          label: 'Age Distribution',
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
          hoverBorderColor: 'rgba(54, 162, 235, 1)',
          data: ageCounts,
        },
      ],
    };
  };

  const prepareFruitsVegetablesChartData = () => {
    const servingsData = surveyData.map((survey) => parseInt(survey.fruits_vegetables));

    const averageServings = servingsData.reduce((acc, servings) => acc + servings, 0) / servingsData.length;

    return {
      labels: ['Average Servings'],
      datasets: [
        {
          label: 'Daily Servings of Fruits and Vegetables',
          backgroundColor: '#FF6384',
          hoverBackgroundColor: '#FF6384',
          data: [averageServings],
        },
      ],
    };
  };

  const prepareFastFoodFrequencyChartData = () => {
    const fastFoodData = surveyData.map((survey) => parseInt(survey.fast_food));

    const frequencyCounts = [0, 0, 0, 0, 0]; // Initialize counts for frequencies
    fastFoodData.forEach((frequency) => {
      frequencyCounts[frequency - 1]++;
    });

    return {
      labels: ['1', '2', '3', '4', '5'], // Assuming 1 to 5 frequencies
      datasets: [
        {
          label: 'Weekly Frequency of Eating Fast Food',
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255, 159, 64, 0.8)',
          hoverBorderColor: 'rgba(255, 159, 64, 1)',
          data: frequencyCounts,
        },
      ],
    };
  };

  const prepareDietPreferencesChartData = () => {
    const dietData = surveyData.reduce((acc, survey) => {
      if (!acc[survey.diet]) {
        acc[survey.diet] = 0;
      }
      acc[survey.diet]++;
      return acc;
    }, {});

    const labels = Object.keys(dietData);
    const data = Object.values(dietData);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Diet Preferences',
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Add more colors if needed
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          data: data,
        },
      ],
    };
  };

  const prepareAverageGPACardData = () => {
    const gpaData = surveyData.map((survey) => parseFloat(survey.gpa));

    const averageGPA =
      gpaData.reduce((acc, gpa) => acc + gpa, 0) / (gpaData.length || 1);

    return {
      labels: ['Average GPA'],
      datasets: [
        {
          label: 'Average GPA',
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          hoverBackgroundColor: 'rgba(153, 102, 255, 0.8)',
          data: [averageGPA],
        },
      ],
    };
  };

  return (
    <div className={styles.container}>
      <h2>Survey Analytics</h2>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          <h3>Health Ratings</h3>
          <Bar data={prepareHealthRatingsChartData()} />
        </div>
        <div className={styles.chart}>
          <h3>Gender Distribution</h3>
          <Doughnut data={prepareGenderChartData()} />
        </div>
        <div className={styles.chart}>
          <h3>Age Distribution</h3>
          <Bar data={prepareAgeDistributionChartData()} />
        </div>
        <div className={styles.chart}>
          <h3>Daily Servings of Fruits and Vegetables</h3>
          <Bar data={prepareFruitsVegetablesChartData()} />
        </div>
        <div className={styles.chart}>
          <h3>Weekly Frequency of Eating Fast Food</h3>
          <Bar data={prepareFastFoodFrequencyChartData()} />
        </div>
        <div className={styles.chart}>
          <h3>Diet Preferences</h3>
          <Doughnut data={prepareDietPreferencesChartData()} />
        </div>
        <div className={styles.chart}>
          <h3>Average GPA</h3>
          <Bar data={prepareAverageGPACardData()} />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
