"use client"

import { useEffect, useRef } from "react";

export function usePhaserGame(config: any) {
  
  const phaserGameRef = useRef(null);

  useEffect(() => {
    if (phaserGameRef.current) {
      return;
    }
    phaserGameRef.current = new Phaser.Game(config);
    return () => {
      phaserGameRef.current.destroy(true);
      phaserGameRef.current = null;
    };
  }, [] /* only run once; config ref elided on purpose */);

  return phaserGameRef.current;
}