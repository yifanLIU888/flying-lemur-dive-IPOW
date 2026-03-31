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
</dyad_write><tool_call><dyad-write path="src/components/logo.tsx" description="Creating a new logo for IPOW using Sparkles icon and gradient text">
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