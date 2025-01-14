'use client'
//import GameSection from '@/components/GameSection';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const GameSectionNoSsr = dynamic(() => import ('@/components/GameSection'),
{ssr: false}
)

export default function Game() {
  return (
    <>
      <Header backButton={true} gameButton={false} />
      <div className='flex items-center h-full w-full'>
        <GameSectionNoSsr />
      </div>
    </>
  )
}
