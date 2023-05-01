import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export const getAppProps = async (ctx) => {
  const { user } = await getSession(ctx.req, ctx.res);
  const client = await clientPromise;
  const db = await client.db("BlogStandard");
  /**
   * _id: new ObjectId("xxx"),
    authOId: 'xxx',
    availableTokens: 0,
   */
  const userProfile = await db.collection("users").findOne({ 
    authOId: user.sub.toString(),
  });

  if (!userProfile) {
    return {
      availableTokens: 0,
      posts: []
    }
  }
  
  // Sort from newest to oldest
  const posts = await db.collection("posts").find({
    userId: userProfile._id
  }).sort({ createdAt: -1 }).toArray()

  return {
    availableTokens: userProfile.availableTokens,
    posts: posts.map(({createdAt, _id, userId, ...rest}) => ({
      _id: _id.toString(),
      created: createdAt.toString(),
      userId: userId.toString(),
      ...rest
    })),
    postId: ctx.params?.postId || '',
  }
}