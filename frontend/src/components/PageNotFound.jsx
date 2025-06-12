export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black text-center p-6 text-white">
      <h2 className="text-6xl font-extrabold text-blue-500 animate-bounce">404</h2>
      <h1 className="text-2xl mt-4 font-semibold">Oops! Page not found</h1>
      <p className="mt-2 text-slate-400">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="mt-6 inline-block bg-blue-600 px-6 py-3 rounded-md text-white font-medium hover:bg-blue-700 transition duration-300 transform hover:scale-105">Go Home</a>
    </div>
  );
}
