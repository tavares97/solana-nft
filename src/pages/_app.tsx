import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Network } from "@thirdweb-dev/sdk/solana";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { ThirdwebProvider } from "@thirdweb-dev/react/solana";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

export const network: Network = "devnet";
export const domain = "example.org";
export const wallet = new PhantomWalletAdapter();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      network={network}
      authConfig={{
        authUrl: "/api/auth",
        domain: domain,
        loginRedirect: "/",
      }}
    >
      <WalletModalProvider>
        <Component {...pageProps} />
      </WalletModalProvider>
    </ThirdwebProvider>
  );
}
