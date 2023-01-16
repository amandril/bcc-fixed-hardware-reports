import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("test");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let report = await db.collection("reports").insertOne(bodyObject);
      res.json(report.ops[0]);
      break;
    case "GET":
      const allReports = await db.collection("reports").find({}).toArray();
      res.json({ status: 201, data: allReports });
      break;
  }
}