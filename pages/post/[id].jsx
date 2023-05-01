import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Admin from "layouts/Admin.js";
import { getAppProps } from 'utils/getAppProps'
import { useUser } from '@auth0/nextjs-auth0/client'
import Image from 'next/image';

export default function PostDetails({ post }) {
  const { user } = useUser()
  const { title, postContent, metaDescription, topic, keywords, created } = post
  return (
    <main className="profile-page">
      <section className="relative block h-500-px">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')",
          }}
        >
          <span
            id="blackOverlay"
            className="w-full h-full absolute opacity-50 bg-black"
          ></span>
        </div>
        <div
          className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-16"
          style={{ transform: "translateZ(0)" }}
        >
          <svg
            className="absolute bottom-0 overflow-hidden"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <polygon
              className="text-blueGray-200 fill-current"
              points="2560 0 2560 100 0 100"
            ></polygon>
          </svg>
        </div>
      </section>
      <section className="relative py-16 bg-blueGray-200">
        <div className="container mx-auto px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                  <div className="relative">
                    <Image 
                      src={user.picture || "https://placehold.co/50x50/png"} 
                      alt={user.name || "User Avatar"} 
                      width={150} 
                      height={150}
                      className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                    ></Image>
                  </div>
                </div>
              </div>
              <div className="text-center mt-24">
                <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                  {user.name}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-blueGray-700">
                  <span className="text-teal-500 mt-5 text-italic"><strong>Posted on:</strong></span> <strong>{new Date(created).toDateString()}</strong>
                </p>
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <h3 className="uppercase text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                      {title.replaceAll('"', '')}
                    </h3>
                    <p className="text-left mb-4 text-sm leading-relaxed text-blueGray-700">
                      <span className="text-teal-500 mt-5 text-italic"><strong>Meta description:</strong></span> {metaDescription}
                    </p>
                    <p className="text-left mb-4 text-sm leading-relaxed text-blueGray-700">
                      <span className="text-teal-500 mt-5 text-italic"><strong>Topic:</strong></span> {topic}
                    </p>
                    <p className="text-left mb-4 text-sm leading-relaxed text-blueGray-700">
                      <span className="text-teal-500 mt-5 text-italic"><strong>Keywords:</strong></span> {keywords}
                    </p>
                    <p className="text-left mb-4 text-lg leading-relaxed text-blueGray-700" dangerouslySetInnerHTML={{ __html: postContent.toString() }}></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

PostDetails.layout = Admin;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx)
    const { posts } = props
    const post = posts.find(item => item._id === ctx.params.id);

    if(!post) {
      return {
        redirect: {
          destination: '/',
          permanent: false
        }
      }
    }

    return {
      props: {
        post,
        ...props
      }
    }
  }
})