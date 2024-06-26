// pages/api/submit.js
import { NextResponse } from 'next/server';
import  connectMongo from '../../../lib/mongodb'
import HealthSurvey from '../../../models/HealthSurvey'

  export const GET = async () => {
    try {
      await connectMongo();
      const surveys = await HealthSurvey.find({}); // Retrieve all surveys
      return NextResponse.json({ surveys }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching survey data' }, { status: 500 });
    }
  };