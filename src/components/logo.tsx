"use client";

import { Sparkles } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
        IPOW
      </h1>
    </div>
  );
};

export default Logo;