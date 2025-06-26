import React, { useState } from 'react';
import { Upload, TreePine, Leaf, Camera, MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SoilPredictionResult {
  soil_type: string;
  recommended_trees: string[];
}

interface PlantIdentificationResult {
  plant_name: string;
  description: string;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

function App() {
  const [activeTab, setActiveTab] = useState<'soil' | 'plant'>('soil');
  const [soilFile, setSoilFile] = useState<File | null>(null);
  const [plantFile, setPlantFile] = useState<File | null>(null);
  const [locationType, setLocationType] = useState<string>('urban');
  const [soilResult, setSoilResult] = useState<SoilPredictionResult | null>(null);
  const [plantResult, setPlantResult] = useState<PlantIdentificationResult | null>(null);
  const [soilUploadState, setSoilUploadState] = useState<UploadState>('idle');
  const [plantUploadState, setPlantUploadState] = useState<UploadState>('idle');
  const [error, setError] = useState<string>('');

  const locationTypes = [
    { value: 'urban', label: 'Urban Area', icon: '🏙️' },
    { value: 'roadside', label: 'Roadside', icon: '🛣️' },
    { value: 'farm', label: 'Farm Land', icon: '🚜' },
    { value: 'forest', label: 'Forest', icon: '🌲' },
    { value: 'highway', label: 'Highway', icon: '🛤️' }
  ];

  const handleSoilFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSoilFile(file);
      setSoilResult(null);
      setError('');
    }
  };

  const handlePlantFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPlantFile(file);
      setPlantResult(null);
      setError('');
    }
  };

  const predictSoil = async () => {
    if (!soilFile) return;

    setSoilUploadState('uploading');
    setError('');

    const formData = new FormData();
    formData.append('file', soilFile);
    formData.append('location_type', locationType);

    try {
      const response = await fetch('http://localhost:8000/predict-soil', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to predict soil type');
      }

      const result: SoilPredictionResult = await response.json();
      setSoilResult(result);
      setSoilUploadState('success');
    } catch (err) {
      setError('Failed to analyze soil. Please try again.');
      setSoilUploadState('error');
    }
  };

  const identifyPlant = async () => {
    if (!plantFile) return;

    setPlantUploadState('uploading');
    setError('');

    const formData = new FormData();
    formData.append('file', plantFile);

    try {
      const response = await fetch('http://localhost:8000/identify-plant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to identify plant');
      }

      const result: PlantIdentificationResult = await response.json();
      setPlantResult(result);
      setPlantUploadState('success');
    } catch (err) {
      setError('Failed to identify plant. Please try again.');
      setPlantUploadState('error');
    }
  };

  const FileUploadArea = ({ 
    file, 
    onFileChange, 
    accept, 
    title, 
    description,
    uploadState 
  }: {
    file: File | null;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    accept: string;
    title: string;
    description: string;
    uploadState: UploadState;
  }) => (
    <div className="relative">
      <input
        type="file"
        accept={accept}
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={uploadState === 'uploading'}
      />
      <div className={`
        border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
        ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'}
        ${uploadState === 'uploading' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}>
        <div className="flex flex-col items-center space-y-4">
          {uploadState === 'uploading' ? (
            <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
          ) : file ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
            {file && (
              <p className="text-sm text-green-600 mt-2 font-medium">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TreePine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Smart Tree Survey</h1>
              <p className="text-sm text-gray-600">AI-Powered Soil Analysis & Plant Identification</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-xl mb-8 border border-green-100">
          <button
            onClick={() => setActiveTab('soil')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'soil'
                ? 'bg-white text-green-700 shadow-sm border border-green-200'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span>Soil Analysis</span>
          </button>
          <button
            onClick={() => setActiveTab('plant')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'plant'
                ? 'bg-white text-green-700 shadow-sm border border-green-200'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            <Leaf className="w-5 h-5" />
            <span>Plant Identification</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Soil Analysis Tab */}
        {activeTab === 'soil' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-green-600" />
                  <span>Upload Soil Image</span>
                </h2>

                <FileUploadArea
                  file={soilFile}
                  onFileChange={handleSoilFileChange}
                  accept="image/*"
                  title="Select Soil Image"
                  description="Upload a clear image of the soil sample"
                  uploadState={soilUploadState}
                />

                {/* Location Type Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Location Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {locationTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setLocationType(type.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          locationType === type.value
                            ? 'border-green-400 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{type.icon}</span>
                          <span className="font-medium text-sm">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Analyze Button */}
                <button
                  onClick={predictSoil}
                  disabled={!soilFile || soilUploadState === 'uploading'}
                  className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {soilUploadState === 'uploading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <TreePine className="w-5 h-5" />
                      <span>Analyze Soil & Get Recommendations</span>
                    </>
                  )}
                </button>
              </div>

              {/* Results Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Analysis Results</h2>
                
                {soilResult ? (
                  <div className="space-y-6">
                    {/* Soil Type */}
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">Detected Soil Type</h3>
                      <p className="text-2xl font-bold text-green-700 capitalize">
                        {soilResult.soil_type}
                      </p>
                    </div>

                    {/* Tree Recommendations */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Recommended Trees</h3>
                      <div className="space-y-2">
                        {soilResult.recommended_trees.map((tree, index) => (
                          <div
                            key={index}
                            className="p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors duration-200"
                          >
                            <p className="text-gray-700">{tree}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TreePine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Upload a soil image to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plant Identification Tab */}
        {activeTab === 'plant' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-green-600" />
                  <span>Upload Plant Image</span>
                </h2>

                <FileUploadArea
                  file={plantFile}
                  onFileChange={handlePlantFileChange}
                  accept="image/*"
                  title="Select Plant Image"
                  description="Upload a clear image of the plant or leaf"
                  uploadState={plantUploadState}
                />

                {/* Identify Button */}
                <button
                  onClick={identifyPlant}
                  disabled={!plantFile || plantUploadState === 'uploading'}
                  className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 px-6 rounded-lg font-medium hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {plantUploadState === 'uploading' ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Identifying...</span>
                    </>
                  ) : (
                    <>
                      <Leaf className="w-5 h-5" />
                      <span>Identify Plant</span>
                    </>
                  )}
                </button>
              </div>

              {/* Results Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Identification Results</h2>
                
                {plantResult ? (
                  <div className="space-y-6">
                    {/* Plant Name */}
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <h3 className="font-semibold text-emerald-800 mb-2">Plant Name</h3>
                      <p className="text-2xl font-bold text-emerald-700">
                        {plantResult.plant_name}
                      </p>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                      <div className="p-4 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-700 leading-relaxed">
                          {plantResult.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Upload a plant image to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-green-100 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Smart Tree Survey - Powered by AI for sustainable forestry
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;