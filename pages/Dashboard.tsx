import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DailyLog, UserRole } from '../types';
import { ActivityChart, SleepWaterChart, MoodPieChart } from '../components/Charts';
import { Activity, Droplets, Moon, TrendingUp, AlertCircle, Calendar } from 'lucide-react';
import { createHealthChat } from '../services/geminiService';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const StatCard = ({ icon: Icon, label, value, trend, trendUp, color }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

const UserDashboard = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState<DailyLog[]>([]);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [loadingInsight, setLoadingInsight] = useState(false);
    const [loadingLogs, setLoadingLogs] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'users', user.id, 'logs'),
            orderBy('timestamp', 'desc'),
            limit(7)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedLogs = snapshot.docs.map(doc => doc.data() as DailyLog).reverse();
            setLogs(fetchedLogs);
            setLoadingLogs(false);
        }, (error) => {
            console.error("Firestore snapshot error:", error);
            setLoadingLogs(false);
        });

        return () => unsubscribe();
    }, [user]);

    const latestLog = logs[logs.length - 1] || {
        steps: 0,
        waterIntake: 0,
        sleepHours: 0,
        caloriesBurned: 0
    };

    const getInsight = async () => {
        if (logs.length === 0) {
            setAiInsight("Please log some health data first!");
            return;
        }
        setLoadingInsight(true);
        try {
           const chat = createHealthChat();
           const summary = logs.map(l => `${l.date}: Steps ${l.steps}, Sleep ${l.sleepHours}, Water ${l.waterIntake}`).join('; ');
           const prompt = `Analyze this weekly health summary: ${summary}. Provide 2 concise sentences of advice.`;
           const response = await chat.sendMessage({ message: prompt });
           setAiInsight(response.text || "Keep up the good work!");
        } catch (e) {
            setAiInsight("Based on your data: Try to increase water intake and aim for consistent sleep schedules.");
        }
        setLoadingInsight(false);
    }

  if (loadingLogs) {
      return (
          <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-slate-500">Here's your daily health analytics overview.</p>
        </div>
        <button 
            onClick={getInsight}
            disabled={loadingInsight}
            className="mt-4 md:mt-0 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg shadow-teal-600/20 transition-all"
        >
            {loadingInsight ? 'Analyzing...' : (
                <>
                <TrendingUp size={18} className="mr-2" />
                Generate AI Insight
                </>
            )}
        </button>
      </div>

      {aiInsight && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white relative overflow-hidden animate-fade-in">
              <div className="relative z-10">
                  <h3 className="font-bold text-lg mb-1 flex items-center"><Activity className="mr-2"/> AI Health Analysis</h3>
                  <p className="text-indigo-100">{aiInsight}</p>
              </div>
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            icon={Activity} 
            label="Daily Steps" 
            value={latestLog.steps.toLocaleString()} 
            trend="+12%" 
            trendUp={true} 
            color="bg-teal-500" 
        />
        <StatCard 
            icon={Droplets} 
            label="Water Intake" 
            value={`${latestLog.waterIntake} ml`} 
            trend="-5%" 
            trendUp={false} 
            color="bg-blue-500" 
        />
        <StatCard 
            icon={Moon} 
            label="Sleep Duration" 
            value={`${latestLog.sleepHours}h`} 
            trend="+2%" 
            trendUp={true} 
            color="bg-indigo-500" 
        />
        <StatCard 
            icon={TrendingUp} 
            label="Calories Burned" 
            value={`${latestLog.caloriesBurned} kcal`} 
            trend="+8%" 
            trendUp={true} 
            color="bg-orange-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Activity Trends</h3>
          <ActivityChart data={logs.length > 0 ? logs : []} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sleep vs Water Intake</h3>
          <SleepWaterChart data={logs.length > 0 ? logs : []} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Mood Analysis</h3>
              <MoodPieChart data={logs.length > 0 ? logs : []} />
          </div>
          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Reminders</h3>
              <div className="space-y-4">
                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                      <AlertCircle className="text-yellow-600 mr-3" />
                      <div>
                          <p className="font-semibold text-slate-800">Hydration Alert</p>
                          <p className="text-sm text-slate-600">You haven't logged water intake in 4 hours.</p>
                      </div>
                  </div>
                  <div className="flex items-center p-4 bg-teal-50 rounded-lg border border-teal-100">
                      <Activity className="text-teal-600 mr-3" />
                      <div>
                          <p className="font-semibold text-slate-800">Goal Achieved!</p>
                          <p className="text-sm text-slate-600">You reached your step goal yesterday. Keep it up!</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

const DoctorDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Doctor Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 font-medium">Total Patients</h3>
                    <p className="text-3xl font-bold text-slate-800 mt-2">124</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 font-medium">Critical Alerts</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">3</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-slate-500 font-medium">Appointments Today</h3>
                    <p className="text-3xl font-bold text-teal-600 mt-2">8</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">Recent Patient Activity</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Patient</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Last Log</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 mr-3"></div>
                                    <span className="font-medium text-slate-800">John Doe</span>
                                </div>
                            </td>
                            <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Stable</span></td>
                            <td className="px-6 py-4 text-sm text-slate-500">2 hours ago</td>
                            <td className="px-6 py-4"><button className="text-teal-600 hover:underline text-sm font-medium">View Report</button></td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-slate-200 mr-3"></div>
                                    <span className="font-medium text-slate-800">Jane Smith</span>
                                </div>
                            </td>
                            <td className="px-6 py-4"><span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Attention</span></td>
                            <td className="px-6 py-4 text-sm text-slate-500">1 day ago</td>
                            <td className="px-6 py-4"><button className="text-teal-600 hover:underline text-sm font-medium">View Report</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const AdminDashboard = () => (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">System Administration</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold mb-4">User Management</h2>
            <p className="text-slate-600">System stats and user roles management would go here.</p>
        </div>
    </div>
);

export const Dashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === UserRole.DOCTOR) return <DoctorDashboard />;
  if (user?.role === UserRole.ADMIN) return <AdminDashboard />;
  return <UserDashboard />;
};
