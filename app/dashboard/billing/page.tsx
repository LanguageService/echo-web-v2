"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mic, MessageSquare, TrendingUp, Calendar, Zap, CreditCard } from 'lucide-react';
import {
  fetchWalletBalance,
  fetchUsageSummary,
  initiateTopUp,
  type WalletBalanceResponse,
  type UsageSummaryResponse,
} from '@/lib/api';

export default function BillingDashboardPage() {
  const [wallet, setWallet] = useState<WalletBalanceResponse | null>(null);
  const [usage, setUsage] = useState<UsageSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<number | ''>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    Promise.all([fetchWalletBalance(), fetchUsageSummary()])
      .then(([walletData, usageData]) => {
        setWallet(walletData);
        setUsage(usageData);
      })
      .catch(err => console.error("Error fetching billing data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topUpAmount || topUpAmount < 5) return;
    setIsProcessing(true);
    try {
      const response = await initiateTopUp({ amount: Number(topUpAmount) });
      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
    } catch (err) {
      console.error("Top-up failed:", err);
      alert("Failed to initiate top-up. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const transactions = wallet?.transactions ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Billing & Wallet</h1>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400">Manage your credits balance and view translation usage.</p>
        </div>
        <Link href="/pricing" target="_blank" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
          View Pricing
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">

        {/* Wallet Balance */}
        <div className="md:col-span-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 dark:text-gray-400 uppercase tracking-wider mb-2">Credits Balance</h2>
          {loading ? (
            <div className="animate-pulse h-12 w-32 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
          ) : (
            <div className="flex items-baseline mb-6">
              <span className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {Number(wallet?.balance || 0).toFixed(2)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">credits</span>
            </div>
          )}
          <button
            onClick={() => setShowTopUpModal(true)}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg transition"
          >
            Top Up Wallet
          </button>
        </div>

        {/* Usage Summary */}
        <div className="md:col-span-2 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Usage Summary</h2>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-100 dark:bg-gray-800 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard icon={<TrendingUp className="w-4 h-4 text-orange-400" />} label="Total Translations" value={usage?.total_translations ?? 0} />
              <StatCard icon={<Mic className="w-4 h-4 text-purple-400" />} label="Voice" value={usage?.voice_translations ?? 0} />
              <StatCard icon={<MessageSquare className="w-4 h-4 text-blue-400" />} label="Text" value={usage?.text_translations ?? 0} />
              <StatCard icon={<Calendar className="w-4 h-4 text-green-400" />} label="This Month" value={usage?.this_month ?? 0} />
              <StatCard icon={<Calendar className="w-4 h-4 text-yellow-400" />} label="This Week" value={usage?.this_week ?? 0} />
              <StatCard icon={<Zap className="w-4 h-4 text-red-400" />} label="Credits Used" value={`${usage?.total_credits_used ?? 0}`} unit="cr" />
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Notes</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-6 py-4">
                      <div className="animate-pulse h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : transactions.length > 0 ? transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-100 dark:bg-gray-800/50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-600 dark:text-gray-300">{formatDate(t.created)}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-500 dark:text-gray-400 dark:text-gray-400 max-w-xs truncate">
                    {t.initiated_by_admin && (
                      <span className="mr-2 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 px-1.5 py-0.5 rounded">Admin</span>
                    )}
                    {t.notes || t.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${t.flow === 'CREDIT' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {t.flow}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-semibold ${t.flow === 'CREDIT' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {t.flow === 'CREDIT' ? '+' : '-'}{Number(t.amount).toFixed(2)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No transactions yet. Top up your wallet to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Top Up Credits</h3>
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400 text-sm mb-6">Minimum amount is $5 USD.</p>
            <form onSubmit={handleTopUp}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Amount (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    min="5"
                    step="0.01"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 50.00"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-8 pr-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition font-mono"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                {[10, 25, 50, 100].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopUpAmount(amt)}
                    className={`flex-1 py-2 rounded text-sm transition border ${topUpAmount === amt ? 'bg-orange-500 border-orange-500 text-gray-900 dark:text-white' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowTopUpModal(false)} className="px-4 py-2 text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:text-white transition" disabled={isProcessing}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!topUpAmount || topUpAmount < 5 || isProcessing}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition"
                >
                  {isProcessing ? "Processing..." : "Pay with Paystack"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: number | string; unit?: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-50 dark:bg-gray-900/60 border border-gray-300 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}{unit && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
      </p>
    </div>
  );
}
