import { Proof } from "@reclaimprotocol/js-sdk";

type ProofSectionProps = {
    proof: Proof|string|undefined;
    setIsOpen: any;
}

export default function ProofSection(props: ProofSectionProps) {
    return (
      <>
        <div className="w-screen h-screen absolute translate-y-[-50%] translate-x-[-50%] top-[50%] left-[50%] z-0 bg-opacity-20 bg-black flex justify-center items-center" 
        onClick={() => props.setIsOpen(false)}>

            <div className="w-[80%] h-[50%] bg-background overflow-auto p-5 rounded-lg">
                {props.proof ? JSON.stringify(props.proof) : ''}
            </div>

        </div>
      </>
    );
}