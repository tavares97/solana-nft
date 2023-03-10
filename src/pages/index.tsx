import { useLogout } from "@thirdweb-dev/react/solana";
import { NFT, NFTMetadata } from "@thirdweb-dev/sdk";
import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { getUser } from "auth.config";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { network } from "./_app";

type NFTSPropTypes = {
  NFTS: NFT[];
};

export default function Home({ NFTS }: NFTSPropTypes) {
  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center bg-zinc-800">
      <h1 className="text-white text-3xl font-bold max-w-[500px] px-3">
        {" "}
        Congratulations, you&apos;re the proud owner of{" "}
        <span className="text-violet-700">{NFTS[0]?.metadata?.name}</span>
      </h1>

      <div className="absolute top-50 left-0  w-full h-[23%] -skew-y-6 z-10 overflow-hidden">
        <p className="text-3xl text-white text-center -mx-20 opacity-30 ">
          COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS
          ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY
          OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL
          MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY
          COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS
          ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY
          OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL
          MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY
          COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS
          ONLY COOL MONKEY OWNERS ONLY COOL MONKEY OWNERS ONLY COOL MONKEY
          OWNERS ONLY
        </p>
      </div>

      <div className="z-30 -sm:w-72 ">
        <Image
          className="mb-3 mt-28 shadow-2xl rounded-3xl "
          src={NFTS[0]?.metadata?.image!}
          alt="logo"
          width={300}
          height={300}
        />
      </div>

      <button
        onClick={logout}
        className="text-xl font-bold mb-5 bg-white text-violet-700 py-3 px-7 rounded-md mt-7"
      >
        Logout
      </button>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const sdk = ThirdwebSDK.fromNetwork(network);
  const user = await getUser(req);

  if (!user) return { redirect: { destination: "/login", permanent: false } };

  //check if user has NFT bought
  const program = await sdk.getNFTDrop(
    process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!
  );

  const NFTS = await program.getAllClaimed();

  const NFT = NFTS.find((nft) => nft.owner === user.address);

  if (!NFT) return { redirect: { destination: "/login", permanent: false } };

  return {
    props: { NFTS },
  };
};
