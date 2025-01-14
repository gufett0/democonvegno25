import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

type HeaderProps = {
  backButton: boolean,
  gameButton: boolean
}

export default function Header(props: HeaderProps) {
    return (
      <div className="w-full p-4 flex justify-between">
         <Link className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full self-center ${props.backButton ? "" : "hidden"}`} href='/'>
          Back
         </Link>
         <Link className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full self-center ${props.gameButton ? "" : "hidden"}`} href='/game'>
          Game
         </Link>
        <ConnectButton />
      </div>
    );
}