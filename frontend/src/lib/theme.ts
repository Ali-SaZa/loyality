// HeroUI theme configuration using the provided color palette
export const theme = {
  colors: {
    // Primary colors - using caribbean_current as the main brand color
    primary: {
      50: '#e6f7f9',
      100: '#001617',
      200: '#002b2f',
      300: '#004146',
      400: '#00565e',
      500: '#006d77', // DEFAULT - main primary
      600: '#00b4c4',
      700: '#13ebff',
      800: '#62f2ff',
      900: '#b0f8ff',
      DEFAULT: '#006d77',
      foreground: '#ffffff',
    },
    
    // Secondary colors - using tiffany_blue for accents
    secondary: {
      50: '#f0f9f8',
      100: '#152c2a',
      200: '#2a5954',
      300: '#3f857e',
      400: '#56afa6',
      500: '#83c5be', // DEFAULT - main secondary
      600: '#9bd0cb',
      700: '#b4dcd8',
      800: '#cde7e5',
      900: '#e6f3f2',
      DEFAULT: '#83c5be',
      foreground: '#ffffff',
    },
    
    // Background colors - using alice_blue and anti-flash_white
    background: {
      DEFAULT: '#edf6f9', // alice_blue DEFAULT
      secondary: '#e9ecef', // anti-flash_white DEFAULT
      tertiary: '#f0f7fa', // alice_blue 600
    },
    
    // Foreground colors - using onyx for text
    foreground: {
      DEFAULT: '#343a40', // onyx DEFAULT
      secondary: '#58626c', // onyx 600
      tertiary: '#7d8995', // onyx 700
      muted: '#a9b0b8', // onyx 800
    },
    
    // Content colors for cards and containers
    content1: {
      DEFAULT: '#ffffff',
      secondary: '#f7fbfc', // alice_blue 800
    },
    
    // Success, warning, error colors derived from the palette
    success: {
      DEFAULT: '#00b4c4', // caribbean_current 600
      foreground: '#ffffff',
    },
    
    warning: {
      DEFAULT: '#f59e0b', // standard warning orange
      foreground: '#ffffff',
    },
    
    danger: {
      DEFAULT: '#ef4444', // standard error red
      foreground: '#ffffff',
    },
    
    // Default colors for HeroUI components
    default: {
      50: '#f8f9fa',
      100: '#e9ecef', // anti-flash_white DEFAULT
      200: '#dee2e6',
      300: '#ced4da',
      400: '#adb5bd',
      500: '#6c757d',
      600: '#495057',
      700: '#343a40', // onyx DEFAULT
      800: '#212529',
      900: '#0b0c0d', // onyx 100
    },
  },
  
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
  
  // Custom CSS variables for additional color access
  cssVars: {
    '--caribbean-current': '#006d77',
    '--tiffany-blue': '#83c5be',
    '--alice-blue': '#edf6f9',
    '--anti-flash-white': '#e9ecef',
    '--onyx': '#343a40',
  },
};

// HeroUI theme configuration that will actually affect components
export const herouiTheme = {
  colors: {
    primary: {
      50: '#e6f7f9',
      100: '#001617',
      200: '#002b2f',
      300: '#004146',
      400: '#00565e',
      500: '#006d77',
      600: '#00b4c4',
      700: '#13ebff',
      800: '#62f2ff',
      900: '#b0f8ff',
      DEFAULT: '#006d77',
      foreground: '#ffffff',
    },
    secondary: {
      50: '#f0f9f8',
      100: '#152c2a',
      200: '#2a5954',
      300: '#3f857e',
      400: '#56afa6',
      500: '#83c5be',
      600: '#9bd0cb',
      700: '#b4dcd8',
      800: '#cde7e5',
      900: '#e6f3f2',
      DEFAULT: '#83c5be',
      foreground: '#ffffff',
    },
    success: {
      DEFAULT: '#00b4c4',
      foreground: '#ffffff',
    },
    warning: {
      DEFAULT: '#f59e0b',
      foreground: '#ffffff',
    },
    danger: {
      DEFAULT: '#ef4444',
      foreground: '#ffffff',
    },
  },
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  },
};

export default theme;
