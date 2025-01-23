export function Footer() {
  return (
    <footer className="bg-blue-700 text-white border-t border-blue-800 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm">
          <button 
            onClick={() => window.open('mailto:support@loveable.ai')} 
            className="text-white hover:text-blue-200 transition-colors"
          >
            Contact Support
          </button>
        </p>
      </div>
    </footer>
  );
}