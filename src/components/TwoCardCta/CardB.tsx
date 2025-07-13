import React from "react";

export default function CardB() {
  function plusMinus(arr: number[]): void {
    const n: number = arr.length;
    let positiveCount: number = 0;
    let negativeCount: number = 0;
    let zeroCount: number = 0;
   
    for (const num of arr) {
      if (num > 0) {
       positiveCount++;
     } else if (num < 0) {
       negativeCount++;
     } else {
       zeroCount++; 
   }
    } 
console.log((positiveCount / n).toFixed(6));
    console.log((negativeCount / n).toFixed(6));
    
    console.log((zeroCount / n).toFixed(6));
  return <div>CardB</div>;
}
