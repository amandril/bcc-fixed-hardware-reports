import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  console.log('Mongo client connected')
  const db = client.db("test");
  switch (req.method) {
    case "POST":
      console.log('Mongo POST request made')
      let bodyObject = JSON.parse(req.body);
      let report = await db.collection("reports").insertOne(bodyObject);
      res.json(report);
      break;
    case "GET":
      console.log('Mongo GET request made')
      const allReports = await db.collection("reports").find({}).toArray();
      console.log('Mongo GET reports collection queried', allReports)
      res.json({ status: 201, data: allReports });
      break;
  }
}