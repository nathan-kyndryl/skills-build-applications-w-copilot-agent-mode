import express from 'express';
import mongoose from 'mongoose';
import './config/database.js';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models/index.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', request.headers.origin ?? '*');
  response.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.header('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});

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

app.get('/', (_request, response) => {
  response.json({
    service: 'octofit-tracker-api',
    status: 'ok',
    apiBasePath: '/api'
  });
});

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

const registerCollectionRoutes = (
  resource: string,
  model: any,
  fallback: Array<Record<string, unknown>>
) => {
  const routePath = `/api/${resource}`;
  const slashRoutePath = `${routePath}/`;

  app.get([routePath, slashRoutePath], async (_request, response) => {
    const data = await getCollection(model, fallback);
    response.json(data);
  });

  app.post([routePath, slashRoutePath], async (request, response) => {
    const payload = request.body ?? {};
    const createdItem = await createCollectionItem(model, resource.replace(/s$/, ''), payload as Record<string, unknown>, fallback);
    response.status(201).json({ message: `${resource.replace(/s$/, '')} created`, data: createdItem });
  });
};

registerCollectionRoutes('users', User, fallbackUsers);
registerCollectionRoutes('teams', Team, fallbackTeams);
registerCollectionRoutes('activities', Activity, fallbackActivities);
registerCollectionRoutes('leaderboard', LeaderboardEntry, fallbackLeaderboard);
registerCollectionRoutes('workouts', Workout, fallbackWorkouts);

app.listen(port, () => {
  console.log(`OctoFit API listening on port ${port}`);
  console.log(`Codespaces-aware API base URL: ${getApiBaseUrl()}`);
});