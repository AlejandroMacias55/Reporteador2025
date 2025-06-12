import { Check, Copy, X } from "lucide-react";
import React, { useState } from "react";
import { ShareableQuery } from "../types/database";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shareableQuery: ShareableQuery;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  shareableQuery,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateShareUrl = () => {
    const encodedData = btoa(JSON.stringify(shareableQuery));
    return `${window.location.origin}${window.location.pathname}?shared=${encodedData}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Share Query Results
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Share Link
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 text-sm text-gray-600 break-all border border-gray-300 rounded-md bg-gray-50">
                {generateShareUrl()}
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            {copied && (
              <p className="mt-1 text-sm text-green-600">
                Link copied to clipboard!
              </p>
            )}
          </div>

          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Query Details
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Database:</span>{" "}
                {shareableQuery.config.name}
              </div>
              <div>
                <span className="font-medium">Type:</span>{" "}
                {shareableQuery.config.type.toUpperCase()}
              </div>
              <div>
                <span className="font-medium">Shared:</span>{" "}
                {new Date(shareableQuery.timestamp).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-3 border border-yellow-200 rounded-md bg-yellow-50">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 text-yellow-600 mt-0.5">⚠️</div>
              <div className="text-sm text-yellow-800">
                <p className="mb-1 font-medium">Security Notice</p>
                <p>
                  This link contains your database configuration. Only share
                  with trusted recipients.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
