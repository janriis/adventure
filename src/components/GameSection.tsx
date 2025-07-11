import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameSectionProps, Choice, GameEvent } from '../types';

const GameSection: React.FC<GameSectionProps> = ({
  section,
  character,
  onChoiceSelect,
  onEventTrigger,
  textSpeed = 30,
  enableTTS = false
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setDisplayedText('');
    setIsTextComplete(false);
    setSelectedChoice(null);
    
    if (section.text) {
      animateText();
    }
    
    // Trigger immediate events
    section.events
      .filter(event => event.trigger === 'immediate')
      .forEach(event => onEventTrigger(event));
  }, [section.id]);

  const animateText = () => {
    const text = section.text;
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTextComplete(true);
        
        if (enableTTS) {
          speakText(text);
        }
      }
    }, Math.max(10, 100 - textSpeed));
  };

  const skipAnimation = () => {
    setDisplayedText(section.text);
    setIsTextComplete(true);
    
    if (enableTTS) {
      speakText(section.text);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    
    speechRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  const handleChoiceClick = (choice: Choice) => {
    if (selectedChoice) return;
    
    setSelectedChoice(choice.id);
    
    // Apply consequences
    if (choice.consequences) {
      choice.consequences.forEach(consequence => {
        // Handle consequences here - this would need to be passed up to parent
        console.log('Applying consequence:', consequence);
      });
    }
    
    // Trigger choice events
    section.events
      .filter(event => event.trigger === 'choice')
      .forEach(event => onEventTrigger(event));
    
    // Navigate after a brief delay
    setTimeout(() => {
      onChoiceSelect(choice);
    }, 500);
  };

  const checkRequirements = (choice: Choice): boolean => {
    if (!choice.requirements) return true;
    
    return choice.requirements.every(req => {
      switch (req.type) {
        case 'stat':
          if (!req.stat || !req.operator || req.value === undefined) return false;
          const statValue = character[req.stat];
          switch (req.operator) {
            case '>': return statValue > req.value;
            case '<': return statValue < req.value;
            case '>=': return statValue >= req.value;
            case '<=': return statValue <= req.value;
            case '==': return statValue === req.value;
            case '!=': return statValue !== req.value;
            default: return false;
          }
        case 'item':
          return character.inventory.some(item => item.id === req.itemId);
        case 'flag':
          // This would need to be implemented with game state
          return true;
        default:
          return true;
      }
    });
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {section.illustration && (
        <div className="relative">
          <img
            src={section.illustration}
            alt={section.title || 'Section illustration'}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        {section.title && (
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800 mb-4"
          >
            {section.title}
          </motion.h2>
        )}
        
        <div className="relative">
          <motion.div
            ref={textRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 leading-relaxed mb-6 text-lg"
          >
            {formatText(displayedText)}
          </motion.div>
          
          {!isTextComplete && (
            <motion.button
              onClick={skipAnimation}
              className="absolute bottom-0 right-0 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Skip
            </motion.button>
          )}
          
          {enableTTS && isTextComplete && (
            <motion.button
              onClick={isReading ? stopSpeaking : () => speakText(section.text)}
              className={`absolute bottom-0 right-0 px-3 py-1 rounded text-sm ${
                isReading 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isReading ? 'Stop' : 'Read Aloud'}
            </motion.button>
          )}
        </div>
        
        <AnimatePresence>
          {isTextComplete && section.choices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              {section.choices.map((choice, index) => {
                const isAvailable = checkRequirements(choice);
                const isSelected = selectedChoice === choice.id;
                
                return (
                  <motion.button
                    key={choice.id}
                    onClick={() => handleChoiceClick(choice)}
                    disabled={!isAvailable || selectedChoice !== null}
                    className={`
                      w-full text-left p-4 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? 'border-green-500 bg-green-50 text-green-800' 
                        : isAvailable 
                          ? 'border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50' 
                          : 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                      }
                    `}
                    whileHover={isAvailable ? { scale: 1.02 } : {}}
                    whileTap={isAvailable ? { scale: 0.98 } : {}}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{choice.text}</span>
                      {isSelected && (
                        <span className="text-green-600">✓</span>
                      )}
                      {!isAvailable && (
                        <span className="text-red-500 text-sm">
                          Requirements not met
                        </span>
                      )}
                    </div>
                    
                    {choice.requirements && (
                      <div className="mt-2 text-sm text-gray-600">
                        {choice.requirements.map((req, reqIndex) => (
                          <div key={reqIndex} className="flex items-center">
                            <span className={`mr-2 ${
                              checkRequirements({...choice, requirements: [req]}) 
                                ? 'text-green-600' 
                                : 'text-red-600'
                            }`}>
                              {checkRequirements({...choice, requirements: [req]}) ? '✓' : '✗'}
                            </span>
                            <span>
                              {req.type === 'stat' && req.stat && req.operator && req.value !== undefined && 
                                `${req.stat.toUpperCase()} ${req.operator} ${req.value}`
                              }
                              {req.type === 'item' && req.itemId && 
                                `Have item: ${req.itemId}`
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        
        {section.events.some(event => event.trigger === 'conditional') && (
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <h4 className="font-semibold text-yellow-800 mb-2">Events</h4>
            <div className="space-y-2">
              {section.events
                .filter(event => event.trigger === 'conditional')
                .map(event => (
                  <div key={event.id} className="text-sm text-yellow-700">
                    {event.description}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSection;