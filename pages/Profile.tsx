import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Heart, Save, X } from 'lucide-react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileForm, setProfileForm] = useState({
        age: user?.profile?.age || 0,
        height: user?.profile?.height || 0,
        weight: user?.profile?.weight || 0,
        bloodType: user?.profile?.bloodType || '',
        allergies: user?.profile?.allergies.join(', ') || ''
    });

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const updatedProfile = {
                ...user.profile,
                age: Number(profileForm.age),
                height: Number(profileForm.height),
                weight: Number(profileForm.weight),
                bloodType: profileForm.bloodType,
                allergies: profileForm.allergies.split(',').map(s => s.trim()).filter(Boolean)
            };

            await updateDoc(doc(db, 'users', user.id), {
                profile: updatedProfile
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="h-32 bg-gradient-to-r from-teal-500 to-emerald-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <img 
                            src={user?.avatar} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-white"
                        />
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center"
                                    >
                                        <X size={16} className="mr-1"/> Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 flex items-center disabled:opacity-50"
                                    >
                                        <Save size={16} className="mr-1"/> {loading ? 'Saving...' : 'Save'}
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{user?.name}</h1>
                        <p className="text-slate-500 font-medium">{user?.role}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <User size={20} className="mr-2 text-teal-600"/> Personal Info
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center text-slate-600">
                            <Mail size={18} className="mr-3 text-slate-400"/> {user?.email}
                        </div>
                        <div className="flex items-center text-slate-600">
                            <Phone size={18} className="mr-3 text-slate-400"/> +1 (555) 123-4567
                        </div>
                        <div className="flex items-center text-slate-600">
                            <MapPin size={18} className="mr-3 text-slate-400"/> New York, USA
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                        <Heart size={20} className="mr-2 text-red-500"/> Health Profile
                    </h3>
                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase mb-1">Age</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                                        value={profileForm.age}
                                        onChange={e => setProfileForm({...profileForm, age: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase mb-1">Blood Type</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                                        value={profileForm.bloodType}
                                        onChange={e => setProfileForm({...profileForm, bloodType: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase mb-1">Height (cm)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                                        value={profileForm.height}
                                        onChange={e => setProfileForm({...profileForm, height: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 uppercase mb-1">Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                                        value={profileForm.weight}
                                        onChange={e => setProfileForm({...profileForm, weight: Number(e.target.value)})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 uppercase mb-1">Allergies (comma separated)</label>
                                <input 
                                    type="text" 
                                    className="w-full p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                                    value={profileForm.allergies}
                                    onChange={e => setProfileForm({...profileForm, allergies: e.target.value})}
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Age</p>
                                    <p className="text-lg font-semibold text-slate-800">{user?.profile?.age} yrs</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Blood Type</p>
                                    <p className="text-lg font-semibold text-slate-800">{user?.profile?.bloodType}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Height</p>
                                    <p className="text-lg font-semibold text-slate-800">{user?.profile?.height} cm</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase">Weight</p>
                                    <p className="text-lg font-semibold text-slate-800">{user?.profile?.weight} kg</p>
                                </div>
                            </div>
                            <div className="mt-4">
                                <p className="text-xs text-slate-500 uppercase mb-2">Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                    {user?.profile?.allergies.map(alg => (
                                        <span key={alg} className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                                            {alg}
                                        </span>
                                    ))}
                                    {user?.profile?.allergies.length === 0 && <span className="text-slate-400 text-sm italic">None</span>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
