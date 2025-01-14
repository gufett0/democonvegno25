"use client"

import { useAccount } from "wagmi";
import UserProfile from "./UserProfile";

export default function Home() {

    const account = useAccount();

    return (
      <>
        {
            account.status == 'connected' ?
                <UserProfile />
                :
                <div className="flex justify-center items-center h-full w-full">Please connect your wallet</div>
        }
      </>
    );
}