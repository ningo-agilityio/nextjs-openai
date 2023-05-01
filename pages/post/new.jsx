import React from "react";
import { useState } from 'react'
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import AppLayout from '@/layouts'
import { useRouter } from 'next/router'
import { getAppProps } from '@/utils/getAppProps'

export default function NewPost() {
  const router = useRouter()
  const [postContent, setPostContent] = useState("")
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  
  // This function handles the click event of the button on the page. It uses the topic and keywords state variables to send a request to the backend, which then generates a post based on the topic and keywords. The response from the backend is then used to set the postContent state variable, which is used to display the post on the page.
  const handleClick = async () => {
    const response = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ topic, keywords })
    })

    const json = await response.json()
    if (json?.postId) {
      router.push(`/post/${json.postId}`)
    }
  }

  return (
    <div>
      <form onSubmit={handleClick}>
        <div>
          <label><strong>Topic:</strong></label>
          <textarea className="resize-none border border-slate-500 w-full block my-2 px-4" value={topic} onChange={e => setTopic(e.target.value)}/>
        </div>
        <div>
          <label><strong>Keywords:</strong></label>
          <textarea className="resize-none border border-slate-500 w-full block my-2 px-4" value={keywords} onChange={e => setTopic(e.target.value)}/>
        </div>
        <button className="btn" type="submit">Generate</button>
      </form>
      {/* <div className='max-w-screen-sm' dangerouslySetInnerHTML={{ __html: postContent }}/> */}
    </div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    return {
      props
    }
  }
})