import { AppBar, Button, Toolbar, Typography, Box, Stack, Drawer, List, ListItemButton, ListItemText, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MaliChainLogo from "../assets/malichain.jpg";
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { WalletSelectionDialog } from './WalletSelectionDialog';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Utility function to truncate a wallet address
const truncateAddress = (address: string, frontChars = 6, backChars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, frontChars)}...${address.substring(address.length - backChars)}`;
};

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  // Define your navigation links
  const navLinks = [
    { label: "Register Property", path: "/register-property" },
    { label: "Dashboard", path: "/dashboard" },
  ];

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{ textAlign: "center", backgroundColor: 'rgba(0,0,0,0.9)', height: "100%" }}
    >
      <Typography variant="h6" sx={{ my: 2, color: 'white' }}>
        MaliChain
      </Typography>
      <List>
        {navLinks.map((item) => (
          <ListItemButton
            key={item.label}
            component={Link}
            to={item.path}
          >
            <ListItemText primary={item.label} primaryTypographyProps={{ color: 'white' }} />
          </ListItemButton>
        ))}
        <ListItemButton onClick={handleConnect}>
          <ListItemText primary={accountId ? `Connected: ${truncateAddress(accountId)}` : 'Connect Wallet'} primaryTypographyProps={{ color: 'white' }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0,0,0,0.8)', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <img src={MaliChainLogo} alt="MaliChain Logo" style={{ height: '40px', marginRight: '8px' }} />
              <Typography variant="h6" color="white" noWrap>
                MaliChain
              </Typography>
            </Link>
          </Box>
          {isMobile ? (
            <IconButton color="inherit" edge="end" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              {navLinks.map((link) => (
                <Button key={link.label} component={Link} to={link.path} variant="text" sx={{ color: 'white' }}>
                  {link.label}
                </Button>
              ))}
              <Button
                variant="contained"
                sx={{ backgroundColor: '#FF3B30', textTransform: 'none' }}
                onClick={handleConnect}
              >
                {accountId ? `Connected: ${truncateAddress(accountId)}` : 'Connect Wallet'}
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
    </>
  );
}
