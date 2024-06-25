// pages/analytics/AnalyticsPage.tsx
"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import styles from './AnalyticsPage.module.css';

interface QuestionAnalytics {
    map: any;
    _id: string;
    count: number;
}

const AnalyticsPage: React.FC = () => {
    const [questionAnalytics, setQuestionAnalytics] = useState<QuestionAnalytics[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all([
                    axios.get('/api/getQuestionAnalytics?question=gender'),
                    axios.get('/api/getQuestionAnalytics?question=fruits_vegetables'),
                    axios.get('/api/getQuestionAnalytics?question=fast_food'),
                    axios.get('/api/getQuestionAnalytics?question=diet'),
                    axios.get('/api/getQuestionAnalytics?question=health_rating'),
                    axios.get('/api/getQuestionAnalytics?question=gpa'),
                    // Add more API calls for other questions as needed
                ]);

                const analyticsData = responses.map(response => response.data.analytics);
                setQuestionAnalytics(analyticsData);
                renderCharts(analyticsData);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };

        fetchData();
    }, []);

    const renderCharts = (analyticsData: QuestionAnalytics[]) => {
        analyticsData.forEach((data, index) => {
            const chartData = {
                labels: data.map(item => item._id),
                datasets: [{
                    label: `Responses for ${data[0]._id}`, // Assuming first item in data array represents the question
                    data: data.map(item => item.count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            };

            const ctx = document.getElementById(`chart-${index}`) as HTMLCanvasElement | null;
            if (ctx) {
                new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Count'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Answers'
                                }
                            }
                        }
                    }
                });
            }
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Survey Analytics</h1>
            <div className={styles.analyticsContainer}>
                {questionAnalytics.map((data, index) => (
                    <div key={index} className={styles.chartContainer}>
                        <h2>{data[0]._id}</h2> {/* Assuming first item in data array represents the question */}
                        <canvas id={`chart-${index}`} width={400} height={300}></canvas>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsPage;
