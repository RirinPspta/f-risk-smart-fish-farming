import { useState, useEffect } from 'react';
import api from '../services/api';
import MetricCard from '../components/MetricCard';
import WaterChart from '../components/WaterChart';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Database, 
  Calendar, 
  Activity, 
  ShieldCheck,
  ShieldX,
  Droplets,
  Thermometer,
  Wind,
  Eye,
  Waves
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [metrics, setMetrics] = useState({
    total_users: 0,
    total_pengukuran: 0,
    pengukuran_hari_ini: 0,
    status_air_terakhir: null
  });
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Ambil metrik ringkasan
      const metricsRes = await api.get('/dashboard');
      setMetrics(metricsRes.data);

      // Ambil data historis kualitas air (maks 10 record untuk chart)
      const historyRes = await api.get('/water-qualities');
      setHistoryData(historyRes.data.slice(0, 10)); // ambil 10 data terbaru

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setErrorMsg('Gagal memuat data dashboard. Pastikan server backend Anda berjalan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
      </div>
    );
  }

  const lastRecord = metrics.status_air_terakhir;

  // Helper untuk menentukan badge parameter normal/tidak
  const checkParamStatus = (name, val) => {
    let status = 'ideal'; // 'ideal', 'warning', 'critical'
    switch(name) {
      case 'ph':
        if (val < 6.0 || val > 9.0) status = 'critical';
        else if (val < 6.5 || val > 8.5) status = 'warning';
        break;
      case 'suhu':
        if (val < 18.0 || val > 35.0) status = 'critical';
        else if (val < 25.0 || val > 30.0) status = 'warning';
        break;
      case 'do':
        if (val < 2.0) status = 'critical';
        else if (val < 4.0) status = 'warning';
        break;
      case 'kekeruhan':
        if (val < 10.0 || val > 150.0) status = 'critical';
        else if (val < 30.0 || val > 80.0) status = 'warning';
        break;
      case 'nitrate':
        if (val > 200.0) status = 'critical';
        else if (val >= 50.0) status = 'warning';
        break;
      case 'amonia':
        if (val > 3.0) status = 'critical';
        else if (val >= 1.0) status = 'warning';
        break;
      default:
        break;
    }
    
    if (status === 'critical') {
      return 'bg-red-950/40 text-red-400 border border-red-500/20 animate-pulse';
    } else if (status === 'warning') {
      return 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
    }
    return 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return {
        icon: Activity,
        bg: 'bg-slate-900 text-slate-400 border-slate-800',
        text: 'TIDAK ADA DATA',
        color: 'text-slate-400',
        shadow: ''
      };
    }

    // PERBAIKAN: Gunakan String() agar aman
    const statusLower = String(status).toLowerCase(); 
    
    if (statusLower.includes('aman')) {
      return {
        icon: ShieldCheck,
        bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
        text: status.toUpperCase(),
        color: 'text-emerald-400',
        shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.15)]'
      };
    } else if (statusLower.includes('berisiko') || statusLower.includes('beresiko')) {
      return {
        icon: ShieldX,
        bg: 'bg-red-950/60 text-red-400 border-red-500/30',
        text: status.toUpperCase(),
        color: 'text-red-400',
        shadow: 'shadow-[0_0_25px_rgba(239,68,68,0.15)] animate-pulse'
      };
    }

    return {
      icon: Activity,
      bg: 'bg-slate-900 text-slate-400 border-slate-800',
      text: String(status).toUpperCase(),
      color: 'text-slate-400',
      shadow: ''
    };
  };

  const statusBadge = getStatusBadge(lastRecord?.status_air);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Monitoring Dashboard</h2>
          <p className="text-xs text-slate-400">Ringkasan kondisi air tambak dan metrik operasional saat ini</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="px-4 py-2 text-xs font-semibold text-cyan-400 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl transition-all self-start md:self-auto"
        >
          Segarkan Data
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Grid Ringkasan Metrik */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? 'lg:grid-cols-3' : ''} gap-6`}>
        {isAdmin && (
          <MetricCard
            title="Total Terdaftar Pengguna"
            value={metrics.total_users}
            icon={Users}
            description="Seluruh pengguna sistem"
            colorClass="purple"
          />
        )}
        <MetricCard
          title="Total Riwayat Pengukuran"
          value={metrics.total_pengukuran}
          icon={Database}
          description="Total data air tercatat"
          colorClass="cyan"
        />
        <MetricCard
          title="Pengukuran Hari Ini"
          value={metrics.pengukuran_hari_ini}
          icon={Calendar}
          description="Data baru masuk hari ini"
          colorClass="emerald"
        />
      </div>

      {/* Layout Status Utama & Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Status Air Terakhir & Rekomendasi */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className={`glass rounded-2xl p-6 border flex-1 flex flex-col justify-between ${statusBadge.bg} ${statusBadge.shadow}`}>
            
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Air Terkini</span>
              
              {/* Badge Status */}
              <div className="mt-4 flex items-center gap-3">
                <div className={`p-3 rounded-2xl bg-slate-950/80 border border-slate-800 ${statusBadge.color}`}>
                  <StatusIcon className="h-8 w-8" />
                </div>
                <div>
                  <h4 className={`text-xl font-extrabold tracking-wide ${statusBadge.color}`}>{statusBadge.text}</h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Diukur: {lastRecord ? new Date(lastRecord.tanggal_pengukuran).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}
                  </p>
                </div>
              </div>

              {/* Rekomendasi Tindakan */}
              <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-mono">Rekomendasi Tindakan</span>
                <p className="mt-1.5 text-xs text-slate-200 leading-relaxed font-medium whitespace-pre-line">
                  {lastRecord ? lastRecord.rekomendasi : 'Silakan input data pengukuran pertama Anda untuk melihat status kelayakan air tambak.'}
                </p>
              </div>
            </div>

            {/* Nilai Parameter yang Terkait */}
            {lastRecord && (
              <div className="mt-6 pt-6 border-t border-slate-800/60 grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('ph', lastRecord.ph)}`}>
                  <Droplets className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-400">pH Air</span>
                  <span className="text-sm font-bold font-mono mt-0.5">{lastRecord.ph}</span>
                </div>
                <div className={`p-3 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('suhu', lastRecord.suhu)}`}>
                  <Thermometer className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-400">Suhu</span>
                  <span className="text-sm font-bold font-mono mt-0.5">{lastRecord.suhu}°C</span>
                </div>
                <div className={`p-3 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('do', lastRecord.dissolved_oxygen)}`}>
                  <Wind className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-400">DO</span>
                  <span className="text-sm font-bold font-mono mt-0.5">{lastRecord.dissolved_oxygen} mg/L</span>
                </div>
                <div className={`p-3 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('kekeruhan', lastRecord.kekeruhan)}`}>
                  <Eye className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-400">Kekeruhan</span>
                  <span className="text-sm font-bold font-mono mt-0.5">{lastRecord.kekeruhan} NTU</span>
                </div>
                <div className={`p-3 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('nitrate', lastRecord.nitrate)}`}>
                  <Waves className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-400">Nitrat</span>
                  <span className="text-sm font-bold font-mono mt-0.5">{lastRecord.nitrate} mg/L</span>
                </div>
                <div className={`p-3 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('amonia', lastRecord.amonia)}`}>
                  <Activity className="h-4 w-4 mb-1" />
                  <span className="text-[10px] font-semibold text-slate-400">Amonia</span>
                  <span className="text-sm font-bold font-mono mt-0.5">{lastRecord.amonia} mg/L</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visualisasi Grafik Chart.js */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <WaterChart data={historyData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
