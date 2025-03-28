import { Card, CardContent, Typography, Paper, Button, Box } from "@mui/material";
import { Stack } from "@mui/system";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Blocks, FileLock2, Users } from "lucide-react";


const headerWords = ["Transforming", "Democratising", "Revolutionising", "Tokenizing"];

const cardData = [
  {
    title: "Fractional Ownership",
    description:
      "Tokenize high-value properties to allow investments starting as low as KES 220, unlocking liquidity and democratizing access.",
    icon: <Blocks size={40} color="#FF3B30" />,
  },
  {
    title: "Transparent & Secure Transactions",
    description:
      "Every transaction is recorded on Hedera’s secure ledger for full transparency and trust.",
    icon: <FileLock2 size={40} color="#FF3B30" />,
  },
  {
    title: "Inclusive Investment",
    description:
      "Empower local investors by bridging traditional real estate with cutting‑edge blockchain technology.",
    icon: <Users size={40} color="#FF3B30" />,
  },
];

const AnimatedHeaderWord = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % headerWords.length);
    }, 3000); // Change word every 3 seconds
    return () => clearInterval(timer);
  }, []); // headerWords is constant so we leave the dependency array empty

  return (
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ textShadow: "0 0 8px #FF3B30", fontWeight: "bold" }}
    >
      {headerWords[index]}
    </motion.span>
  );
};

export default function Home() {
  return (
    <Paper 
      elevation={0}
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        backgroundColor: "transparent", // keeps the parallax background visible
        position: "relative",
        zIndex: 2,
        p: 2,
      }}
    >
      {/* Hero Text with Entrance Animation */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, letterSpacing: 2 }}>
          Welcome To MaliChain
        </Typography>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Typography variant="h6" sx={{ mb: 4, color: "gray" }}>
          <AnimatedHeaderWord /> Real Estate Investment with Blockchain
        </Typography>
      </motion.div>
      
      {/* Info Cards Carousel / Stack */}
      <Box sx={{ width: "100%", maxWidth: 800 }}>
        <Stack spacing={3}>
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3 + 1 }}
            >
              <Card sx={{ backgroundColor: "#111", borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {card.icon}
                    <Typography variant="h5" sx={{ color: "#FF3B30" }}>
                      {card.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ color: "white", mt: 1 }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </Box>
      
      {/* Call-to-action button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <Button variant="outlined" size="large" sx={{ borderColor: "#FF3B30", color: "#FF3B30", mt: 4 }}>
          Explore More
        </Button>
      </motion.div>
    </Paper>
  );
}
