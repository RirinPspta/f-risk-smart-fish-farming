import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  AlertCircle, 
  Check, 
  X,
  UserPlus,
  Shield,
  Mail,
  User as UserIcon,
  Key
} from 'lucide-react';

const UserManagement = () => {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'petambak'
  });
  
  const [formErrors, setFormErrors] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMsg('Gagal memuat daftar pengguna. Akses khusus administrator.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nama lengkap wajib diisi.';
    if (!formData.email.trim()) {
      errors.email = 'Email wajib diisi.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email tidak valid.';
    }
    
    if (modalMode === 'create' && !formData.password) {
      errors.password = 'Kata sandi wajib diisi untuk pengguna baru.';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Kata sandi harus minimal 6 karakter.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'petambak'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setSelectedUserId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // biarkan kosong kecuali ingin merubah
      role: user.role
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
        const res = await api.post('/users', formData);
        setSuccessMsg(res.data.message);
      } else {
        const res = await api.put(`/users/${selectedUserId}`, formData);
        setSuccessMsg(res.data.message);
      }
      setIsModalOpen(false);
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Submit user error:', error);
      if (error.response?.data?.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        setErrorMsg(error.response?.data?.message || 'Gagal menyimpan user.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      alert('Aksi Ditolak: Anda tidak dapat menghapus akun Anda yang sedang aktif.');
      return;
    }

    if (!window.confirm('Apakah Anda yakin ingin menghapus pengguna ini beserta seluruh data historis pengukurannya?')) return;

    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.delete(`/users/${id}`);
      setSuccessMsg(res.data.message);
      fetchUsers();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (error) {
      console.error('Delete user error:', error);
      setErrorMsg(error.response?.data?.message || 'Gagal menghapus pengguna.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Kelola Pengguna Sistem</h2>
          <p className="text-xs text-slate-400">Atur akun pembudidaya ikan, kelola peran (role), dan batasi hak akses aplikasi</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-500/10 transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Success/Error alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="glass rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-cyan-500 border-t-transparent"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <th className="p-4">Nama Lengkap</th>
                  <th className="p-4">Alamat Email</th>
                  <th className="p-4">Peran (Role)</th>
                  <th className="p-4">Waktu Terdaftar</th>
                  <th className="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">{item.name} {item.id === currentUser?.id && <span className="text-[10px] text-cyan-400 font-normal font-mono">(Anda)</span>}</td>
                    <td className="p-4 font-mono text-slate-400">{item.email}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                        item.role === 'admin' 
                          ? 'bg-purple-950/40 text-purple-400 border-purple-800/20' 
                          : 'bg-cyan-950/40 text-cyan-400 border-cyan-800/20'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {new Date(item.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/20 transition-all"
                          title="Edit User"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        
                        {/* Hapus dinonaktifkan jika menghapus diri sendiri */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={item.id === currentUser?.id}
                          className={`p-1.5 rounded-lg border border-slate-800 hover:border-red-500/30 transition-all ${
                            item.id === currentUser?.id 
                              ? 'opacity-40 cursor-not-allowed text-slate-600' 
                              : 'text-slate-400 hover:text-red-400 hover:bg-red-950/20'
                          }`}
                          title="Hapus User"
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
            Tidak ada pengguna sistem ditemukan.
          </div>
        )}
      </div>

      {/* CRUD User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-md glass rounded-2xl border border-slate-800 p-6 shadow-2xl z-10">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-400" />
              {modalMode === 'create' ? 'Tambah Pengguna Baru' : 'Perbarui Akun Pengguna'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Ahmad Subardjo"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200"
                    required
                  />
                </div>
                {formErrors.name && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.name}</span>
                )}
              </div>

              {/* Alamat Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ahmad@domain.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200"
                    required
                  />
                </div>
                {formErrors.email && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.email}</span>
                )}
              </div>

              {/* Peran / Role */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Peran Akses (Role)</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 appearance-none"
                  >
                    <option value="petambak">Petambak Ikan (Akses Terbatas)</option>
                    <option value="admin">Admin Sistem (Akses Penuh)</option>
                  </select>
                </div>
              </div>

              {/* Kata Sandi */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Kata Sandi {modalMode === 'edit' && <span className="text-[10px] text-slate-500 font-normal font-mono">(Biarkan kosong untuk mempertahankan sandi lama)</span>}
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={modalMode === 'create' ? 'Minimal 6 karakter' : '••••••'}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200"
                    required={modalMode === 'create'}
                  />
                </div>
                {formErrors.password && (
                  <span className="text-[10px] text-red-400 mt-1 block">{formErrors.password}</span>
                )}
              </div>

              {/* Submit Buttons */}
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  {modalMode === 'create' ? 'Buat Akun' : 'Simpan Akun'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
