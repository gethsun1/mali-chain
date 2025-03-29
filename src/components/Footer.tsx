import { Box, Typography, Stack } from '@mui/material';
import MaliChainLogo from "../assets/malichain.webp"; 
import HederaLogo from "../assets/hederalogobg.png";
import KenivestLogo from "../assets/kenivestlogo.png";
import NSELogo from "../assets/nselogo.png";

export default function Footer() {
  return (
    <Box sx={{ mt: 4, p: 2, textAlign: 'center', backgroundColor: '#111' }}>
      <Stack spacing={2} alignItems="center">
        {/* MaliChain Logo & Copyright */}
        <img 
          src={MaliChainLogo}
          alt='MaliChain'
          style={{ height: '30px', marginBottom: '8px' }}
        />
        <Typography variant="body2" color="gray">
          © {new Date().getFullYear()} MaliChain. All rights reserved.
        </Typography>

        {/* Partners Section */}
        <Typography variant="subtitle1" color="white" sx={{ mt: 2 }}>
          Our Partners
        </Typography>
        <Stack direction="row" spacing={3} alignItems="center" justifyContent="center">
          <img src={HederaLogo} alt="Hedera Logo" style={{ height: '40px' }} />
          <img src={KenivestLogo} alt="Kenivest Logo" style={{ height: '40px' }} />
          <img src={NSELogo} alt="NSE Logo" style={{ height: '40px' }} />
        </Stack>
      </Stack>
    </Box>
  );
}
