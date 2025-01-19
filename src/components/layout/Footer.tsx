export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          <button 
            onClick={() => window.open('mailto:support@loveable.ai')} 
            className="hover:text-medical-primary"
          >
            Contact Support
          </button>
        </p>
      </div>
    </footer>
  );
}