export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#ea384c] to-[#ff6b81] text-white border-t border-red-600/20 mt-auto backdrop-blur-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            <button 
              onClick={() => window.open('mailto:support@loveable.ai')} 
              className="text-white hover:text-red-200 transition-colors relative group"
            >
              Contact Support
              <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
            </button>
          </p>
          <div className="flex gap-4 text-sm">
            <button className="text-white hover:text-red-200 transition-colors">Terms</button>
            <button className="text-white hover:text-red-200 transition-colors">Privacy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}