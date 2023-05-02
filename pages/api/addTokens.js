import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const { user } = await getSession(req, res)
  const client = await clientPromise;
  const db = client.db("BlogStandard");
  const{ token } = req.body

  await db.collection("users").updateOne({ 
    authOId: user.sub.toString(),
  }, {
    $inc: { availableTokens: parseInt(token) || 10 },
    $setOnInsert: { authOId: user.sub }
  }, {
    upsert: true
  });

  res.status(200).json({
    success: true
  })
}