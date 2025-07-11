import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AICreatorRequest, AICreatorResponse, Adventure, Character, GameSection } from '../types';

interface AIGameCreatorProps {
  onAdventureCreated: (adventure: Adventure) => void;
  onSectionCreated: (section: GameSection) => void;
  onCharacterCreated: (character: Character) => void;
  existingAdventure?: Adventure;
}

const AIGameCreator: React.FC<AIGameCreatorProps> = ({
  onAdventureCreated,
  onSectionCreated,
  onCharacterCreated,
  existingAdventure
}) => {
  const [activeTab, setActiveTab] = useState<'adventure' | 'section' | 'character'>('adventure');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<Partial<AICreatorRequest>>({
    type: 'adventure',
    theme: 'fantasy',
    difficulty: 'medium',
    length: 'medium'
  });
  const [preview, setPreview] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // This would integrate with Claude API
      const response = await mockAICreator(request as AICreatorRequest);
      
      if (response.success && response.data) {
        if (request.type === 'adventure') {
          onAdventureCreated(response.data as Adventure);
        } else if (request.type === 'section') {
          onSectionCreated(response.data as GameSection);
        } else if (request.type === 'character') {
          onCharacterCreated(response.data as Character);
        }
      } else {
        setError(response.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to AI service');
    } finally {
      setIsLoading(false);
    }
  };

  const mockAICreator = async (request: AICreatorRequest): Promise<AICreatorResponse> => {
    // Mock implementation - in real app, this would call Claude API
    // const apiKey = process.env.REACT_APP_CLAUDE_API_KEY;
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (request.type === 'adventure') {
      return {
        success: true,
        data: {
          id: 'mock-adventure-' + Date.now(),
          title: 'The Crystal Caverns',
          author: 'AI Creator',
          description: 'A mysterious adventure in underground caverns filled with magical crystals.',
          difficulty: request.difficulty || 'medium',
          estimatedPlayTime: 60,
          sections: [
            {
              id: 'start',
              text: 'You stand at the entrance to the Crystal Caverns, your torch flickering in the cold air. The ancient map in your hand shows two possible paths...',
              choices: [
                {
                  id: 'choice-1',
                  text: 'Take the left passage',
                  targetSectionId: 'left-path'
                },
                {
                  id: 'choice-2',
                  text: 'Take the right passage',
                  targetSectionId: 'right-path'
                }
              ],
              events: []
            }
          ],
          startingSectionId: 'start',
          initialCharacter: {
            skill: 10,
            stamina: 20,
            luck: 10,
            provisions: 10,
            gold: 20,
            inventory: []
          }
        }
      };
    }
    
    return { success: false, error: 'Not implemented' };
  };

  const generatePreview = async () => {
    if (!request.prompt) return;
    
    setIsLoading(true);
    try {
      // Mock preview generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPreview(`Preview for "${request.prompt}":\n\nThis ${request.type} will feature ${request.theme} elements with ${request.difficulty} difficulty. The content will be ${request.length} in length and include engaging choices and challenges appropriate for Fighting Fantasy games.`);
    } catch (err) {
      setError('Failed to generate preview');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Game Creator</h2>
      
      <div className="flex space-x-4 mb-6">
        {(['adventure', 'section', 'character'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setRequest(prev => ({ ...prev, type: tab }));
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={request.prompt || ''}
            onChange={(e) => setRequest(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder={`Describe the ${activeTab} you want to create...`}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={request.theme || 'fantasy'}
              onChange={(e) => setRequest(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="fantasy">Fantasy</option>
              <option value="sci-fi">Science Fiction</option>
              <option value="horror">Horror</option>
              <option value="mystery">Mystery</option>
              <option value="adventure">Adventure</option>
              <option value="historical">Historical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={request.difficulty || 'medium'}
              onChange={(e) => setRequest(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <select
              value={request.length || 'medium'}
              onChange={(e) => setRequest(prev => ({ ...prev, length: e.target.value as 'short' | 'medium' | 'long' }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={generatePreview}
            disabled={isLoading || !request.prompt}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Preview'}
          </button>

          <button
            type="submit"
            disabled={isLoading || !request.prompt}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : `Create ${activeTab}`}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center">
              <div className="text-red-600 mr-2">⚠️</div>
              <div className="text-red-800">{error}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Preview</h3>
            <div className="text-blue-700 whitespace-pre-wrap">{preview}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-center justify-center py-8"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Creating your {activeTab}...</span>
        </motion.div>
      )}
    </div>
  );
};

export default AIGameCreator;