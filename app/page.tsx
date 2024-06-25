import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background-start-rgb to-background-end-rgb">
      <div className="p-8 max-w-lg bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Healthy Eating Habits and Academic Performance Survey</h1>
        <p className="mb-6 text-center text-gray-600">
          We value your privacy. All responses are confidential and your data is securely protected.
        </p>
        <Link href="/survey" legacyBehavior>
          <a className="block p-6 bg-blue-500 text-white text-center rounded-lg shadow-lg hover:bg-blue-600 transition">
            Take the Survey
          </a>
        </Link>
        <Link href="/analytics" passHref>
          <a className="block mt-4 text-center text-blue-500 hover:underline">
            View Analytics
          </a>
        </Link>
      </div>
    </main>
  );
}

