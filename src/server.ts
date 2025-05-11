import express from 'express';
import axios from 'axios';
import { Kafka } from 'kafkajs';
import path from 'path';
import { fileURLToPath } from 'url';
import { insertOrder, getOrders } from './db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const REST_API_BASE = 'http://localhost/api'; // Mokapi mocked REST API

// Serve the 'public' folder statically
app.use(express.static(path.join(__dirname, 'public')));

// Get pets from mocked REST API
app.get('/api/pets', async (req, res) => {
  const url = `${REST_API_BASE}/pets${req.query.category ? '?category=' + req.query.category : ''}`;
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).send('Failed to fetch pets');
  }
});

// Get stored order events
app.get('/api/orders', (_, res) => {
  getOrders((err, orders) => {
    if (err) {
      return res.status(500).send('DB error: ' + err.message);
    }

    res.json(orders);
  });
});

// Kafka consumer for Mokapi-mocked topic
const kafka = new Kafka({ clientId: 'petstore-app', brokers: ['localhost:9092'] }); // Mokapi provides Kafka mock
const consumer = kafka.consumer({ groupId: 'petstore-group' });

async function startKafka() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'petstore.order-event', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }
      const event = JSON.parse(message.value.toString());
      insertOrder(event);
    },
  });
}

startKafka().catch(console.error);

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
