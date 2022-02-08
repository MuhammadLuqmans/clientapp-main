import { createTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createTheme({
  typography: {
    
  },
  palette: {
    primary: {
      main: '#4db0cc',
      dark: '#3891aa',
      contrastText: "#fff",
    },
    secondary: {
      main: '#1D5990',
      dark: '#133D65',
    },
    error: {
      main: '#DD3336',
      dark: '#b92b2e',
    },
    success: {
      main: '#1FBD6C',
    },
  },
  props: {
    MuiSvgIcon: {
      htmlColor: '#fff',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {},
      },
    },
  },
});

export default theme;
