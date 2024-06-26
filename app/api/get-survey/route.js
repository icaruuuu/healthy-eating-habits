import { NextResponse } from 'next/server';
import connectMongo from '../../../lib/mongodb';
import HealthSurvey from '../../../models/HealthSurvey';

export const revalidate = 0;

export async function GET() {
  try {
    await connectMongo(); // Ensure the database is connected
    const surveyData = await HealthSurvey.find({});
    console.log("Fetched survey data:", surveyData);
    return NextResponse.json(surveyData, { status: 200 });
  } catch (error) {
    console.error('Error fetching survey data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
