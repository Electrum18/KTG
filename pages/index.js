import Head from "next/head";

import Background from "../components/background";
import QuestionTablet from "../components/tablets/question";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />
        <QuestionTablet />
      </main>
    </>
  );
}
