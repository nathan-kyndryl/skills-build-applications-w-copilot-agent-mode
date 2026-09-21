import express from 'express';
import mongoose from 'mongoose';
import './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);

const getApiBaseUrl = () => {
  const codespaceName = process.env.CODESPACE_NAME;
  return codespaceName ? `https://${codespaceName}-8000.app.github.dev` : 'http://localhost:8000';
};

const normalizeDocument = (document: Record<string, unknown>) => {
  const { _id, __v, ...rest } = document;
  return {
    ...rest,
    id: _id ? String(_id) : rest.id ?? undefined
  };
};

const serializeCollection = (documents: Array<Record<string, unknown>>) => documents.map(normalizeDocument);

const getCollection = async (model: any, fallback: Array<Record<string, unknown>>) => {
  if (mongoose.connection.readyState === 1) {
    const documents = await model.find({}).lean();
    return serializeCollection(documents as Array<Record<string, unknown>>);
  }

  return fallback;
};

const createCollectionItem = async (
  model: any,
  entityName: string,
  payload: Record<string, unknown>,
  fallback: Array<Record<string, unknown>>
) => {
  if (mongoose.connection.readyState === 1) {
    const createdDocument = await model.create(payload);
    return normalizeDocument(createdDocument as Record<string, unknown>);
  }

  const newItem = { ...payload, id: payload.id ?? `${entityName}-${Date.now()}` };
  fallback.push(newItem);
  return newItem;
};

const fallbackUsers = [
  { id: 'user-1', name: 'Ava Thompson', email: 'ava@example.com', team: 'Shadow Crew' },
  { id: 'user-2', name: 'Leo Martinez', email: 'leo@example.com', team: 'Velocity' },
  { id: 'user-3', name: 'Nia Patel', email: 'nia@example.com', team: 'Summit Squad' }
];

const fallbackTeams = [
  { id: 'team-1', name: 'Shadow Crew', members: 12, focus: 'HIIT' },
  { id: 'team-2', name: 'Velocity', members: 9, focus: 'Running' },
  { id: 'team-3', name: 'Summit Squad', members: 15, focus: 'Strength' }
];

const fallbackActivities = [
  { id: 'activity-1', userId: 'user-1', type: 'Run', duration: 32, calories: 320 },
  { id: 'activity-2', userId: 'user-2', type: 'Cycle', duration: 45, calories: 410 },
  { id: 'activity-3', userId: 'user-3', type: 'Lift', duration: 60, calories: 540 }
];

const fallbackLeaderboard = [
  { rank: 1, user: 'Ava Thompson', points: 1280 },
  { rank: 2, user: 'Leo Martinez', points: 1175 },
  { rank: 3, user: 'Nia Patel', points: 1090 }
];

const fallbackWorkouts = [
  { id: 'workout-1', title: 'Power Intervals', difficulty: 'Advanced', duration: 30 },
  { id: 'workout-2', title: 'Core & Mobility', difficulty: 'Beginner', duration: 20 },
  { id: 'workout-3', title: 'Sprint Ladder', difficulty: 'Intermediate', duration: 25 }
];

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'octofit-tracker-api',
    apiBaseUrl: getApiBaseUrl(),
    port
  });
});

app.get('/api/config', (_request, response) => {
  response.json({
    apiBaseUrl: getApiBaseUrl(),
    environment: process.env.NODE_ENV ?? 'development',
    service: 'octofit-tracker-api'
  });
});

app.get('/api/users', async (_request, response) => {
  const data = await getCollection(User, fallbackUsers);
  response.json({ data, count: data.length });
});

app.post('/api/users', async (request, response) => {
  const payload = request.body ?? {};
  const createdItem = await createCollectionItem(User, 'user', payload, fallbackUsers);
  response.status(201).json({ message: 'user created', data: createdItem });
});

app.get('/api/teams', async (_request, response) => {
  const data = await getCollection(Team, fallbackTeams);
  response.json({ data, count: data.length });
});

app.post('/api/teams', async (request, response) => {
  const payload = request.body ?? {};
  const createdItem = await createCollectionItem(Team, 'team', payload, fallbackTeams);
  response.status(201).json({ message: 'team created', data: createdItem });
});

app.get('/api/activities', async (_request, response) => {
  const data = await getCollection(Activity, fallbackActivities);
  response.json({ data, count: data.length });
});

app.post('/api/activities', async (request, response) => {
  const payload = request.body ?? {};
  const createdItem = await createCollectionItem(Activity, 'activity', payload, fallbackActivities);
  response.status(201).json({ message: 'activity created', data: createdItem });
});

app.get('/api/leaderboard', async (_request, response) => {
  const data = await getCollection(LeaderboardEntry, fallbackLeaderboard);
  response.json({ data, count: data.length });
});

app.post('/api/leaderboard', async (request, response) => {
  const payload = request.body ?? {};
  const createdItem = await createCollectionItem(LeaderboardEntry, 'leaderboard', payload, fallbackLeaderboard);
  response.status(201).json({ message: 'leaderboard created', data: createdItem });
});

app.get('/api/workouts', async (_request, response) => {
  const data = await getCollection(Workout, fallbackWorkouts);
  response.json({ data, count: data.length });
});

app.post('/api/workouts', async (request, response) => {
  const payload = request.body ?? {};
  const createdItem = await createCollectionItem(Workout, 'workout', payload, fallbackWorkouts);
  response.status(201).json({ message: 'workout created', data: createdItem });
});

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
  console.log(`Codespaces-aware API base URL: ${getApiBaseUrl()}`);
});