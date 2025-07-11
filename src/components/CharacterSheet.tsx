import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CharacterSheetProps, InventoryItem, StatType } from '../types';
import DiceComponent from './DiceComponent';

const CharacterSheet: React.FC<CharacterSheetProps> = ({
  character,
  onCharacterChange,
  onRollDice,
  readOnly = false
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showDiceRoller, setShowDiceRoller] = useState(false);
  const [diceRollerType, setDiceRollerType] = useState<StatType>('skill');

  const handleStatChange = (stat: StatType, value: number) => {
    if (readOnly) return;
    
    const maxValue = character[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}` as keyof typeof character] as number;
    const clampedValue = Math.max(0, Math.min(maxValue, value));
    
    onCharacterChange({
      ...character,
      [stat]: clampedValue
    });
  };

  const handleMaxStatChange = (stat: StatType, value: number) => {
    if (readOnly) return;
    
    const clampedValue = Math.max(1, Math.min(20, value));
    const maxKey = `max${stat.charAt(0).toUpperCase() + stat.slice(1)}` as keyof typeof character;
    
    onCharacterChange({
      ...character,
      [maxKey]: clampedValue,
      [stat]: Math.min(character[stat], clampedValue)
    });
  };

  const handleEquipItem = (item: InventoryItem) => {
    if (readOnly) return;
    
    const newEquipment = { ...character.equipment };
    const newInventory = [...character.inventory];
    
    if (item.type === 'weapon') {
      if (character.equipment.weapon) {
        newInventory.push(character.equipment.weapon);
      }
      newEquipment.weapon = item;
    } else if (item.type === 'armor') {
      if (character.equipment.armor) {
        newInventory.push(character.equipment.armor);
      }
      newEquipment.armor = item;
    } else if (item.type === 'shield') {
      if (character.equipment.shield) {
        newInventory.push(character.equipment.shield);
      }
      newEquipment.shield = item;
    }
    
    const itemIndex = newInventory.findIndex(i => i.id === item.id);
    if (itemIndex !== -1) {
      newInventory.splice(itemIndex, 1);
    }
    
    onCharacterChange({
      ...character,
      equipment: newEquipment,
      inventory: newInventory
    });
  };

  const handleUnequipItem = (slot: 'weapon' | 'armor' | 'shield') => {
    if (readOnly) return;
    
    const item = character.equipment[slot];
    if (!item) return;
    
    const newEquipment = { ...character.equipment };
    delete newEquipment[slot];
    
    onCharacterChange({
      ...character,
      equipment: newEquipment,
      inventory: [...character.inventory, item]
    });
  };

  const handleEatProvisions = () => {
    if (readOnly || character.provisions <= 0) return;
    
    const healAmount = Math.min(4, character.maxStamina - character.stamina);
    
    onCharacterChange({
      ...character,
      provisions: character.provisions - 1,
      stamina: character.stamina + healAmount
    });
  };

  const openDiceRoller = (type: StatType) => {
    setDiceRollerType(type);
    setShowDiceRoller(true);
  };

  const StatBlock: React.FC<{ stat: StatType; label: string }> = ({ stat, label }) => (
    <div className="bg-gray-100 rounded-lg p-4">
      <h3 className="font-bold text-gray-800 mb-2">{label}</h3>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">
          {`${character[stat]}/${character[`max${stat.charAt(0).toUpperCase() + stat.slice(1)}` as keyof typeof character]}`}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => openDiceRoller(stat)}
            className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
          >
            Test
          </button>
          {!readOnly && (
            <div className="flex space-x-1">
              <button
                onClick={() => handleStatChange(stat, character[stat] - 1)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
              >
                -
              </button>
              <button
                onClick={() => handleStatChange(stat, character[stat] + 1)}
                className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{character.name || 'Unnamed Character'}</h2>
        {!readOnly && (
          <button
            onClick={handleEatProvisions}
            disabled={character.provisions <= 0 || character.stamina >= character.maxStamina}
            className={`px-4 py-2 rounded-lg font-semibold ${
              character.provisions <= 0 || character.stamina >= character.maxStamina
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            Eat Provisions ({character.provisions})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatBlock stat="skill" label="SKILL" />
        <StatBlock stat="stamina" label="STAMINA" />
        <StatBlock stat="luck" label="LUCK" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Equipment</h3>
          <div className="space-y-2">
            {(['weapon', 'armor', 'shield'] as const).map(slot => (
              <div key={slot} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold capitalize">{slot}:</span>
                  <span className="ml-2">
                    {character.equipment[slot]?.name || 'None'}
                  </span>
                </div>
                {character.equipment[slot] && !readOnly && (
                  <button
                    onClick={() => handleUnequipItem(slot)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Unequip
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resources</h3>
          <div className="space-y-2">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold">Gold:</span>
              <span>{character.gold}</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-semibold">Provisions:</span>
              <span>{character.provisions}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {character.inventory.map(item => (
            <motion.div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <span className="font-semibold">{item.name}</span>
                {item.quantity > 1 && (
                  <span className="text-gray-600 ml-2">({item.quantity})</span>
                )}
                <div className="text-sm text-gray-600">{item.description}</div>
              </div>
              {!readOnly && ['weapon', 'armor', 'shield'].includes(item.type) && (
                <button
                  onClick={() => handleEquipItem(item)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Equip
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {character.notes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Notes</h3>
          <div className="space-y-2">
            {character.notes.map((note, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                {note}
              </div>
            ))}
          </div>
        </div>
      )}

      {showDiceRoller && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDiceRoller(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {diceRollerType.toUpperCase()} Test
            </h3>
            <p className="text-gray-600 mb-4">
              Roll 2 dice and add your {diceRollerType} ({character[diceRollerType]})
            </p>
            <DiceComponent
              numDice={2}
              numSides={6}
              onRoll={(roll) => {
                onRollDice(diceRollerType);
                setShowDiceRoller(false);
              }}
            />
            <button
              onClick={() => setShowDiceRoller(false)}
              className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CharacterSheet;