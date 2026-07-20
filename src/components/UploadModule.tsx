import React, { useState, useRef } from 'react';
import { 
  Upload, Trash2, Check, RefreshCw, Eye, Share2, FileDown, 
  Crop, Sparkles, Image, FileText, AlertCircle, Maximize2, 
  Download, CheckCircle2, X, RotateCw, ZoomIn, ZoomOut, Plus, Heart
} from 'lucide-react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface PhotoItem {
  id: string;
  url: string;
  isPrimary: boolean;
  zoom: number;
  rotation: number;
  xOffset: number;
  yOffset: number;
}

export interface BiodataFile {
  name: string;
  type: 'pdf' | 'jpg' | 'png';
  url: string;
  size: string;
}

interface UploadModuleProps {
  photos: PhotoItem[];
  biodata: BiodataFile | null;
  onChangePhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  onChangeBiodata: React.Dispatch<React.SetStateAction<BiodataFile | null>>;
}

export const UploadModule: React.FC<UploadModuleProps> = ({
  photos,
  biodata,
  onChangePhotos,
  onChangeBiodata
}) => {
  // Cropper Modal States
  const [activeCropPhotoId, setActiveCropPhotoId] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState<number>(1);
  const [cropRotation, setCropRotation] = useState<number>(0);
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);

  // Preview Modal States
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [previewBiodata, setPreviewBiodata] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Hidden Input Refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const replacePhotoInputRef = useRef<HTMLInputElement>(null);
  const biodataInputRef = useRef<HTMLInputElement>(null);
  const replacePhotoIdRef = useRef<string | null>(null);

  // Drag and drop states
  const [isDragOverPhotos, setIsDragOverPhotos] = useState(false);
  const [isDragOverBiodata, setIsDragOverBiodata] = useState(false);

  // Toast confirmation
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // PHOTO UPLOAD HANDLERS
  const handlePhotoFiles = async (files: FileList) => {
    const remainingSlots = 6 - photos.length;
    if (remainingSlots <= 0) {
      triggerToast("Maximum limit of 6 photos reached.");
      return;
    }

    const filesArray = Array.from(files).slice(0, remainingSlots);
    setIsUploading(true);
    triggerToast(`Uploading ${filesArray.length} photo(s) to secure storage...`);

    try {
      for (const file of filesArray) {
        if (!file.type.startsWith('image/')) {
          triggerToast("Only image files are supported in this section.");
          continue;
        }

        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `photos/${fileName}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        const newPhoto: PhotoItem = {
          id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: downloadUrl,
          isPrimary: photos.length === 0, // First uploaded photo becomes primary
          zoom: 1.0,
          rotation: 0,
          xOffset: 0,
          yOffset: 0
        };

        onChangePhotos(prev => {
          const list = [...prev, newPhoto];
          const hasPrimary = list.some(p => p.isPrimary);
          if (!hasPrimary && list.length > 0) {
            list[0].isPrimary = true;
          }
          return list;
        });
      }
      triggerToast("Photos uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      triggerToast("Failed to upload photos: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handlePhotoFiles(e.target.files);
    }
  };

  // REPLACE PHOTO
  const handleReplacePhotoClick = (id: string) => {
    replacePhotoIdRef.current = id;
    if (replacePhotoInputRef.current) {
      replacePhotoInputRef.current.click();
    }
  };

  const handleReplacePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetId = replacePhotoIdRef.current;
    if (targetId && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        triggerToast("Please select a valid image file to replace.");
        return;
      }

      setIsUploading(true);
      triggerToast("Replacing photo...");
      try {
        const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const storageRef = ref(storage, `photos/${fileName}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        onChangePhotos(prev => prev.map(p => p.id === targetId ? {
          ...p,
          url: downloadUrl,
          zoom: 1.0,
          rotation: 0,
          xOffset: 0,
          yOffset: 0
        } : p));
        triggerToast("Photo replaced successfully.");
      } catch (err: any) {
        console.error(err);
        triggerToast("Failed to replace photo: " + err.message);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // DELETE PHOTO
  const handleDeletePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChangePhotos(prev => {
      const pToDelete = prev.find(p => p.id === id);
      const filtered = prev.filter(p => p.id !== id);
      // If deleted was primary, set another one as primary
      if (pToDelete?.isPrimary && filtered.length > 0) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
    triggerToast("Photo deleted.");
  };

  // CHOOSE PRIMARY PHOTO
  const handleSetPrimary = (id: string) => {
    onChangePhotos(prev => prev.map(p => ({
      ...p,
      isPrimary: p.id === id
    })));
    triggerToast("Primary profile photo updated.");
  };

  // PHOTO CROP FUNCTIONALITY
  const handleOpenCropper = (photo: PhotoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCropPhotoId(photo.id);
    setCropZoom(photo.zoom);
    setCropRotation(photo.rotation);
    setCropX(photo.xOffset);
    setCropY(photo.yOffset);
  };

  const handleSaveCrop = () => {
    if (activeCropPhotoId) {
      onChangePhotos(prev => prev.map(p => p.id === activeCropPhotoId ? {
        ...p,
        zoom: cropZoom,
        rotation: cropRotation,
        xOffset: cropX,
        yOffset: cropY
      } : p));
      setActiveCropPhotoId(null);
      triggerToast("Image cropping coordinates updated.");
    }
  };

  // BIODATA UPLOAD HANDLERS
  const handleBiodataFile = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    
    if (!isImage && !isPdf) {
      triggerToast("Unsupported file type. Please upload a JPG, PNG, or PDF.");
      return;
    }

    setIsUploading(true);
    triggerToast("Uploading biodata to secure storage...");
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `biodata/${fileName}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      const fileType: 'pdf' | 'jpg' | 'png' = isPdf ? 'pdf' : (file.type === 'image/png' ? 'png' : 'jpg');
      
      onChangeBiodata({
        name: file.name,
        type: fileType,
        url: downloadUrl,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
      });
      triggerToast("Biodata uploaded successfully.");
    } catch (err: any) {
      console.error(err);
      triggerToast("Failed to upload biodata: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBiodataSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleBiodataFile(e.target.files[0]);
    }
  };

  const handleDeleteBiodata = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChangeBiodata(null);
    triggerToast("Biodata file removed.");
  };

  const handleDownloadBiodata = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!biodata) return;

    // Simulate direct download
    const link = document.createElement('a');
    link.href = biodata.url;
    link.download = `Biodata_${biodata.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Downloading biodata file...");
  };

  const handleShareBiodata = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: 'Feroz 01 Matrimonial Biodata',
        text: `Review Feroz 01 premium matrimonial biodata record: ${biodata?.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast("Biodata link copied to clipboard for sharing.");
    }
  };

  return (
    <div className="space-y-6 text-gray-700">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg z-50 flex items-center gap-1.5 backdrop-blur-xs">
          <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: PROFILE PHOTO UPLOADER */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4.5 space-y-4 shadow-2xs">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-[#C2185B]" /> Profile Photos ({photos.length}/6)
            </h4>
            <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
              Upload up to 6 high-quality photos. Set a primary profile picture.
            </p>
          </div>
          {photos.length < 6 && (
            <button
              onClick={() => photoInputRef.current?.click()}
              className="bg-pink-50 hover:bg-pink-100 text-[#880E4F] p-1.5 rounded-full border border-pink-100/50 transition flex items-center justify-center"
              title="Add Photos"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hidden inputs for uploading */}
        <input 
          type="file" 
          ref={photoInputRef}
          onChange={handlePhotoSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
        <input 
          type="file" 
          ref={replacePhotoInputRef}
          onChange={handleReplacePhotoSelect}
          accept="image/*"
          className="hidden"
        />

        {/* DRAG & DROP ZONE IF EMPTY */}
        {photos.length === 0 ? (
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOverPhotos(true); }}
            onDragLeave={() => setIsDragOverPhotos(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverPhotos(false);
              if (e.dataTransfer.files) handlePhotoFiles(e.dataTransfer.files);
            }}
            onClick={() => photoInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${
              isDragOverPhotos 
                ? 'border-[#880E4F] bg-pink-50/40' 
                : 'border-pink-200 bg-pink-50/10 hover:bg-pink-50/20'
            }`}
          >
            <Upload className="w-8 h-8 text-[#C2185B] mb-2 animate-bounce" />
            <span className="text-xs font-bold text-gray-700">Choose files or drag here</span>
            <span className="text-[10px] text-gray-400 mt-1">PNG, JPG up to 10MB each</span>
          </div>
        ) : (
          /* PHOTOS BENTO-LIKE GRID */
          <div className="grid grid-cols-3 gap-2.5">
            {photos.map((photo, index) => (
              <div 
                key={photo.id}
                className={`relative aspect-square rounded-2xl overflow-hidden border group bg-gray-50 flex items-center justify-center ${
                  photo.isPrimary ? 'border-2 border-[#880E4F] ring-2 ring-pink-100' : 'border-pink-100/60'
                }`}
              >
                {/* Photo rendering with custom crop, zoom, rotation offset values */}
                <div 
                  className="w-full h-full overflow-hidden flex items-center justify-center"
                  style={{ transform: `rotate(${photo.rotation}deg)` }}
                >
                  <img 
                    src={photo.url} 
                    alt={`Slot ${index + 1}`}
                    className="w-full h-full object-cover transition duration-300"
                    style={{ 
                      transform: `scale(${photo.zoom}) translate(${photo.xOffset}px, ${photo.yOffset}px)`
                    }}
                  />
                </div>

                {/* Primary photo ribbon tag */}
                {photo.isPrimary && (
                  <span className="absolute top-1 left-1 bg-[#880E4F] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Main
                  </span>
                )}

                {/* Grid slot number when hovered / static */}
                <span className="absolute bottom-1 right-1.5 bg-black/40 text-white text-[9px] font-bold px-1 rounded-sm backdrop-blur-xs select-none">
                  {index + 1}
                </span>

                {/* Micro Actions overlay on hover / touch */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                  <div className="flex justify-between">
                    <button
                      onClick={(e) => handleDeletePhoto(photo.id, e)}
                      className="p-1 rounded-lg bg-red-600/90 text-white hover:bg-red-700 transition"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleOpenCropper(photo, e)}
                      className="p-1 rounded-lg bg-slate-800/90 text-white hover:bg-slate-700 transition"
                      title="Crop / Align"
                    >
                      <Crop className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    {!photo.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(photo.id)}
                        className="w-full py-1 bg-white/95 text-gray-900 hover:bg-pink-100 rounded-lg text-[9px] font-black transition text-center"
                      >
                        Set as Main
                      </button>
                    )}
                    <button
                      onClick={() => handleReplacePhotoClick(photo.id)}
                      className="w-full py-1 bg-slate-800/90 text-white hover:bg-slate-700 rounded-lg text-[9px] font-bold transition text-center"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: 6 - photos.length }).map((_, idx) => (
              <button
                key={`empty-${idx}`}
                onClick={() => photoInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-pink-100 bg-pink-50/10 hover:bg-pink-50/20 transition flex flex-col items-center justify-center text-gray-400 group"
              >
                <Plus className="w-5 h-5 text-pink-300 group-hover:scale-110 transition" />
                <span className="text-[8px] text-gray-400 font-bold mt-1">Upload Slot</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: BIODATA UPLOADER SECTION */}
      <div className="bg-white border border-pink-100 rounded-3xl p-4.5 space-y-4 shadow-2xs">
        <div>
          <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#C2185B]" /> Matrimonial Biodata Document
          </h4>
          <p className="text-[10px] text-gray-400 leading-normal mt-0.5">
            Add a digital copy of your detailed biodata. Supports JPG, PNG, or PDF formats.
          </p>
        </div>

        <input 
          type="file"
          ref={biodataInputRef}
          onChange={handleBiodataSelect}
          accept=".pdf,image/*"
          className="hidden"
        />

        {biodata ? (
          /* UPLOADED BIODATA CARD VIEW */
          <div className="border border-pink-100 rounded-2xl p-3 bg-pink-50/20 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#880E4F]/10 flex items-center justify-center shrink-0 border border-pink-100/50">
                {biodata.type === 'pdf' ? (
                  <FileText className="w-6 h-6 text-[#880E4F]" />
                ) : (
                  <Image className="w-6 h-6 text-[#C2185B]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase font-black text-[#880E4F] tracking-wider block font-mono">
                  {biodata.type.toUpperCase()} DOCUMENT
                </span>
                <h5 className="text-xs font-bold text-gray-800 truncate leading-tight mt-0.5">
                  {biodata.name}
                </h5>
                <span className="text-[10px] text-gray-400">{biodata.size}</span>
              </div>
            </div>

            {/* Action buttons list */}
            <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-pink-100/50">
              <button
                onClick={() => setPreviewBiodata(true)}
                className="py-1.5 bg-white border border-pink-100 text-[#880E4F] hover:bg-pink-50 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={handleDownloadBiodata}
                className="py-1.5 bg-white border border-pink-100 text-[#880E4F] hover:bg-pink-50 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" /> Get
              </button>
              <button
                onClick={handleShareBiodata}
                className="py-1.5 bg-white border border-pink-100 text-[#880E4F] hover:bg-pink-50 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1"
                title="Share"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={() => biodataInputRef.current?.click()}
                className="py-1.5 bg-white border border-pink-100 text-gray-600 hover:bg-pink-50 rounded-xl text-[10px] font-bold transition flex items-center justify-center gap-1"
                title="Replace Document"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Swap
              </button>
            </div>

            <button
              onClick={handleDeleteBiodata}
              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-red-100"
            >
              <Trash2 className="w-4 h-4" /> Delete Biodata Document
            </button>
          </div>
        ) : (
          /* DRAG & DROP ZONE FOR BIODATA */
          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragOverBiodata(true); }}
            onDragLeave={() => setIsDragOverBiodata(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOverBiodata(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleBiodataFile(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => biodataInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${
              isDragOverBiodata 
                ? 'border-[#880E4F] bg-pink-50/40' 
                : 'border-pink-200 bg-pink-50/10 hover:bg-pink-50/20'
            }`}
          >
            <Upload className="w-8 h-8 text-[#C2185B] mb-2" />
            <span className="text-xs font-bold text-gray-700">Choose biodata file or drag here</span>
            <span className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG up to 15MB</span>
          </div>
        )}
      </div>

      {/* CROPPER / ADJUST MODAL DIALOG */}
      {activeCropPhotoId && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 select-none">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="bg-pink-50 border-b border-pink-100 px-4 py-3.5 flex items-center justify-between">
              <span className="text-[#880E4F] font-black text-xs uppercase tracking-wider flex items-center gap-1">
                <Crop className="w-4 h-4" /> Crop & Align Image
              </span>
              <button 
                onClick={() => setActiveCropPhotoId(null)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 border border-pink-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewport Frame with overlay ring */}
            <div className="p-6 bg-slate-900 flex items-center justify-center relative aspect-square">
              <div className="w-64 h-64 border-2 border-dashed border-white/50 rounded-2xl overflow-hidden relative flex items-center justify-center bg-black/40 shadow-inner">
                {/* Image to crop */}
                <div 
                  className="w-full h-full flex items-center justify-center transition-transform"
                  style={{ transform: `rotate(${cropRotation}deg)` }}
                >
                  <img 
                    src={photos.find(p => p.id === activeCropPhotoId)?.url} 
                    alt="Adjusting" 
                    className="max-w-none w-full h-full object-cover pointer-events-none select-none"
                    style={{ 
                      transform: `scale(${cropZoom}) translate(${cropX}px, ${cropY}px)`
                    }}
                  />
                </div>

                {/* Cropping Grid Overlay lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/10" />
                  ))}
                </div>
                
                {/* Circular Crop area highlight guide */}
                <div className="absolute inset-0 border-[24px] border-black/50 pointer-events-none" />
              </div>
            </div>

            {/* Slider Controls */}
            <div className="p-4.5 bg-white space-y-4 text-gray-600">
              {/* Zoom slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Zoom Level ({cropZoom.toFixed(1)}x)</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCropZoom(z => Math.max(1, z - 0.2))} className="text-[#880E4F] hover:scale-110"><ZoomOut className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setCropZoom(z => Math.min(3, z + 0.2))} className="text-[#880E4F] hover:scale-110"><ZoomIn className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <input 
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={cropZoom}
                  onChange={(e) => setCropZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#880E4F] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Rotation angle ({cropRotation}°)</span>
                  <button onClick={() => setCropRotation(r => (r + 90) % 360)} className="text-[#880E4F] hover:scale-110 flex items-center gap-0.5"><RotateCw className="w-3.5 h-3.5" /> 90°</button>
                </div>
                <input 
                  type="range"
                  min={0}
                  max={360}
                  step={15}
                  value={cropRotation}
                  onChange={(e) => setCropRotation(parseInt(e.target.value))}
                  className="w-full accent-[#880E4F] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* XY Offset adjustments */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block mb-1">X-Axis Offset</span>
                  <input 
                    type="range"
                    min={-100}
                    max={100}
                    value={cropX}
                    onChange={(e) => setCropX(parseInt(e.target.value))}
                    className="w-full accent-slate-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 block mb-1">Y-Axis Offset</span>
                  <input 
                    type="range"
                    min={-100}
                    max={100}
                    value={cropY}
                    onChange={(e) => setCropY(parseInt(e.target.value))}
                    className="w-full accent-slate-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 bg-gray-50 border-t border-pink-100/60 flex gap-2">
              <button
                onClick={() => setActiveCropPhotoId(null)}
                className="flex-1 py-2.5 bg-white border border-pink-200 text-gray-600 font-bold rounded-xl text-xs hover:bg-gray-100 transition"
              >
                Discard
              </button>
              <button
                onClick={handleSaveCrop}
                className="flex-1 py-2.5 bg-[#880E4F] hover:bg-[#AD1457] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1"
              >
                <Check className="w-4 h-4" /> Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BIODATA DOCUMENT PREVIEW MODAL */}
      {previewBiodata && biodata && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 select-none">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[85%]">
            <div className="bg-pink-50 border-b border-pink-100 px-4 py-3 flex items-center justify-between">
              <span className="text-[#880E4F] font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> Document Preview
              </span>
              <button 
                onClick={() => setPreviewBiodata(false)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-500 hover:text-gray-900 border border-pink-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-100 flex-1 overflow-y-auto flex items-center justify-center min-h-[300px]">
              {biodata.type === 'pdf' ? (
                /* PDF Interactive Simulator View */
                <div className="bg-white border-2 border-double border-amber-800/20 p-5 rounded-lg w-full max-w-[280px] shadow-sm text-[8px] space-y-3 relative font-serif text-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none">
                    <Heart className="w-32 h-32 text-red-900 fill-red-900" />
                  </div>
                  <div className="text-center">
                    <span className="px-1 py-0.5 bg-amber-100 text-amber-900 rounded-sm text-[5px] font-black uppercase">श्री गणेशाय नमः • ॐ</span>
                    <h4 className="text-xs font-bold text-amber-950 mt-1 uppercase">Matrimonial Biodata</h4>
                    <div className="w-8 h-0.5 bg-amber-800/30 mx-auto mt-0.5" />
                  </div>

                  <div className="space-y-1.5 text-left text-[7px]">
                    <p><strong className="text-amber-950">Name:</strong> Feroz Ahmad</p>
                    <p><strong className="text-amber-950">Age / DOB:</strong> 28 Years / 15th Sept 1998</p>
                    <p><strong className="text-amber-950">Education:</strong> M.Tech Software Engineering</p>
                    <p><strong className="text-amber-950">Profession:</strong> Tech Lead (Cloud Architect)</p>
                    <p><strong className="text-amber-950">Gotra / Caste:</strong> Sunni Khan / moderate values</p>
                    <p><strong className="text-amber-950">Location:</strong> Delhi NCR, India</p>
                  </div>
                  <div className="border-t border-amber-800/10 pt-2 text-[6px] text-gray-400 text-center">
                    🔒 Certified Matrimonial Document - Feroz 01
                  </div>
                </div>
              ) : (
                /* Image file rendering */
                <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden border border-gray-200 bg-white">
                  <img src={biodata.url} alt="Biodata Preview" className="max-w-full max-h-[400px] object-contain" />
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t border-pink-100 flex gap-2 shrink-0">
              <button
                onClick={handleDownloadBiodata}
                className="flex-1 py-2 bg-[#880E4F] hover:bg-[#AD1457] text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
