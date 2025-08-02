import { DefaultTheme as PaperDefaultTheme } from 'react-native-paper';
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

// Color palette
const colors = {
  // Primary colors
  primary: '#1E3A8A',
  primaryLight: '#3B82F6',
  primaryDark: '#1E40AF',
  
  // Secondary colors
  secondary: '#10B981',
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent colors
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  accentDark: '#D97706',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',
  
  // Text colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // Special colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  disabled: '#D1D5DB',
  placeholder: '#9CA3AF',
  
  // Gradient colors
  gradientPrimary: ['#1E3A8A', '#3B82F6'],
  gradientSecondary: ['#10B981', '#34D399'],
  gradientAccent: ['#F59E0B', '#FCD34D'],
};

// Typography
const fonts = {
  regular: {
    fontFamily: 'Inter-Regular',
    fontWeight: '400',
  },
  medium: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
  },
  semiBold: {
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
  },
  bold: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700',
  },
};

const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

const lineHeights = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 56,
};

// Spacing
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

// Border radius
const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadows
const shadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 16,
  },
};

// Theme object
export const theme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    ...colors,
  },
  fonts: {
    ...PaperDefaultTheme.fonts,
    ...fonts,
  },
  fontSizes,
  lineHeights,
  spacing,
  borderRadius,
  shadows,
  
  // Custom theme properties
  layout: {
    screen: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    card: {
      padding: spacing.md,
      borderRadius: borderRadius.lg,
      backgroundColor: colors.surface,
      ...shadows.sm,
    },
    button: {
      height: 48,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
    },
    input: {
      height: 48,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Z-indices
  zIndex: {
    modal: 1000,
    overlay: 999,
    dropdown: 998,
    header: 997,
    sticky: 996,
  },
};

// Dark theme variant
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: colors.gray900,
    backgroundSecondary: colors.gray800,
    surface: colors.gray800,
    surfaceSecondary: colors.gray700,
    textPrimary: colors.white,
    textSecondary: colors.gray300,
    textTertiary: colors.gray400,
    border: colors.gray700,
    borderLight: colors.gray600,
    borderDark: colors.gray800,
  },
};

// Typography styles
export const typography = {
  h1: {
    fontSize: fontSizes['4xl'],
    lineHeight: lineHeights['4xl'],
    ...fonts.bold,
  },
  h2: {
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights['3xl'],
    ...fonts.bold,
  },
  h3: {
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
    ...fonts.semiBold,
  },
  h4: {
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    ...fonts.semiBold,
  },
  h5: {
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    ...fonts.medium,
  },
  h6: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.base,
    ...fonts.medium,
  },
  body1: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.base,
    ...fonts.regular,
  },
  body2: {
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.sm,
    ...fonts.regular,
  },
  caption: {
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.xs,
    ...fonts.regular,
  },
  button: {
    fontSize: fontSizes.base,
    lineHeight: lineHeights.base,
    ...fonts.medium,
  },
};

// Component styles
export const componentStyles = {
  button: {
    primary: {
      backgroundColor: colors.primary,
      color: colors.white,
    },
    secondary: {
      backgroundColor: colors.secondary,
      color: colors.white,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
      color: colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: colors.primary,
    },
    disabled: {
      backgroundColor: colors.disabled,
      color: colors.textTertiary,
    },
  },
  card: {
    default: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.sm,
    },
    elevated: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      ...shadows.lg,
    },
    outlined: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
  },
  input: {
    default: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      color: colors.textPrimary,
    },
    focused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    error: {
      borderColor: colors.error,
      borderWidth: 2,
    },
  },
};

export default theme;