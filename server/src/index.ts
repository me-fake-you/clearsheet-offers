import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// Basic configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple in‑memory / file‑based storage for received offers
const DATA_FILE = path.resolve(__dirname, '../../data/offers.json');

function loadOffers(): any[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveOffers(offers: any[]) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(offers, null, 2));
}

// POST /api/offer – receive low‑ticket order submissions
app.post('/api/offer', (req: Request, res: Response) => {
  const { service, email, txHash, notes, timestamp } = req.body;

  // Basic validation
  if (!service || !email || !txHash) {
    return res.status(400).send('Missing required fields.');
  }

  const newOffer = { service, email, txHash, notes: notes || '', timestamp };
  const offers = loadOffers();
  offers.push(newOffer);
  saveOffers(offers);

  // In a real product we’d trigger an email receipt here.
  console.log('✅ New low‑ticket offer received:', newOffer);
  res.status(200).send('Offer recorded');
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`🚀 Low‑ticket offer server listening on http://localhost:${PORT}`);
});
