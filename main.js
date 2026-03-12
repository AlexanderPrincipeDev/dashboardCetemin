const data = {
  kpis: [
    { label: 'Índice de Deserción Actual', val: '13%', meta: 'marzo 2026', trend: [13, 12.8, 12.3, 11.8, 11.2, 10.7, 10.1, 9.6, 9.0, 8.5, 7.8, 7.0], color: '#df5a57' },
    { label: 'Índice de Riesgo de Deserción', val: '0.62', meta: 'riesgo promedio', trend: [0.62, 0.61, 0.60, 0.58, 0.56, 0.54, 0.52, 0.50, 0.48, 0.45, 0.42, 0.39], color: '#efaa22' },
    { label: 'Tasa de Morosidad', val: '21%', meta: 'principal impulsor', trend: [21, 20.7, 20.2, 19.4, 18.8, 17.9, 17.0, 16.1, 15.4, 14.2, 13.1, 12.0], color: '#df5a57' },
    { label: 'Participación Académica', val: '64%', meta: 'nivel institucional', trend: [64, 64.5, 65.0, 65.8, 66.7, 67.5, 68.3, 69.1, 70.0, 71.0, 72.0, 73.0], color: '#1ea567' },
    { label: 'Desempeño Académico', val: '68%', meta: 'rendimiento agregado', trend: [68, 68.2, 68.8, 69.1, 69.8, 70.5, 71.0, 71.8, 72.4, 73.0, 74.0, 75.0], color: '#3578e5' },
    { label: 'Progreso Curricular', val: '59%', meta: 'avance esperado', trend: [59, 59.5, 60.0, 60.6, 61.4, 62.0, 62.8, 63.6, 64.5, 65.4, 66.2, 67.0], color: '#1ea567' }
  ],
  scenarios: {
    months: ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb'],
    optimista: [13, 12.5, 11.9, 11.2, 10.6, 10.0, 9.3, 8.7, 8.1, 7.7, 7.3, 7.0],
    regular: [13, 12.8, 12.5, 12.0, 11.7, 11.3, 10.9, 10.5, 10.1, 9.9, 9.7, 9.5],
    critico: [13, 13.1, 13.2, 13.4, 13.5, 13.7, 13.9, 14.1, 14.2, 14.4, 14.6, 14.8]
  },
  drivers: [
    { name: 'Morosidad', value: 0.31, color: '#df5a57' },
    { name: 'Participación académica', value: 0.24, color: '#efaa22' },
    { name: 'Desempeño académico', value: 0.23, color: '#3578e5' },
    { name: 'Progreso curricular', value: 0.22, color: '#1ea567' }
  ],
  careers: [
    { name: 'Seguridad Industrial', students: 482, dropout: 13.9, risk: 'Alto', trend: 'Al alza' },
    { name: 'Mantenimiento de Maquinaria Pesada', students: 534, dropout: 13.2, risk: 'Alto', trend: 'Al alza' },
    { name: 'Exploración y Operación Minera', students: 426, dropout: 12.5, risk: 'Medio', trend: 'Estable' },
    { name: 'Procesos Metalúrgicos', students: 391, dropout: 11.7, risk: 'Medio', trend: 'A la baja' },
    { name: 'Mantenimiento de Sistemas Eléctricos e Instrumentación Industrial', students: 585, dropout: 11.2, risk: 'Medio', trend: 'A la baja' }
  ],
  matrix: [
    { factor: 'Morosidad', opt: 'Baja', reg: 'Media', cri: 'Alta' },
    { factor: 'Participación académica', opt: 'Alta', reg: 'Media', cri: 'Baja' },
    { factor: 'Desempeño académico', opt: 'Alto', reg: 'Medio', cri: 'Bajo' },
    { factor: 'Progreso curricular', opt: 'Alto', reg: 'Medio', cri: 'Bajo' }
  ]
};

