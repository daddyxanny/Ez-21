import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CardSlot from "./CardSlot";
import ProbabilityDisplay from "./ProbabilityDisplay";
import DonationModal from "./DonationModal";
import { Heart, RefreshCw, Play, User, UserRoundCheck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { GameState, BlackjackProbabilities, GameStats } from "@shared/schema";

const CARD_VALUES = [
  { value: 1, display: 'A' },
  { value: 2, display: '2' },
  { value: 3, display: '3' },
  { value: 4, display: '4' },
  { value: 5, display: '5' },
  { value: 6, display: '6' },
  { value: 7, display: '7' },
  { value: 8, display: '8' },
  { value: 9, display: '9' },
  { value: 10, display: '10' },
  { value: 10, display: 'J' },
  { value: 10, display: 'Q' },
  { value: 10, display: 'K' }
];

export default function BlackjackGame() {
  const [gameState, setGameState] = useState<GameState>({
    dealerCards: [],
    playerCards: [],
    handCount: 0
  });
  
  const [showCardModal, setShowCardModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<{ section: 'dealer' | 'player', index: number } | null>(null);
  const [dealerSlots, setDealerSlots] = useState<(string | null)[]>([null]);
  const [playerSlots, setPlayerSlots] = useState<(string | null)[]>([null, null]);

  const queryClient = useQueryClient();

  // Fetch game stats
  const { data: gameStats } = useQuery<GameStats>({
    queryKey: ['/api/game-stats'],
  });

  // Calculate probabilities
  const { data: probabilities, refetch: refetchProbabilities } = useQuery<BlackjackProbabilities>({
    queryKey: ['/api/calculate-probabilities', gameState],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/calculate-probabilities', gameState);
      return response.json();
    },
    enabled: gameState.dealerCards.length > 0 || gameState.playerCards.length > 0,
  });

  // Update game stats mutation
  const updateStatsMutation = useMutation({
    mutationFn: async (handsPlayed: number) => {
      const response = await apiRequest('POST', '/api/game-stats', { handsPlayed });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/game-stats'] });
    },
  });

  const calculateHandValue = (cards: number[]): number => {
    let value = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card === 1) {
        aces++;
        value += 11;
      } else {
        value += card;
      }
    });
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  };

  const shouldPlayerContinue = (currentCards: number[]): boolean => {
    const playerValue = calculateHandValue(currentCards);
    return playerValue < 21 && currentCards.length < 5;
  };

  const selectCard = (section: 'dealer' | 'player', index: number) => {
    setCurrentSlot({ section, index });
    setShowCardModal(true);
  };

  const selectCardValue = (card: typeof CARD_VALUES[0]) => {
    if (!currentSlot) return;

    const { section, index } = currentSlot;
    
    if (section === 'dealer') {
      const newDealerCards = [...gameState.dealerCards];
      const newDealerSlots = [...dealerSlots];
      
      newDealerCards[index] = card.value;
      newDealerSlots[index] = card.display;
      
      setGameState(prev => ({ ...prev, dealerCards: newDealerCards }));
      setDealerSlots(newDealerSlots);
    } else {
      const newPlayerCards = [...gameState.playerCards];
      const newPlayerSlots = [...playerSlots];
      
      newPlayerCards[index] = card.value;
      newPlayerSlots[index] = card.display;
      
      setGameState(prev => ({ ...prev, playerCards: newPlayerCards }));
      setPlayerSlots(newPlayerSlots);
    }
    
    setShowCardModal(false);
    setCurrentSlot(null);
  };

  const removeCard = (section: 'dealer' | 'player', index: number) => {
    if (section === 'dealer') {
      const newDealerCards = gameState.dealerCards.filter((_, i) => i !== index);
      const newDealerSlots = dealerSlots.filter((_, i) => i !== index);
      
      setGameState(prev => ({ ...prev, dealerCards: newDealerCards }));
      setDealerSlots(newDealerSlots.length < 1 ? [...newDealerSlots, null] : newDealerSlots);
    } else {
      const newPlayerCards = gameState.playerCards.filter((_, i) => i !== index);
      const newPlayerSlots = playerSlots.filter((_, i) => i !== index);
      
      setGameState(prev => ({ ...prev, playerCards: newPlayerCards }));
      setPlayerSlots(newPlayerSlots.length < 2 ? [...newPlayerSlots, null] : newPlayerSlots);
    }
  };

  const resetHand = () => {
    setGameState(prev => ({ ...prev, dealerCards: [], playerCards: [] }));
    setDealerSlots([null]);
    setPlayerSlots([null, null]);
  };

  const dealAgain = () => {
    resetHand();
    const newHandCount = gameState.handCount + 1;
    setGameState(prev => ({ ...prev, handCount: newHandCount }));
    updateStatsMutation.mutate(newHandCount);
  };

  // Refetch probabilities when game state changes
  useEffect(() => {
    refetchProbabilities();
  }, [gameState.dealerCards, gameState.playerCards, refetchProbabilities]);

  // Auto-add card slot when player should hit
  useEffect(() => {
    if (probabilities?.recommendation === 'HIT' && playerSlots.length > 0) {
      const lastSlotFilled = playerSlots[playerSlots.length - 1] !== null;
      const playerValue = calculateHandValue(gameState.playerCards);
      
      if (lastSlotFilled && playerValue < 21 && playerSlots.length < 5) {
        setPlayerSlots(prev => [...prev, null]);
      }
    }
  }, [probabilities, playerSlots, gameState.playerCards]);

  const playerHandValue = calculateHandValue(gameState.playerCards);

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-3 animate-fade-in">EZ 21</h1>
        <p className="text-muted-foreground text-lg mb-6">Smart Blackjack Predictor</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="bg-card border border-border rounded-lg px-6 py-3 animate-slide-up">
            <span className="text-sm text-muted-foreground">Hands Played:</span>
            <span className="text-2xl font-bold text-primary ml-2">
              {gameStats?.handsPlayed || gameState.handCount}
            </span>
          </div>
          <Button 
            onClick={() => setShowDonationModal(true)}
            variant="outline"
            className="rounded-lg px-6 py-3 hover:bg-accent transition-all duration-300"
          >
            <Heart className="text-destructive mr-2 animate-pulse" />
            <span className="text-sm font-medium">Support EZ 21</span>
          </Button>
        </div>
      </div>

      {/* Dealer Section */}
      <Card className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-center text-foreground">
          <UserRoundCheck className="inline mr-2" />
          Dealer
        </h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {dealerSlots.map((slot, index) => (
            <CardSlot
              key={index}
              value={slot || undefined}
              selected={!!slot}
              onClick={() => slot ? removeCard('dealer', index) : selectCard('dealer', index)}
              className="animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            />
          ))}
        </div>
      </Card>

      {/* Player Section */}
      <Card className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-center text-foreground flex-1">
            <User className="inline mr-2" />
            Your Cards
          </h2>
        </div>
        <div className="flex justify-center gap-4 flex-wrap mb-6">
          {playerSlots.map((slot, index) => (
            <CardSlot
              key={index}
              value={slot || undefined}
              selected={!!slot}
              onClick={() => slot ? removeCard('player', index) : selectCard('player', index)}
              className="animate-slide-up"
              style={{animationDelay: `${index * 0.1}s`}}
            />
          ))}
        </div>
        
        {/* Hand Value Display */}
        <div className="text-center mb-6">
          <div className="bg-secondary border border-border rounded-lg inline-block px-8 py-4">
            <span className="text-sm text-muted-foreground font-medium">Hand:</span>
            <span className="text-3xl font-bold text-primary ml-3">{playerHandValue} {playerHandValue > 21 ? '(BUST)' : playerHandValue === 21 ? '(BLACKJACK)' : ''}</span>
          </div>
        </div>
      </Card>

      {/* Prediction Section */}
      {probabilities && (
        <ProbabilityDisplay
          winProbability={probabilities.winProbability}
          bustProbability={probabilities.bustProbability}
          recommendation={probabilities.recommendation}
          recommendationColor={probabilities.recommendationColor}
        />
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Button 
          onClick={resetHand}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 px-8 py-4 font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
        >
          <RefreshCw className="mr-3 h-5 w-5" />
          Reset Hand
        </Button>
        <Button 
          onClick={dealAgain}
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary px-8 py-4 font-semibold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25"
        >
          <Play className="mr-3 h-5 w-5" />
          Deal Again
        </Button>
      </div>

      {/* Card Selection Modal */}
      <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
        <DialogContent className="glass-dark border-white/20 max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4 neon-text">Select Card Value</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {CARD_VALUES.map((card, index) => (
              <Button
                key={index}
                onClick={() => selectCardValue(card)}
                className="bg-gradient-to-br from-primary to-purple-600 hover:from-purple-600 hover:to-primary p-4 font-bold text-lg rounded-xl transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-purple-500/30"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                {card.display}
              </Button>
            ))}
          </div>
          <Button 
            onClick={() => setShowCardModal(false)}
            variant="secondary"
            className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-semibold"
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>

      {/* Donation Modal */}
      <DonationModal open={showDonationModal} onOpenChange={setShowDonationModal} />
    </div>
  );
}
