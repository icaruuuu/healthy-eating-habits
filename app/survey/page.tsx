// app/survey/page.tsx
"use client"

import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { getData} from '../../actions/get'
import styles from './SurveyPage.module.css';

interface FormData {
    name: string;
    age: string;
    gender: string;
    fruits_vegetables: string;
    fast_food: string;
    diet: string;
    health_rating: string;
    gpa: string;
}

const SurveyPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        age: '',
        gender: '',
        fruits_vegetables: '',
        fast_food: '',
        diet: '',
        health_rating: '',
        gpa: ''
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
            const data = await getData()
            console.log(data);
            
        }

        fetchData()
       
      }, [])

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Healthy Eating Habits and Academic Performance Survey</h1>
            <form onSubmit={handleSubmit} className={styles.formContainer}>
                <label htmlFor="name" className={styles.label}>Name:</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={styles.input} />

                <label htmlFor="age" className={styles.label}>Age:</label>
                <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} required className={styles.input} />

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
                <input type="text" id="gpa" name="gpa" value={formData.gpa} onChange={handleChange} required className={styles.input} />

                <button type="submit" className={styles.button}>Submit</button>
            </form>
        </div>
    );
};

export default SurveyPage;
