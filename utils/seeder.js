import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

const categories = [
  { name: 'Toy Cars', slug: 'toy-cars', icon: '🚗', description: 'Die-cast and plastic toy cars for all ages' },
  { name: 'Remote Control Cars', slug: 'remote-control-cars', icon: '🎮', description: 'RC cars and trucks' },
  { name: 'Toy Bikes', slug: 'toy-bikes', icon: '🏍️', description: 'Toy motorcycles and bicycles' },
  { name: 'Small Electronics', slug: 'small-electronics', icon: '📱', description: 'Gadgets and electronic devices' },
  { name: 'Gadgets', slug: 'gadgets', icon: '⚡', description: 'Cool tech gadgets' },
  { name: 'Batteries & Accessories', slug: 'batteries-accessories', icon: '🔋', description: 'Batteries and toy accessories' }
];

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany();
  await Category.deleteMany();
  await Product.deleteMany();
  console.log('🗑️  Cleared existing data');

  await User.create([
    { name: 'Admin User', email: 'admin@shaktitoys.com', password: 'admin123', role: 'admin' },
    { name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'user' }
  ]);
  console.log('👤 Users seeded');

  const createdCategories = await Category.insertMany(categories);
  console.log('📁 Categories seeded');
  const catMap = {};
  createdCategories.forEach(c => { catMap[c.slug] = c._id; });

  const products = [
    { name: 'Ferrari F40 Die-Cast Model', description: 'Premium die-cast Ferrari F40 model car in 1:18 scale. Perfect collector item with detailed interior and opening doors.', price: 29.99, originalPrice: 39.99, category: catMap['toy-cars'], brand: 'Bburago', stock: 50, isFeatured: true, rating: 4.5, numReviews: 28, discount: 25, tags: ['ferrari', 'diecast', 'collector'], images: ['https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&q=80'], specifications: [{ key: 'Scale', value: '1:18' }, { key: 'Material', value: 'Die-cast metal' }, { key: 'Age', value: '8+' }] },
    { name: 'Lamborghini Huracán RC Car', description: 'High-speed remote control Lamborghini Huracán with 2.4GHz technology. Up to 30km/h speed, 4WD, and rechargeable battery included.', price: 79.99, originalPrice: 99.99, category: catMap['remote-control-cars'], brand: 'Rastar', stock: 30, isFeatured: true, rating: 4.7, numReviews: 42, discount: 20, tags: ['lamborghini', 'rc', 'fast'], images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'], specifications: [{ key: 'Speed', value: '30 km/h' }, { key: 'Range', value: '50m' }, { key: 'Battery', value: 'Rechargeable Li-Ion' }] },
    { name: 'Kawasaki Ninja Toy Bike', description: 'Detailed 1:12 scale Kawasaki Ninja motorcycle with realistic paintwork. Die-cast body with rubber tires.', price: 24.99, category: catMap['toy-bikes'], brand: 'Maisto', stock: 45, isFeatured: true, rating: 4.3, numReviews: 15, tags: ['kawasaki', 'motorcycle', 'diecast'], images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'], specifications: [{ key: 'Scale', value: '1:12' }, { key: 'Material', value: 'Die-cast' }] },
    { name: 'Mini Bluetooth Speaker', description: 'Compact waterproof Bluetooth 5.0 speaker with 12-hour battery life, 360° sound, and built-in mic for calls.', price: 34.99, originalPrice: 49.99, category: catMap['small-electronics'], brand: 'JBL', stock: 80, isFeatured: true, rating: 4.6, numReviews: 67, discount: 30, tags: ['bluetooth', 'speaker', 'wireless'], images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'], specifications: [{ key: 'Battery', value: '12 hours' }, { key: 'Connectivity', value: 'Bluetooth 5.0' }, { key: 'Water Resistance', value: 'IPX7' }] },
    { name: 'Smart LED Desk Lamp', description: 'USB-C powered LED desk lamp with touch control, 5 brightness levels, 3 color temperatures, and phone wireless charging pad.', price: 45.99, category: catMap['gadgets'], brand: 'Baseus', stock: 60, isFeatured: true, rating: 4.4, numReviews: 33, tags: ['led', 'desk', 'smart'], images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80'], specifications: [{ key: 'Power', value: '10W' }, { key: 'Color Temp', value: '3000K-6000K' }] },
    { name: 'AA Alkaline Batteries 24-Pack', description: 'Long-lasting Duracell AA alkaline batteries. 10-year shelf life. Powers all your toys and electronics.', price: 14.99, category: catMap['batteries-accessories'], brand: 'Duracell', stock: 200, rating: 4.8, numReviews: 120, tags: ['batteries', 'aa', 'duracell'], images: ['https://images.unsplash.com/photo-1619866975816-70c9e1ac8bdd?w=600&q=80'], specifications: [{ key: 'Count', value: '24 pack' }, { key: 'Type', value: 'AA Alkaline' }, { key: 'Shelf Life', value: '10 years' }] },
    { name: 'Porsche 911 GT3 Pull-Back Car', description: 'Friction-powered Porsche 911 GT3 toy car. Pull back and release for realistic racing fun. Perfect for ages 3+.', price: 12.99, category: catMap['toy-cars'], brand: 'Hot Wheels', stock: 120, rating: 4.2, numReviews: 45, tags: ['porsche', 'pullback', 'kids'], images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80'] },
    { name: '4WD Monster Truck RC', description: 'Off-road 4WD monster truck with high suspension, LED lights, and turbo boost. Works on sand, grass, and rough terrain.', price: 89.99, originalPrice: 119.99, category: catMap['remote-control-cars'], brand: 'BEZGAR', stock: 25, rating: 4.5, numReviews: 38, discount: 25, tags: ['monster', 'offroad', '4wd'], images: ['https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&q=80'] },
    { name: 'Digital Multimeter Pro', description: 'Professional digital multimeter with auto-ranging, 6000 counts, measures voltage/current/resistance/capacitance/frequency.', price: 39.99, category: catMap['gadgets'], brand: 'Fluke', stock: 40, rating: 4.7, numReviews: 22, tags: ['multimeter', 'tools', 'electrical'], images: ['https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&q=80'] },
    { name: 'USB-C Power Bank 20000mAh', description: 'High-capacity 20000mAh power bank with 65W USB-C PD fast charging. Charges laptops, phones, and tablets simultaneously.', price: 59.99, originalPrice: 79.99, category: catMap['small-electronics'], brand: 'Anker', stock: 55, isFeatured: true, rating: 4.8, numReviews: 89, discount: 25, tags: ['powerbank', 'usbc', 'fast-charge'], images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80'] },
    { name: 'Harley Davidson Toy Bike Set', description: 'Set of 3 Harley Davidson motorcycles in different scales. Collector edition with chrome detailing and authentic paint.', price: 32.99, category: catMap['toy-bikes'], brand: 'Maisto', stock: 35, rating: 4.4, numReviews: 19, tags: ['harley', 'set', 'collector'], images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'] },
    { name: 'AAA Rechargeable Battery Pack', description: 'Pack of 8 Eneloop AAA rechargeable batteries. 2100 recharge cycles, pre-charged and ready to use.', price: 22.99, category: catMap['batteries-accessories'], brand: 'Panasonic', stock: 150, rating: 4.6, numReviews: 76, tags: ['aaa', 'rechargeable', 'eneloop'], images: ['https://images.unsplash.com/photo-1619866975816-70c9e1ac8bdd?w=600&q=80'] }
  ];

  await Product.insertMany(products);
  console.log('📦 Products seeded');
  console.log('✅ Seeding complete!');
  console.log('🔐 Admin: admin@shaktitoys.com / admin123');
  console.log('👤 User: john@example.com / user123');
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
