import { ThemeProvider } from '@material-ui/core';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Routes from './router/routes';
import theme from './styles/theme';

LicenseInfo.setLicenseKey(
  '82b06281d934355ee10f667482ba1792T1JERVI6Mjg1NTIsRVhQSVJZPTE2NjEzMjc3NTkwMDAsS0VZVkVSU0lPTj0x'
);

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: true } },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <Router>
          <Routes />
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
    <ReactQueryDevtools initialIsOpen={true} />
  </QueryClientProvider>
);

export default App;
