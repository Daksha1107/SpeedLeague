'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import BottomNav from '@/components/layout/BottomNav';
import TopBar from '@/components/layout/TopBar';
import LeagueTier from '@/components/league/LeagueTier';
import { UserStats } from '@/types';

export default function LeaguePage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('speedleague_user_id');
    if (!storedUserId) {
      router.push('/');
      return;
    }
    fetchStats(storedUserId);
  }, [router]);

  const fetchStats = async (uid: string) => {
    try {
      const response = await fetch(`/api/stats/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div className="mx-auto max-w-[420px] px-4 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-[var(--muted)]">Loading league...</p>
          </div>
        </div>
      </main>
    );
  }

  const currentLeague = stats?.currentLeague || 'Gold';

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="mx-auto max-w-[420px] px-4 pt-6 pb-24">
        
        <TopBar title="League" showBack={true} showMenu={false} />
        
        {/* League Ladder */}
        <div className="mt-8 space-y-4">
          <LeagueTier tier="Apex" color="apex" />
          <div className="flex justify-center">
            <ChevronDown className="text-white/30" size={16} />
          </div>
          
          <LeagueTier tier="Diamond" color="diamond" />
          <div className="flex justify-center">
            <ChevronDown className="text-white/30" size={16} />
          </div>
          
          <LeagueTier 
            tier="Gold" 
            color="gold" 
            active={currentLeague === 'Gold'} 
            label="Current League"
          />
          <div className="flex justify-center">
            <ChevronDown className="text-white/30" size={16} />
          </div>
          
          <LeagueTier tier="Silver" color="silver" />
          <div className="flex justify-center">
            <ChevronDown className="text-white/30" size={16} />
          </div>
          
          <LeagueTier tier="Bronze" color="bronze" />
        </div>
        
        {/* Season Info */}
        <div className="mt-8 text-center text-white/60 text-sm">
          Season Ends in 2 Days
        </div>
      </div>
      
      <BottomNav />
    </main>
  );
}
