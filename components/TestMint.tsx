import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
import { useEffect } from "react";
import artifacts from "../abi/Testmint.json";
import NotificationBanner from "./NotificationBanner";
import { useNotifications, extractMainHash } from "@/hooks/useNotifications"

const CONTRACT_ADDRESS = "0x60dF8978e207969654Ea7C07794A444fcc1Cd01F";

export default function TestMint() {
    const account = useAccount();
    const { notifications, addNotification, removeNotification } = useNotifications();

    //const chainId = useChainId();
    const testMintAddress = CONTRACT_ADDRESS as `0x${string}`;

    const { data: hash, writeContractAsync, isPending, isSuccess: isSent } = useWriteContract();

    // Aggiungiamo questo hook che mancava
    const { isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
        hash,
        enabled: !!hash,
    });

    useEffect(() => {
        if (isSent && hash) {
            console.log("Transaction sent:", hash);
            addNotification(`Transazione inviata! In attesa di conferma...`, 'success', hash);
        }
    }, [isSent, hash]);

    useEffect(() => {
        if (isConfirmed && receipt) {
            console.log("Transaction confirmed:", receipt);
            setTimeout(() => {
                addNotification(`Token mintato con successo! TX: `, 'success', receipt.transactionHash);
            }, 1500);
        }
    }, [isConfirmed, receipt]);

    const { writeContracts, isPending: isPendingCB } = useWriteContracts({
        mutation: {
            onSuccess: (hash) => {
                addNotification(`User Operation inviata! In attesa di conferma...`, 'success');
                
                setTimeout(() => {
                    const mainHash = extractMainHash(hash);
                    addNotification(`Token mintato con successo! User Operation: `, 'success', mainHash);
                }, 1500);
            }
        }
    });

    const handleMint = async () => {
        const args = [
            account.address,
            0,
            "0x0000000000000000000000000000000000000000000000000000000000000000"
        ];

        try {
            if (account.connector?.type === 'coinbaseWallet') {
                const capabilities = {
                    paymasterService: {
                        url: process.env.NEXT_PUBLIC_PAYMASTER_AND_BUNDLER_ENDPOINT
                    }
                };

                writeContracts({
                    contracts: [{
                        address: testMintAddress,
                        abi: artifacts.abi,
                        functionName: 'mint',
                        args
                    }],
                    capabilities
                });
            } else {
                await writeContractAsync({
                    address: testMintAddress,
                    abi: artifacts.abi,
                    functionName: 'mint',
                    args
                });
            }
        } catch (error: any) {
            console.error("[TestMint] Error:", error);
            addNotification("Errore durante il mint: " + error.message, 'error');
        }
    };

    return (
        <div className="flex flex-col items-center mt-6">
            <NotificationBanner
                notifications={notifications}
                onClose={removeNotification}
            />

            <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
                onClick={handleMint}
                disabled={isPending || isPendingCB}
            >
                {isPending || isPendingCB ? 'minting...' : 'Test Mint'}
            </button>
        </div>
    );
}