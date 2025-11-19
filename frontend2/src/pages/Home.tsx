export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Welcome to SMB</h1>
        <a
          href="/login"
          className="mt-4 inline-block px-6 py-2 bg-blue-600 rounded-lg"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}
