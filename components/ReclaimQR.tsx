import QRCode from "react-qr-code";

type ReclaimQRProps = {
    requestUrl: string;
}

export default function ProofSection(props: ReclaimQRProps) {
    return (
      <>
        {
              props.requestUrl ? 
                <div style={{ margin: '20px 0' }}>
                  <QRCode value={props.requestUrl} size={200}/>
                </div>
              :
              <div className="flex items-center justify-center w-[200px] h-[200px] bg-stone rounded-lg">
                <h2>QR not generated yet</h2>
              </div>
            }
      </>
    );
}