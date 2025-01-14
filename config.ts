import { getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';
import { baseSepolia, base } from 'wagmi/chains';
import { coinbaseWallet, walletConnectWallet, metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';

const projectId = 'ec26217c82991ae090f1eae51624159f';

coinbaseWallet.preference = 'smartWalletOnly';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [
        coinbaseWallet,
        metaMaskWallet,
        walletConnectWallet, 
      ],
    },
  ],
  {
    appName: 'Demo Web3Hub',
    projectId,
  }
);

////

export const custom = defineChain({
  id: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!),
  name: process.env.NEXT_PUBLIC_CHAIN_NAME!,
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_CHAIN_URL!] },
  },
})

export const config = getDefaultConfig({
  appName: 'Demo Web3Hub',
  projectId: projectId,
  chains: [baseSepolia, base, custom],
  connectors, 
});