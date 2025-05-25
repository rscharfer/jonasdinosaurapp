import React, { useState } from 'react';
import { Target, Sprout, Printer, RotateCcw, Loader2, AlertTriangle, Image as ImageIcon, Volume2, VolumeX } from 'lucide-react';
import * as Tone from 'tone';
import getGeneratedImage from '../utils/getGeneratedImage';

const App = () => {
  const reptiles = [
    { id: 'crocodile', name: 'Saltwater Crocodile', habitat: 'murky swamps and tropical rivers' },
    { id: 'komodo', name: 'Komodo Dragon', habitat: 'harsh volcanic islands' },
    { id: 'black_mamba', name: 'Black Mamba', habitat: 'sun-baked savannas and rocky hills' },
    { id: 'king_cobra', name: 'King Cobra', habitat: 'dense rainforests and humid plains' },
    { id: 'inland_taipan', name: 'Inland Taipan', habitat: 'arid, cracked-earth semi-arid regions' },
    { id: 'gila_monster', name: 'Gila Monster', habitat: 'scorching deserts and thorny scrublands' },
  ];

  const dinosaurs = [
    { id: 'trex', name: 'Tyrannosaurus Rex', era: 'Late Cretaceous period jungle' },
    { id: 'velociraptor', name: 'Velociraptor', era: 'Late Cretaceous period fern-covered plains' },
    { id: 'spinosaurus', name: 'Spinosaurus', era: 'Cretaceous period river delta' },
    { id: 'allosaurus', name: 'Allosaurus', era: 'Late Jurassic period open woodlands' },
    { id: 'carnotaurus', name: 'Carnotaurus', era: 'Late Cretaceous period South American plains' },
    { id: 'giganotosaurus', name: 'Giganotosaurus', era: 'Late Cretaceous period forested floodplains' },
  ];

  const [selectedReptile, setSelectedReptile] = useState('');
  const [selectedDinosaur, setSelectedDinosaur] = useState('');
  const [winner, setWinner] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);




  const handleBattle = async () => {
    if (!selectedReptile || !selectedDinosaur || !winner) {
      setModalMessage('Please select a reptile, a dinosaur, and a winner before starting the battle!');
      setShowModal(true);
      return;
    }


    setIsLoading(true);
    setError('');
    setGeneratedImage('');

    const reptileData = reptiles.find(r => r.id === selectedReptile);
    const dinosaurData = dinosaurs.find(d => d.id === selectedDinosaur);

    if (!reptileData || !dinosaurData) {
        setError('Could not find selected creature data.');
        setIsLoading(false);
        return;
    }

    const creature1Name = reptileData.name;
    const creature2Name = dinosaurData.name;
    let winningCreatureName = '';
    let losingCreatureName = '';
    let winnerHabitat = '';

    if (winner === 'reptile') {
      winningCreatureName = creature1Name;
      losingCreatureName = creature2Name;
      winnerHabitat = reptileData.habitat;
    } else {
      winningCreatureName = creature2Name;
      losingCreatureName = creature1Name;
      winnerHabitat = dinosaurData.era; 
    }
   // const prompt = `Epic, photorealistic battle scene: a ${creature1Name} versus a ${creature2Name}. The ${winningCreatureName} is **undeniably triumphant and in a massively dominant pose**, decisively overpowering the ${losingCreatureName}. The ${winningCreatureName} is poised to deliver a **spectacular and final fight-ending blow**. The ${losingCreatureName} appears clearly defeated, weakened, and on the verge of collapse. The scene is set in a dramatic environment inspired by ${winnerHabitat}, featuring dynamic action, intense cinematic lighting, and hyper-realistic textures. Focus on the power and inevitable victory of the ${winningCreatureName}.`;
    const prompt = `Epic, photorealistic battle scene: a ${creature1Name} versus a ${creature2Name}. The ${winningCreatureName} is victorious, and staring down at the defeated ${losingCreatureName}`
    try {
      
      const result = await getGeneratedImage(prompt)
      setGeneratedImage(`data:image/png;base64,${result.image[0]}`);

    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while generating the image.');
      setModalMessage(err.message || 'An unexpected error occurred. Please try again.');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    if (generatedImage) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Dino Battle Print</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f0f0; }
              img { max-width: 100%; max-height: 95vh; object-fit: contain; box-shadow: 0 0 20px rgba(0,0,0,0.5); }
            </style>
          </head>
          <body>
            <img src="${generatedImage}" onload="window.print(); setTimeout(() => { window.close(); }, 300);" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
        setModalMessage('No image to print yet. Generate a battle scene first!');
        setShowModal(true);
    }
  };

  const handleStartOver = () => {
    setSelectedReptile('');
    setSelectedDinosaur('');
    setWinner('');
    setGeneratedImage('');
    setError('');
    setIsLoading(false);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
    if (isSoundEnabled && Tone.context.state === "running") { // If turning sound off
        // Optional: stop any currently playing Tone.js sounds if necessary
        // Tone.Transport.stop(); // This stops the main transport, might be too much
        // For individual synths, you'd need to manage and release them.
        // For this app, simply not triggering new sounds is enough.
    }
  };

  const CustomSelect = ({ id, value, onChange, options, placeholder, icon, disabled = false }) => (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
        {icon}
      </div>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 appearance-none bg-white text-gray-700 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value} className="text-gray-800">
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </div>
    </div>
  );
  
  const winnerOptions = [];
  if (selectedReptile) {
    const reptileData = reptiles.find(r => r.id === selectedReptile);
    if (reptileData) winnerOptions.push({ value: 'reptile', label: reptileData.name });
  }
  if (selectedDinosaur) {
    const dinosaurData = dinosaurs.find(d => d.id === selectedDinosaur);
    if (dinosaurData) winnerOptions.push({ value: 'dinosaur', label: dinosaurData.name });
  }

  const Modal = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-center mb-4">
            <AlertTriangle className="w-12 h-12 text-red-500 animate-pulse" />
        </div>
        <p className="text-gray-700 mb-6 text-lg">{message}</p>
        <button
          onClick={onClose}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          OK
        </button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-yellow-400 to-orange-500 p-4 sm:p-6 flex flex-col items-center font-['Comic Sans MS', 'Chalkboard SE', 'casual']">
      {showModal && <Modal message={modalMessage} onClose={() => setShowModal(false)} />}
      <div className="bg-white bg-opacity-95 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl relative">
        <button 
            onClick={toggleSound}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label={isSoundEnabled ? "Mute sounds" : "Unmute sounds"}
        >
            {isSoundEnabled ? <Volume2 className="w-6 h-6 text-green-600" /> : <VolumeX className="w-6 h-6 text-red-500" />}
        </button>
        <header className="text-center mb-6 sm:mb-8 pt-8 sm:pt-0">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-700 tracking-tight">
            Dino Battle Royale!
          </h1>
          <p className="text-yellow-700 mt-2 text-lg">Who will be the ultimate champion?</p>
        </header>

        <div className="space-y-6 mb-8">
          <CustomSelect
            id="reptile-select"
            value={selectedReptile}
            onChange={(e) => setSelectedReptile(e.target.value)}
            options={reptiles.map(r => ({ value: r.id, label: r.name }))}
            placeholder="-- Select a Deadly Reptile --"
            icon={<Target className="w-5 h-5 text-red-500" />}
          />
          <CustomSelect
            id="dinosaur-select"
            value={selectedDinosaur}
            onChange={(e) => setSelectedDinosaur(e.target.value)}
            options={dinosaurs.map(d => ({ value: d.id, label: d.name }))}
            placeholder="-- Select a Carnivorous Dinosaur --"
            icon={<Sprout className="w-5 h-5 text-green-600" />}
          />
          <CustomSelect
            id="winner-select"
            value={winner}
            onChange={(e) => setWinner(e.target.value)}
            options={winnerOptions}
            placeholder="-- Who Will Win? --"
            icon={<ImageIcon className="w-5 h-5 text-yellow-500" />} 
            disabled={!selectedReptile || !selectedDinosaur}
          />
        </div>

        <button
          onClick={handleBattle}
          disabled={isLoading || !selectedReptile || !selectedDinosaur || !winner}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-xl shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-3 w-6 h-6" />
              Generating Epic Battle...
            </>
          ) : (
            'BATTLE!'
          )}
        </button>

        {error && !isLoading && (
          <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-md shadow-md flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0 text-red-600" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-block ">
                <img src="https://placehold.co/120x120/FFFFFF/34D399?text=⚔️&font=noto-sans-mono" alt="Loading Battle" className="rounded-full animate-pulse" />
            </div>
            <p className="text-yellow-700 font-semibold mt-3 text-lg">The titans are preparing for combat...</p>
            <p className="text-sm text-gray-600">Crafting the legendary clash!</p>
          </div>
        )}

        {generatedImage && !isLoading && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">Behold the Battle Scene!</h2>
            <div className="flex justify-center items-center bg-black rounded-lg overflow-hidden shadow-md aspect-w-16 aspect-h-9">
                 <img 
                    src={generatedImage} 
                    alt="Generated battle scene" 
                    className="w-full h-full object-contain" // Changed to object-contain and w-full h-full
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src="https://placehold.co/600x338/CCCCCC/FFFFFF?text=Image+Load+Error"; // Adjusted placeholder aspect ratio
                        setError("There was an issue loading the generated image. Please try again.");
                    }}
                />
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <Printer className="mr-2 w-5 h-5" /> Print Image
              </button>
              <button
                onClick={handleStartOver}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <RotateCcw className="mr-2 w-5 h-5" /> Start New Battle
              </button>
            </div>
          </div>
        )}
         {!generatedImage && !isLoading && !error && (
            <div className="mt-8 text-center p-8 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                <ImageIcon className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                <p className="text-yellow-700 text-xl font-semibold">Select your fighters and a winner...</p>
                <p className="text-yellow-600 text-md">Then hit "BATTLE!" to witness the epic clash!</p>
            </div>
        )}
      </div>
       <footer className="mt-8 text-center pb-4">
        <p className="text-sm text-green-100 opacity-90">Dino Battle App &copy; 2025 - For the fiercest paleontologists!</p>
      </footer>
    </div>
  );
};

export default App;

