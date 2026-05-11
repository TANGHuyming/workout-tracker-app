# MongoDB Setup Guide

## Current Status
✅ MongoDB providers created with full CRUD operations
✅ Auth API routes updated to use UserProvider and WorkoutProvider
✅ Mongoose models created with validation
✅ `.env.local` file created with placeholder URI

## Next Steps to Get Started

### 1. Set Up MongoDB

**Option A: MongoDB Atlas (Recommended for Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new project
4. Create a cluster (M0 tier is free)
5. Wait for cluster to initialize (~5-10 minutes)
6. Click "Connect" button
7. Choose "Drivers"
8. Select Node.js and copy the connection string
9. Replace `<password>` and `<username>` with your credentials

**Option B: Local MongoDB**
1. Install MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Connection string: `mongodb://localhost:27017/workout-tracker`

### 2. Update `.env.local`

Edit `d:\workout-tracker-app\.env.local`:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/workout-tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-in-production
```

Replace:
- `username` - Your MongoDB username
- `password` - Your MongoDB password
- `cluster0` - Your cluster name
- `workout-tracker` - Database name (or your preferred name)

### 3. Verify Connection

Restart the dev server:
```bash
npm run dev
```

Try registering a new account at http://localhost:3000

If successful, the user data will be saved to MongoDB!

---

## Available API Endpoints

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current authenticated user

### Future Workout Endpoints (To be created)
- `GET /api/workouts` - Get user's workouts
- `POST /api/workouts` - Create new workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

---

## Provider Usage Examples

### UserProvider
```typescript
import { UserProvider } from '@/app/providers/UserProvider';

// Create user
const user = await UserProvider.create({
  email: 'user@example.com',
  username: 'johndoe',
  passwordHash: hashedPassword
});

// Find user
const user = await UserProvider.findByEmail('user@example.com');
const user = await UserProvider.findById(userId);

// Update user
await UserProvider.update(userId, { username: 'newname' });

// Delete user
await UserProvider.delete(userId);
```

### WorkoutProvider
```typescript
import { WorkoutProvider } from '@/app/providers/WorkoutProvider';

// Create workout
const workout = await WorkoutProvider.create({
  userId: userId,
  name: 'Bench Press',
  type: 'strength',
  sets: 4,
  reps: 8,
  weight: 225,
  intensity: 'high'
});

// Get user workouts
const workouts = await WorkoutProvider.findByUserId(userId);

// Get filtered workouts
const workouts = await WorkoutProvider.findByUserIdFiltered(userId, {
  type: 'strength',
  sortBy: 'weight'
});

// Get stats
const stats = await WorkoutProvider.getStatsByUserId(userId);
```

---

## File Structure

```
app/
├── lib/
│   └── mongodb.ts              # MongoDB connection singleton
├── models/
│   ├── User.ts                 # User Mongoose model
│   └── Workout.ts              # Workout Mongoose model
├── providers/
│   ├── UserProvider.ts         # User CRUD operations
│   └── WorkoutProvider.ts      # Workout CRUD operations
└── api/auth/
    ├── register/route.ts       # Uses UserProvider
    ├── login/route.ts          # Uses UserProvider
    ├── logout/route.ts
    └── me/route.ts             # Uses UserProvider
```

---

## Troubleshooting

### "Please define the MONGODB_URI environment variable"
- Check `.env.local` file exists in root directory
- Verify `MONGODB_URI` is set correctly
- Restart dev server after changing `.env.local`

### "MongoError: connect ECONNREFUSED"
- Verify MongoDB is running
- Check connection string is correct
- For Atlas, verify IP is whitelisted (use 0.0.0.0/0 for development)

### "Invalid authentication credentials"
- Check username and password in connection string
- Verify MongoDB user exists in your cluster
- Ensure special characters in password are URL-encoded

---

## Next Phase: Workout API Routes

Once MongoDB is set up and working, we can create:
- `POST /api/workouts` - Create workout (linked to authenticated user)
- `GET /api/workouts` - Get all user workouts
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

This will replace the current in-memory workout storage with persistent database storage.
