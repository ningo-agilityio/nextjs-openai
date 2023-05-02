import React from "react";
import { useState } from 'react'
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Admin from "layouts/Admin.js";
import { getAppProps } from "utils/getAppProps";

export default function TokenTopup() {
  const [postContent, setPostContent] = useState("")
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  
  // This function handles the click event of the button on the page. It uses the topic and keywords state variables to send a request to the backend, which then generates a post based on the topic and keywords. The response from the backend is then used to set the postContent state variable, which is used to display the post on the page.
  const handleClick = async () => {
    const response = await fetch("/api/addTokens", {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      }
    })

    const json = await response.json()
  }

  return (
    <div>
      <h1>Topup token</h1>
      <button onClick={handleClick}>Topup</button>
    </div>
  )
}

TokenTopup.layout = Admin;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    return {
      props
    }
  }
})