'use client'
import GameSection from '@/components/GameSection';
import Header from '@/components/Header';


export default function Game() {
  return (
    <>
      <Header backButton={true} gameButton={false} />
      <div className='flex items-center h-full w-full'>
        <GameSection />
      </div>
    </>
  )
}
