import React, { useEffect, useRef, useState } from "react";
import { Banner, FileContent } from "../types";
import { getFileType } from "../utils";
import Dialog from "./ui/Dialog";
import LoadingSpinner from "./ui/LoadingSpinner";
import FileEdit from "./FileEdit";
import { useFileDownload } from "../hooks/useFileDownload";

interface BannerDialogProps {
  banner: Banner | null;
  isOpen: boolean;
  onClose: () => void;
  onFileUpdated?: (originalName: string, newName?: string) => void;
  onFileDeleted?: () => void;
}

const BannerDialog: React.FC<BannerDialogProps> = ({
  banner,
  isOpen,
  onClose,
  onFileUpdated,
  onFileDeleted,
}) => {
  const { fileContent, loading, error, downloadFile, clearFile } =
    useFileDownload();
  const currentUrlRef = useRef<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && banner) {
      downloadFile(banner.name);
    } else {
      // Limpar URL anterior se existir
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
      clearFile();
      setShowEdit(false);
      setShowDeleteConfirm(false);
      setActionMessage(null);
    }
  }, [isOpen, banner?.name, downloadFile, clearFile]); // Adicionar banner?.name para recarregar quando o nome mudar

  // Cleanup effect para liberar URLs quando componente for desmontado
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
      }
    };
  }, []);

  const handleEditSuccess = (newFileName?: string) => {
    setActionMessage({
      type: "success",
      text: "Arquivo atualizado com sucesso!",
    });
    setShowEdit(false);

    // Notificar que o arquivo foi atualizado
    if (banner) {
      onFileUpdated?.(banner.name, newFileName);
    }

    // Fechar o dialog após edição
    onClose();

    // Limpar mensagem após 3 segundos
    setTimeout(() => setActionMessage(null), 3000);
  };

  const handleEditError = (error: string) => {
    setActionMessage({ type: "error", text: error });
    // Limpar mensagem após 5 segundos
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleDelete = async () => {
    if (!banner) return;

    setActionLoading(true);
    try {
      const { bannerService } = await import("../services/api");
      await bannerService.deleteBanner(banner.name);

      setActionMessage({
        type: "success",
        text: "Arquivo deletado com sucesso!",
      });
      setShowDeleteConfirm(false);
      onFileDeleted?.();

      // Fechar modal imediatamente após exclusão
      onClose();
    } catch (error) {
      console.error("Erro ao deletar arquivo:", error);
      setActionMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Erro ao deletar arquivo",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <span className="ml-3 text-gray-600">Carregando arquivo...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-2">
            Erro ao carregar arquivo
          </div>
          <div className="text-gray-600">{error}</div>
        </div>
      );
    }

    if (!fileContent) {
      return (
        <div className="text-center py-12 text-gray-600">
          Nenhum arquivo carregado
        </div>
      );
    }

    // Se estiver no modo de edição
    if (showEdit && banner) {
      return (
        <FileEdit
          currentFileName={banner.name}
          onEditSuccess={handleEditSuccess}
          onEditError={handleEditError}
          onCancel={() => setShowEdit(false)}
        />
      );
    }

    // Se estiver no modo de confirmação de exclusão
    if (showDeleteConfirm && banner) {
      return (
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">Confirmar Exclusão</div>
          <div className="text-gray-600 mb-6">
            Tem certeza que deseja excluir o arquivo{" "}
            <strong>"{banner.name}"</strong>?
            <br />
            Esta ação não pode ser desfeita.
          </div>
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              disabled={actionLoading}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              {actionLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Excluindo...</span>
                </>
              ) : (
                "Excluir Arquivo"
              )}
            </button>
          </div>
        </div>
      );
    }

    const fileType = getFileType(fileContent.contentType);

    // Limpar URL anterior se existir
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
    }

    // Criar nova URL
    const url = URL.createObjectURL(fileContent.data);
    currentUrlRef.current = url;

    switch (fileType) {
      case "image":
        return (
          <div className="flex justify-center">
            <img
              src={url}
              alt={banner?.name || "Imagem"}
              className="max-w-full max-h-[70vh] object-contain rounded"
            />
          </div>
        );

      case "pdf":
        return (
          <div className="w-full h-[70vh]">
            <iframe
              src={url}
              className="w-full h-full border-0 rounded"
              title={banner?.name || "PDF"}
            />
          </div>
        );

      case "video":
        return (
          <div className="flex justify-center">
            <video
              controls
              className="max-w-full max-h-[70vh] rounded"
              src={url}
            >
              Seu navegador não suporta vídeos.
            </video>
          </div>
        );

      case "document":
        return (
          <div className="w-full h-[70vh]">
            <iframe
              src={url}
              className="w-full h-full border-0 rounded"
              title={banner?.name || "Documento"}
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              Tipo de arquivo não suportado para visualização
            </div>
            <a
              href={url}
              download={banner?.name}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Baixar arquivo
            </a>
          </div>
        );
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={banner?.name}>
      {renderContent()}

      {/* Botões de Ação - apenas quando não estiver editando ou confirmando exclusão */}
      {!showEdit && !showDeleteConfirm && banner && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {banner.name} • {banner.type}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowEdit(true)}
                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensagens de Feedback */}
      {actionMessage && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all ${
            actionMessage.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center space-x-2">
            {actionMessage.type === "success" ? (
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
            <span>{actionMessage.text}</span>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default BannerDialog;
