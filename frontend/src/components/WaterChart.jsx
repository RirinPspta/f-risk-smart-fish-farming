import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const WaterChart = ({ data = [] }) => {
  const [selectedParam, setSelectedParam] = useState('ph');

  // Urutkan data secara kronologis (tanggal terlama ke terbaru) untuk grafik
  const sortedData = [...data].reverse();

  const parameters = {
    ph: {
      label: 'pH Air',
      color: '6, 182, 212', // cyan
      unit: '',
      minNormal: 6.5,
      maxNormal: 8.5,
      field: 'ph',
    },
    suhu: {
      label: 'Suhu Air',
      color: '244, 63, 94', // rose
      unit: '°C',
      minNormal: 25,
      maxNormal: 30,
      field: 'suhu',
    },
    dissolved_oxygen: {
      label: 'Dissolved Oxygen (DO)',
      color: '16, 185, 129', // emerald
      unit: 'mg/L',
      minNormal: 4.0,
      maxNormal: null,
      field: 'dissolved_oxygen',
    },
    kekeruhan: {
      label: 'Kekeruhan (Turbidity)',
      color: '245, 158, 11', // amber
      unit: 'NTU',
      minNormal: 30,
      maxNormal: 80,
      field: 'kekeruhan',
    },
    nitrate: {
      label: 'Nitrat (Nitrate)',
      color: '99, 102, 241', // indigo
      unit: 'PPM',
      minNormal: 0,
      maxNormal: 50.0,
      field: 'nitrate',
    },
    amonia: {
      label: 'Amonia (Ammonia)',
      color: '139, 92, 246', // violet
      unit: 'mg/L',
      minNormal: 0,
      maxNormal: 1.0,
      field: 'amonia',
    },
  };

  const currentParam = parameters[selectedParam];
  const labels = sortedData.map((item) => {
    // Format tanggal menjadi tanggal lokal yang ringkas
    const date = new Date(item.tanggal_pengukuran);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  });
  
  const datasetValues = sortedData.map((item) => item[currentParam.field]);

  const chartData = {
    labels,
    datasets: [
      {
        label: currentParam.label,
        data: datasetValues,
        borderColor: `rgba(${currentParam.color}, 1)`,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          
          // Efek gradient fill di bawah line
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, `rgba(${currentParam.color}, 0.25)`);
          gradient.addColorStop(1, `rgba(${currentParam.color}, 0.0)`);
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: `rgba(${currentParam.color}, 1)`,
        pointBorderColor: '#0f172a',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
    ],
  };

  // Konfigurasi Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: `rgba(${currentParam.color}, 0.4)`,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => ` ${context.parsed.y} ${currentParam.unit}`,
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(51, 65, 85, 0.2)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'monospace',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="glass rounded-2xl p-6 border border-slate-800/80 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Grafik Monitoring Kualitas Air</h3>
          <p className="text-xs text-slate-400">Tren parameter air tambak dalam 10 pengukuran terakhir</p>
        </div>
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {Object.keys(parameters).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedParam(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedParam === key
                  ? 'bg-slate-800 text-cyan-400 border border-cyan-500/20 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {key === 'dissolved_oxygen' ? 'DO' : key === 'ph' ? 'pH' : key === 'nitrate' ? 'Nitrat' : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-80 w-full">
        {sortedData.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500 text-sm italic">
            Belum ada data pengukuran untuk ditampilkan pada grafik.
          </div>
        )}
      </div>

      {/* Informasi Batas Normal Parameter Aktif */}
      <div className="mt-4 p-4 rounded-xl bg-slate-950/40 border border-slate-900 text-xs text-slate-400 flex flex-wrap gap-x-8 gap-y-2 justify-between">
        <div>
          <span className="font-semibold text-slate-300">Batas Normal {currentParam.label}:</span>{' '}
          {currentParam.minNormal !== null && currentParam.maxNormal !== null && (
            <span className="font-mono text-cyan-400">{currentParam.minNormal} - {currentParam.maxNormal} {currentParam.unit}</span>
          )}
          {currentParam.minNormal !== null && currentParam.maxNormal === null && (
            <span className="font-mono text-emerald-400">&gt; {currentParam.minNormal} {currentParam.unit}</span>
          )}
          {currentParam.minNormal === null && currentParam.maxNormal !== null && (
            <span className="font-mono text-amber-400">&lt; {currentParam.maxNormal} {currentParam.unit}</span>
          )}
        </div>
        <div>
          <span className="font-semibold text-slate-300">Parameter Terkini:</span>{' '}
          <span className="font-mono text-slate-200">
            {data.length > 0 ? `${data[0][currentParam.field]} ${currentParam.unit}` : '-'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WaterChart;
