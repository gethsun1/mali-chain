import { AppBar, Button, Toolbar, Typography, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import MaliChainLogo from "../assets/malichain.jpg"; 
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { WalletSelectionDialog } from './WalletSelectionDialog';

// Utility function to truncate a wallet address
const truncateAddress = (address: string, frontChars = 6, backChars = 4): string => {
  if (!address) return "";
  return `${address.substring(0, frontChars)}...${address.substring(address.length - backChars)}`;
};

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  return (
    <>
      <AppBar position='fixed' sx={{ backgroundColor: 'rgba(0,0,0,0.8)', boxShadow: 'none' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={MaliChainLogo} alt='MaliChain Logo' style={{ height: '40px', marginRight: '8px' }} />
            <Typography variant="h6" color="white" noWrap>
              MaliChain
            </Typography>
          </Box>
          <Button
            variant='contained'
            sx={{ ml: "auto", backgroundColor: '#FF3B30', textTransform: 'none' }}
            onClick={handleConnect}
          >
            {accountId ? `Connected: ${truncateAddress(accountId)}` : 'Connect Wallet'}
          </Button>
        </Toolbar>
      </AppBar>
      <WalletSelectionDialog open={open} setOpen={setOpen} onClose={() => setOpen(false)} />
    </>
  );
}
