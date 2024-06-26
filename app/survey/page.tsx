// app/survey/page.tsx
"use client"

import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { getData } from '../../actions/get';
import styles from './SurveyPage.module.css';

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

const SurveyPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        age: '',
        course: '',
        gender: '',
        fruits_vegetables: '',
        fast_food: '',
        diet: '',
        health_rating: '',
        gpa: '',
        study_hours: '',
        extracurricular: '',
        sleep_hours: '',
        stress_level: '',
        class_attendance: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/submit-survey', formData);
            window.location.href = '/thankyou';
        } catch (error) {
            alert('Error submitting survey');
            console.error('Error submitting survey:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData();
            console.log(data);
        };

        fetchData();
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Healthy Eating Habits and Academic Performance Survey</h1>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <label htmlFor="name" className={styles.label}>Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={styles.input} />

                <label htmlFor="age" className={styles.label}>Age:</label>
                <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required className={styles.input} />

                <label htmlFor="course" className={styles.label}>Course:</label>
                <select id="course" name="course" value={formData.course} onChange={handleChange} required className={styles.select}>
                    <option value="">Select course</option>
                    <option value="computer_science">Computer Science</option>
                    <option value="business_administration">Business Administration</option>
                    <option value="psychology">Accountancy</option>
                    <option value="engineering">Engineering</option>
                    <option value="medicine">Medicine</option>
                    <option value="medicine">Information Technology</option>
                    <option value="medicine">Architecture</option>
                    <option value="medicine">Nursing</option>
                    <option value="medicine">Criminology</option>
                    <option value="other">Other</option>
                </select>

                <label htmlFor="gender" className={styles.label}>Gender:</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className={styles.select}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                </select>

                <label htmlFor="fruits_vegetables" className={styles.label}>Daily servings of fruits and vegetables:</label>
                <input type="number" id="fruits_vegetables" name="fruits_vegetables" value={formData.fruits_vegetables} onChange={handleChange} required className={styles.input} />

                <label htmlFor="fast_food" className={styles.label}>Weekly frequency of eating fast food:</label>
                <input type="number" id="fast_food" name="fast_food" value={formData.fast_food} onChange={handleChange} required className={styles.input} />

                <label htmlFor="diet" className={styles.label}>Do you follow a specific diet?</label>
                <select id="diet" name="diet" value={formData.diet} onChange={handleChange} required className={styles.select}>
                    <option value="">Select diet</option>
                    <option value="none">None</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="other">Other</option>
                </select>

                <label htmlFor="health_rating" className={styles.label}>Overall health rating:</label>
                <select id="health_rating" name="health_rating" value={formData.health_rating} onChange={handleChange} required className={styles.select}>
                    <option value="">Select health rating</option>
                    <option value="1">1 - Very Poor</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Average</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Very Good</option>
                </select>

                <label htmlFor="gpa" className={styles.label}>Average GPA:</label>
                <select id="gpa" name="gpa" value={formData.gpa} onChange={handleChange} required className={styles.select}>
                    <option value="">Select GPA</option>
                    <option value="1.00">1.00 = 99%-100%</option>
                    <option value="1.25">1.25 = 96%-98%</option>
                    <option value="1.50">1.50 = 93%-95%</option>
                    <option value="1.75">1.75= 90%-88%</option>
                    <option value="2.00">2.00 = 87%-85%</option>
                    <option value="2.25">2.25 = 84%-82%</option>
                    <option value="2.50">2.50 = 81%-79%</option>
                    <option value="2.75">2.75 = 78%-76%</option>
                    <option value="3.00">3.00 = 75%-77%</option>
                    <option value="4">4 = 61%-74%</option>
                    <option value="5">5 = below 60% </option>
                </select>

                <label htmlFor="study_hours" className={styles.label}>Average daily study hours:</label>
                <input type="number" id="study_hours" name="study_hours" value={formData.study_hours} onChange={handleChange} required className={styles.input} />

                <label htmlFor="extracurricular" className={styles.label}>Involvement in extracurricular activities:</label>
                <input type="text" id="extracurricular" name="extracurricular" value={formData.extracurricular} onChange={handleChange} required className={styles.input} />

                <label htmlFor="sleep_hours" className={styles.label}>Average daily sleep hours:</label>
                <input type="number" id="sleep_hours" name="sleep_hours" value={formData.sleep_hours} onChange={handleChange} required className={styles.input} />

                <label htmlFor="stress_level" className={styles.label}>Stress level (1-10):</label>
                <input type="number" id="stress_level" name="stress_level" value={formData.stress_level} onChange={handleChange} required className={styles.input} />

                <label htmlFor="class_attendance" className={styles.label}>Class attendance percentage:</label>
                <input type="number" id="class_attendance" name="class_attendance" value={formData.class_attendance} onChange={handleChange} required className={styles.input} />

                <button type="submit" className={styles.button} disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</button>
            </form>
        </div>
    );
};

export default SurveyPage;
