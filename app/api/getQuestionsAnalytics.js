// pages/api/getQuestionAnalytics.js

const connectMongo = require('../../lib/mongodb');
const HealthSurvey = require('../../models/HealthSurvey');

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        try {
            await connectMongo(); // Connect to MongoDB

            const { question } = req.query;
            const analytics = await HealthSurvey.aggregate([
                { $group: { _id: `$${question}`, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]);

            res.status(200).json({ analytics });
        } catch (error) {
            console.error('Error fetching analytics:', error);
            res.status(500).json({ error: 'Failed to fetch analytics' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
};
