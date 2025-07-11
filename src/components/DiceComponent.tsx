import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiceComponentProps, DiceRoll } from '../types';

const DiceComponent: React.FC<DiceComponentProps> = ({
  numDice,
  numSides,
  onRoll,
  disabled = false,
  size = 'medium',
  autoRoll = false
}) => {
  const [isRolling, setIsRolling] = useState(false);
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null);
  const [diceValues, setDiceValues] = useState<number[]>([]);

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base'
  };

  const rollDice = useCallback(() => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    
    // Animate dice rolling
    const rollAnimation = setInterval(() => {
      setDiceValues(Array.from({ length: numDice }, () => 
        Math.floor(Math.random() * numSides) + 1
      ));
    }, 100);

    // Stop animation and set final values
    setTimeout(() => {
      clearInterval(rollAnimation);
      
      const finalDice = Array.from({ length: numDice }, () => 
        Math.floor(Math.random() * numSides) + 1
      );
      
      const roll: DiceRoll = {
        id: Date.now().toString(),
        dice: finalDice,
        total: finalDice.reduce((sum, die) => sum + die, 0),
        timestamp: Date.now(),
        type: 'stat'
      };

      setDiceValues(finalDice);
      setCurrentRoll(roll);
      setIsRolling(false);
      onRoll(roll);
    }, 800);
  }, [numDice, numSides, disabled, isRolling, onRoll]);

  useEffect(() => {
    if (autoRoll && !currentRoll) {
      rollDice();
    }
  }, [autoRoll, currentRoll, rollDice]);

  const getDiceFace = (value: number) => {
    const faces = {
      1: '⚀',
      2: '⚁',
      3: '⚂',
      4: '⚃',
      5: '⚄',
      6: '⚅'
    };
    return faces[value as keyof typeof faces] || value.toString();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        <AnimatePresence>
          {Array.from({ length: numDice }).map((_, index) => (
            <motion.div
              key={index}
              className={`
                ${sizeClasses[size]}
                bg-white border-2 border-gray-400 rounded-lg
                flex items-center justify-center font-bold text-gray-800
                shadow-lg cursor-pointer select-none
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
              `}
              animate={isRolling ? {
                rotateX: [0, 180, 360],
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
                repeat: isRolling ? Infinity : 0
              }}
              onClick={rollDice}
              whileHover={{ scale: disabled ? 1 : 1.05 }}
              whileTap={{ scale: disabled ? 1 : 0.95 }}
            >
              {diceValues[index] !== undefined ? (
                numSides === 6 ? getDiceFace(diceValues[index]) : diceValues[index]
              ) : (
                numSides === 6 ? '⚀' : '1'
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <button
          onClick={rollDice}
          disabled={disabled || isRolling}
          className={`
            px-4 py-2 rounded-lg font-semibold transition-all
            ${disabled || isRolling
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
        
        {currentRoll && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-lg font-bold text-gray-800"
          >
            Total: {currentRoll.total}
          </motion.div>
        )}
      </div>

      {currentRoll && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-sm text-gray-600"
        >
          Individual rolls: {currentRoll.dice.join(', ')}
        </motion.div>
      )}
    </div>
  );
};

export default DiceComponent;