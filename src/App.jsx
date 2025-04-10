import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import './App.css';

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
  const cardRef = useRef();

  // Load saved cards from localStorage on component mount
  useEffect(() => {
    const savedCardsFromStorage = localStorage.getItem('savedCards');
    if (savedCardsFromStorage) {
      setSavedCards(JSON.parse(savedCardsFromStorage));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a copy of the form data
    const dataToSubmit = {
      ...formData,
      id: Date.now(), // Add a unique ID for each card
      timestamp: new Date().toISOString()
    };

    setSubmittedData(dataToSubmit);

    // Save to localStorage
    const updatedCards = [...savedCards, dataToSubmit];
    setSavedCards(updatedCards);
    localStorage.setItem('savedCards', JSON.stringify(updatedCards));
  };

  const handleDownloadCard = () => {
    if (!cardRef.current) {
      console.error("Card reference is not available");
      return;
    }

    // Add a small delay to ensure all elements are rendered properly
    setTimeout(() => {
      // Apply options to handle potential issues
      const options = {
        quality: 0.95,
        backgroundColor: '#fff',
        cacheBust: true,
        // Handle potential cross-origin issues with images
        filter: (node) => {
          if (node.tagName === 'IMG') {
            // Skip over problematic images if needed
            // return node.crossOrigin !== 'anonymous';
          }
          return true;
        },
      };

      toPng(cardRef.current, options)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `id-card-${submittedData.name.replace(/\s+/g, '-').toLowerCase()}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Error generating image:', err);
          // Provide user feedback
          alert('Failed to download the ID card. Please try again or use a screenshot instead.');
        });
    }, 100);
  };


  const loadSavedCard = (card) => {
    setSubmittedData(card);
  };

  // Template 1 ID Card
  const Template1 = ({ data }) => (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 max-w-md mx-auto text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">UNITY SCHOOL</h1>
          <h2 className="text-lg">Student ID Card</h2>
        </div>
        <div className="bg-white rounded-full p-1">
          <img src="/api/placeholder/64/64" alt="School Logo" className="h-16 w-16" />
        </div>
      </div>

      <div className="flex mb-4">
        <div className="mr-4">
          {data.photoPreview ? (
            <img src={data.photoPreview} alt="Student" className="w-32 h-32 object-cover rounded-lg border-4 border-white" />
          ) : (
            <div className="w-32 h-32 bg-gray-300 rounded-lg border-4 border-white flex items-center justify-center">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 32 32" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" fill="#e2e8f0" />
                <circle cx="16" cy="10" r="6" fill="#94a3b8" />
                <path d="M 4 32 C 4 22 28 22 28 32" fill="#94a3b8" />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <span className="text-xs opacity-75">Name</span>
            <h3 className="text-xl font-bold">{data.name}</h3>
          </div>
          <div className="mb-2">
            <span className="text-xs opacity-75">Roll Number</span>
            <p className="font-semibold">{data.rollNumber}</p>
          </div>
          <div className="mb-2">
            <span className="text-xs opacity-75">Rack Number</span>
            <p className="font-semibold">{data.rackNumber}</p>
          </div>
          <div>
            <span className="text-xs opacity-75">Bus Route</span>
            <p className="font-semibold">{data.busRouteNumber}</p>
          </div>
        </div>
      </div>

      {data.allergies && data.allergies.length > 0 && (
        <div className="mb-4">
          <span className="text-xs opacity-75">Allergies</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.allergies.map(allergy => (
              <span key={allergy} className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div className="bg-white p-2 rounded-lg">
          <QRCodeSVG value={JSON.stringify(data)} size={80} />
        </div>
        <p className="text-sm opacity-75 text-right">
          <span className="block">Issued on:</span>
          <span className="block">{new Date().toLocaleDateString()}</span>
        </p>
      </div>
    </div>
  );

  // Template 2 ID Card
  const Template2 = ({ data }) => (
    <div className="bg-white border-t-8 border-yellow-500 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">UNITY SCHOOL</h1>
        <h2 className="text-md font-semibold text-yellow-500">Student Identification</h2>
      </div>

      <div className="flex flex-col items-center mb-4">
        {data.photoPreview ? (
          <img src={data.photoPreview} alt="Student" className="w-36 h-36 object-cover rounded-full border-4 border-yellow-500 mb-4" />
        ) : (
          <div className="w-36 h-36 bg-gray-200 rounded-full border-4 border-yellow-500 mb-4 flex items-center justify-center">
            <span className="text-gray-500">No Photo</span>
          </div>
        )}
        <h3 className="text-2xl font-bold text-gray-800">{data.name}</h3>
        <p className="text-gray-500">Roll Number: {data.rollNumber}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-3 rounded">
          <span className="text-xs text-gray-500">Rack Number</span>
          <p className="font-bold text-gray-800">{data.rackNumber}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded">
          <span className="text-xs text-gray-500">Bus Route</span>
          <p className="font-bold text-gray-800">{data.busRouteNumber}</p>
        </div>
      </div>

      {data.allergies && data.allergies.length > 0 && (
        <div className="mb-4 bg-red-50 p-3 rounded border-l-4 border-red-500">
          <span className="text-xs font-semibold text-red-500">Health Alert: Allergies</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {data.allergies.map(allergy => (
              <span key={allergy} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                {allergy}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div className="bg-gray-100 p-2 rounded">
          <QRCodeSVG value={JSON.stringify(data)} size={80} />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            <span className="block">Valid Until:</span>
            <span className="block font-semibold">{new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}</span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Smart Student ID Generator</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Data Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Student Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Allergies</label>
                <div className="space-y-2">
                  {allergyOptions.map((allergy) => (
                    <label key={allergy} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.allergies.includes(allergy)}
                        onChange={() => handleAllergyChange(allergy)}
                        className="mr-2"
                      />
                      {allergy}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Photo Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full"
                />
                {formData.photoPreview && (
                  <div className="mt-2">
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rack Number</label>
                <input
                  type="text"
                  name="rackNumber"
                  value={formData.rackNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Bus Route Number</label>
                <select
                  name="busRouteNumber"
                  value={formData.busRouteNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
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
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Generate ID Card
              </button>
            </form>

            {/* Saved Cards (Bonus Feature) */}
            {savedCards.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Saved Cards</h3>
                <div className="max-h-48 overflow-y-auto">
                  {savedCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-2 border-b hover:bg-gray-100 cursor-pointer flex justify-between"
                      onClick={() => loadSavedCard(card)}
                    >
                      <span>{card.name} - {card.rollNumber}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(card.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ID Card Preview */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">ID Card Preview</h2>
                <div>
                  <label className="mr-2">Template:</label>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="px-3 py-1 border rounded-md"
                  >
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
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
                    className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                  >
                    Download as PNG
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Fill the form and submit to generate ID card
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}