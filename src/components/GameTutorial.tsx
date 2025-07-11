import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, BookOpen, User, Sword, Map, Crown, Scroll, Lightbulb, Compass } from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  icon: React.ReactNode;
  tips?: string[];
  example?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to Adventure Creation!",
    content: "This tutorial will guide you through creating your own complete fantasy adventure from scratch. You'll learn to build worlds, characters, and stories that come alive!",
    icon: <BookOpen className="w-8 h-8 text-purple-500" />,
    tips: [
      "Every great adventure starts with a simple idea",
      "Don't worry about perfection - you can always revise",
      "Let your imagination run wild!",
      "The best adventures are the ones you're excited to explore"
    ]
  },
  {
    id: 2,
    title: "Step 1: Choose Your Adventure Theme",
    content: "What kind of adventure do you want to create? Your theme will shape everything from the setting to the challenges your players will face.",
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    tips: [
      "Classic Fantasy: Dragons, wizards, and ancient magic",
      "Dark Mystery: Haunted places and supernatural threats",
      "Epic Quest: Save the kingdom from great evil",
      "Urban Adventure: City intrigue and political plots"
    ],
    example: "Theme: 'Ancient Forest Mystery' - Players investigate why the forest spirits have gone silent and animals are fleeing."
  },
  {
    id: 3,
    title: "Step 2: Design Your World",
    content: "Now let's create the world where your adventure takes place. Think about the geography, climate, and what makes this place unique.",
    icon: <Map className="w-8 h-8 text-green-500" />,
    tips: [
      "Start with one main location (village, castle, forest)",
      "Add 2-3 key landmarks or areas of interest",
      "Consider how locations connect to each other",
      "Think about what dangers or mysteries each area holds"
    ],
    example: "World: 'Whisperwood Village' - A small logging town on the edge of an ancient forest, with an old watchtower and mysterious stone circles deeper in the woods."
  },
  {
    id: 4,
    title: "Step 3: Create Key Characters",
    content: "Every adventure needs memorable characters! Create the important people your players will meet - allies, enemies, and neutral parties.",
    icon: <User className="w-8 h-8 text-blue-500" />,
    tips: [
      "Give each character a clear motivation",
      "Include helpful allies and challenging opponents",
      "Add personality quirks to make them memorable",
      "Think about how they relate to your adventure's theme"
    ],
    example: "Characters: Elder Mira (worried village leader), Finn the Hunter (knows the forest), Shadow Drake (the mysterious threat)."
  },
  {
    id: 5,
    title: "Step 4: Plan Your Story Arc",
    content: "Structure your adventure with a clear beginning, middle, and end. Create a problem that needs solving and multiple paths to the solution.",
    icon: <Scroll className="w-8 h-8 text-amber-500" />,
    tips: [
      "Start with a hook - something that grabs attention",
      "Build tension with obstacles and discoveries",
      "Include choices that matter to the outcome",
      "Plan multiple possible endings based on player actions"
    ],
    example: "Arc: Village in crisis → Investigate the forest → Discover ancient curse → Choose how to break it → Face the consequences."
  },
  {
    id: 6,
    title: "Step 5: Add Challenges & Encounters",
    content: "Design the specific challenges players will face. Mix combat, puzzles, social encounters, and exploration to keep things interesting.",
    icon: <Sword className="w-8 h-8 text-red-500" />,
    tips: [
      "Vary the types of challenges (not just combat)",
      "Create puzzles that fit your world's theme",
      "Include social encounters for character development",
      "Make encounters meaningful to the story"
    ],
    example: "Challenges: Negotiate with suspicious villagers, solve an ancient riddle, track creatures through the forest, face the Shadow Drake."
  },
  {
    id: 7,
    title: "Step 6: Define Victory Conditions",
    content: "Decide what success looks like for your adventure. What are the different ways players can 'win', and what are the consequences of failure?",
    icon: <Crown className="w-8 h-8 text-gold-500" />,
    tips: [
      "Consider multiple types of success",
      "Think about partial victories and moral choices",
      "Plan consequences for different approaches",
      "Leave room for unexpected player creativity"
    ],
    example: "Victory: Lift the curse (forest restored), Contain the threat (temporary peace), Negotiate a truce (uneasy balance)."
  },
  {
    id: 8,
    title: "Step 7: Test Your Adventure",
    content: "Now it's time to bring your adventure to life! Use the AI Game Master to run through your creation and see how it plays.",
    icon: <Play className="w-8 h-8 text-purple-500" />,
    tips: [
      "Start with the opening scene you designed",
      "Be ready to adapt based on what happens",
      "Take notes on what works and what doesn't",
      "Remember - the best adventures evolve during play"
    ],
    example: "Launch: 'I want to run my Whisperwood Village adventure. The players are traveling merchants who arrive to find the village in crisis.'"
  },
  {
    id: 9,
    title: "You're Ready to Create!",
    content: "Congratulations! You now have all the tools to create amazing adventures. Remember, the best adventures come from practice and creativity.",
    icon: <Compass className="w-8 h-8 text-teal-500" />,
    tips: [
      "Start simple and build complexity over time",
      "Pay attention to what excites your players",
      "Don't be afraid to improvise and adapt",
      "Every adventure is a learning experience"
    ],
    example: "Your adventure toolkit is ready. Go forth and create worlds that will captivate and inspire!"
  }
];

const GameTutorial: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTutorialStep = tutorialSteps[currentStep];

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          <BookOpen className="w-5 h-5" />
          Adventure Creator
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {currentTutorialStep.icon}
              <h2 className="text-2xl font-bold text-gray-800">
                {currentTutorialStep.title}
              </h2>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {currentTutorialStep.content}
            </p>

            {currentTutorialStep.example && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-blue-800 font-semibold mb-2">Example:</p>
                <p className="text-blue-700">{currentTutorialStep.example}</p>
              </div>
            )}

            {currentTutorialStep.tips && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-800 font-semibold mb-2">Tips:</p>
                <ul className="text-yellow-700 space-y-1">
                  {currentTutorialStep.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep === tutorialSteps.length - 1 ? (
              <button
                onClick={() => setIsVisible(false)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Creating!
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameTutorial;