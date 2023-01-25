import { useWallet } from "@solana/wallet-adapter-react";
import {
  useClaimNFT,
  useDropUnclaimedSupply,
  useLogin,
  useLogout,
  useNFTs,
  useProgram,
  useUser,
} from "@thirdweb-dev/react/solana";
import { NFT } from "@thirdweb-dev/sdk";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { wallet } from "./_app";

const Login = () => {
  const [usersNFT, setUsersNFT] = useState<NFT | undefined>();

  const login = useLogin();
  const logout = useLogout();
  const router = useRouter();
  const { user } = useUser();
  const { publicKey, connect, select } = useWallet();

  const { program } = useProgram(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS,
    "nft-drop"
  );

  const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
  const { data: nfts, isLoading } = useNFTs(program);
  const { mutateAsync: claim } = useClaimNFT(program);

  useEffect(() => {
    if (!publicKey) {
      select(wallet.name);
      connect();
    }
  }, [connect, select, publicKey]);

  useEffect(() => {
    if (!user || !nfts) return;

    const usersNFT = nfts.find((nft) => nft.owner === user?.address);

    if (usersNFT) {
      setUsersNFT(usersNFT);
    }
  }, [nfts, user]);

  const handleLogin = async () => {
    await login();
    router.replace("/");
  };

  const handlePurchase = async () => {
    await claim({
      amount: 1,
    });
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-zinc-800">
      <div className="absolute top-48 left-0 w-full h-1/4 -skew-y-6 z-10 overflow-hidden shadow-xl bg-violet-700" />

      <Image
        className="z-30 mb-7 shadow-2xl rounded-full"
        src="/logo.jpg"
        alt="logo"
        width={300}
        height={300}
      />

      <main className="z-30 text-white">
        <h1 className="text-3xl font-bold uppercase">
          Welcome to the{" "}
          <span className="text-violet-700">Cool Monkey NFT</span> site
        </h1>

        {!user && (
          <>
            <button
              onClick={handleLogin}
              className="text-xl font-bold mb-5 bg-violet-700 py-3 px-7 animate-bounce rounded-md mt-7"
            >
              Login / Connect Wallet
            </button>
          </>
        )}

        {user && (
          <>
            <p className="text-lg text-violet-700 font-bold mb-7">
              Welcome {user.address.slice(0, 5)}...{user.address.slice(-5)}
            </p>
            {isLoading && (
              <div className="text-xl font-bold mb-5 bg-violet-700 py-3 px-7 rounded-md mt-7">
                Hold on, while we validate things...
              </div>
            )}
            <div className=" flex flex-col items-center">
              {usersNFT && (
                <Link
                  href="/"
                  className="text-xl font-bold mb-5 bg-violet-700 py-3 px-7 rounded-md mt-7"
                >
                  Access Granted - ENTER
                </Link>
              )}

              {!usersNFT &&
                !isLoading &&
                (unclaimedSupply && unclaimedSupply > 0 ? (
                  <button
                    onClick={handlePurchase}
                    className="text-xl font-bold mb-5 bg-violet-700 py-3 px-7 rounded-md mt-3"
                  >
                    Buy this Cool Monkey
                  </button>
                ) : (
                  <p>{"Sorry every Cool monkey found its new home :( "}</p>
                ))}

              {user && (
                <button
                  onClick={logout}
                  className="text-xl font-bold mb-5 bg-white text-violet-700 py-3 px-7 rounded-md mt-3"
                >
                  Logout
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Login;
