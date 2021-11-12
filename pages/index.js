import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen flex justify-center items-center overflow-hidden">
        <img
          className="h-full max-w-none"
          src="/assets/game background.png"
          alt="Задний фон игры"
        />

        <div className="absolute bottom-0 mx-auto">
          <Image
            src="/assets/clipboard.png"
            alt="Клипборд"
            width={512}
            height={512}
          />
        </div>
      </main>
    </>
  );
}
