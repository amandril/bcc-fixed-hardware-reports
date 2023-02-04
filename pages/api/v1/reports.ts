import clientPromise from "../../../lib/mongodb";
import {generateId} from "../../../lib/utils";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("test");
  switch (req.method) {
    case "POST":
      // console.log('[POST /v1/reports] Handling', req.body)
      const { params, errMsgs } = parseParams(req.body)
      if (Object.keys(errMsgs).length != 0) {
        res.status(400).json({ error: errMsgs })
        return;
      }
      const generatedId = generateId("rept_")
      const idedParams = {
        _id: generatedId, // Override Mongo's automatically generated id with our own public-facing one.
        ...params
      }
      // console.log('[POST /v1/reports] Attempting DB write')
      try {
        const insertRes = await db.collection("reports").insertOne(idedParams);
        if (!insertRes.acknowledged) {
          throw new Error(`Database did not acknowledge write for _id ${generatedId}.`)
        }
        if (insertRes.insertedId != generatedId) {
          throw new Error(`Inserted id does not match record inserted. ${insertRes.insertedId} vs ${generatedId}`)
        }
        res.status(200).json({ data: idedParams });
      } catch (e) { // Catch other errors such as duplicate keys.
        console.log('[POST v1/reports] Error on insert: ', e)
        res.status(500).json({ error: "Internal server error."});
      }
      break;
    case "GET":
      const allReports = await db.collection("reports").find({}).toArray();
      res.status(200).json({ data: allReports });
      break;
    default:
      res.status(405).json({ error: "This endpoint only supports POST and GET requests."})
  }
}


// Extracts params from bodyObject, validates values.
// Extra key-value pairs in BodyObject are ignored.
function parseParams(bodyObject) {
  let validatedParams = {};
  let validationErrMsgs = {};
  for (let param of postParams) {
    const value = bodyObject[param.name];
    if (value === undefined) { // Param missing.
      if (param.required) { // Required params not ok to be missing.
        validationErrMsgs[param.name] = "Required parameter missing.";
      }
      continue;
    }
    if (param.validationFn(value)) {
      validatedParams[param.name] = value
    } else {
      validationErrMsgs[param.name] = param.validationErrMsg
    }
  }
  return {params: validatedParams, errMsgs: validationErrMsgs}
}

interface Param {
  name: string,
  required: boolean,
  validationFn: (value: any) => boolean,
  validationErrMsg: string,
}

// Describes an API parameter.
class Param {
  constructor(data: Param) {
    this.name = data.name;
    this.required = data.required;
    this.validationFn = data.validationFn;
    this.validationErrMsg = data.validationErrMsg;
  }
}

const postParams = [
  new Param({
    name: 'climb',
    required: true,
    validationFn: val => val.length >= 8 && val.length <= 12, // MountainProject IDs tend to be 9 numeric chars.
    validationErrMsg: "Expecting string that is between 8 and 12 characters long."
  }),
  new Param({
    name: 'hardware_type',
    required: true,
    validationFn: (val: string) => ['bolt', 'pin', 'webbing', 'other'].includes(val),
    validationErrMsg: "Should be one of {'bolt', 'pin', 'webbing', 'other'}."
  }),
  new Param({
    name: 'assessed_at',
    required: true,
    validationFn: (val: number) => Number.isInteger(val) &&
      val >= 1_000_000_000 && // Sep 2001
      val < 10_000_000_000,   // Nov 2286
    validationErrMsg: "Should be a 10 digit Unix timestamp."
  }),
  new Param({
    name: 'description',
    required: false,
    validationFn: (val: string) => val.length <= 1024,
    validationErrMsg: "Should be 1024 characters or shorter."
  }),
  new Param({
    name: 'email',
    required: false,
    validationFn: (val: string) => val.length <= 64,
    validationErrMsg: "Should be 64 characters or shorter."
  }),
  new Param({
    name: 'phone',
    required: false,
    validationFn: (val: string) => val.length <= 16, // Might need better phone number validation.
    validationErrMsg: "Should be 16 characters or shorter."
  }),
]