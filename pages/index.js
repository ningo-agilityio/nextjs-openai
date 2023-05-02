/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Admin from "layouts/Admin.js";
import { getAppProps } from "utils/getAppProps";
import { useRouter } from 'next/router'

export default function Index() {
  const router = useRouter()
  const [topic, setTopic] = useState("")
  const [keywords, setKeywords] = useState("")
  const [processing, setProcessing] = useState(false)

  const handleClick = async () => {
    setProcessing(true)
    const response = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ topic, keywords })
    })

    const json = await response.json()
    if (json?.postId) {
      setProcessing(false)
      router.push(`/post/${json.postId}`)
    }
  }

  return (
    <>
      <h1 className="text-white text-md uppercase hidden lg:inline-block font-bold">Create New Post</h1>
      <div >
        <div className="text-white mt-5 text-semibold">
          <label>Topic:</label>
          <textarea className="rounded resize-none border border-slate-500 w-full block my-2 px-4 text-blueGray-600" value={topic} onChange={e => setTopic(e.target.value)}/>
        </div>
        <div className="text-white mt-5 text-semibold">
          <label>Keywords:</label>
          <textarea className="rounded resize-none border border-slate-500 w-full block my-2 px-4 text-blueGray-600" value={keywords} onChange={e => setKeywords(e.target.value)}/>
        </div>
        <button
          className="mt-2 bg-lightBlue-600 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
          type="button"
          onClick={handleClick}
          disabled={processing}
        >
          {
            processing && <i className="fas fa-circle-notch animate-spin text-white mx-auto text-xl px-1"></i>
          }
          Generate
        </button>
      </div>
    </>
  );
}

Index.layout = Admin;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    return {
      props
    }
  }
})