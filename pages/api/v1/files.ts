import clientPromise from "../../../lib/mongodb";
import { uploadToSirv, getToken } from "../../../lib/sirvClient";
import { generateId, parseParams, Param, AdditionalValidation } from "../../../lib/utils";

import multer from "multer";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from 'next-connect';
import path from 'path';

const apiRoute = nextConnect({
  onError(error, req, res: NextApiResponse) {
    res.status(501).json({ error: `Internal server error ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

/* ***********
 * Returns a Multer instance that provides several methods for generating 
 * middleware that process files uploaded in multipart/form-data format.
 *
 * Use in-memory storage for now so that we get the file buffer for free.
 * Vercel has 1GB memory limit for serverless functions. Need to prevent user
 * from uploading too many images at once. 
 * *********** */
const upload = multer({ storage: multer.memoryStorage() })

// '.array' returns middleware that processes multiple files sharing the same field name.
const uploadMiddleware = upload.array('files');
apiRoute.use(uploadMiddleware);

interface NextAndMulterRequest extends Express.Request {
  // Multer is built on express, so takes on the Express request shape with .files added
  // and Next adds .body
  body: any
}

apiRoute.post(async (req: NextAndMulterRequest, res: NextApiResponse) => {
  // This isn't an Express Request, but multer is a library built for Express
  // and once the request passes through the multer middleware, it should 
  // have the same type as an Express request.
  const uploadedAt = Math.floor(Date.now() / 1000);

  const client = await clientPromise;
  const db = client.db("test");
  console.log('[POST /v1/files] Handling', req.files, req.body);

  /* Param checks */
  const { params, errMsgs } = parseParams(req.body, postParams, [])

  if (Object.keys(errMsgs).length != 0) {
    res.status(400).json({ error: errMsgs })
    return;
  }

  if (!Array.isArray(req.files)) {
    res.status(400).json({ error: 'Files should be supplied in an array' });
    return
  }

  /* Upload files to Sirv and save metadata to DB */
  try {
    for (let file of req.files as Express.Multer.File[]) {
      const fileId = generateId("file_")
      const adminToken = await getToken(true)
      const sirvPath = await uploadToSirv(`/uploads/${fileId}`, file.buffer, adminToken)

      // Write to DB
      const dbPayload = {
        _id: fileId, // Override Mongo's automatically generated id with our own public-facing one.
        report_id: params['report_id'],
        uploaded_at: uploadedAt,
        sirv_path: sirvPath,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      }
      console.log('[POST /v1/files] Attempting DB write', dbPayload)
      const insertRes = await db.collection("files").insertOne(dbPayload);
      if (!insertRes.acknowledged) {
        throw new Error(`Database did not acknowledge write for _id ${fileId}.`)
      }
      if (insertRes.insertedId != fileId) {
        throw new Error(`Inserted id does not match record inserted. ${insertRes.insertedId} vs ${fileId}`)
      }
      res.status(200).json({ data: dbPayload });
    }
  } catch(e) {
    console.log('[POST /v1/files] Error on insert: ', e)
    res.status(500).json({ error: JSON.stringify(e)})
  }
  res.status(200)
})

const postParams = [
  new Param({
    name: 'report_id',
    required: true,
    validate: val => val.startsWith('rept_') && val.length == 5+22, // 'rept_' + 22char uuid
    validationErrMsg: "Invalid report id. Should be 'rept_...' "
  }),
]

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
