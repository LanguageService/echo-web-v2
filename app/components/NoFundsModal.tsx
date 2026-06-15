"use client";

import Link from "next/link";
import { Wallet, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function NoFundsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
              <Wallet size={20} className="text-orange-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Insufficient Balance
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
          Your wallet has no funds. Please top up your wallet to continue using
          Echo translation services.
        </p>

        <div className="flex gap-3">
          <Link
            href="/dashboard/billing"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl text-center transition-colors"
          >
            Top Up Wallet
          </Link>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
