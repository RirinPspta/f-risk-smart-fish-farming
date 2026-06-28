const MetricCard = ({ title, value, icon: Icon, description, colorClass = 'cyan' }) => {
  const colorMaps = {
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-950/40 border-cyan-800/30',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      shadow: 'shadow-[0_0_15px_rgba(6,182,212,0.05)]'
    },
    purple: {
      text: 'text-purple-400',
      bg: 'bg-purple-950/40 border-purple-800/30',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.05)]'
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.05)]'
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.05)]'
    },
    red: {
      text: 'text-red-400',
      bg: 'bg-red-950/40 border-red-800/30',
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/20',
      shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.05)]'
    }
  };

  const currentTheme = colorMaps[colorClass] || colorMaps.cyan;

  return (
    <div className={`glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700/80 ${currentTheme.shadow}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 tracking-wide">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-100">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl border ${currentTheme.iconBg}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {description && (
        <div className="mt-4 flex items-center">
          <p className="text-xs text-slate-400 font-medium font-mono">{description}</p>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
