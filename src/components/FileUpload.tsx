import React, { useState, useRef } from "react";
import LoadingSpinner from "./ui/LoadingSpinner";

interface FileUploadProps {
  onUploadSuccess: () => void;
  onUploadError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  onUploadError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    // Se não foi digitado um nome, usar o nome do arquivo
    if (!fileName) {
      setFileName(file.name.split(".")[0]);
    }
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

    if (!selectedFile || !fileName.trim()) {
      onUploadError("Por favor, selecione um arquivo e digite um nome.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name_file", fileName.trim());

      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      // Limpar formulário
      setSelectedFile(null);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onUploadSuccess();
    } catch (error) {
      console.error("Erro no upload:", error);
      onUploadError(
        error instanceof Error
          ? error.message
          : "Erro ao fazer upload do arquivo"
      );
    } finally {
      setLoading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Adicionar Novo Arquivo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Área de Drag & Drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
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
                ✓ Arquivo selecionado
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
              <div className="text-gray-500">
                Arraste e solte um arquivo aqui, ou
              </div>
              <button
                type="button"
                onClick={openFileDialog}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                clique para selecionar
              </button>
            </div>
          )}
        </div>

        {/* Campo de Nome */}
        <div>
          <label
            htmlFor="fileName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome do Arquivo
          </label>
          <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Digite um nome para o arquivo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Botão de Upload */}
        <button
          type="submit"
          disabled={!selectedFile || !fileName.trim() || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Enviando...</span>
            </>
          ) : (
            "Enviar Arquivo"
          )}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
