import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Adventure, Character, GameState, GameSection as GameSectionType, Choice, GameEvent, DiceRoll, SaveSlot } from '../types';
import CharacterSheet from './CharacterSheet';
import GameSection from './GameSection';
import AIGameCreator from './AIGameCreator';
import DiceComponent from './DiceComponent';

interface AdventureGameProps {
  adventure?: Adventure;
  onAdventureChange?: (adventure: Adventure) => void;
  debugMode?: boolean;
}

const AdventureGame: React.FC<AdventureGameProps> = ({
  adventure: initialAdventure,
  onAdventureChange,
  debugMode = false
}) => {
  const [adventure, setAdventure] = useState<Adventure | null>(initialAdventure || null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentSection, setCurrentSection] = useState<GameSectionType | null>(null);
  const [activeTab, setActiveTab] = useState<'play' | 'character' | 'create'>('play');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [diceHistory, setDiceHistory] = useState<DiceRoll[]>([]);

  // Initialize game state when adventure changes
  useEffect(() => {
    if (adventure && !gameState) {
      initializeGame();
    }
  }, [adventure]);

  // Update current section when game state changes
  useEffect(() => {
    if (gameState && adventure) {
      const section = adventure.sections.find(s => s.id === gameState.currentSectionId);
      setCurrentSection(section || null);
    }
  }, [gameState, adventure]);

  const initializeGame = () => {
    if (!adventure) return;

    const character: Character = {
      id: 'player',
      name: 'Adventurer',
      skill: adventure.initialCharacter.skill || 10,
      stamina: adventure.initialCharacter.stamina || 20,
      luck: adventure.initialCharacter.luck || 10,
      maxSkill: adventure.initialCharacter.skill || 10,
      maxStamina: adventure.initialCharacter.stamina || 20,
      maxLuck: adventure.initialCharacter.luck || 10,
      provisions: adventure.initialCharacter.provisions || 10,
      gold: adventure.initialCharacter.gold || 20,
      inventory: adventure.initialCharacter.inventory || [],
      equipment: { weapon: undefined, armor: undefined, shield: undefined },
      notes: []
    };

    const newGameState: GameState = {
      character,
      currentSectionId: adventure.startingSectionId,
      visitedSections: [adventure.startingSectionId],
      gameFlags: {},
      saveTimestamp: Date.now()
    };

    setGameState(newGameState);
  };

  const handleChoiceSelect = (choice: Choice) => {
    if (!gameState || !adventure) return;

    const newGameState: GameState = {
      ...gameState,
      currentSectionId: choice.targetSectionId,
      visitedSections: [...gameState.visitedSections, choice.targetSectionId],
      saveTimestamp: Date.now()
    };

    setGameState(newGameState);
  };

  const handleEventTrigger = (event: GameEvent) => {
    if (!gameState) return;

    console.log('Event triggered:', event);
    
    // Handle different event types
    switch (event.type) {
      case 'damage':
        if (event.parameters.targetStat && event.parameters.amount) {
          const newCharacter = { ...gameState.character };
          const currentValue = newCharacter[event.parameters.targetStat];
          newCharacter[event.parameters.targetStat] = Math.max(0, currentValue - event.parameters.amount);
          setGameState({ ...gameState, character: newCharacter });
        }
        break;
      
      case 'heal':
        if (event.parameters.targetStat && event.parameters.amount) {
          const newCharacter = { ...gameState.character };
          const maxKey = `max${event.parameters.targetStat.charAt(0).toUpperCase() + event.parameters.targetStat.slice(1)}` as keyof Character;
          const maxValue = newCharacter[maxKey] as number;
          const currentValue = newCharacter[event.parameters.targetStat];
          newCharacter[event.parameters.targetStat] = Math.min(maxValue, currentValue + event.parameters.amount);
          setGameState({ ...gameState, character: newCharacter });
        }
        break;
      
      case 'treasure':
        if (event.parameters.items || event.parameters.gold) {
          const newCharacter = { ...gameState.character };
          if (event.parameters.items) {
            newCharacter.inventory = [...newCharacter.inventory, ...event.parameters.items];
          }
          if (event.parameters.gold) {
            newCharacter.gold += event.parameters.gold;
          }
          setGameState({ ...gameState, character: newCharacter });
        }
        break;
    }
  };

  const handleCharacterChange = (character: Character) => {
    if (!gameState) return;
    setGameState({ ...gameState, character });
  };

  const handleDiceRoll = (roll: DiceRoll) => {
    setDiceHistory(prev => [roll, ...prev.slice(0, 9)]);
  };

  const handleRollDice = (type: 'skill' | 'stamina' | 'luck') => {
    // This would typically open a dice rolling modal
    console.log(`Rolling dice for ${type} test`);
  };

  const saveGame = (slot: SaveSlot) => {
    if (!gameState) return;
    
    const saveKey = `ff-save-${slot}`;
    const saveData = {
      ...gameState,
      adventureId: adventure?.id,
      saveTimestamp: Date.now()
    };
    
    localStorage.setItem(saveKey, JSON.stringify(saveData));
    setShowSaveDialog(false);
  };

  const loadGame = (slot: SaveSlot) => {
    const saveKey = `ff-save-${slot}`;
    const saveData = localStorage.getItem(saveKey);
    
    if (saveData) {
      try {
        const parsedData = JSON.parse(saveData);
        setGameState(parsedData);
        setShowLoadDialog(false);
      } catch (error) {
        console.error('Failed to load save:', error);
      }
    }
  };

  const getSaveSlots = (): Array<{ slot: SaveSlot; data: any; empty: boolean }> => {
    return ([1, 2, 3, 4, 5] as SaveSlot[]).map(slot => {
      const saveKey = `ff-save-${slot}`;
      const saveData = localStorage.getItem(saveKey);
      
      return {
        slot,
        data: saveData ? JSON.parse(saveData) : null,
        empty: !saveData
      };
    });
  };

  const handleAdventureCreated = (newAdventure: Adventure) => {
    setAdventure(newAdventure);
    setGameState(null);
    setActiveTab('play');
    if (onAdventureChange) {
      onAdventureChange(newAdventure);
    }
  };

  const handleSectionCreated = (section: GameSectionType) => {
    console.log('Section created:', section);
  };

  const handleCharacterCreated = (character: Character) => {
    console.log('Character created:', character);
  };

  if (!adventure && activeTab !== 'create') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Adventure Selected</h2>
          <p className="text-gray-600 mb-6">Create a new adventure to begin playing.</p>
          <button
            onClick={() => setActiveTab('create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Create Adventure
          </button>
        </div>
      </div>
    );
  }

  if (!adventure && activeTab === 'create') {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Create Adventure</h1>
              <button
                onClick={() => setActiveTab('play')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Back
              </button>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AIGameCreator
            onAdventureCreated={handleAdventureCreated}
            onSectionCreated={handleSectionCreated}
            onCharacterCreated={handleCharacterCreated}
            existingAdventure={adventure || undefined}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">{adventure?.title}</h1>
            
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {(['play', 'character', 'create'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={!gameState}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowLoadDialog(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Load
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'play' && gameState && currentSection && (
            <motion.div
              key="play"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GameSection
                section={currentSection}
                character={gameState.character}
                onChoiceSelect={handleChoiceSelect}
                onEventTrigger={handleEventTrigger}
              />
              
              {debugMode && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-800 mb-2">Debug Info</h3>
                  <p className="text-red-700">Section ID: {currentSection.id}</p>
                  <p className="text-red-700">Visited: {gameState.visitedSections.length} sections</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'character' && gameState && (
            <motion.div
              key="character"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CharacterSheet
                character={gameState.character}
                onCharacterChange={handleCharacterChange}
                onRollDice={handleRollDice}
              />
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AIGameCreator
                onAdventureCreated={handleAdventureCreated}
                onSectionCreated={handleSectionCreated}
                onCharacterCreated={handleCharacterCreated}
                existingAdventure={adventure || undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {diceHistory.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-gray-800 mb-2">Recent Rolls</h3>
          <div className="space-y-1">
            {diceHistory.slice(0, 5).map(roll => (
              <div key={roll.id} className="text-sm">
                <span className="font-medium">{roll.total}</span>
                <span className="text-gray-600 ml-2">({roll.dice.join(', ')})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Save Game</h3>
              <div className="space-y-2">
                {getSaveSlots().map(({ slot, data, empty }) => (
                  <button
                    key={slot}
                    onClick={() => saveGame(slot)}
                    className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <div className="font-medium">Slot {slot}</div>
                    <div className="text-sm text-gray-600">
                      {empty ? 'Empty' : `Saved ${new Date(data.saveTimestamp).toLocaleDateString()}`}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load Dialog */}
      <AnimatePresence>
        {showLoadDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowLoadDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Load Game</h3>
              <div className="space-y-2">
                {getSaveSlots().map(({ slot, data, empty }) => (
                  <button
                    key={slot}
                    onClick={() => loadGame(slot)}
                    disabled={empty}
                    className={`w-full text-left p-3 border border-gray-300 rounded-lg ${
                      empty ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">Slot {slot}</div>
                    <div className="text-sm text-gray-600">
                      {empty ? 'Empty' : `Saved ${new Date(data.saveTimestamp).toLocaleDateString()}`}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowLoadDialog(false)}
                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdventureGame;