
import { Challenge, CampusResource, Badge } from './types';

export const MOCK_CHALLENGES: Challenge[] = [
  { id: '1', title: 'Reusable Bottle', description: 'Use a reusable water bottle all day.', points: 10, category: 'Waste', icon: '🚰' },
  { id: '2', title: 'Power Down', description: 'Turn off all lights and unplug devices before leaving.', points: 15, category: 'Energy', icon: '💡' },
  { id: '3', title: 'Walk or Bike', description: 'Commute to class without using a car or bus.', points: 20, category: 'Transport', icon: '🚲' },
  { id: '4', title: 'Meatless Meal', description: 'Eat at least one fully plant-based meal today.', points: 15, category: 'Food', icon: '🥗' },
  { id: '5', title: 'Correct Sorting', description: 'Ensure all your waste is sorted into the correct bins.', points: 5, category: 'Waste', icon: '♻️' },
  { id: '6', title: 'Zero Waste Kit', description: 'Carry a set of reusable cutlery and straw.', points: 25, category: 'Waste', icon: '🍴' },
];

export const BADGES: Badge[] = [
  { id: 'b1', name: 'Sprout', icon: '🌱', description: 'Started your green journey.', requirement: 0 },
  { id: 'b2', name: 'Water Warrior', icon: '🌊', description: 'Reach 100 points.', requirement: 100 },
  { id: 'b3', name: 'Energy Elite', icon: '⚡', description: 'Reach 250 points.', requirement: 250 },
  { id: 'b4', name: 'Carbon Killer', icon: '🌳', description: 'Reach 500 points.', requirement: 500 },
];

export const MOCK_RESOURCES: CampusResource[] = [
  { id: 'r1', name: 'Student Union Refill', type: 'Water', lat: 40.7128, lng: -74.0060, description: 'High-speed filtered water station.' },
  { id: 'r2', name: 'Library Bike Rack', type: 'Bike', lat: 40.7130, lng: -74.0065, description: 'Covered parking for 50 bikes.' },
  { id: 'r3', name: 'Engineering Quad Recycling', type: 'Recycle', lat: 40.7125, lng: -74.0055, description: 'E-waste and paper specialty bins.' },
  { id: 'r4', name: 'Gym Refill Station', type: 'Water', lat: 40.7135, lng: -74.0070, description: 'Located near the main entrance.' },
];

export const LEADERBOARD_DATA = [
  { name: 'EcoWarrior_Sarah', points: 1250 },
  { name: 'GreenCampus_Dan', points: 1100 },
  { name: 'Sustainability_Sam', points: 980 },
  { name: 'RecycleKing', points: 850 },
  { name: 'BikeGirl99', points: 720 },
];
