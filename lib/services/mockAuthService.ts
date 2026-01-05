import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, User, Session } from './types';

const STORAGE_KEY = 'mock_auth_session';
const USERS_STORAGE_KEY = 'mock_auth_users';

let authListeners: ((session: Session | null) => void)[] = [];

function createSession(user: User): Session {
  return {
    user,
    accessToken: `mock_token_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
}

function notifyListeners(session: Session | null) {
  authListeners.forEach((cb) => cb(session));
}

async function getStoredUsers(): Promise<Map<string, { user: User; password: string }>> {
  const stored = await AsyncStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) return new Map();
  const parsed = JSON.parse(stored);
  return new Map(Object.entries(parsed));
}

async function saveUsers(users: Map<string, { user: User; password: string }>): Promise<void> {
  const obj = Object.fromEntries(users);
  await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(obj));
}

export const mockAuthService: AuthService = {
  signUp: async (email, password, name) => {
    await new Promise((r) => setTimeout(r, 500));

    const users = await getStoredUsers();

    if (users.has(email)) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      createdAt: new Date(),
    };

    users.set(email, { user, password });
    await saveUsers(users);

    const session = createSession(user);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    notifyListeners(session);

    return { user, session };
  },

  signIn: async (email, password) => {
    await new Promise((r) => setTimeout(r, 500));

    const users = await getStoredUsers();
    const stored = users.get(email);

    if (!stored || stored.password !== password) {
      throw new Error('Invalid email or password');
    }

    const session = createSession(stored.user);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    notifyListeners(session);

    return { user: stored.user, session };
  },

  signOut: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    notifyListeners(null);
  },

  getSession: async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session: Session = JSON.parse(stored);

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      await AsyncStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return session;
  },

  onAuthStateChange: (callback) => {
    authListeners.push(callback);
    return () => {
      authListeners = authListeners.filter((cb) => cb !== callback);
    };
  },
};
