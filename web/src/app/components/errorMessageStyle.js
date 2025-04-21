export default function ErrorMessageStyle({ children }) {
    if (!children) return null;
  
    return (
      <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-md text-sm text-center">
        {children}
      </div>
    );
  }
  