import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import Layout from './layout/Layout';
import { SnackbarProvider } from 'notistack';

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <Layout />
            </SnackbarProvider>
        </ThemeProvider>
    );
}
