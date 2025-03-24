import React, { useState, useRef } from 'react';
import { Upload, X, Camera, Calendar, MapPin, Settings } from 'lucide-react';
import exifr from 'exifr';

interface MetadataGroup {
  title: string;
  icon: React.ReactNode;
  data: Record<string, string | number>;
}

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MetadataGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        // Create object URL for preview
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);

        // Parse EXIF data
        const exif = await exifr.parse(file);
        
        // Group metadata for display
        const groupedMetadata: MetadataGroup[] = [
          {
            title: 'Camera Information',
            icon: <Camera className="w-5 h-5" />,
            data: {
              'Camera Make': exif?.Make || 'N/A',
              'Camera Model': exif?.Model || 'N/A',
              'Lens Model': exif?.LensModel || 'N/A',
              'Focal Length': exif?.FocalLength ? `${exif.FocalLength}mm` : 'N/A',
              'Aperture': exif?.FNumber ? `f/${exif.FNumber}` : 'N/A',
              'ISO': exif?.ISO || 'N/A',
              'Shutter Speed': exif?.ExposureTime ? `1/${1/exif.ExposureTime}s` : 'N/A',
            }
          },
          {
            title: 'Time Information',
            icon: <Calendar className="w-5 h-5" />,
            data: {
              'Date Taken': exif?.DateTimeOriginal ? new Date(exif.DateTimeOriginal).toLocaleString() : 'N/A',
              'Date Modified': exif?.ModifyDate ? new Date(exif.ModifyDate).toLocaleString() : 'N/A',
            }
          },
          {
            title: 'Location',
            icon: <MapPin className="w-5 h-5" />,
            data: {
              'Latitude': exif?.latitude || 'N/A',
              'Longitude': exif?.longitude || 'N/A',
            }
          },
          {
            title: 'Technical Details',
            icon: <Settings className="w-5 h-5" />,
            data: {
              'Dimensions': exif?.ExifImageWidth && exif?.ExifImageHeight ? 
                `${exif.ExifImageWidth} × ${exif.ExifImageHeight}` : 'N/A',
              'Color Space': exif?.ColorSpace || 'N/A',
              'Software': exif?.Software || 'N/A',
            }
          }
        ];

        setMetadata(groupedMetadata);
      } catch (error) {
        console.error('Error parsing image metadata:', error);
        setMetadata([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        await handleImageUpload({ target: { files: dataTransfer.files } } as any);
      }
    }
  };

  const preventDefault = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Photo Metadata Viewer
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div 
            className="bg-white rounded-xl shadow-lg p-6"
            onDrop={handleDrop}
            onDragOver={preventDefault}
            onDragEnter={preventDefault}
          >
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg h-80 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={selectedImage} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button 
                    className="absolute top-2 right-2 bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                      setMetadata([]);
                    }}
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    <span className="font-medium">Click to upload</span> or drag and drop<br />
                    your photo here
                  </p>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          {/* Metadata Display */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Image Metadata
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : metadata.length > 0 ? (
              <div className="space-y-6">
                {metadata.map((group, index) => (
                  <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-2 mb-3">
                      {group.icon}
                      <h3 className="text-lg font-medium text-gray-700">{group.title}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      {Object.entries(group.data).map(([key, value]) => (
                        <React.Fragment key={key}>
                          <span className="text-gray-600">{key}:</span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedImage ? (
              <div className="text-center text-gray-500 py-12">
                No metadata found in this image
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                Upload an image to view its metadata
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;