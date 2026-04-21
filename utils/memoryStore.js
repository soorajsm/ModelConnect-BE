import bcrypt from 'bcryptjs';

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const now = () => new Date().toISOString();

export const memoryStore = {
  users: [],
  modelProfiles: [],
  clientProfiles: [],
  opportunities: [],
  applications: [],
  portfolio: [],
  contactMessages: [],
};

export async function seedMemoryStore() {
  if (memoryStore.users.length) return;
  const password = await bcrypt.hash('password123', 10);
  const modelUser = {
    _id: createId('usr'),
    name: 'Aarohi Kapoor',
    email: 'demo@modelconnect.com',
    password,
    role: 'model',
    phone: '',
    avatar: '',
    isVerified: true,
    createdAt: now(),
  };
  const clientUser = {
    _id: createId('usr'),
    name: 'Luxe Brand Studio',
    email: 'client@modelconnect.com',
    password,
    role: 'client',
    phone: '',
    avatar: '',
    isVerified: true,
    createdAt: now(),
  };
  memoryStore.users.push(modelUser, clientUser);
  memoryStore.modelProfiles.push({
    _id: createId('mod'),
    userId: modelUser._id,
    fullName: 'Aarohi Kapoor',
    city: 'Mumbai',
    categories: ['Fashion', 'Runway', 'Commercial'],
    experienceLevel: 'Intermediate',
    bio: 'Editorial and runway model available for beauty, fashion and campaign shoots.',
    heightCm: 173,
    profileImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    isPublished: true,
    createdAt: now(),
  });
  memoryStore.clientProfiles.push({
    _id: createId('cli'),
    userId: clientUser._id,
    companyName: 'Luxe Brand Studio',
    contactPerson: 'Rhea Mehta',
    businessType: 'Fashion Brand',
    email: 'client@modelconnect.com',
    location: 'Bengaluru',
    createdAt: now(),
  });
  memoryStore.opportunities.push(
    {
      _id: createId('opp'),
      title: 'Editorial Photoshoot for Luxury Resort Campaign',
      company: 'Luxe Brand Studio',
      category: 'Fashion',
      description: 'Looking for confident female models for a polished resortwear editorial campaign with full creative direction and styling.',
      requirements: 'Strong posing, elegant expressions, portfolio preferred.',
      budgetMin: 15000,
      budgetMax: 30000,
      currency: 'INR',
      location: 'Goa',
      projectType: 'photoshoot',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
      shootDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20).toISOString(),
      status: 'open',
      createdBy: clientUser._id,
      createdAt: now(),
    },
    {
      _id: createId('opp'),
      title: 'Runway Casting for Designer Showcase',
      company: 'Luxe Brand Studio',
      category: 'Runway',
      description: 'Seeking tall runway models for a premium designer showcase. Prior ramp walk experience preferred.',
      requirements: 'Height 170cm+, confident runway walk, neutral makeup.',
      budgetMin: 20000,
      budgetMax: 45000,
      currency: 'INR',
      location: 'Mumbai',
      projectType: 'fashion_show',
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      shootDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18).toISOString(),
      status: 'open',
      createdBy: clientUser._id,
      createdAt: now(),
    }
  );
}

export function sanitizeUser(user) {
  const { password, ...safe } = user;
  return safe;
}

export function findUserByEmail(email) {
  return memoryStore.users.find((item) => item.email === String(email || '').toLowerCase().trim()) || null;
}

export function findUserById(id) {
  return memoryStore.users.find((item) => item._id === id) || null;
}

export function createUser({ name, email, password, role }) {
  const user = {
    _id: createId('usr'),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role,
    phone: '',
    avatar: '',
    isVerified: false,
    createdAt: now(),
  };
  memoryStore.users.push(user);
  return user;
}

export function createModelProfile(payload) {
  const item = { _id: createId('mod'), createdAt: now(), ...payload };
  memoryStore.modelProfiles.push(item);
  return item;
}

export function createClientProfile(payload) {
  const item = { _id: createId('cli'), createdAt: now(), ...payload };
  memoryStore.clientProfiles.push(item);
  return item;
}
