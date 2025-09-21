"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:4000";

type Patient = {
  _id?: string;
  medicalId: string;
  name: string;
  phone: string;
  email?: string;
  dob?: string;
  allergies?: string;
  medications?: string;
  primaryPhysician?: string;
  insuranceProvider?: string;
  conditions?: string[];
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  editing?: boolean;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState<Patient>({ 
    medicalId: "", 
    name: "", 
    phone: "",
    email: "",
    allergies: "",
    medications: "",
    primaryPhysician: "",
    insuranceProvider: "",
    emergencyContactName: "",
    emergencyContactPhone: ""
  });

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/api/patients`, { withCredentials: true });
      const data = res.data;
      const patientsData = Array.isArray(data) ? data : [];
      setPatients(patientsData.map(p => ({ ...p, editing: false })));
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message || "Failed to load patients");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function create() {
    if (!form.medicalId.trim() || !form.name.trim() || !form.phone.trim()) {
      setError("Medical ID, name, and phone are required");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await axios.post(
        `${BACKEND}/api/patients`,
        {
          ...form,
          conditions: form.conditions ? [form.conditions] : []
        },
        { withCredentials: true }
      );
      setForm({ 
        medicalId: "", 
        name: "", 
        phone: "",
        email: "",
        allergies: "",
        medications: "",
        primaryPhysician: "",
        insuranceProvider: "",
        emergencyContactName: "",
        emergencyContactPhone: ""
      });
      setShowCreateForm(false);
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    setLoading(true);
    try {
      await axios.delete(`${BACKEND}/api/patients/${id}`, { withCredentials: true });
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  function toggleEdit(id: string) {
    setPatients(prev => prev.map(p => p._id === id ? { ...p, editing: !p.editing } : p));
  }

  async function savePatient(patient: Patient) {
    if (!patient._id) return;
    setLoading(true);
    try {
      await axios.patch(
        `${BACKEND}/api/patients/${patient._id}`,
        {
          name: patient.name,
          phone: patient.phone,
          email: patient.email,
          allergies: patient.allergies,
          medications: patient.medications,
          primaryPhysician: patient.primaryPhysician,
          insuranceProvider: patient.insuranceProvider,
          emergencyContactName: patient.emergencyContactName,
          emergencyContactPhone: patient.emergencyContactPhone
        },
        { withCredentials: true }
      );
      setPatients(prev => prev.map(p => p._id === patient._id ? { ...p, editing: false } : p));
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
       
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Test Patients</h1>
          <p className="text-gray-600 mt-1">Demo patient data for testing OpenMic webhooks</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          {showCreateForm ? "Cancel" : "Add Test Patient"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
 
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Add Test Patient</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical ID *</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="M001, M002..."
                value={form.medicalId} 
                onChange={e => setForm(prev => ({...prev, medicalId: e.target.value}))} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="John Doe"
                value={form.name} 
                onChange={e => setForm(prev => ({...prev, name: e.target.value}))} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input 
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="+15551234567"
                value={form.phone} 
                onChange={e => setForm(prev => ({...prev, phone: e.target.value}))} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="john@example.com"
                value={form.email || ""} 
                onChange={e => setForm(prev => ({...prev, email: e.target.value}))} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Physician</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="Dr. Smith"
                value={form.primaryPhysician || ""} 
                onChange={e => setForm(prev => ({...prev, primaryPhysician: e.target.value}))} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="Blue Cross"
                value={form.insuranceProvider || ""} 
                onChange={e => setForm(prev => ({...prev, insuranceProvider: e.target.value}))} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="Penicillin, Shellfish"
                value={form.allergies || ""} 
                onChange={e => setForm(prev => ({...prev, allergies: e.target.value}))} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="Aspirin, Lisinopril"
                value={form.medications || ""} 
                onChange={e => setForm(prev => ({...prev, medications: e.target.value}))} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
              <input 
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="Jane Doe"
                value={form.emergencyContactName || ""} 
                onChange={e => setForm(prev => ({...prev, emergencyContactName: e.target.value}))} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Phone</label>
              <input 
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-colors"
                placeholder="+15551234567"
                value={form.emergencyContactPhone || ""} 
                onChange={e => setForm(prev => ({...prev, emergencyContactPhone: e.target.value}))} 
              />
            </div>
          </div>
          <div className="flex gap-3 pt-6">
            <button 
              onClick={create} 
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Adding..." : "Add Patient"}
            </button>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

 
      <div className="space-y-4">
        {loading && patients.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patients...</p>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No test patients yet</h3>
            <p className="text-gray-600 mb-4">Add demo patients to test pre-call webhooks and in-call functions</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Add Test Patient
            </button>
          </div>
        ) : (
          patients.map(patient => (
            <div key={patient._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {patient.medicalId}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>📞 {patient.phone}</div>
                    {patient.email && <div>✉️ {patient.email}</div>}
                    {patient.primaryPhysician && <div>👨‍⚕️ Dr. {patient.primaryPhysician}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleEdit(patient._id!)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    {patient.editing ? "Cancel" : "Edit"}
                  </button>
                  <button 
                    onClick={() => remove(patient._id!)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {patient.editing && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        value={patient.name}
                        onChange={e => setPatients(prev => prev.map(p => p._id === patient._id ? { ...p, name: e.target.value } : p))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        value={patient.phone}
                        onChange={e => setPatients(prev => prev.map(p => p._id === patient._id ? { ...p, phone: e.target.value } : p))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                        value={patient.email || ""}
                        onChange={e => setPatients(prev => prev.map(p => p._id === patient._id ? { ...p, email: e.target.value } : p))}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => savePatient(patient)}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
              
             
              {!patient.editing && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {patient.allergies && (
                      <div>
                        <span className="font-medium text-gray-700">Allergies:</span>
                        <span className="ml-2 text-red-600">{patient.allergies}</span>
                      </div>
                    )}
                    {patient.medications && (
                      <div>
                        <span className="font-medium text-gray-700">Medications:</span>
                        <span className="ml-2 text-gray-600">{patient.medications}</span>
                      </div>
                    )}
                    {patient.insuranceProvider && (
                      <div>
                        <span className="font-medium text-gray-700">Insurance:</span>
                        <span className="ml-2 text-gray-600">{patient.insuranceProvider}</span>
                      </div>
                    )}
                    {patient.emergencyContactName && (
                      <div>
                        <span className="font-medium text-gray-700">Emergency Contact:</span>
                        <span className="ml-2 text-gray-600">{patient.emergencyContactName} {patient.emergencyContactPhone && `(${patient.emergencyContactPhone})`}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


