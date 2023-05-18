import type { NextPage } from "next";
import Head from "next/head";

import { api } from "~/utils/api";
import AuthShowcase from "~/components/AuthShowcase";
import CreatePostForm from "~/components/CreatePostForm";
import PostCard from "~/components/PostCard";

const Home: NextPage = () => {
  const postQuery = api.post.all.useQuery();

  const deletePostMutation = api.post.delete.useMutation({
    onSettled: () => postQuery.refetch(),
  });

  return (
    <>
      <Head>
        <title>Tychon Take Home</title>
        <meta name="description" content="Tychon Take Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container mt-12 flex flex-col items-center justify-center gap-4 px-4 py-8">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Create <span className="text-pink-400">T3</span> Turbo
          </h1>
          <AuthShowcase />

          <CreatePostForm />

          {postQuery.data ? (
            <div className="w-full max-w-2xl">
              {postQuery.data?.length === 0 ? (
                <span>There are no posts!</span>
              ) : (
                <div className="flex h-[40vh] justify-center overflow-y-scroll px-4 text-2xl">
                  <div className="flex w-full flex-col gap-4">
                    {postQuery.data?.map((p) => {
                      return (
                        <PostCard
                          key={p.id}
                          post={p}
                          onPostDelete={() => deletePostMutation.mutate(p.id)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
