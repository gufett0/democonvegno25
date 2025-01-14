'use client'

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '../config';


const CustomWalletInfo = ({ Text }) => (
  <Text>
    <div className="p-2 text-black">
      <h2 className="text-lg font-semibold">Guida all'uso</h2>
      <ul className="space-y-2">
        <li>• Scegli Coinbase Wallet se sei nuovo/a (usa gli smart account per non pagare le fees!)</li>
        <li>• Scegli MetaMask o WalletConnect se hai già un tuo wallet installato dove ricevere i tokens</li>
      </ul>
    </div>
  </Text>
);


const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          appInfo={{
            appName: 'Demo Web3Hub',
            learnMoreUrl: 'https://www.web3.polimi.it/',
            disclaimer: CustomWalletInfo
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}