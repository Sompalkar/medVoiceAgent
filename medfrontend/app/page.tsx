import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
    
      <header className="border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">MedicalAI Agent</h1>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 border border-purple-300 rounded-lg no-underline text-purple-700 text-sm transition-colors hover:bg-purple-50">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 bg-purple-600 text-white rounded-lg no-underline text-sm transition-colors hover:bg-purple-700">
              Get Started
            </Link>
          </div>
        </div>
      </header>

       
      <section className="py-20 bg-gradient-to-b from-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI-Powered Medical Intake
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Build intelligent medical intake agents using OpenMic API. Complete with pre-call webhooks, in-call function calls, and post-call processing for seamless patient interactions.
          </p>
          <Link href="/register" className="inline-block px-8 py-4 bg-purple-600 text-white rounded-lg no-underline text-base font-medium transition-colors hover:bg-purple-700 shadow-lg">
            Start Building
          </Link>
        </div>
      </section>

  
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-semibold text-center mb-16 text-gray-900">
            OpenMic API Integration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">Pre-Call Webhooks</h4>
              <p className="text-gray-600 leading-relaxed">
                Automatically fetch patient information before calls start. Get medical history, allergies, and previous visit data for personalized conversations.
              </p>
            </div>
            <div className="text-center p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">In-Call Functions</h4>
              <p className="text-gray-600 leading-relaxed">
                Real-time patient data retrieval during conversations. Agent asks for Medical ID and instantly fetches relevant medical records and alerts.
              </p>
            </div>
            <div className="text-center p-8 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-4 text-gray-900">Post-Call Processing</h4>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive call logging and analysis. Automatic transcript processing, summary generation, and follow-up requirement detection.
              </p>
            </div>
          </div>
        </div>
      </section>

 
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-semibold text-center mb-16 text-gray-900">
            Complete Demo Platform
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-semibold mb-6 text-gray-900">Bot Management</h4>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create and configure medical intake bots
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Edit system prompts and instructions
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Manage bot lifecycle (CRUD operations)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-2xl font-semibold mb-6 text-gray-900">Call Analytics</h4>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View complete call transcripts
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Track API function call results
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Monitor success rates and follow-ups
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

 
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-gray-400">
            © 2024 MedicalAI Agent. Powered by OpenMic API Integration.
          </p>
        </div>
      </footer>
    </div>
  );
}
