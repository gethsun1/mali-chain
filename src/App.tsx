import Footer from './components/Footer';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/Navbar';
import { Box, ThemeProvider } from '@mui/material';
import { AllWalletsProvider } from './services/wallets/AllWalletsProvider';
import AppRouter from './AppRouter';
import backgroundSvg from './assets/background.svg';
import { theme } from './theme';
import "./App.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AllWalletsProvider>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#000000',
            backgroundImage: `url(${backgroundSvg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed', // enables parallax effect
            backgroundPosition: 'center'
          }}
        >
          <header>
            <NavBar />
          </header>
          <Box flex={1} p={3}>
            <AppRouter />
          </Box>
          <Footer />
        </Box>
      </AllWalletsProvider>
    </ThemeProvider>
  );
}

export default App;
