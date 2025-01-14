'use client'

import Header from '@/components/Header';
import Home from '@/components/Home';
import TestMint from '@/components/TestMint';

export default function App() {
  return (
    <>
      <Header backButton={false} gameButton={true} />
      <div className="flex flex-col gap-8">
        <TestMint />
      </div>
      {/* <ReclaimSection /> */}
      <Home />
    </>
  )
}
