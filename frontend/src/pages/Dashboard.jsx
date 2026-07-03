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
  Waves,
  FileText
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
      
      const metricsRes = await api.get('/dashboard');
      setMetrics(metricsRes.data);

      const historyRes = await api.get('/water-qualities');
      let processedData = historyRes.data;

      if (processedData.length > 0) {
        processedData.sort((a, b) => new Date(b.tanggal_pengukuran) - new Date(a.tanggal_pengukuran));

        if (isAdmin) {
          const groupedData = processedData.reduce((acc, curr) => {
            const date = curr.tanggal_pengukuran;
            if (!acc[date]) {
              acc[date] = { count: 0, ph: 0, suhu: 0, dissolved_oxygen: 0, kekeruhan: 0, nitrate: 0, amonia: 0, tanggal_pengukuran: date };
            }
            acc[date].count += 1;
            acc[date].ph += parseFloat(curr.ph);
            acc[date].suhu += parseFloat(curr.suhu);
            acc[date].dissolved_oxygen += parseFloat(curr.dissolved_oxygen);
            acc[date].kekeruhan += parseFloat(curr.kekeruhan);
            acc[date].nitrate += parseFloat(curr.nitrate);
            acc[date].amonia += parseFloat(curr.amonia);
            return acc;
          }, {});

          processedData = Object.values(groupedData).map(item => ({
            tanggal_pengukuran: item.tanggal_pengukuran,
            ph: Number((item.ph / item.count).toFixed(2)),
            suhu: Number((item.suhu / item.count).toFixed(2)),
            dissolved_oxygen: Number((item.dissolved_oxygen / item.count).toFixed(2)),
            kekeruhan: Number((item.kekeruhan / item.count).toFixed(2)),
            nitrate: Number((item.nitrate / item.count).toFixed(2)),
            amonia: Number((item.amonia / item.count).toFixed(2)),
          }));
          
          processedData.sort((a, b) => new Date(b.tanggal_pengukuran) - new Date(a.tanggal_pengukuran));
        } else {
          const seenDates = new Set();
          processedData = processedData.filter(item => {
            if (seenDates.has(item.tanggal_pengukuran)) return false;
            seenDates.add(item.tanggal_pengukuran);
            return true;
          });
        }
      }

      setHistoryData(processedData.slice(0, 10));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setErrorMsg('Gagal memuat data dashboard.');
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

  const checkParamStatus = (name, val) => {
    let status = 'ideal';
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
    
    if (status === 'critical') return 'bg-red-950/40 text-red-400 border border-red-500/20 animate-pulse';
    else if (status === 'warning') return 'bg-amber-950/40 text-amber-400 border border-amber-500/20';
    return 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';
  };

  const getStatusBadge = (status) => {
    if (!status) return { icon: Activity, bg: 'bg-slate-900 text-slate-400 border-slate-800', text: 'TIDAK ADA DATA', color: 'text-slate-400', shadow: '' };

    const statusLower = String(status).toLowerCase(); 
    if (statusLower.includes('aman')) return { icon: ShieldCheck, bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30', text: status.toUpperCase(), color: 'text-emerald-400', shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.15)]' };
    else if (statusLower.includes('berisiko') || statusLower.includes('beresiko')) return { icon: ShieldX, bg: 'bg-red-950/60 text-red-400 border-red-500/30', text: status.toUpperCase(), color: 'text-red-400', shadow: 'shadow-[0_0_25px_rgba(239,68,68,0.15)] animate-pulse' };

    return { icon: Activity, bg: 'bg-slate-900 text-slate-400 border-slate-800', text: String(status).toUpperCase(), color: 'text-slate-400', shadow: '' };
  };

  const statusBadge = getStatusBadge(lastRecord?.status_air);
  const StatusIcon = statusBadge.icon;

  // PERBAIKAN: Logika regex untuk merapikan spasi/gap pada Rekomendasi
  const cleanedRekomendasi = lastRecord?.rekomendasi
    ? lastRecord.rekomendasi
        .replace(/^(✅|⚠️)?\s*STATUS AIR:.*?\n+/i, '') // Menghapus header status air & emoji
        .replace(/[✅⚠️]/g, '') // Menghapus sisa emoji jika ada di tengah teks
        .replace(/Kondisi air masih aman untuk ikan Nila, namun beberapa parameter perlu mulai diperhatikan:\s*/g, 'Kondisi air masih aman untuk ikan Nila, namun beberapa parameter perlu mulai diperhatikan:\n\n') // Fallback fix untuk teks spesifik
        .replace(/:\s*(?=-)/g, ':\n\n') // Fix universal: Beri gap/enter ganda antara kalimat berakhiran titik dua (:) dan list berawalan strip (-)
        .trim()
    : 'Silakan input data pengukuran pertama Anda untuk melihat status kelayakan air tambak.';

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
          <MetricCard title="Total Terdaftar Pengguna" value={metrics.total_users} icon={Users} description="Seluruh pengguna sistem" colorClass="purple" />
        )}
        <MetricCard title="Total Riwayat Pengukuran" value={metrics.total_pengukuran} icon={Database} description="Total data air tercatat" colorClass="cyan" />
        <MetricCard title="Pengukuran Hari Ini" value={metrics.pengukuran_hari_ini} icon={Calendar} description="Data baru masuk hari ini" colorClass="emerald" />
      </div>

      {/* Layout Status Utama & Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* KOLOM KIRI */}
        <div className={`lg:col-span-1 h-full w-full glass rounded-2xl p-6 border flex flex-col justify-between ${statusBadge.bg} ${statusBadge.shadow}`}>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Status Air Terkini</span>
            
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
          </div>

          {/* Nilai Parameter */}
          {lastRecord && (
            <div className="mt-8 pt-8 border-t border-slate-800/60 grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('ph', lastRecord.ph)}`}>
                <Droplets className="h-5 w-5 mb-1.5" />
                <span className="text-xs font-semibold text-slate-400">pH Air</span>
                <span className="text-base font-bold font-mono mt-1">{lastRecord.ph}</span>
              </div>
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('suhu', lastRecord.suhu)}`}>
                <Thermometer className="h-5 w-5 mb-1.5" />
                <span className="text-xs font-semibold text-slate-400">Suhu</span>
                <span className="text-base font-bold font-mono mt-1">{lastRecord.suhu}°C</span>
              </div>
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('do', lastRecord.dissolved_oxygen)}`}>
                <Wind className="h-5 w-5 mb-1.5" />
                <span className="text-xs font-semibold text-slate-400">DO</span>
                <span className="text-base font-bold font-mono mt-1">{lastRecord.dissolved_oxygen} mg/L</span>
              </div>
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('kekeruhan', lastRecord.kekeruhan)}`}>
                <Eye className="h-5 w-5 mb-1.5" />
                <span className="text-xs font-semibold text-slate-400">Kekeruhan</span>
                <span className="text-base font-bold font-mono mt-1">{lastRecord.kekeruhan} NTU</span>
              </div>
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('nitrate', lastRecord.nitrate)}`}>
                <Waves className="h-5 w-5 mb-1.5" />
                <span className="text-xs font-semibold text-slate-400">Nitrat</span>
                <span className="text-base font-bold font-mono mt-1">{lastRecord.nitrate} mg/L</span>
              </div>
              <div className={`p-4 rounded-xl flex flex-col items-center justify-center text-center ${checkParamStatus('amonia', lastRecord.amonia)}`}>
                <Activity className="h-5 w-5 mb-1.5" />
                <span className="text-xs font-semibold text-slate-400">Amonia</span>
                <span className="text-base font-bold font-mono mt-1">{lastRecord.amonia} mg/L</span>
              </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN (Grafik) */}
        {/* Ditambahkan h-full dan [&>*]:h-full untuk memaksa WaterChart meregang sepenuhnya */}
        <div className="lg:col-span-2 h-full w-full flex flex-col min-h-[400px] [&>*]:h-full">
          <WaterChart data={historyData} />
        </div>

      </div>

      {/* BARIS BAWAH: Kotak Rekomendasi */}
      <div className="glass rounded-2xl p-6 border border-slate-800/80 bg-slate-900/40 shadow-lg">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Detail & Rekomendasi Tindakan
        </span>
        <p className="mt-4 text-sm text-slate-200 leading-relaxed font-medium whitespace-pre-line">
          {cleanedRekomendasi}
        </p>
      </div>

    </div>
  );
};

export default Dashboard;