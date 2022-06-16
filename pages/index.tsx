import type { NextPage } from "next";
import Head from "next/head";
//import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center space-y-2 ">
        <h1>Please use on Devnet 😊</h1>
        <div className="bg-slate-300 rounded-md px-2">
          <Link href="/swap">
            <a>Swap</a>
          </Link>
        </div>
        <div className="bg-slate-300 rounded-md px-2">
          <Link href="/mint">
            <a>Mint</a>
          </Link>
        </div>
        <div className="bg-slate-300 rounded-md px-2">
          <Link href="/nft_verification">
            <a>NFT Gated Access Page</a>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
