import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { Configuration, OpenAIApi } from 'openai'
import clientPromise from "../../lib/mongodb";
import { getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("BlogStandard");
  const userProfile = await db.collection("users").findOne({ 
    authOId: user.sub.toString(),
  });

  if (!userProfile?.availableTokens) {
    res.status(403)
  }

  const config = new Configuration({
    apiKey: process.env.OPEN_API_KEY
  })
  const { topic, keywords } = req.body
  const openai = new OpenAIApi(config)
  // const response = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   temperature: 0,
  //   max_tokens: 3600,
  //   prompt: `Write a long and detailed SEO friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. The content should be formatted in SEO-friendly HTML.
  //   The response must also include appropriate HTML title and meta description content.
  //   The return format must be stringified JSON in the following format: 
  //   {
  //     "postContent": post content here
  //     "title": title goes here
  //     "metaDescription": meta description goes here
  //   }`
  // })
  const postContentResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [{
      role: "system",
      content: "You are blog post generator"
    }, {
      role: "user",
      content: `Write a long and detailed SEO friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul`
    }]
  })
  const postContent = postContentResponse.data.choices[0]?.message?.content || ""
  const titleResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [{
      role: "system",
      content: "You are blog post generator"
    }, {
      role: "user",
      content: `Write a long and detailed SEO friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul`
    }, {
      role: "assistant",
      content: postContent
    }, {
      role: "user",
      content: "Generate appropriate title tag text for the above blog post"
    }]
  })
  const metaDescriptionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [{
      role: "system",
      content: "You are blog post generator"
    }, {
      role: "user",
      content: `Write a long and detailed SEO friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}. The content should be formatted in SEO-friendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul`
    }, {
      role: "assistant",
      content: postContent
    }, {
      role: "user",
      content: "Generate SEO-friendly meta description for the above blog post"
    }]
  })
  const title = titleResponse.data.choices[0]?.message?.content || ""
  const metaDescription = metaDescriptionResponse.data.choices[0]?.message?.content || ""
  // res.status(200).json({ post: response.data.choices[0]?.text?.split("\n").join("") })
  
  await db.collection("users").updateOne({ 
    authOId: user.sub,
  }, {
    $inc: { availableTokens: -1 },
    $setOnInsert: { authOId: user.sub }
  }, {
    upsert: true
  });
  const post = await db.collection("posts").insertOne({
    title,
    postContent,
    metaDescription,
    topic,
    keywords,
    userId: userProfile._id,
    createdAt: new Date()
  })
  // res.status(200).json({ post: {
  //   title,
  //   postContent,
  //   metaDescription
  // }})
  res.status(200).json({ postId: post.insertedId })
})