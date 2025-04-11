import React, { useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import QRCodeSVG from 'qrcode.react'; // ✅ default export, NOT destructured

export default function App() {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    allergies: [],
    photo: null,
    photoPreview: null,
    rackNumber: '',
    busRouteNumber: ''
  });

  const [submittedData, setSubmittedData] = useState(null);
  const [template, setTemplate] = useState('template1');
  const [savedCards, setSavedCards] = useState([]);
  const [isQrEnlarged, setIsQrEnlarged] = useState(false);
  const cardRef = useRef();

  // Load saved cards from localStorage on component mount
  useEffect(() => {
    const savedCardsFromStorage = localStorage.getItem('savedCards');
    if (savedCardsFromStorage) {
      try {
        const parsedCards = JSON.parse(savedCardsFromStorage);
        setSavedCards(parsedCards);
      } catch (error) {
        console.error("Error parsing saved cards:", error);
        localStorage.removeItem('savedCards');
      }
    }
  }, []);

  // Allergy options
  const allergyOptions = ['Peanuts', 'Dairy', 'Gluten', 'Eggs', 'Seafood', 'Soy'];

  // Bus route options
  const busRouteOptions = ['Route A', 'Route B', 'Route C', 'Route D', 'Route E'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAllergyChange = (allergy) => {
    const updatedAllergies = formData.allergies.includes(allergy)
      ? formData.allergies.filter(a => a !== allergy)
      : [...formData.allergies, allergy];

    setFormData({
      ...formData,
      allergies: updatedAllergies
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          photo: file,
          photoPreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Find the handleSubmit function and modify it like this:
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a copy of the form data
    const dataToSubmit = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };

    setSubmittedData(dataToSubmit);

    // Create a version for storage that excludes the large photo data
    const storageData = {
      ...dataToSubmit,
      // Exclude full photoPreview from storage to prevent localStorage overflow
      photoPreview: dataToSubmit.photoPreview ? true : null
    };

    // Save to localStorage
    const updatedCards = [...savedCards, storageData];
    setSavedCards(updatedCards);

    try {
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      alert("Could not save card to local storage - storage may be full");
    }

    // Reset form data after successful submission
    setFormData({
      name: '',
      rollNumber: '',
      allergies: [],
      photo: null,
      photoPreview: null,
      rackNumber: '',
      busRouteNumber: ''
    });
  };
  // Generate a compact QR code with essential data only
  const generateQrData = (data) => {
    // Only include essential identification information
    const qrData = {
      name: data.name,
      rollNumber: data.rollNumber,
      allergies: data.allergies,
      rackNumber: data.rackNumber,
      busRouteNumber: data.busRouteNumber
    };

    return JSON.stringify(qrData);
  };

  // Fixed handleDownloadCard function
  const handleDownloadCard = () => {
    if (!cardRef.current) {
      console.error("Card reference is not available");
      return;
    }

    // Modified options to handle font loading issues
    const options = {
      quality: 0.95,
      backgroundColor: "#fff",
      cacheBust: true,
      // Skip fonts to avoid the font undefined error
      skipFonts: true,
      // Filter to exclude problematic elements if any
      filter: (node) => {
        // Return true for all nodes to include everything
        return true;
      },
      // Add font options to prevent undefined font errors
      fontEmbedCSS: '',
      // Add a small timeout to ensure DOM is fully rendered
      pixelRatio: 2 // Increase quality of the output image
    };

    // Add a small delay to ensure the DOM is stable
    setTimeout(() => {
      toPng(cardRef.current, options)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `id-card-${submittedData.name.replace(/\s+/g, "-").toLowerCase()}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Error generating image:", err);
          // Fallback method if toPng fails
          alert("Could not generate image automatically. Please take a screenshot of the card instead.");
        });
    }, 300); // Increased delay to ensure everything is loaded
  };

  const loadSavedCard = (card) => {
    // If we're loading from localStorage, we need to handle missing photoPreview
    if (card.photoPreview === true) {
      // We stored a placeholder, tell user photo needs to be re-uploaded
      alert("Saved photo cannot be loaded. Please re-upload the photo if needed.");
      setSubmittedData({
        ...card,
        photoPreview: null
      });
    } else {
      setSubmittedData(card);
    }
  };

  const deleteSavedCard = (e, cardId) => {
    e.stopPropagation();
    const updatedCards = savedCards.filter(card => card.id !== cardId);
    setSavedCards(updatedCards);

    try {
      localStorage.setItem('savedCards', JSON.stringify(updatedCards));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }

    // If the currently displayed card is deleted, clear the display
    if (submittedData && submittedData.id === cardId) {
      setSubmittedData(null);
    }
  };

  const clearAllSavedCards = () => {
    setSavedCards([]);
    localStorage.removeItem('savedCards');
    setSubmittedData(null);
  };

  // Classic Template 1 ID Card
  const Template1 = ({ data }) => (
    <div className="bg-amber-50 border-2 border-amber-700 rounded-lg shadow-lg p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Classic decorative elements */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700"></div>
      <div className="absolute top-2 left-0 w-2 h-full bg-gradient-to-b from-amber-700 via-amber-500 to-amber-700"></div>
      <div className="absolute top-2 right-0 w-2 h-full bg-gradient-to-b from-amber-700 via-amber-500 to-amber-700"></div>

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-700"></div>
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-700"></div>
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-700"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-700"></div>

      <div className="flex items-center justify-between mb-6 border-b-2 border-amber-200 pb-4 relative z-10">
        <div>
          <h1 className="text-xl font-bold text-amber-800 tracking-tight">UNITY SCHOOL</h1>
          <h2 className="text-sm text-amber-700 uppercase tracking-wider">Student ID Card</h2>
        </div>
        <div className="bg-amber-100 p-2 rounded-full border border-amber-200 shadow">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 48 48" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-amber-700"
          >
            <rect width="48" height="48" fill="#fef3c7" />
            <text x="50%" y="50%" fontSize="8" fill="#b45309" 
              textAnchor="middle" dominantBaseline="middle">LOGO</text>
          </svg>
        </div>
      </div>

      <div className="flex mb-6">
        <div className="mr-6">
          {data.photoPreview ? (
            <img 
              src={data.photoPreview} 
              alt="Student" 
              className="w-32 h-40 object-cover border-2 border-amber-700 shadow-md transform hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <div className="w-32 h-40 bg-amber-100 border-2 border-amber-700 shadow-md flex items-center justify-center">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 32 40" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="40" fill="#fef3c7" />
                <circle cx="16" cy="14" r="8" fill="#d1d5db" />
                <path d="M 4 40 C 4 26 28 26 28 40" fill="#d1d5db" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="mb-3">
            <span className="text-xs text-amber-700 uppercase tracking-wider font-semibold">Name</span>
            <h3 className="text-lg font-semibold text-amber-900">{data.name}</h3>
          </div>
          <div className="mb-3">
            <span className="text-xs text-amber-700 uppercase tracking-wider font-semibold">Roll Number</span>
            <p className="text-amber-800 font-medium">{data.rollNumber}</p>
          </div>
          <div className="mb-3">
            <span className="text-xs text-amber-700 uppercase tracking-wider font-semibold">Rack Number</span>
            <p className="text-amber-800 font-medium">{data.rackNumber}</p>
          </div>
          <div>
            <span className="text-xs text-amber-700 uppercase tracking-wider font-semibold">Bus Route</span>
            <p className="text-amber-800 font-medium">{data.busRouteNumber}</p>
          </div>
        </div>
      </div>

      {data.allergies && data.allergies.length > 0 && (
        <div className="mb-6">
          <span className="text-xs text-red-700 uppercase tracking-wider mb-1 block font-semibold">Allergies</span>
          <div className="flex flex-wrap gap-2">
            {data.allergies.map(allergy => (
              <span key={allergy} className="bg-red-50 text-red-800 text-xs px-2 py-1 border border-red-300 rounded-full font-medium">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center pt-4 border-t-2 border-amber-200">
        <div 
          className="bg-white p-1 border-2 border-amber-600 rounded shadow-md relative cursor-pointer group"
          onClick={() => setIsQrEnlarged(!isQrEnlarged)}
        >
          <div className={`transition-transform duration-300 ${isQrEnlarged ? 'transform scale-150 origin-top-left' : ''}`}>
            <QRCodeSVG value={generateQrData(data)} size={64} />
          </div>
          <span className="absolute -bottom-6 left-0 text-xs text-amber-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Click to {isQrEnlarged ? 'shrink' : 'enlarge'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-amber-700">
            <span className="block">Issued on:</span>
            <span className="block font-medium">{new Date().toLocaleDateString()}</span>
          </p>
        </div>
      </div>
    </div>
  );

  // Classic Template 2 ID Card
  const Template2 = ({ data }) => (
    <div className="bg-blue-50 border-2 border-blue-800 rounded-lg shadow-lg p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>

      {/* Ornate header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-blue-200 relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent"></div>
        <h1 className="text-xl font-bold text-blue-800">UNITY SCHOOL</h1>
        <h2 className="text-sm text-blue-700 uppercase tracking-wider">Student Identification</h2>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-blue-800 to-transparent"></div>
      </div>

      <div className="flex flex-col items-center mb-6">
        {data.photoPreview ? (
          <div className="p-1 border-2 border-blue-700 rounded-lg shadow-md bg-white mb-4">
            <img 
              src={data.photoPreview} 
              alt="Student" 
              className="w-32 h-32 object-cover transform hover:scale-105 transition-transform duration-300" 
            />
          </div>
        ) : (
          <div className="w-32 h-32 bg-blue-100 border-2 border-blue-700 rounded-lg shadow-md mb-4 flex items-center justify-center">
            <svg 
              width="100%" 
              height="100%" 
              viewBox="0 0 32 32" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="32" height="32" fill="#dbeafe" />
              <circle cx="16" cy="12" r="6" fill="#93c5fd" />
              <path d="M 4 32 C 4 22 28 22 28 32" fill="#93c5fd" />
            </svg>
          </div>
        )}
        <h3 className="text-lg font-semibold text-blue-900">{data.name}</h3>
        <p className="text-blue-700 text-sm">Roll Number: {data.rollNumber}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-100 p-3 border-2 border-blue-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="text-xs text-blue-700 uppercase tracking-wider block mb-1 font-semibold">Rack Number</span>
          <p className="font-medium text-blue-800">{data.rackNumber}</p>
        </div>
        <div className="bg-blue-100 p-3 border-2 border-blue-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <span className="text-xs text-blue-700 uppercase tracking-wider block mb-1 font-semibold">Bus Route</span>
          <p className="font-medium text-blue-800">{data.busRouteNumber}</p>
        </div>
      </div>

      {data.allergies && data.allergies.length > 0 && (
        <div className="mb-6 bg-red-50 p-3 border-2 border-red-300 rounded-lg shadow-sm">
          <span className="text-xs font-semibold text-red-800 uppercase tracking-wider block mb-1">Health Alert: Allergies</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {data.allergies.map(allergy => (
              <span key={allergy} className="bg-white text-red-800 text-xs px-2 py-1 border border-red-300 rounded-full">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between items-center pt-4 border-t-2 border-blue-200">
        <div 
          className="bg-white p-1 border-2 border-blue-600 rounded-lg shadow-md relative cursor-pointer group"
          onClick={() => setIsQrEnlarged(!isQrEnlarged)}
        >
          <div className={`transition-transform duration-300 ${isQrEnlarged ? 'transform scale-150 origin-top-left' : ''}`}>
            <QRCodeSVG value={generateQrData(data)} size={64} />
          </div>
          <span className="absolute -bottom-6 left-0 text-xs text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Click to {isQrEnlarged ? 'shrink' : 'enlarge'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-700">
            <span className="block uppercase tracking-wider">Valid Until:</span>
            <span className="block font-medium">{new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 pb-4 border-b-2 border-gray-300">
          <span className="text-amber-700">Student</span> ID Card <span className="text-blue-700">Generator</span>
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Data Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">Student Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <div className="space-y-1 bg-gray-50 p-3 border-2 border-gray-200 rounded-lg">
                  {allergyOptions.map((allergy) => (
                    <label key={allergy} className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors duration-200">
                      <input
                        type="checkbox"
                        checked={formData.allergies.includes(allergy)}
                        onChange={() => handleAllergyChange(allergy)}
                        className="mr-2 h-4 w-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200 transition-colors"
                />
                {formData.photoPreview && (
                  <div className="mt-2">
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover border-2 border-gray-300 rounded-lg shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rack Number</label>
                <input
                  type="text"
                  name="rackNumber"
                  value={formData.rackNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bus Route</label>
                <select
                  name="busRouteNumber"
                  value={formData.busRouteNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                  required
                >
                  <option value="">Select Bus Route</option>
                  {busRouteOptions.map((route) => (
                    <option key={route} value={route}>{route}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-800 text-white py-2 px-4 rounded-lg hover:from-amber-700 hover:to-amber-900 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
              >
                Generate ID Card
              </button>
            </form>

            {/* Saved Cards with Delete Option */}
            {savedCards.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Saved Cards</h3>
                  <button 
                    onClick={clearAllSavedCards}
                    className="text-xs text-red-600 hover:text-red-800 hover:underline focus:outline-none"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg shadow-inner">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-2 border-b border-gray-200 hover:bg-amber-50 cursor-pointer flex justify-between items-center"
                      onClick={() => loadSavedCard(card)}
                    >
                      <span className="text-sm text-gray-700 font-medium">{card.name} - {card.rollNumber}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {new Date(card.timestamp).toLocaleDateString()}
                        </span>
                        <button
                          onClick={(e) => deleteSavedCard(e, card.id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                          title="Delete this card"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ID Card Preview */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">ID Card Preview</h2>
                <div>
                  <label className="text-sm text-gray-700 mr-2">Template:</label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="px-3 py-1 border-2 border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="template1">Amber Classic</option>
                    <option value="template2">Blue Modern</option>
                  </select>
                </div>
              </div>

              {submittedData ? (
                <div>
                  <div ref={cardRef}>
                    {template === 'template1' ? (
                      <Template1 data={submittedData} />
                    ) : (
                      <Template2 data={submittedData} />
                    )}
                  </div>
                  <button
                    onClick={handleDownloadCard}
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                  >
                    Download as PNG
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <p>Fill the form and submit to generate ID card</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
