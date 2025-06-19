import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Copy } from "lucide-react";
import { SiBitcoin, SiEthereum, SiPaypal, SiLitecoin } from "react-icons/si";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PayPalButton from "./PayPalButton";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const { toast } = useToast();
  const [showPayPal, setShowPayPal] = useState(false);

  // Wallet addresses - replace these with your actual wallet addresses
  const walletAddresses = {
    bitcoin: "331dqC5jNsm2ys2wp83SUv8tUZKGAmrueG", // Replace with your Bitcoin address
    ethereum: "0x85c53efe088662af333a11b659ca911db5469b03", // Replace with your Ethereum address
    litecoin: "LKacdeS6n6Ei4hmvmsC3QSac1ZJP9g9Fcc" // Replace with your Litecoin address
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} address copied to clipboard`,
      });
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        toast({
          title: "Copied!",
          description: `${label} address copied to clipboard`,
        });
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-dark border-white/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            <Heart className="inline text-red-400 mr-2" />
            Support EZ 21
          </DialogTitle>
          <p className="text-gray-300 text-center">Help keep this app free and updated!</p>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* PayPal */}
          <Card className="glass rounded-lg p-4 bg-transparent border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SiPaypal className="text-2xl text-blue-400 mr-3" />
                <span className="font-semibold">PayPal</span>
              </div>
              {!showPayPal ? (
                <Button 
                  onClick={() => setShowPayPal(true)}
                  className="bg-blue-600 hover:bg-blue-500"
                  size="sm"
                >
                  Donate
                </Button>
              ) : (
                <PayPalButton amount="5.00" currency="USD" intent="capture" />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">Secure payment via PayPal</p>
          </Card>
          
          {/* Bitcoin */}
          <Card className="glass rounded-lg p-4 bg-transparent border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <SiBitcoin className="text-2xl text-orange-400 mr-3" />
                <span className="font-semibold">Bitcoin</span>
              </div>
              <Button 
                onClick={() => copyToClipboard(walletAddresses.bitcoin, 'Bitcoin')}
                className="bg-orange-600 hover:bg-orange-500"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-400 font-mono break-all">{walletAddresses.bitcoin}</p>
          </Card>
          
          {/* Ethereum */}
          <Card className="glass rounded-lg p-4 bg-transparent border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <SiEthereum className="text-2xl text-purple-400 mr-3" />
                <span className="font-semibold">Ethereum</span>
              </div>
              <Button 
                onClick={() => copyToClipboard(walletAddresses.ethereum, 'Ethereum')}
                className="bg-purple-600 hover:bg-purple-500"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-400 font-mono break-all">{walletAddresses.ethereum}</p>
          </Card>

          {/* Litecoin */}
          <Card className="glass rounded-lg p-4 bg-transparent border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <SiLitecoin className="text-2xl text-gray-300 mr-3" />
                <span className="font-semibold">Litecoin</span>
              </div>
              <Button 
                onClick={() => copyToClipboard(walletAddresses.litecoin, 'Litecoin')}
                className="bg-gray-600 hover:bg-gray-500"
                size="sm"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <p className="text-xs text-gray-400 font-mono break-all">{walletAddresses.litecoin}</p>
          </Card>
        </div>
        
        <Button 
          onClick={() => onOpenChange(false)}
          className="w-full bg-gray-600 hover:bg-gray-500 mt-6"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
