import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#EFF4F5] dark:bg-gray-900 border-t border-[#B9CED5] dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <img src="/images/logo_v2.png" alt="ECHO Logo" className="h-8 w-auto object-contain dark:invert mb-3" />
            <p className="text-xs text-[#4D6680] dark:text-gray-400 leading-relaxed max-w-[200px]">
              AI-powered translation bridging cultures through voice, text and documents.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-[#0C141D] dark:text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/pricing" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/dashboard/voice" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Voice Translation</Link></li>
              <li><Link href="/dashboard/text" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Text Translation</Link></li>
              <li><Link href="/dashboard/document" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Document Translation</Link></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className="text-xs font-bold text-[#0C141D] dark:text-white uppercase tracking-wider mb-4">Developers</h4>
            <ul className="space-y-3">
              <li><Link href="/developer/docs" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">API Documentation</Link></li>
              <li><Link href="/developer/pricing" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">API Pricing</Link></li>
              <li><Link href="/dashboard/api-keys" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">API Keys</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-[#0C141D] dark:text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">About Us</Link></li>
              <li><Link href="/login" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Log In</Link></li>
              <li><Link href="/signup" className="text-xs text-[#4D6680] dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Sign Up</Link></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#B9CED5] dark:border-gray-700 px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4D6680] dark:text-gray-500">
          <p>© 2026 ECHO. Built with ❤️ for bridging cultures through voice.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-orange-500 transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-orange-500 transition-colors">Pricing</Link>
            <Link href="/developer/docs" className="hover:text-orange-500 transition-colors">Developer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
