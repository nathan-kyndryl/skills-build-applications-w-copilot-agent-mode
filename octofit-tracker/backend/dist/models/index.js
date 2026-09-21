import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    team: { type: String, required: true },
    level: { type: String, default: 'Intermediate' },
    active: { type: Boolean, default: true }
}, { timestamps: true });
const teamSchema = new Schema({
    name: { type: String, required: true, unique: true },
    members: { type: Number, required: true },
    focus: { type: String, required: true },
    description: { type: String, default: '' }
}, { timestamps: true });
const activitySchema = new Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
    calories: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });
const leaderboardSchema = new Schema({
    rank: { type: Number, required: true },
    user: { type: String, required: true },
    points: { type: Number, required: true }
}, { timestamps: true });
const workoutSchema = new Schema({
    title: { type: String, required: true },
    difficulty: { type: String, required: true },
    duration: { type: Number, required: true },
    focus: { type: String, default: 'Full body' },
    description: { type: String, default: '' }
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Activity = mongoose.model('Activity', activitySchema);
export const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardSchema);
export const Workout = mongoose.model('Workout', workoutSchema);
