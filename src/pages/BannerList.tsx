import React, { useState, useEffect } from "react";
import { Banner } from "../types";
import { useBanners } from "../hooks/useBanners";
import BannerCard from "../components/BannerCard";
import BannerDialog from "../components/BannerDialog";
import FileUpload from "../components/FileUpload";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const BannerList: React.FC = () => {
  const { banners, loading, error, refetch } = useBanners();
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [editedBannerName, setEditedBannerName] = useState<string | null>(null);

  const handleBannerClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBanner(null);
  };

  const handleUploadSuccess = () => {
    setUploadMessage({ type: "success", text: "Arquivo enviado com sucesso!" });
    setShowUpload(false);
    refetch(); // Recarregar a lista de banners
    // Limpar mensagem após 3 segundos
    setTimeout(() => setUploadMessage(null), 3000);
  };

  const handleUploadError = (error: string) => {
    setUploadMessage({ type: "error", text: error });
    // Limpar mensagem após 5 segundos
    setTimeout(() => setUploadMessage(null), 5000);
  };

  const handleFileUpdated = (originalName: string, newName?: string) => {
    // Marcar que um banner foi editado para atualizar o selectedBanner após refetch
    // Se temos um novo nome, usar ele; senão usar o nome original
    setEditedBannerName(newName || originalName);
    refetch();
  };

  const handleFileDeleted = () => {
    refetch(); // Recarregar a lista de banners
  };

  // Effect para atualizar selectedBanner quando a lista for recarregada após edição
  useEffect(() => {
    if (editedBannerName && banners.length > 0) {
      // Procurar o banner editado na lista atualizada pelo nome correto
      const updatedBanner = banners.find((b) => b.name === editedBannerName);

      if (updatedBanner) {
        setSelectedBanner(updatedBanner);
      }
      setEditedBannerName(null); // Limpar o flag
    }
  }, [banners, editedBannerName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Carregando banners...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            Erro ao carregar banners
          </div>
          <div className="text-gray-600 mb-4">{error}</div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Repo</h1>
                <p className="mt-2 text-gray-600">
                  Clique em um arquivo para visualizar seu conteúdo
                </p>
              </div>
              <button
                onClick={() => setShowUpload(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Adicionar Arquivo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {banners.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              Nenhum arquivo encontrado
            </div>
            <div className="text-gray-400 mb-8">
              Não há arquivos disponíveis no momento.
            </div>
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="text-sm text-gray-500">
                {banners.length} arquivo{banners.length !== 1 ? "s" : ""}{" "}
                encontrado{banners.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {banners.map((banner) => (
                <BannerCard
                  key={banner.name}
                  banner={banner}
                  onClick={handleBannerClick}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Dialog */}
      <BannerDialog
        banner={selectedBanner}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onFileUpdated={handleFileUpdated}
        onFileDeleted={handleFileDeleted}
      />

      {/* Modal de Upload */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowUpload(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Adicionar Arquivo
              </h2>
              <button
                onClick={() => setShowUpload(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <FileUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mensagens de Feedback */}
      {uploadMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all ${
            uploadMessage.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            {uploadMessage.type === "success" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            <span>{uploadMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerList;
