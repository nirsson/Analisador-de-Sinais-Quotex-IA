import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, LoadingSpinner } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Referência para o input de arquivo

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
      // Limpa o valor do input para permitir que o mesmo arquivo seja selecionado novamente
      e.target.value = ''; 
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click(); // Aciona o clique no input de arquivo oculto
  };

  return (
    <div className="w-full flex flex-col items-center">
      <label
        htmlFor="file-upload"
        className={`relative flex justify-center items-center w-full h-64 md:h-96 rounded-lg border-2 border-dashed
        ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600'}
        ${imageUrl ? '' : 'cursor-pointer'}
        transition-all duration-300 ease-in-out group`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="Pré-visualização do Gráfico Quotex" className="object-contain h-full w-full rounded-lg" />
            {!isLoading && (
               <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-lg font-semibold">Clique ou arraste para substituir a imagem</span>
               </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500" />
            <p className="mt-2 text-sm text-gray-400">
              <span className="font-semibold text-cyan-400">Clique para carregar</span> ou arraste e solte
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
          </div>
        )}
        <input 
          id="file-upload" 
          name="file-upload" 
          type="file" 
          className="sr-only" 
          onChange={handleFileChange} 
          accept="image/png, image/jpeg, image/webp" 
          disabled={isLoading} 
          ref={fileInputRef} // Atribui a referência
        />
      </label>

      {/* Novo botão de upload sempre visível */}
      <button
        onClick={handleButtonClick}
        disabled={isLoading}
        className="mt-6 flex items-center justify-center gap-2 w-full sm:w-auto text-white font-bold py-3 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
      >
        {isLoading ? <LoadingSpinner/> : <UploadIcon className="w-5 h-5"/>}
        {imageUrl ? 'Substituir Imagem' : 'Carregar Imagem'}
      </button>
    </div>
  );
};