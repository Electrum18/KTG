import { useEffect } from "react";

import Head from "next/head";
import { useRouter } from "next/router";

import Background from "../../components/background";
import LoginTablet from "../../components/tablets/enter-to-game";

const rightIndex = "123";

export default function Home() {
  const router = useRouter();

  const { index } = router.query;

  useEffect(() => index && index !== rightIndex && router.push("/"), [index]);

  return (
    <>
      <Head>
        <title>Регистрация игрока | КТГ</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <Background />
        <LoginTablet />
      </main>
    </>
  );
}
