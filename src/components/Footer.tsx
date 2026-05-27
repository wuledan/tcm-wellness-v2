export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="font-serif text-lg font-bold text-gray-800">TCM Wellness</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Food as Medicine, Made Personal. Ancient Chinese wisdom powered by modern AI.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="/quiz" className="hover:text-emerald-600 transition-colors">Body Type Quiz</a></li>
              <li><a href="/food-scan" className="hover:text-emerald-600 transition-colors">Food Scanner</a></li>
              <li><a href="/learn" className="hover:text-emerald-600 transition-colors">Learn TCM</a></li>
              <li><a href="/daily" className="hover:text-emerald-600 transition-colors">Daily Wellness</a></li>
              <li><a href="/about" className="hover:text-emerald-600 transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Legal</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              ⚕️ Educational content only. Not medical advice. Always consult with a qualified healthcare provider before making any changes to your diet, exercise, or health regimen. The information provided is for general wellness education purposes only.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} TCM Wellness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
