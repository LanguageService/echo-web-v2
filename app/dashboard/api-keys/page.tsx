"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus } from 'lucide-react';
import {
  fetchApiKeys, createApiKey, revokeApiKey, ApiKey,
  fetchWebhooks, createWebhook, deleteWebhook, Webhook,
} from '@/lib/api';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookApp, setNewWebhookApp] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchApiKeys(),
      fetchWebhooks(),
    ]).then(([keysData, webhooksData]) => {
      setKeys(keysData);
      setWebhooks(webhooksData);
    }).catch(err => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName || isProcessing) return;
    setIsProcessing(true);
    try {
      const newKey = await createApiKey({ name: newKeyName });
      setKeys([newKey, ...keys]);
      setNewSecret(newKey.client_secret || null);
      setNewKeyName("");
    } catch {
      alert("Failed to create API key. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    const appId = newWebhookApp || keys[0]?.id;
    if (!newWebhookUrl || !appId || isProcessing) return;
    setIsProcessing(true);
    try {
      const webhook = await createWebhook(appId, newWebhookUrl);
      setWebhooks([webhook, ...webhooks]);
      setNewWebhookUrl("");
      setNewWebhookApp("");
      setShowWebhookModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add webhook endpoint.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    if (!confirm("Remove this webhook endpoint?")) return;
    try {
      await deleteWebhook(id);
      setWebhooks(prev => prev.filter(w => w.id !== id));
    } catch {
      alert("Failed to remove webhook. Please try again.");
    }
  };

  const closeSecretModal = () => {
    setNewSecret(null);
    setShowKeyModal(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-800 dark:text-gray-200">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">API Keys</h1>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400">Manage your developer credentials for the ECHO API.</p>
        </div>
        <div className="flex space-x-3">
          <Link href="/developer/docs" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
            Read Docs
          </Link>
          <button
            onClick={() => setShowKeyModal(true)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm transition text-white shadow-lg"
          >
            + Create API Key
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>Important:</strong> All API requests are billed against your Universal Wallet. Ensure you have sufficient balance in{" "}
          <Link href="/dashboard/billing" className="underline font-semibold hover:text-gray-900 dark:text-white">Billing</Link>{" "}
          to prevent service interruption.
        </p>
      </div>

      {/* API Keys Table */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xl mb-10">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Keys</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Client ID</th>
                <th className="px-6 py-4 font-medium">Created</th>
                <th className="px-6 py-4 font-medium">Last Used</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : keys.length > 0 ? keys.map(key => (
                <tr key={key.id} className="hover:bg-gray-100 dark:bg-gray-800/50 transition">
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{key.name}</td>
                  <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400 text-xs">{key.client_id}</td>
                  <td className="px-6 py-4">{new Date(key.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={async () => {
                        if (!confirm(`Revoke "${key.name}"? This cannot be undone.`)) return;
                        try {
                          await revokeApiKey(key.id);
                          setKeys(prev => prev.filter(k => k.id !== key.id));
                        } catch {
                          alert("Failed to revoke key. Please try again.");
                        }
                      }}
                      className="text-red-400 hover:text-red-300 transition text-xs font-semibold uppercase tracking-wider"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No API keys found. Create one to get started.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Webhooks</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Receive real-time updates for long-running translations.</p>
          </div>
          <button
            onClick={() => {
              if (keys.length === 0) {
                alert("Create an API key first before adding a webhook.");
                return;
              }
              setShowWebhookModal(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
          >
            <Plus size={14} /> Add Endpoint
          </button>
        </div>

        {webhooks.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 text-center border border-gray-200 dark:border-gray-800 border-dashed">
            <p className="text-gray-500 dark:text-gray-400 text-sm">No webhook endpoints configured yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {webhooks.map(wh => (
              <div key={wh.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-mono truncate">{wh.url}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">App: {wh.app_name} · Added {new Date(wh.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => handleDeleteWebhook(wh.id)}
                  className="ml-4 shrink-0 text-red-400 hover:text-red-300 transition"
                  title="Remove webhook"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create API Key Modal */}
      {showKeyModal && !newSecret && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create API Key</h3>
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400 text-sm mb-6">Give your key a descriptive name so you know what it's used for.</p>
            <form onSubmit={handleCreateKey}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Key Name</label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production iOS App"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowKeyModal(false)} className="px-4 py-2 text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:text-white transition" disabled={isProcessing}>Cancel</button>
                <button type="submit" disabled={!newKeyName || isProcessing} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition">
                  {isProcessing ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Secret Key Display Modal */}
      {showKeyModal && newSecret && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 border-t-4 border-t-green-500">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Save your new key</h3>
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400 text-sm mb-6">
              Please copy this Client Secret and save it somewhere safe.
              <strong className="text-gray-900 dark:text-white block mt-1">You won&apos;t be able to see it again!</strong>
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-green-400 break-all border border-gray-200 dark:border-gray-800 mb-6 flex items-center justify-between">
              <span className="text-sm">{newSecret}</span>
              <button onClick={() => navigator.clipboard.writeText(newSecret)} className="ml-4 text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:text-white shrink-0" title="Copy">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
            </div>
            <button onClick={closeSecretModal} className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-medium transition">
              I have saved my secret key
            </button>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Add Webhook Endpoint</h3>
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400 text-sm mb-6">We'll send a signed POST request to this URL when translations complete.</p>
            <form onSubmit={handleCreateWebhook}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Endpoint URL</label>
                <input
                  type="url"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  placeholder="https://your-server.com/webhook"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                  autoFocus
                  required
                />
              </div>
              {keys.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Link to API Key</label>
                  <select
                    value={newWebhookApp}
                    onChange={(e) => setNewWebhookApp(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:border-orange-500 transition"
                  >
                    {keys.map(k => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => { setShowWebhookModal(false); setNewWebhookUrl(""); }} className="px-4 py-2 text-gray-500 dark:text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:text-white transition" disabled={isProcessing}>Cancel</button>
                <button type="submit" disabled={!newWebhookUrl || isProcessing} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition">
                  {isProcessing ? "Adding..." : "Add Endpoint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
