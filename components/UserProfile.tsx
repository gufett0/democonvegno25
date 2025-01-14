"use client"

import { Proof } from "@reclaimprotocol/js-sdk";
import { useState } from "react";
import ProofSection from "./ProofSection";
import { AiOutlineCheck, AiOutlineCloseCircle } from "react-icons/ai";
import ReclaimProvider from "./ReclaimProvider";
import ReclaimQR from "./ReclaimQR";
import ClaimToken from "./ClaimToken";
import { useAccount, useReadContract } from "wagmi";
import artifacts from "../abi/Attestor.json";

const CONTRACT_ADDRESS = "0xFf055825cDaB483114A3cAaA6Fbd1279b18AD304"; 

export default function UserProfile() {

    const [proofOne, setProofOne] = useState<Proof|string>();
    const [proofTwo, setProofTwo] = useState<Proof|string>();
    const [proofThree, setProofThree] = useState<Proof|string>();

    const [requestUrl, setRequestUrl] = useState('');
    const [modalProof, setModalProof] = useState<Proof|string>();
    const [isOpen, setIsOpen] = useState(false);

    const account = useAccount();

    //const chainId = useChainId();
    const attestorAddress = CONTRACT_ADDRESS as `0x${string}`;

    const { data: b1 } = useReadContract({
      address: attestorAddress,
      abi: artifacts.abi,
      functionName: 'balanceOf',
      args: [account.address,0],
    })

    const { data: b2 } = useReadContract({
        address: attestorAddress,
        abi: artifacts.abi,
        functionName: 'balanceOf',
        args: [account.address,1],
    })

    const { data: b3 } = useReadContract({
      address: attestorAddress,
      abi: artifacts.abi,
      functionName: 'balanceOf',
      args: [account.address,2],
    })


    const FIRST_PROVIDER_ID = process.env.NEXT_PUBLIC_FIRST_PROVIDER_ID!;
    const SECOND_PROVIDER_ID = process.env.NEXT_PUBLIC_SECOND_PROVIDER_ID!;
    const THIRD_PROVIDER_ID = process.env.NEXT_PUBLIC_THIRD_PROVIDER_ID!;

    console.log(b1)

    return (
      <div className="h-full flex flex-col items-center justify-center px-10 gap-y-8">
        <ReclaimQR requestUrl={requestUrl} />
        <div className="flex flex-row items-center justify-center gap-x-12">
          <div className='flex flex-col gap-y-4 h-full'>
            <h2 className="text-center font-bold">License Points</h2>
              {
                b1 && b1 > BigInt(0)?
                  <>
                    <div className="text-center">Claimed <AiOutlineCheck className="inline text-green"/></div>
                  </>
                  :
                  proofOne ?
                    <>
                      <button className='text-blue-500' 
                        onClick={
                          ()=>{
                          setModalProof(proofOne);
                          return setIsOpen(true)}
                      }>View Proof</button>
                      <ClaimToken proof={proofOne} id={0}/>
                    </>
                    :
                    <>
                      <div>Not generated <AiOutlineCloseCircle className="inline text-red"/></div>
                      <ReclaimProvider setProof={setProofOne} setRequestUrl={setRequestUrl} providerID={FIRST_PROVIDER_ID} />
                    </>
              }
              
            </div>
        
            <div className='flex flex-col gap-y-4 h-full'>
              <h2 className="text-center font-bold">Donation</h2>
              {
                b2 && b2 > BigInt(0) ?
                  <>
                    <div className="text-center">Claimed <AiOutlineCheck className="inline text-green"/></div>
                  </>
                  :
                  proofTwo ?
                    <>
                      <button className='text-blue-500'
                        onClick={
                          ()=>{
                            setModalProof(proofTwo);
                            return setIsOpen(true)}
                        }>View Proof</button>
                        <ClaimToken proof={proofTwo} id={1}/>
                    </>
                    :
                    <>
                      <div>Not generated <AiOutlineCloseCircle className="inline text-red"/></div>
                      <ReclaimProvider setProof={setProofTwo} setRequestUrl={setRequestUrl} providerID={SECOND_PROVIDER_ID} />
                    </>
              }
            </div>
        
            <div className='flex flex-col gap-y-4 h-full'>
              <h2 className="text-center font-bold">Carbon Footprint</h2>
              {
                b3 && b3 > BigInt(0) ?
                  <>
                   <div className="text-center">Claimed <AiOutlineCheck className="inline text-green"/></div>
                  </>
                  :
                  proofThree ?
                    <>
                      <button className='text-blue-500' 
                        onClick={
                          ()=>{
                            setModalProof(proofThree);
                            return setIsOpen(true)}
                        }>View Proof</button>
                        <ClaimToken proof={proofThree} id={2}/>
                    </>
                    :
                    <>
                      <div>Not generated <AiOutlineCloseCircle className="inline text-red"/></div>
                      <ReclaimProvider setProof={setProofThree} setRequestUrl={setRequestUrl} providerID={THIRD_PROVIDER_ID} />
                    </>
              }
            </div>
          </div>
          {isOpen && <ProofSection setIsOpen={setIsOpen} proof={modalProof}/>}
      </div>
    );
}