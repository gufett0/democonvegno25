import { Proof, transformForOnchain } from "@reclaimprotocol/js-sdk";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useWriteContracts } from "wagmi/experimental";
import { useEffect } from "react";
import artifacts from "../abi/Attestor.json";
import NotificationBanner from "./NotificationBanner";
import { useNotifications, extractMainHash } from "@/hooks/useNotifications";

type ClaimSectionProps = {
    proof: Proof | string | undefined;
    id: number
}

const CONTRACT_ADDRESS = "0xFf055825cDaB483114A3cAaA6Fbd1279b18AD304";

export default function ClaimToken(props: ClaimSectionProps) {
    const account = useAccount();
    const { notifications, addNotification, removeNotification } = useNotifications();

    //const chainId = useChainId();
    const attestorAddress = CONTRACT_ADDRESS as `0x${string}`;

    // hook per eoa
    const { data: hash, writeContractAsync, isPending, isSuccess: isSent } = useWriteContract();

    const { isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
        hash,
        enabled: !!hash
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
            onSuccess: (hash: string) => {
                addNotification(`User Operation inviata! In attesa di conferma...`, 'success');

                setTimeout(() => {
                    const mainHash = extractMainHash(hash);
                    addNotification(`Token mintato con successo! User Operation: `, 'success', mainHash);
                }, 1500);
            }
        }
    });

    const getSolidityProof = async () => {
        const args = [
            account.address,
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            transformForOnchain(props.proof!)
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
                        address: attestorAddress,
                        abi: artifacts.abi,
                        functionName: 'mint',
                        args
                    }],
                    capabilities
                });
            } else {
                await writeContractAsync({
                    address: attestorAddress,
                    abi: artifacts.abi,
                    functionName: 'mint',
                    args
                });
            }
        } catch (error: any) {
            console.error("[ClaimToken] Error:", error);
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
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
                onClick={getSolidityProof}
                disabled={isPending || isPendingCB}
            >
                {isPending || isPendingCB ? 'minting...' : 'Claim'}
            </button>
        </div>
    );
}