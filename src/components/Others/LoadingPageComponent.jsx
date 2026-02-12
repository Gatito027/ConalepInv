export default function LoadingPageComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="mt-4 animate-spin">
        <div className="w-60 h-60 bg-linear-to-tr from-emerald-500 to-emerald-700 rounded-full opacity-75"></div>
      </div>
      <h2 className="text-xl font-bold mt-2 text-gray-700">
        Recuperando Informacion...
      </h2>
    </div>
  );
}