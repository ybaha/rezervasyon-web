import { defaultTheme } from './default';

// Different industry themes
const barberTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: {
      default: "#2E294E",
      hover: "#231F3A",
      light: "#E8E6F0",
      dark: "#1A1730",
    },
  },
};

const carWashTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: {
      default: "#1E88E5",
      hover: "#1976D2",
      light: "#E3F2FD",
      dark: "#1565C0",
    },
  },
};

// Map of industry to theme
const industryThemes: Record<string, typeof defaultTheme> = {
  barber: barberTheme,
  carwash: carWashTheme,
  default: defaultTheme,
};

export type ThemeType = typeof defaultTheme;

/**
 * Gets the appropriate theme based on industry
 */
export function getThemeByIndustry(industry: string): ThemeType {
  return industryThemes[industry] || defaultTheme;
}

/**
 * Gets the appropriate theme based on domain
 */
export function getThemeByDomain(domain: string): ThemeType {
  // Example mapping of domains to industries
  if (domain.includes('barber')) {
    return industryThemes.barber;
  } else if (domain.includes('carwash')) {
    return industryThemes.carwash;
  }
  
  return defaultTheme;
} 