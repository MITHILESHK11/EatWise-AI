import { User } from '../types';

const SESSION_KEY = 'eatwise_session';

export const login = async (): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a mock user
  const mockUser: User = {
    id: 'user_' + Math.floor(Math.random() * 10000),
    name: 'Alex Johnson',
    email: 'alex.j@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(mockUser));
  return mockUser;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSession = (): User | null => {
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};
