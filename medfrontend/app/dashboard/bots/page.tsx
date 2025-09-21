"use client"

import { useEffect , useState } from "react"
import axios from "axios"

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "/api"

type Bot = {
  uid: string
  name?: string
  description?: string
  instructions?: string
}

type BotRow = Bot & {
  editName?: string
  editPrompt?: string
  editing?: boolean
}




export default function BotsPage() {


  const [bots , setBots] = useState<BotRow[]>([])
  const [loading , setLoading] = useState(false)
  const [error , setError] = useState<string | null>(null)

  const [newName , setNewName] = useState("")
  const [newPrompt , setNewPrompt] = useState(
    "You are a medical intake agent. Greet the caller, confirm consent for recording, ask for their Medical ID, and when provided call the function get_patient_info with patientId. Use returned allergies/medications accurately. Be concise and empathetic; end with summary and next steps."
  )
  const [showCreateForm , setShowCreateForm] = useState(false)



  async function load() {
    setError(null)
    setLoading(true)
    try {
      const res = await axios.get(`${BACKEND}/api/openmic/bots`, { withCredentials:true })
      const rawList: any[] = res.data?.bots || res.data?.data || res.data || []


            const hydrated: BotRow[] = await Promise.all(
              rawList.map(async b => {
                let instr = b.instructions || b.prompt || ""
                if (!instr && b.uid) {
                  try {
                    const det = await axios.get(`${BACKEND}/api/openmic/bots/${b.uid}`, { withCredentials:true })
                    instr = det.data?.instructions || det.data?.prompt || instr
                  } catch {}
                }
                return {
                  ...b ,
                  instructions: instr ,
                  editName: b.name || "" ,
                  editPrompt: instr || "" ,
                  editing: false
                }
              })
            )


      setBots(hydrated)
    } catch (e:any) {

      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Failed to load bots"
      setError(String(msg))


    } finally {


      setLoading(false)

    }
  }

        useEffect(() => {
          
               load() 
              
        
         } , [])

  async function create() {

            if (!newName.trim() || !newPrompt.trim()) {

              setError("Bot name and prompt are required")
              return
            }

            setError(null)
            setLoading(true)


            try {

                  await axios.post( `${BACKEND}/api/openmic/bots`, { name:newName.trim() , instructions:newPrompt.trim() , prompt:newPrompt.trim() },

                    { withCredentials:true }
                  )
                  setNewName("")

              setNewPrompt(
                "You are a medical intake agent. Greet the caller, confirm consent for recording, ask for their Medical ID, and when provided call the function get_patient_info with patientId. Use returned allergies/medications accurately. Be concise and empathetic; end with summary and next steps."
              )

                  setShowCreateForm(false)

                  await load()

                } catch (e:any) {

                  const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Create failed"
                  setError(String(msg))

                } finally {

                  setLoading(false)
                  
            }
          }

  async function remove(uid:string) {
          if (!confirm("Delete this bot?")) return
          setLoading(true)
              try {
                        await axios.delete(`${BACKEND}/api/openmic/bots/${uid}`, { withCredentials:true })
                        await load()
                  } catch (e:any) {


                        const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Delete failed"
                        setError(String(msg))
              } finally {
                setLoading(false)
              }
  }

  async function saveBot(uid:string , name:string , prompt:string) {
    setLoading(true)
          try {
                    await axios.patch( `${BACKEND}/api/openmic/bots/${uid}`, { name:name.trim() , instructions:prompt.trim() , prompt:prompt.trim() }, { withCredentials:true }

                    )

            setBots(prev => prev.map(x => (x.uid === uid ? { ...x , editing:false } : x)))


            await load()


          } catch (e:any) {

            const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Update failed"
            setError(String(msg))


          } finally {
            setLoading(false)
          }
  }

  function toggleEdit(uid:string) {

    setBots(prev => prev.map(x => (x.uid === uid ? { ...x , editing:!x.editing } : x)))
    
  }

  function cancelEdit(uid:string) {
    setBots(prev =>
      prev.map(x =>
        x.uid === uid
          ? { ...x , editing:false , editName:x.name || "" , editPrompt:x.instructions || "" }
          : x
      )
    )
  }

  return (



    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">OpenMic AI Bots</h1>
          <p className="text-gray-600 mt-1">Create and manage medical intake agents</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Create New Bot"}
        </button>
      </div>




      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}



      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Medical AI Bot</h2>
            <p className="text-sm text-gray-600 mt-1">Configure your OpenMic bot for medical intake</p>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bot Name *</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="e.g., Medical Intake Assistant, Primary Care Bot"
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Choose a descriptive name for your medical intake bot</p>
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt *</label>
              <textarea
                rows={8}
                value={newPrompt}
                onChange={e => setNewPrompt(e.target.value)}
                placeholder="You are a medical intake agent..."
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">Define how your AI agent should behave during patient calls</p>
                <span className="text-xs text-gray-400">{newPrompt.length} characters</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Integration Tips:</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Use pre-call variables: patient_name, medical_id, allergies, last_visit</li>
                <li>• Call getPatientInfo function with patient_id for real-time data</li>
                <li>• Be empathetic and concise in medical conversations</li>
              </ul>
            </div>
          </div>



          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={create}
              disabled={loading || !newName.trim() || !newPrompt.trim()}
              className="bg-purple-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating Bot..." : "Create Bot"}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {loading && bots.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading bots...</p>
          </div>
        ) : bots.length === 0 ? (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bots created yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first bot</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
            >
              Create Bot
            </button>
          </div>
        ) : (
          bots.map(bot => (
            <div key={bot.uid} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {bot.editing ? (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Bot Name</label>
                      <input
                        value={bot.editName}
                        onChange={e =>
                          setBots(prev => prev.map(x => (x.uid === bot.uid ? { ...x , editName:e.target.value } : x)))
                        }
                        className="text-lg font-semibold text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="Bot Name"
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bot.name}</h3>
                      <p className="text-sm text-gray-500 font-mono mt-1">ID: {bot.uid}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {bot.editing ? (
                    <>
                      <button
                        onClick={() => saveBot(bot.uid , bot.editName || "" , bot.editPrompt || "")}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => cancelEdit(bot.uid)}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleEdit(bot.uid)}
                        className="border border-purple-300 text-purple-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(bot.uid)}
                        className="border border-red-300 text-red-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">System Prompt</label>
                {bot.editing ? (
                  <textarea
                    rows={8}
                    value={bot.editPrompt}
                    onChange={e =>
                      setBots(prev => prev.map(x => (x.uid === bot.uid ? { ...x , editPrompt:e.target.value } : x)))
                    }
                    className="w-full text-sm text-gray-900 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                    placeholder="Define how your AI agent should behave..."
                  />
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <div className="text-sm text-gray-900 whitespace-pre-wrap">
                      {bot.instructions || "No prompt configured"}
                    </div>
                    {bot.instructions && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        {bot.instructions.length} characters
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!bot.editing && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs text-gray-500">
                  <span>OpenMic Bot ID: {bot.uid}</span>
                  <span>Ready for webhook integration</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {bots.length > 0 && (
        <div className="text-sm text-gray-500">
          {bots.length} bot{bots.length !== 1 ? "s" : ""} total
        </div>
      )}
    </div>
  )
}
