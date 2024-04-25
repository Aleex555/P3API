const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const dbConfig = require('../../src/config/db');
const Event = require('../../src/api/models/event');

describe('Event Integration Tests', () => {
  beforeAll(async () => {
    // Connecta a la base de dades
    await mongoose.connect(dbConfig.MONGODB_URI_TEST);
  });

  afterEach(async () => {
    // Neteja la col·lecció d'esdeveniments després de cada test
    await Event.deleteMany({});
  });

  afterAll(async () => {
    // Tanca la connexió a la base de dades
    await mongoose.connection.close();
  });

  test('should create a new event and retrieve it', async () => {
    // Dades de l'esdeveniment de prova
    const newEvent = {
      name: 'New Event',
      date: '2023-04-15T19:00:00.000Z',
      description: 'This is a test event'
    };

    // Crea un nou esdeveniment
    const createResponse = await request(app)
      .post('/api/events')
      .send(newEvent)
      .expect(201); // Espera un estat 201 Created

    expect(createResponse.body.name).toBe(newEvent.name);
    expect(createResponse.body.description).toBe(newEvent.description);

    // Suposant que tens un endpoint GET /api/events/:id per recuperar esdeveniments
    // Recupera l'esdeveniment creat
    const eventId = createResponse.body._id;
    const getResponse = await request(app)
      .get(`/api/events/${eventId}`)
      .expect(200); // Espera un estat 200 OK

    expect(getResponse.body.name).toBe(newEvent.name);
    expect(getResponse.body.description).toBe(newEvent.description);
  });
});