function sparkline(values, color) {
  const w = 180, h = 38, p = 3;
  const min = Math.min(...values), max = Math.max(...values);
  const sx = (i) => p + i * ((w - 2 * p) / (values.length - 1));
  const sy = (v) => h - p - ((v - min) / (max - min || 1)) * (h - 2 * p);
  const points = values.map((v, i) => `${sx(i)},${sy(v)}`).join(' ');
  const lastX = sx(values.length - 1), lastY = sy(values[values.length - 1]);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline fill="none" stroke="#dce6f1" stroke-width="6" points="${points}" opacity=".55"></polyline>
    <polyline fill="none" stroke="${color}" stroke-width="2.6" points="${points}"></polyline>
    <circle cx="${lastX}" cy="${lastY}" r="3.5" fill="${color}"></circle>
  </svg>`;
}

const kpiWrap = document.getElementById('kpiCards');
data.kpis.forEach(k => {
  const div = document.createElement('div');
  div.className = 'card kpi-card';
  div.innerHTML = `<div class="label">${k.label}</div><div class="val">${k.val}</div><div class="meta">${k.meta}</div>${sparkline(k.trend, k.color)}`;
  kpiWrap.appendChild(div);
});

function renderTrendChart() {
  const svg = document.getElementById('trendChart');
  const W = 860, H = 330, left = 58, right = 18, top = 18, bottom = 44;
  const months = data.scenarios.months;
  const series = [
    { name: 'optimista', vals: data.scenarios.optimista, color: '#1ea567' },
    { name: 'regular', vals: data.scenarios.regular, color: '#efaa22' },
    { name: 'critico', vals: data.scenarios.critico, color: '#df5a57' }
  ];
  const min = 6.5, max = 15.5;
  const x = (i) => left + i * ((W - left - right) / (months.length - 1));
  const y = (v) => H - bottom - ((v - min) / (max - min)) * (H - top - bottom);
  let out = '';
  for (let i = 0; i < 6; i++) {
    const val = min + i * ((max - min) / 5);
    const yy = y(val);
    out += `<line x1="${left}" y1="${yy}" x2="${W - right}" y2="${yy}" stroke="#e6edf5" stroke-width="1"></line>`;
    out += `<text x="${left - 10}" y="${yy + 4}" text-anchor="end" font-size="11" fill="#6d7b8a">${val.toFixed(1)}%</text>`;
  }
  months.forEach((m, i) => {
    const xx = x(i);
    out += `<line x1="${xx}" y1="${top}" x2="${xx}" y2="${H - bottom}" stroke="#f1f5f9" stroke-width="1"></line>`;
    out += `<text x="${xx}" y="${H - 18}" text-anchor="middle" font-size="11" fill="#6d7b8a">${m}</text>`;
  });
  series.forEach(s => {
    const pts = s.vals.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    out += `<polyline fill="none" stroke="${s.color}" stroke-width="3.2" points="${pts}"></polyline>`;
    s.vals.forEach((v, i) => { out += `<circle cx="${x(i)}" cy="${y(v)}" r="3.3" fill="${s.color}"></circle>`; });
    const lx = x(months.length - 1), ly = y(s.vals[s.vals.length - 1]);
    out += `<text x="${lx + 10}" y="${ly + 4}" font-size="11" fill="${s.color}" font-weight="800">${s.vals[s.vals.length - 1].toFixed(1)}%</text>`;
  });
  svg.innerHTML = out;
}
renderTrendChart();

const driverWrap = document.getElementById('driverRows');
data.drivers.forEach(d => {
  const row = document.createElement('div'); row.className = 'row';
  row.innerHTML = `<div><strong>${d.name}</strong></div><div style="font-weight:800">${(d.value * 100).toFixed(0)}%</div><div class="bar"><div style="width:${d.value * 100}%;background:${d.color}"></div></div>`;
  driverWrap.appendChild(row);
});

const tbody = document.getElementById('careerRows');
data.careers.forEach(c => {
  const tagClass = c.risk === 'Alto' ? 'danger' : c.risk === 'Medio' ? 'warn' : 'ok';
  const tr = document.createElement('tr');
  tr.innerHTML = `<td>${c.name}</td><td>${c.students.toLocaleString('es-PE')}</td><td>${c.dropout.toFixed(1)}%</td><td><span class="tag ${tagClass}">${c.risk}</span></td><td>${c.trend}</td>`;
  tbody.appendChild(tr);
});

const matrixWrap = document.getElementById('matrixRows');
function cellClass(v) { return ['Alta', 'Alto'].includes(v) ? 'high' : ['Media', 'Medio'].includes(v) ? 'med' : 'low'; }
data.matrix.forEach(r => {
  const row = document.createElement('div'); row.className = 'm-row';
  row.innerHTML = `<div><strong>${r.factor}</strong></div><div class="cell ${cellClass(r.opt)}">${r.opt}</div><div class="cell ${cellClass(r.reg)}">${r.reg}</div><div class="cell ${cellClass(r.cri)}">${r.cri}</div>`;
  matrixWrap.appendChild(row);
});
