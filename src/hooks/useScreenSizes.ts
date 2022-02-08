import { useMediaQuery, useTheme } from '@material-ui/core';

// add different screen size listeners
export const useScreenSizes = () => {
  const theme = useTheme();
  const isMobileScreen = useMediaQuery(theme.breakpoints.only('xs'));
  const isTabletScreen = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isxLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  return { isMobileScreen, isTabletScreen, isLargeScreen, isxLargeScreen };
};
