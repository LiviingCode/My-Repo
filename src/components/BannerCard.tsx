import React from "react";
import { Banner } from "../types";
import { getFileIcon, formatFileName } from "../utils";

interface BannerCardProps {
  banner: Banner;
  onClick: (banner: Banner) => void;
}

const BannerCard: React.FC<BannerCardProps> = ({ banner, onClick }) => {
  const fileIcon = getFileIcon(banner.type as any);
  const displayName = formatFileName(banner.name);

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
      onClick={() => onClick(banner)}
    >
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{fileIcon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {displayName}
            </h3>
            <p className="text-sm text-gray-500 capitalize">{banner.type}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Clique para visualizar</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;
