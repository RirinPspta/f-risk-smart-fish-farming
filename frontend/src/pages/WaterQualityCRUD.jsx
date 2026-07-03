import { useState, useEffect, useCallback, useRef } from 'react';
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
  FileText,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
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

// REVISI: Fungsi format rekomendasi
const formatRekomendasi = (text) => {
  if (!text) return '-';
  
  // 1. Hapus format "STATUS AIR: XX%"
  let cleaned = text.replace(/STATUS AIR:[^%]*%\s*/i, '');
  
  // 2. Hapus emoji ✅ dan ⚠️
  cleaned = cleaned.replace(/[✅⚠️]/g, '');
  
  // 3. Tambahkan 1 baris kosong (enter ganda \n\n) KHUSUS setelah kalimat "Kondisi air masih aman..."
  cleaned = cleaned.replace(
    /Kondisi air masih aman untuk ikan Nila, namun beberapa parameter perlu mulai diperhatikan:\s*/g, 
    'Kondisi air masih aman untuk ikan Nila, namun beberapa parameter perlu mulai diperhatikan:\n\n'
  );
  
  return cleaned.trim();
};

// ==========================================
// KOMPONEN CUSTOM DATE PICKER (KALENDER UI)
// ==========================================
const CustomDatePicker = ({ value, onChange, placeholder = "Pilih Tanggal" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const popoverRef = useRef(null);

  // Tutup kalender jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${year}-${month}-${dayStr}`);
    setIsOpen(false);
  };

  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="relative w-full" ref={popoverRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl px-3 py-2 text-xs text-slate-200 cursor-pointer flex items-center justify-between transition-colors h-[38px]"
      >
        <span className={value ? "text-slate-200" : "text-slate-500"}>
          {value ? formatLocalDate(value) : placeholder}
        </span>
        <CalendarIcon className="h-4 w-4 text-slate-400" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl shadow-black/50 w-72">
          <div className="flex justify-between items-center mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="font-semibold text-slate-200 text-sm">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-[10px] font-semibold text-slate-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {emptyDays.map(empty => (
              <div key={`empty-${empty}`} className="h-8 w-8"></div>
            ))}
            {days.map(day => {
              const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = value === dateString;
              const isToday = getLocalDateString() === dateString;

              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`h-8 w-full flex items-center justify-center rounded-lg text-xs font-medium transition-all
                    ${isSelected 
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                      : isToday 
                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
// ==========================================

const WaterQualityCRUD = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [statusAirFilter, setStatusAirFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [penginputFilter, setPenginputFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const [expandedRowIds, setExpandedRowIds] = useState(new Set());

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

  useEffect(() => {
    setCurrentPage(1);
  }, [statusAirFilter, startDate, penginputFilter]);

  const fetchRecords = useCallback(async (signal) => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await api.get('/water-qualities', {
        params: {
          status_air: statusAirFilter,
          start_date: startDate,
          penginput: penginputFilter
        },
        signal: signal
      });
      setRecords(response.data);
    } catch (error) {
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        return;
      }
      console.error('Error fetching records:', error);
      setErrorMsg('Gagal memuat data kualitas air.');
    } finally {
      setLoading(false);
    }
  }, [statusAirFilter, startDate, penginputFilter]);

  useEffect(() => {
    const controller = new AbortController();
    
    const delayTimer = setTimeout(() => {
      fetchRecords(controller.signal);
    }, 300);

    return () => {
      clearTimeout(delayTimer);
      controller.abort();
    };
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
    setPenginputFilter('');
  };

  const getStatusPill = (status) => {
    if (!status) return 'bg-slate-900 text-slate-400 border border-slate-800';
    const statusLower = String(status).toLowerCase(); 
    if (statusLower.includes('aman')) {
      return 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20';
    }
    if (statusLower.includes('berisiko') || statusLower.includes('beresiko')) {
      return 'bg-red-950/50 text-red-400 border border-red-500/20 animate-pulse';
    }
    return 'bg-slate-900 text-slate-400 border border-slate-800';
  };

  const toggleExpand = (id) => {
    const newSet = new Set(expandedRowIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRowIds(newSet);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(records.length / recordsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
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

      {/* Alerts */}
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
      <div className="glass rounded-2xl p-6 border border-slate-800/80 relative z-50">
        <div className="flex items-center gap-2 mb-4 text-cyan-400 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filter & Pencarian Riwayat
        </div>
        
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${isAdmin ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4`}>
          {isAdmin && (
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1.5">Penginput</label>
              <input
                type="text"
                placeholder="Cari nama penginput..."
                value={penginputFilter}
                onChange={(e) => setPenginputFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">Tanggal</label>
            <CustomDatePicker 
              value={startDate} 
              onChange={(date) => setStartDate(date)} 
              placeholder="dd/mm/yyyy"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1.5">Status Air</label>
            <select
              value={statusAirFilter}
              onChange={(e) => setStatusAirFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-800 focus:border-cyan-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-200 h-[38px]"
            >
              <option value="">Semua Status</option>
              <option value="Aman">Aman</option>
              <option value="Beresiko">Beresiko</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-3 py-2 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-all h-[38px]"
            >
              Bersihkan Filter
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg relative z-10">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : records.length > 0 ? (
          <div className="flex flex-col">
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
                  {currentRecords.map((record) => {
                    const isExpanded = expandedRowIds.has(record.id);
                    const formattedRekomendasi = formatRekomendasi(record.rekomendasi);
                    
                    const linesCount = formattedRekomendasi.split('\n').length;
                    const needsExpandButton = formattedRekomendasi.length > 140 || linesCount > 3;

                    return (
                      <tr key={record.id} className="hover:bg-slate-900/30 transition-colors">
                        {isAdmin && (
                          <td className="p-4 font-semibold text-cyan-300 align-top">
                            {record.user?.name || 'Sistem'}
                          </td>
                        )}
                        <td className="p-4 whitespace-nowrap font-mono align-top">
                          {formatLocalDate(record.tanggal_pengukuran)}
                        </td>
                        <td className="p-4 font-mono align-top">{record.ph}</td>
                        <td className="p-4 font-mono align-top">{record.suhu}°C</td>
                        <td className="p-4 font-mono align-top">{record.dissolved_oxygen} mg/L</td>
                        <td className="p-4 font-mono align-top">{record.kekeruhan} NTU</td>
                        <td className="p-4 font-mono align-top">{record.nitrate} PPM</td>
                        <td className="p-4 font-mono align-top">{record.amonia} mg/L</td>
                        <td className="p-4 whitespace-nowrap align-top">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${getStatusPill(record.status_air)}`}>
                            {record.status_air}
                          </span>
                        </td>
                        <td className="p-4 align-top">
                          <div className="w-64 lg:w-72">
                            <div 
                              className={`text-slate-400 leading-relaxed transition-all whitespace-pre-line ${
                                isExpanded ? '' : 'line-clamp-3'
                              }`} 
                            >
                              {formattedRekomendasi}
                            </div>
                            
                            {needsExpandButton && (
                              <button
                                onClick={() => toggleExpand(record.id)}
                                className="text-cyan-500 hover:text-cyan-400 text-[10px] font-bold mt-1.5 focus:outline-none transition-colors"
                              >
                                {isExpanded ? 'Sembunyikan' : 'Baca selengkapnya...'}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center whitespace-nowrap align-top">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditModal(record)}
                              className="p-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/20 transition-all"
                              title="Edit Pengukuran"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            
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
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 items-center border-t border-slate-800 bg-slate-900/40 px-4 py-3 sm:px-6 gap-4">
                <div className="text-[11px] text-slate-400 justify-self-center md:justify-self-start order-2 md:order-1">
                  Menampilkan <span className="font-semibold text-cyan-400">{indexOfFirstRecord + 1}</span> - <span className="font-semibold text-cyan-400">{Math.min(indexOfLastRecord, records.length)}</span> dari <span className="font-semibold text-slate-200">{records.length}</span> data
                </div>
                
                <div className="flex items-center gap-1.5 justify-center order-1 md:order-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 text-xs font-semibold hover:text-cyan-400 hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="text-slate-500 text-xs font-semibold px-1">...</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-semibold transition-all ${
                            currentPage === page 
                              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                              : 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 text-xs font-semibold hover:text-cyan-400 hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="hidden md:block order-3"></div>
              </div>
            )}
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
              
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tanggal Pengukuran</label>
                <CustomDatePicker 
                  value={formData.tanggal_pengukuran} 
                  onChange={(date) => setFormData({...formData, tanggal_pengukuran: date})} 
                />
                {formErrors.tanggal_pengukuran && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.tanggal_pengukuran}</span>
                )}
              </div>

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

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs font-semibold flex items-center gap-2 mt-4">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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