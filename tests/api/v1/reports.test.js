/**
 * @jest-environment node
 */
import clientPromise from "../../../lib/mongodb";
import { createMocks } from 'node-mocks-http';
import reportHandler from "../../../pages/api/v1/reports"
import { MongoMemoryServer } from 'mongodb-memory-server';


describe('/v1/reports', () => {
  let mongoServer;
  let mongoClient;
  let db;

  beforeAll(async () => {
    // Create an in-memory Mongo server. 
    // dbName, ip and port must be in sync with .env.test since
    // that is where the clientPromise will call to.
    mongoServer = await MongoMemoryServer.create({instance: {
      port: 27017,
      dbName: 'test',
      ip: '127.0.0.1',
    }});
    console.log('Serving Mongo memory server from: ', mongoServer.getUri());

    mongoClient = await clientPromise;
    db = mongoClient.db("test");
  });

  afterEach(async () => {
    await db.collection("reports").deleteMany({});
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoServer.stop();
  });

  describe('POST request', () => {
    it('inserts data when receiving well-formed body', async () => {
      const reportBody = {
        climb: "111222333",
        hardware_type: "bolt",
        assessed_at: 1234567890,
        description: "rusty spinning bolt"
      }
      const { req, res } = createMocks({
        method: 'POST',
        body: reportBody
      });

      await reportHandler(req, res)
      // console.log(res._getData())
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())["data"]).toEqual(
        expect.objectContaining(reportBody),
      );
      const allReports = await db.collection("reports").find({}).toArray()
      expect(allReports.length).toBe(1)
      expect(allReports[0]).toEqual(
        expect.objectContaining(reportBody)
      )
    })

    it('throws 400 when encountering missing required fields', async () => {
      const reportBodyMissingRequiredClimb = {
        hardware_type: "bolt",
        assessed_at: 1234567890,
        description: "rusty spinning bolt"
      }
      const { req, res } = createMocks({
        method: 'POST',
        body: reportBodyMissingRequiredClimb
      });
      await reportHandler(req, res)
      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())["error"]).toEqual(
        expect.objectContaining({climb: "Required parameter missing."}),
      );
      // No data written.
      const allReports = await db.collection("reports").find({}).toArray()
      expect(allReports.length).toBe(0)
    })
  })
});