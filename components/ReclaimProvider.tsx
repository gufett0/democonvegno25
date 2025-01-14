import { Proof, ReclaimProofRequest } from "@reclaimprotocol/js-sdk";
import { useState } from "react";
import QRCode from "react-qr-code";
import { AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";

type ReclaimProvierProps = {
    setProof: any;
    setRequestUrl: any;
    providerID: any;
}

export default function ReclaimProvider(props: ReclaimProvierProps) {
   
    const getVerificationReq = async () => {
      // Your credentials from the Reclaim Developer Portal
      // Replace these with your actual credentials
      const APP_ID = process.env.NEXT_PUBLIC_APP_ID!;
      const APP_SECRET = process.env.NEXT_PUBLIC_APP_SECRET!;
      const PROVIDER_ID = props.providerID; //process.env.NEXT_PUBLIC_PROVIDER_ID!;
   
      // Initialize the Reclaim SDK with your credentials
      const reclaimProofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);
   
      // Generate the verification request URL
      const requestUrl = await reclaimProofRequest.getRequestUrl();
      console.log('Request URL:', requestUrl);
      props.setRequestUrl(requestUrl);
   
      // Start listening for proof submissions
      await reclaimProofRequest.startSession({
        // Called when the user successfully completes the verification
        onSuccess: (proof:string | Proof | undefined) => {
          if (proof) {
            if (typeof proof === 'string') {
              // When using a custom callback url, the proof is returned to the callback url and we get a message instead of a proof
              console.log('SDK Message:', proof);
              props.setProof(proof);
            } else if (typeof proof !== 'string') {
              // When using the default callback url, we get a proof object in the response
              console.log('Proof generation success', proof?.claimData.context);
              props.setProof(proof);
            }
          }
          // Add your success logic here, such as:
          // - Updating UI to show verification success
          // - Storing verification status
          // - Redirecting to another page
        },
        // Called if there's an error during verification
        onError: (error) => {
          console.error('Verification failed', error);
   
          // Add your error handling logic here, such as:
          // - Showing error message to user
          // - Resetting verification state
          // - Offering retry options
        },
      });
    };

    return (
      <>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onClick={getVerificationReq}>Get Proof</button>
      </>
    );
}