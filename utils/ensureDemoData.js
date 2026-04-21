import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ModelProfile } from '../models/ModelProfile.js';
import { ClientProfile } from '../models/ClientProfile.js';
import { Opportunity } from '../models/Opportunity.js';

export async function ensureDemoData() {
  const count = await User.countDocuments();
  if (count > 0) return;

  const password = await bcrypt.hash('password123', 10);
  const modelUser = await User.create({
    name: 'Aarohi Kapoor',
    email: 'demo@modelconnect.com',
    password,
    role: 'model',
    isVerified: true,
  });

  const clientUser = await User.create({
    name: 'Luxe Brand Studio',
    email: 'client@modelconnect.com',
    password,
    role: 'client',
    isVerified: true,
  });

  await ModelProfile.create({
    userId: modelUser._id,
    fullName: 'Aarohi Kapoor',
    city: 'Mumbai',
    categories: ['Fashion', 'Runway', 'Commercial'],
    experienceLevel: 'Intermediate',
    bio: 'Editorial and runway model available for beauty, fashion and campaign shoots.',
    heightCm: 173,
    profileImageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    isPublished: true,
  });

  await ClientProfile.create({
    userId: clientUser._id,
    companyName: 'Luxe Brand Studio',
    contactPerson: 'Rhea Mehta',
    businessType: 'Fashion Brand',
    email: 'client@modelconnect.com',
    location: 'Bengaluru',
  });

  await Opportunity.insertMany([
    {
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
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      shootDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
      status: 'open',
      createdBy: clientUser._id,
    },
    {
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
      applicationDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      shootDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
      status: 'open',
      createdBy: clientUser._id,
    },
  ]);

  console.log('Demo data seeded');
}
