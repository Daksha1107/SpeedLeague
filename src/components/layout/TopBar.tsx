'use client';

import { ArrowLeft, Home, Settings } from 'lucide-react';
import { colors } from '@/styles/theme';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  showHome?: boolean;
  showSettings?: boolean;
  onBack?: () => void;
}

export default function TopBar({ title, showBack, showHome, showSettings, onBack }: TopBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="flex items-center justify-between h-16 px-5">
      {/* Left Side */}
      <div className="w-12">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} color={colors.text.primary} />
          </button>
        )}
        {showHome && (
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <Home size={20} color={colors.text.primary} />
          </button>
        )}
      </div>

      {/* Center - Title */}
      <h1 className="text-xl font-semibold text-white">{title}</h1>

      {/* Right Side */}
      <div className="w-12">
        {showSettings && (
          <button
            onClick={() => router.push('/settings')}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <Settings size={20} color={colors.text.primary} />
          </button>
        )}
      </div>
    </div>
  );
}
