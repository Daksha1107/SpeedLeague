// Design System - Premium Dark Blue Theme

// Color Palette
export const colors = {
  // Background Colors
  background: {
    primary: '#0F1924',      // Dark navy blue
    card: '#1A2332',         // Lighter navy
    cardTransparent: 'rgba(26, 35, 50, 0.6)',
  },
  
  // Primary & Accent Colors
  primary: {
    blue: '#0080FF',
    blueLight: '#00B4FF',
    accent: '#00D4FF',
  },
  
  // League Colors
  league: {
    apex: '#A78BFA',         // Purple
    diamond: '#60A5FA',      // Bright blue
    gold: '#FBBF24',         // Gold/yellow
    silver: '#9CA3AF',       // Silver/gray
    bronze: '#CD7F32',       // Bronze
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#94A3B8',
    accent: '#00B4FF',
  },
  
  // UI Colors
  border: 'rgba(255, 255, 255, 0.1)',
  shadow: 'rgba(0, 0, 0, 0.3)',
  track: '#2A3441',
};

// Typography
export const typography = {
  sizes: {
    largeNumber: '48px',
    extraLargeNumber: '64px',
    title: '24px',
    titleSmall: '20px',
    body: '16px',
    bodySmall: '14px',
    label: '12px',
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

// Spacing
export const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

// Border Radius
export const borderRadius = {
  small: '12px',
  medium: '16px',
  large: '20px',
  full: '9999px',
};

// Component Styles
export const components = {
  card: {
    borderRadius: borderRadius.large,
    background: colors.background.cardTransparent,
    border: `1px solid ${colors.border}`,
    shadow: `0 4px 20px ${colors.shadow}`,
  },
  button: {
    primary: {
      height: '56px',
      borderRadius: borderRadius.full,
      gradient: `linear-gradient(90deg, ${colors.primary.blue} 0%, ${colors.primary.blueLight} 100%)`,
    },
  },
  progressBar: {
    height: '8px',
    borderRadius: borderRadius.full,
    track: colors.track,
  },
  bottomNav: {
    height: '72px',
    background: colors.background.primary,
    iconSize: '24px',
    activeColor: colors.primary.accent,
    inactiveColor: '#64748B',
  },
};

// Screen Layout
export const layout = {
  maxWidth: '428px',
  padding: '24px',
  paddingHorizontal: '20px',
};

// Measurements for specific components
export const measurements = {
  home: {
    circularProgress: '280px',
    statsCardHeight: '48px',
    statsCardGap: '16px',
    leagueProgressHeight: '80px',
    playButtonHeight: '56px',
    bottomNavHeight: '72px',
  },
  leaderboard: {
    tabHeight: '48px',
    rowHeight: '64px',
    avatarSize: '40px',
    rowGap: '12px',
  },
  stats: {
    bestTimeCardHeight: '80px',
    chartHeight: '280px',
    metricCardHeight: '72px',
  },
  league: {
    tierCardHeight: '68px',
    tierGap: '24px',
    arrowSize: '16px',
    currentScale: 1.05,
  },
};

// Animation Durations
export const animations = {
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  circularProgress: '1500ms',
};
