import React, { useState, useRef } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";

interface FileEditProps {
  currentFileName: string;
  onEditSuccess: (newFileName?: string) => void;
  onEditError: (error: string) => void;
  onCancel: () => void;
}

const FileEdit: React.FC<FileEditProps> = ({
  currentFileName,
  onEditSuccess,
  onEditError,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState(currentFileName);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && newFileName.trim() === currentFileName) {
      onEditError("Nenhuma alteração foi feita.");
      return;
    }

    setLoading(true);

    try {
      const { bannerService } = await import("../services/api");

      // Sempre passar o nome original como primeiro parâmetro
      await bannerService.updateBanner(
        currentFileName, // Nome original para localizar o arquivo
        selectedFile || undefined,
        newFileName.trim() !== currentFileName ? newFileName.trim() : undefined
      );

      // Passar o novo nome do arquivo se foi alterado
      const finalFileName =
        newFileName.trim() !== currentFileName
          ? newFileName.trim()
          : currentFileName;
      onEditSuccess(finalFileName);
    } catch (error) {
      console.error("Erro na edição:", error);
      onEditError(
        error instanceof Error ? error.message : "Erro ao editar arquivo"
      );
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const hasChanges = selectedFile || newFileName.trim() !== currentFileName;

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Editar Arquivo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Área de Drag & Drop para novo arquivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Novo Arquivo (opcional)
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : selectedFile
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
              accept="*/*"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <div className="text-green-600 font-medium">
                  ✓ Novo arquivo selecionado
                </div>
                <div className="text-sm text-gray-600">
                  {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Trocar arquivo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-gray-500 text-sm">
                  Arraste um novo arquivo aqui, ou
                </div>
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  clique para selecionar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Campo de Nome */}
        <div>
          <label
            htmlFor="newFileName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Novo Nome do Arquivo (opcional)
          </label>
          <input
            type="text"
            id="newFileName"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Digite um novo nome para o arquivo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Nome atual: {currentFileName}
          </p>
        </div>

        {/* Botões */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!hasChanges || loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Salvando...</span>
              </>
            ) : (
              "Salvar Alterações"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileEdit;
