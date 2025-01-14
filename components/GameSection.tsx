"use client"

import PreLoadScene from "../game/scene/PreLoadScene"
import GameScene from "../game/scene/GameScene"
import gameOverScene from "../game/scene/GameOverScene"
import BlankScene from "../game/scene/BlankScene"
import Phaser from "phaser";
import { usePhaserGame } from "@/hooks/usePhaserGame"
import { useEffect } from "react"
import { useAccount, useReadContract, useChainId } from "wagmi"
import artifacts from "../abi/Attestor.json";
import addresses from "../shared/data/addresses.json";

const CONTRACT_ADDRESS = "0xFf055825cDaB483114A3cAaA6Fbd1279b18AD304"; 



const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.AUTO,
    pixelArt: false,
    roundPixels: true,
    parent: 'game',
    title: 'Phaser3 Mario',
    width: 700,
    height: 224,
    // width: 3840,
    // height: 624,
    fps: 60,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // 调试开启 arcade sprite 会有边框提示
        }
    },

    scene: [
        // LoadingScene,
        // DoubleJumpScene,
        PreLoadScene,
        GameScene,
        gameOverScene,
        BlankScene
    ]
};


export default function GameSection() {

    const account = useAccount();

    const chainId = useChainId();
    const attestorAddress = chainId === 1337 
            ? addresses["Attestor#Attestor"] as `0x${string}`
            : CONTRACT_ADDRESS as `0x${string}`;
    
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

    const game = usePhaserGame(config);

    useEffect(()=>{
        let count = 0;

        if(b1 && b1 > BigInt(0)){
            count++;
        }  

        if(b2 && b2 > BigInt(0)){
            count++;
        } 

        if(b3 && b3 > BigInt(0)){
            count++;
        } 

        localStorage.setItem("sustainabilityScore", JSON.stringify(count))   
    }, [b1,b2,b3]) 

    return (
        <div className="w-full">
            <div id="game">

            </div>
        </div>
    );
}
