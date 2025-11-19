export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-3 rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="border w-full p-3 rounded mb-4"
        />

        <button className="bg-blue-600 text-white w-full p-3 rounded">
          Login
        </button>

        <p className="text-sm mt-4 text-center text-gray-500">
          *Frontend only. Backend steps in README.
        </p>
      </div>
    </div>
  );
}
