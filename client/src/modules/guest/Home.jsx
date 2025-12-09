import React from "react";
import Hero from "./home/Hero";
import Categories from "./home/Categories";

import HowItWorks from "./home/HowItWorks";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <main className="flex-1">
        <Hero />
        <Categories />
      
        <HowItWorks />
      
      
      </main>
    </div>
  );
}

