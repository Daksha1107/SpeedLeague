'use client';

import { ArrowLeft, Menu, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showSettings?: boolean;
  onBack?: () => void;
}

export default function TopBar({ 
  title = "Reflex Duel", 
  showBack, 
  showMenu = true, 
  showSettings = true, 
  onBack 
}: TopBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center justify-between h-[60px] px-2">
      {/* Left Side */}
      <div className="w-12">
        {showBack ? (
          <button
            onClick={handleBack}
            className="soft-card p-2.5 rounded-xl hover:brightness-110 transition-all"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
        ) : showMenu ? (
          <button
            className="soft-card p-2.5 rounded-xl hover:brightness-110 transition-all"
          >
            <Menu size={20} className="text-white" />
          </button>
        ) : null}
      </div>

      {/* Center - Title */}
      <h1 className="text-xl font-semibold text-white">{title}</h1>

      {/* Right Side */}
      <div className="w-12">
        {showSettings && (
          <button
            onClick={() => router.push('/settings')}
            className="soft-card p-2.5 rounded-xl hover:brightness-110 transition-all"
          >
            <Settings size={20} className="text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
