import { Link } from 'react-router-dom';
import { 
  Fish, 
  Droplets, 
  TrendingUp, 
  ShieldAlert, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Database,
  Layers
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-900">
      
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 border-b border-slate-900/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Fish className="h-8 w-8 text-cyan-400 animate-pulse-cyan" />
          <div>
            <span className="font-bold text-lg tracking-wider text-cyan-400">F-RISK</span>
            <p className="text-[10px] text-slate-400 -mt-1 tracking-widest font-mono">WATER MONITOR</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-colors">
            Masuk
          </Link>
          <Link to="/register" className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all duration-300 hover:shadow-cyan-500/20">
            Daftar Sekarang
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-4xl mx-auto">
          <span className="px-3 py-1 rounded-full border border-cyan-800/60 bg-cyan-950/40 text-cyan-400 text-xs font-mono tracking-wider uppercase">
            IOT & Web Framework Technology
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-indigo-300 bg-clip-text text-transparent leading-none">
            F-RISK Water Quality Monitoring System
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Optimalkan hasil panen tambak ikan Anda dengan pemantauan kualitas air secara real-time. Dapatkan diagnosis otomatis dan rekomendasi tindakan berbasis data ilmiah.
          </p>
          
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="group px-6 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/10 flex items-center gap-2 transition-all duration-300">
              Mulai Monitor Tambak
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#tentang" className="px-6 py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 font-semibold text-sm transition-all">
              Pelajari Fitur
            </a>
          </div>
        </div>
      </section>

      {/* Tentang Section */}
      <section id="tentang" className="py-20 px-6 border-t border-slate-900 bg-slate-950/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest font-mono">Tentang Sistem</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-100">Solusi Cerdas Budidaya Ikan Modern</h2>
            <p className="mt-4 text-slate-400 leading-relaxed text-sm sm:text-base">
              F-RISK Water Quality Monitoring System adalah platform terintegrasi yang membantu petambak memonitor kondisi air tambak secara presisi. Kualitas air tambak sangat memengaruhi tingkat kelangsungan hidup ikan (Survival Rate). Dengan platform ini, Anda tidak perlu lagi menebak-nebak kondisi air.
            </p>
            <p className="mt-4 text-slate-400 leading-relaxed text-sm sm:text-base">
              Sistem ini menganalisis 6 parameter utama secara simultan (pH, Suhu, DO, Kekeruhan, Nitrat, dan Amonia) untuk merumuskan status kelayakan air secara instan: <strong>Aman</strong> atau <strong>Beresiko</strong>, lengkap dengan rekomendasi praktis penanganannya.
            </p>
          </div>
          <div className="relative p-8 rounded-2xl glass border border-slate-800 flex flex-col gap-6 shadow-2xl">
            <div className="absolute -top-4 -right-4 h-24 w-24 bg-indigo-500/10 rounded-full blur-xl"></div>
            
            <div className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Decoupled Architecture</h3>
                <p className="text-xs text-slate-400 mt-1">Dibuat menggunakan Laravel 12 REST API untuk backend yang andal dan React.js SPA untuk antarmuka yang cepat.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Relational Database Storage</h3>
                <p className="text-xs text-slate-400 mt-1">Seluruh data riwayat pengukuran disimpan secara relasional dan aman dalam DBMS MySQL.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur Utama Section */}
      <section className="py-20 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest font-mono">Fitur Utama</span>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-100">Dirancang Khusus Untuk Pembudidaya</h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm">Kemudahan pemantauan tambak dalam satu dashboard terintegrasi.</p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass p-8 rounded-2xl text-left border border-slate-800 transition-all duration-300 hover:border-cyan-500/20">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit">
                <Droplets className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-bold text-slate-200">6 Sensor Parameter</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Mencatat dan memantau parameter krusial air tambak secara lengkap: keasaman (pH), suhu air (°C), Oksigen Terlarut (DO), kekeruhan air (Turbidity), Nitrat (Nitrate), dan Amonia (Ammonia).
              </p>
            </div>

            <div className="glass p-8 rounded-2xl text-left border border-slate-800 transition-all duration-300 hover:border-cyan-500/20">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-bold text-slate-200">Status Kelayakan Otomatis</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Logika sistem otomatis menentukan status kesehatan air berdasarkan batas aman standar budidaya perikanan nasional, mencegah kematian massal ikan.
              </p>
            </div>

            <div className="glass p-8 rounded-2xl text-left border border-slate-800 transition-all duration-300 hover:border-cyan-500/20">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-bold text-slate-200">Grafik Chart.js Interaktif</h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Visualisasi tren data sensor air tambak dari waktu ke waktu guna membantu analisis fluktuasi parameter di kala cuaca berubah ekstrem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistik Section */}
      <section className="py-16 px-6 border-t border-slate-900 bg-slate-950/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <span className="block text-4xl font-extrabold text-cyan-400 font-mono">100%</span>
              <span className="block text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Sistem Real-Time</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-indigo-400 font-mono">5+</span>
              <span className="block text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Parameter Vital</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-emerald-400 font-mono">&lt; 1 Detik</span>
              <span className="block text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Respon Analisis</span>
            </div>
            <div>
              <span className="block text-4xl font-extrabold text-amber-400 font-mono">99.9%</span>
              <span className="block text-xs text-slate-400 mt-1 uppercase tracking-widest font-mono">Uptime Server</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 border-t border-slate-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest font-mono">Hubungi Kami</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-100">Ada Pertanyaan Mengenai Sistem?</h2>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Tim support teknis kami siap mendampingi Anda dalam melakukan instalasi, setup perangkat sensor, atau menjawab keraguan seputar integrasi API F-RISK.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                  <Mail className="h-5 w-5" />
                </div>
                <span className="text-sm font-mono">support@smartfishing.co.id</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-sm font-mono">+62 821-3456-7890</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-sm">Gedung Riset Teknologi Perikanan, Blok B4, Jakarta</span>
              </div>
            </div>
          </div>

          <form className="glass p-8 rounded-2xl border border-slate-800 space-y-4 flex flex-col" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
              <input type="text" placeholder="Masukkan nama Anda" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input type="email" placeholder="contoh@email.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Pesan Anda</label>
              <textarea rows="4" placeholder="Tuliskan pertanyaan Anda..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"></textarea>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 text-slate-950 font-bold text-xs transition-all duration-300 hover:from-cyan-500 hover:to-cyan-400 shadow-md">
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-500 font-mono bg-slate-950">
        &copy; {new Date().getFullYear()} F-RISK Water Quality Monitoring System. UAS Pemrograman Web Framework.
      </footer>
    </div>
  );
};

export default LandingPage;
