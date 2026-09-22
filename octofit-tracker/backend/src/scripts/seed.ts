import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models/index.js';

const connectionString = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({})
    ]);

    const users = await User.insertMany([
      { name: 'Ava Thompson', email: 'ava@example.com', team: 'Shadow Crew', level: 'Advanced', active: true },
      { name: 'Leo Martinez', email: 'leo@example.com', team: 'Velocity', level: 'Advanced', active: true },
      { name: 'Nia Patel', email: 'nia@example.com', team: 'Summit Squad', level: 'Intermediate', active: true },
      { name: 'Milo Chen', email: 'milo@example.com', team: 'Velocity', level: 'Beginner', active: true },
      { name: 'Sara Gomez', email: 'sara@example.com', team: 'Shadow Crew', level: 'Intermediate', active: true }
    ]);

    await Team.insertMany([
      { name: 'Shadow Crew', members: 12, focus: 'HIIT', description: 'Fast-paced interval training and sprint conditioning.' },
      { name: 'Velocity', members: 9, focus: 'Running', description: 'Endurance building with track-focused workouts.' },
      { name: 'Summit Squad', members: 15, focus: 'Strength', description: 'Compound lifts and power training sessions.' }
    ]);

    await Activity.insertMany([
      { userId: users[0]._id.toString(), type: 'Run', duration: 32, calories: 320, date: new Date('2026-09-20T06:30:00Z') },
      { userId: users[1]._id.toString(), type: 'Cycle', duration: 45, calories: 410, date: new Date('2026-09-20T18:00:00Z') },
      { userId: users[2]._id.toString(), type: 'Lift', duration: 60, calories: 540, date: new Date('2026-09-19T17:15:00Z') },
      { userId: users[3]._id.toString(), type: 'Walk', duration: 25, calories: 180, date: new Date('2026-09-18T07:00:00Z') }
    ]);

    await LeaderboardEntry.insertMany([
      { rank: 1, user: 'Ava Thompson', points: 1280 },
      { rank: 2, user: 'Leo Martinez', points: 1175 },
      { rank: 3, user: 'Nia Patel', points: 1090 },
      { rank: 4, user: 'Milo Chen', points: 1015 }
    ]);

    await Workout.insertMany([
      { title: 'Power Intervals', difficulty: 'Advanced', duration: 30, focus: 'Cardio', description: 'Explosive interval rounds tailored for speed and stamina.' },
      { title: 'Core & Mobility', difficulty: 'Beginner', duration: 20, focus: 'Recovery', description: 'Low-impact mobility and core activation sequence.' },
      { title: 'Sprint Ladder', difficulty: 'Intermediate', duration: 25, focus: 'Speed', description: 'Progressive sprint intervals that build acceleration.' },
      { title: 'Leg Day Burn', difficulty: 'Advanced', duration: 40, focus: 'Strength', description: 'Heavy lower-body circuit emphasizing form and power.' }
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
