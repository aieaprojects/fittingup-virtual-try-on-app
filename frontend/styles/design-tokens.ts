// Fashion-focused design tokens for Clozet
export const designTokens = {
  // Color Palette - Fashion & Luxury Inspired
  colors: {
    // Primary neutrals
    cream: '#FAF7F2',        // Warm background
    ivory: '#F8F5F0',        // Secondary background
    pearl: '#F2EFE9',        // Card backgrounds
    stone: '#E8E4DD',        // Subtle borders
    
    // Accent colors
    sage: '#A8B5A0',         // Soft green accent
    blush: '#E5C5C0',        // Warm pink accent
    lavender: '#D4C8E0',     // Soft purple accent
    champagne: '#E6D7C3',    // Warm beige accent
    
    // Text colors
    charcoal: '#2C2C2C',     // Primary text
    slate: '#5A5A5A',        // Secondary text
    ash: '#8A8A8A',          // Tertiary text
    smoke: '#B8B8B8',        // Placeholder text
    
    // Pure contrasts
    pure: '#FFFFFF',         // Pure white
    onyx: '#000000',         // Pure black
    
    // Status colors
    success: '#7D9471',      // Muted green
    error: '#C4827D',        // Muted red
    warning: '#D4B078',      // Muted amber
  },
  
  // Typography - Elegant and readable
  typography: {
    // Font families
    heading: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    body: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    
    // Font sizes
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  // Spacing scale
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // Border radius - Smooth and modern
  radius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',   // Fully rounded
  },
  
  // Shadows - Subtle depth
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
  },
  
  // Layout breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  }
};

// Component style helpers
export const styleHelpers = {
  // Common gradient backgrounds
  gradients: {
    warm: 'linear-gradient(135deg, #FAF7F2 0%, #F2EFE9 100%)',
    cool: 'linear-gradient(135deg, #F8F5F0 0%, #E8E4DD 100%)',
    accent: 'linear-gradient(135deg, #A8B5A0 0%, #E5C5C0 100%)',
  },
  
  // Glass morphism effect
  glass: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  
  // Button variants
  buttons: {
    primary: `
      bg-gradient-to-r from-slate-900 to-slate-800 
      text-white font-medium
      hover:from-slate-800 hover:to-slate-700
      shadow-lg hover:shadow-xl
      transition-all duration-300
    `,
    secondary: `
      bg-white text-slate-800 
      border border-stone-300 
      hover:bg-pearl hover:border-stone-400
      shadow-sm hover:shadow-md
      transition-all duration-300
    `,
    accent: `
      bg-gradient-to-r from-sage to-blush
      text-white font-medium
      hover:shadow-lg
      transition-all duration-300
    `,
  },
  
  // Card styles
  cards: {
    default: `
      bg-white rounded-xl 
      shadow-md hover:shadow-lg
      border border-stone-200
      transition-all duration-300
    `,
    elevated: `
      bg-white rounded-2xl 
      shadow-lg hover:shadow-xl
      border border-stone-100
      transition-all duration-300
    `,
    glass: `
      bg-white/70 backdrop-blur-md rounded-2xl 
      border border-white/20
      shadow-lg
    `,
  }
};

export default designTokens;