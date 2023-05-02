import React from "react";
import { useState } from 'react'
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Admin from "layouts/Admin.js";
import { getAppProps } from "utils/getAppProps";
import { useRouter } from 'next/router'

export default function TokenTopup() {
  const router = useRouter()
  const [token, setToken] = useState("")

  // This function handles the click event of the button on the page. It uses the topic and keywords state variables to send a request to the backend, which then generates a post based on the topic and keywords. The response from the backend is then used to set the postContent state variable, which is used to display the post on the page.
  const handleClick = async () => {
    const response = await fetch("/api/addTokens", {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ token })
    })

    const json = await response.json()
    if (json?.success) {
      // Refresh
      router.replace(router.asPath);
    }
  }

  return (
    <>
      <h1 className="text-white text-md uppercase hidden lg:inline-block font-bold">Create New Post</h1>
      <div >
        <div className="text-white mt-5 text-semibold">
          <label>How much you want to top up:</label>
          <textarea className="rounded resize-none border border-slate-500 w-full block my-2 px-4 text-blueGray-600" value={token} onChange={e => setToken(e.target.value)}/>
        </div>
        <button
          className="mt-2 bg-lightBlue-600 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
          type="button"
          onClick={handleClick}
        >
          Top up
        </button>
      </div>
    </>
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