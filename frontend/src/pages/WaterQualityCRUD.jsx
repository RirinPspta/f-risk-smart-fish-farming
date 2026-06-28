import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  Check, 
  X,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
const getLocalDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatLocalDate = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};

const WaterQualityCRUD = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Pencarian & Filter States
  const [statusAirFilter, setStatusAirFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    tanggal_pengukuran: getLocalDateString(),
    ph: '',
    suhu: '',
    dissolved_oxygen: '',
    kekeruhan: '',
    nitrate: '',
    amonia: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await api.get('/water-qualities', {
        params: {
          status_air: statusAirFilter,
          start_date: startDate,
          end_date: endDate
        }
      });
      setRecords(response.data);
    } catch (error) {
      console.error('Error fetching records:', error);
      setErrorMsg('Gagal memuat data kualitas air.');
    } finally {
      setLoading(false);
    }
  }, [statusAirFilter, startDate, endDate]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const validateForm = () => {
    const errors = {};
    const phVal = parseFloat(formData.ph);
    const suhuVal = parseFloat(formData.suhu);
    const doVal = parseFloat(formData.dissolved_oxygen);
    const kekeruhanVal = parseFloat(formData.kekeruhan);
    const nitrateVal = parseFloat(formData.nitrate);
    const amoniaVal = parseFloat(formData.amonia);

    if (!formData.tanggal_pengukuran) errors.tanggal_pengukuran = 'Tanggal wajib diisi.';
    
    if (isNaN(phVal) || phVal < 0 || phVal > 14) {
      errors.ph = 'pH harus di antara 0 dan 14.';
    }
    if (isNaN(suhuVal) || suhuVal < 0 || suhuVal > 50) {
      errors.suhu = 'Suhu harus di antara 0 dan 50°C.';
    }
    if (isNaN(doVal) || doVal < 0 || doVal > 20) {
      errors.dissolved_oxygen = 'DO harus di antara 0 dan 20 mg/L.';
    }
    if (isNaN(kekeruhanVal) || kekeruhanVal < 0) {
      errors.kekeruhan = 'Kekeruhan tidak boleh negatif.';
    }
    if (isNaN(nitrateVal) || nitrateVal < 0) {
      errors.nitrate = 'Nitrat tidak boleh negatif.';
    }
    if (isNaN(amoniaVal) || amoniaVal < 0) {
      errors.amonia = 'Amonia tidak boleh negatif.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Ganti koma dengan titik untuk input numerik agar tidak gagal di backend Laravel
    const sanitizedValue = (name !== 'tanggal_pengukuran')
      ? value.replace(',', '.')
      : value;
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      tanggal_pengukuran: getLocalDateString(),
      ph: '',
      suhu: '',
      dissolved_oxygen: '',
      kekeruhan: '',
      nitrate: '',
      amonia: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setModalMode('edit');
    setCurrentRecordId(record.id);
    setFormData({
      tanggal_pengukuran: record.tanggal_pengukuran,
      ph: record.ph.toString(),
      suhu: record.suhu.toString(),
      dissolved_oxygen: record.dissolved_oxygen.toString(),
      kekeruhan: record.kekeruhan.toString(),
      nitrate: record.nitrate.toString(),
      amonia: record.amonia.toString(),
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!validateForm()) return;

    try {
      if (modalMode === 'create') {
        const res = await api.post('/water-qualities', formData);
        setSuccessMsg(res.data.message);
      } else {
        const res = await api.put(`/water-qualities/${currentRecordId}`, formData);
        setSuccessMsg(res.data.message);
      }
      setIsModalOpen(false);
      fetchRecords();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Submit error:', error);
      setErrorMsg(error.response?.data?.message || 'Gagal menyimpan data.');
    }
  };

  const confirmDelete = (id) => {
    setRecordToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!recordToDelete) return;
    setIsDeleteModalOpen(false);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.delete(`/water-qualities/${recordToDelete}`);
      setSuccessMsg(res.data.message);
      fetchRecords();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMsg(error.response?.data?.message || 'Gagal menghapus data.');
    } finally {
      setRecordToDelete(null);
    }
  };

  const clearFilters = () => {
    setStatusAirFilter('');
    setStartDate('');
    setEndDate('');
  };

  const getStatusPill = (status) => {
    if (!status) return 'bg-slate-900 text-slate-400 border border-slate-800';
    
    // PERBAIKAN: Gunakan String() agar kebal dari error jika data bukan teks murni
    const statusLower = String(status).toLowerCase(); 
    
    if (statusLower.includes('aman')) {
      return 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20';
    }
    if (statusLower.includes('berisiko') || statusLower.includes('beresiko')) {
      return 'bg-red-950/50 text-red-400 border border-red-500/20 animate-pulse';
    }
    return 'bg-slate-900 text-slate-400 border border-slate-800';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Manajemen Data Kualitas Air</h2>
          <p className="text-xs text-slate-400">Kelola riwayat pengukuran air tambak, pantau status, dan diagnosa otomatis</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/10 transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Tambah Pengukuran
        </button>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="glass rounded-2xl p-6 border border-slate-800/80">
        <div className="flex items-center gap-2 mb-4 text-cyan-400 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filter & Pencarian Riwayat
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          
          {/* Filter Status Air */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">Status Air</label>
            <select
              value={statusAirFilter}
              onChange={(e) => setStatusAirFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200"
            >
              <option value="">Semua Status</option>
              <option value="Aman">Aman</option>
              <option value="Beresiko">Beresiko</option>
            </select>
          </div>

          {/* Tanggal Mulai */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">Tanggal Mulai</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200"
            />
          </div>

          {/* Tanggal Selesai */}
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">Tanggal Selesai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200"
            />
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-3 py-2 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-all"
            >
              Bersihkan Filter
            </button>
          </div>

        </div>
      </div>

      {/* Data Table */}
      <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {isAdmin && <th className="p-4">Penginput</th>}
                  <th className="p-4">Tanggal</th>
                  <th className="p-4">pH</th>
                  <th className="p-4">Suhu</th>
                  <th className="p-4">DO</th>
                  <th className="p-4">Kekeruhan</th>
                  <th className="p-4">Nitrat</th>
                  <th className="p-4">Amonia</th>
                  <th className="p-4">Status Air</th>
                  <th className="p-4">Rekomendasi</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-900/30 transition-colors">
                    {isAdmin && (
                      <td className="p-4 font-semibold text-cyan-300">
                        {record.user?.name || 'Sistem'}
                      </td>
                    )}
                    <td className="p-4 whitespace-nowrap font-mono">
                      {formatLocalDate(record.tanggal_pengukuran)}
                    </td>
                    <td className="p-4 font-mono">{record.ph}</td>
                    <td className="p-4 font-mono">{record.suhu}°C</td>
                    <td className="p-4 font-mono">{record.dissolved_oxygen} mg/L</td>
                    <td className="p-4 font-mono">{record.kekeruhan} NTU</td>
                    <td className="p-4 font-mono">{record.nitrate} PPM</td>
                    <td className="p-4 font-mono">{record.amonia} mg/L</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${getStatusPill(record.status_air)}`}>
                        {record.status_air}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-400" title={record.rekomendasi}>
                      {record.rekomendasi}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(record)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/20 transition-all"
                          title="Edit Pengukuran"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        
                        {/* Hapus Data */}
                        <button
                          onClick={() => confirmDelete(record.id)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all"
                          title="Hapus Data"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 italic text-sm">
            Tidak ada riwayat pengukuran kualitas air tambak ditemukan.
          </div>
        )}
      </div>

      {/* CRUD Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-lg glass rounded-2xl border border-slate-800 p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-400" />
              {modalMode === 'create' ? 'Input Pengukuran Air Baru' : 'Perbarui Data Pengukuran'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Tanggal Pengukuran */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal Pengukuran</label>
                <input
                  type="date"
                  name="tanggal_pengukuran"
                  value={formData.tanggal_pengukuran}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200"
                  required
                />
                {formErrors.tanggal_pengukuran && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.tanggal_pengukuran}</span>
                )}
              </div>

              {/* pH Air */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Keasaman Air (pH) <span className="text-[10px] text-slate-500 font-mono font-normal">(normal: 6.5 - 8.5)</span></label>
                <input
                  type="number"
                  step="0.01"
                  name="ph"
                  value={formData.ph}
                  onChange={handleInputChange}
                  placeholder="Contoh: 7.2"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200"
                  required
                />
                {formErrors.ph && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.ph}</span>
                )}
              </div>

              {/* Suhu Air */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Suhu Air (°C) <span className="text-[10px] text-slate-500 font-mono font-normal">(normal: 25 - 30°C)</span></label>
                <input
                  type="number"
                  step="any"
                  name="suhu"
                  value={formData.suhu}
                  onChange={handleInputChange}
                  placeholder="Contoh: 28.5"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200"
                  required
                />
                {formErrors.suhu && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.suhu}</span>
                )}
              </div>

              {/* DO */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Dissolved Oxygen (DO) <span className="text-[10px] text-slate-500 font-mono font-normal">(normal: &gt;= 4.0 mg/L)</span></label>
                <input
                  type="number"
                  step="any"
                  name="dissolved_oxygen"
                  value={formData.dissolved_oxygen}
                  onChange={handleInputChange}
                  placeholder="Contoh: 6.5"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200"
                  required
                />
                {formErrors.dissolved_oxygen && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.dissolved_oxygen}</span>
                )}
              </div>

              {/* Kekeruhan */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kekeruhan Air (Turbidity) <span className="text-[10px] text-slate-500 font-mono font-normal">(normal: 30 - 80 NTU)</span></label>
                <input
                  type="number"
                  step="any"
                  name="kekeruhan"
                  value={formData.kekeruhan}
                  onChange={handleInputChange}
                  placeholder="Contoh: 25"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200"
                  required
                />
                {formErrors.kekeruhan && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.kekeruhan}</span>
                )}
              </div>

              {/* Nitrat */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kadar Nitrat (Nitrate) <span className="text-[10px] text-slate-500 font-mono font-normal">(normal: 0 - 50 PPM)</span></label>
                <input
                  type="number"
                  step="any"
                  name="nitrate"
                  value={formData.nitrate}
                  onChange={handleInputChange}
                  placeholder="Contoh: 12.5"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200"
                  required
                />
                {formErrors.nitrate && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.nitrate}</span>
                )}
              </div>

              {/* Amonia */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kadar Amonia (Ammonia) <span className="text-[10px] text-slate-500 font-mono font-normal">(normal: 0 - 1.0 mg/L)</span></label>
                <input
                  type="number"
                  step="any"
                  name="amonia"
                  value={formData.amonia}
                  onChange={handleInputChange}
                  placeholder="Contoh: 0.03"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-4 py-2.5 text-sm text-slate-200"
                  required
                />
                {formErrors.amonia && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.amonia}</span>
                )}
              </div>

              {/* Error Alert inside Modal */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs font-semibold flex items-center gap-2 mt-4">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 justify-end mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-slate-400 text-xs font-semibold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  {modalMode === 'create' ? 'Simpan Data' : 'Perbarui Data'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)}></div>
          
          <div className="relative w-full max-w-sm glass rounded-2xl border border-slate-800 p-6 shadow-2xl z-10 text-center">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-950/40 border border-red-800/40 text-red-500 mb-4">
              <Trash2 className="h-6 w-6 animate-pulse" />
            </div>

            <h3 className="text-lg font-bold text-slate-200 mb-2">Hapus Data Pengukuran?</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus data pengukuran kualitas air ini? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-800 hover:bg-slate-900 rounded-xl text-slate-400 text-xs font-semibold transition-all w-full"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all w-full"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterQualityCRUD;
