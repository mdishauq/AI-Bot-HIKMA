const stateLoop = [
  { state: "HEALTHY", color: "#0c8f84", confidence: 87, note: "Machine behavior is stable and within expected operation." },
  { state: "HEALTHY", color: "#0c8f84", confidence: 91, note: "Condition remains steady with consistent operational response." },
  { state: "AMBIENT", color: "#64748b", confidence: 54, note: "No meaningful machine activity. Monitoring remains active." },
  { state: "HEALTHY", color: "#0c8f84", confidence: 89, note: "Machine has returned to normal profile and stable status." },
  { state: "FAULT", color: "#d97706", confidence: 78, note: "Noticeable deviation detected. Maintenance check is recommended." },
];

function initHeroStatusAnimation() {
  const stateEl = document.getElementById("hero-state");
  const noteEl = document.getElementById("hero-note");
  const fillEl = document.getElementById("meter-fill");
  const valueEl = document.getElementById("meter-value");

  if (!stateEl || !noteEl || !fillEl || !valueEl) return;

  let i = 0;

  const paint = () => {
    const item = stateLoop[i % stateLoop.length];
    stateEl.textContent = item.state;
    stateEl.style.color = item.color;
    noteEl.textContent = item.note;
    fillEl.style.width = `${item.confidence}%`;
    valueEl.textContent = `${item.confidence}%`;
    i += 1;
  };

  paint();
  window.setInterval(paint, 2600);
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");
  if (!revealItems.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el) => obs.observe(el));
}

function initCharts() {
  if (typeof Chart === "undefined") return;

  const textColor = "#4d5a74";
  const gridColor = "rgba(20, 33, 61, 0.09)";

  const statusCanvas = document.getElementById("statusChart");
  if (statusCanvas) {
    new Chart(statusCanvas, {
      type: "doughnut",
      data: {
        labels: ["Healthy", "Ambient", "Fault"],
        datasets: [
          {
            data: [66, 21, 13],
            backgroundColor: ["#0c8f84", "#64748b", "#d97706"],
            borderColor: ["#ffffff", "#ffffff", "#ffffff"],
            borderWidth: 3,
            hoverOffset: 5,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: textColor, font: { family: "Sora", size: 12 } },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`,
            },
          },
        },
      },
    });
  }

  const trendCanvas = document.getElementById("trendChart");
  if (trendCanvas) {
    new Chart(trendCanvas, {
      type: "line",
      data: {
        labels: ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"],
        datasets: [
          {
            label: "Overall confidence",
            data: [84, 89, 86, 91, 88, 82, 87],
            borderColor: "#0c8f84",
            backgroundColor: "rgba(12, 143, 132, 0.14)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: { color: textColor, font: { family: "Space Mono", size: 10 } },
            grid: { color: gridColor },
          },
          y: {
            suggestedMin: 60,
            suggestedMax: 100,
            ticks: {
              callback: (v) => `${v}%`,
              color: textColor,
              font: { family: "Space Mono", size: 10 },
            },
            grid: { color: gridColor },
          },
        },
        plugins: {
          legend: {
            labels: { color: textColor, font: { family: "Sora", size: 12 } },
          },
        },
      },
    });
  }
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id ? document.querySelector(id) : null;
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initOledSimulations() {
  // Heartbeat animation
  const hbCanvas = document.getElementById("heartbeat");
  if (hbCanvas) {
    const ctx = hbCanvas.getContext("2d");
    const heartbeat = [0, 0, 0, 0, -2, -4, -3, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let phase = 0;
    setInterval(() => {
      ctx.clearRect(0, 0, hbCanvas.width, hbCanvas.height);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 120; i++) {
        const idx = (i / 4 + phase) % 16;
        const y = 8 + heartbeat[Math.floor(idx)] * 0.8;
        i === 0 ? ctx.moveTo(i, y) : ctx.lineTo(i, y);
      }
      ctx.stroke();
      phase = (phase + 1) % 16;
    }, 50);
  }

  // Sine wave animation
  const sineCanvas = document.getElementById("sine-wave");
  if (sineCanvas) {
    const ctx = sineCanvas.getContext("2d");
    let offset = 0;
    setInterval(() => {
      ctx.clearRect(0, 0, sineCanvas.width, sineCanvas.height);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < 120; x++) {
        const angle1 = (x + offset) * 0.12;
        const angle2 = (x + offset) * 0.07 + 1.2;
        const y1 = 9 + Math.sin(angle1) * 4;
        const y2 = 9 + Math.sin(angle2) * 2;
        const y = (y1 + y2) / 2;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      offset = (offset + 0.5) % 120;
    }, 50);
  }

  // Calibration progress
  let progress = 0;
  setInterval(() => {
    const bar = document.getElementById("progress-bar");
    const text = document.getElementById("progress-text");
    if (bar && text) {
      progress = (progress + 1) % 100;
      bar.style.width = progress + "%";
      text.textContent = progress + "%  Building baseline";
    }
  }, 80);

  // Animate dots
  const dots = ["", ".", "..", "...", "..", "."];
  let dotIdx = 0;
  setInterval(() => {
    document.getElementById("dots-warmup").textContent = dots[dotIdx % dots.length];
    document.getElementById("dots-calib").textContent = dots[dotIdx % dots.length];
    document.getElementById("dots-rolling").textContent = dots[dotIdx % dots.length];
    dotIdx += 1;
  }, 350);

  // Feature page rotation
  const features = [
    { label: "RMS", val: "245.8", label2: "PEAK Hz", val2: "1247" },
    { label: "KURT", val: "3.24", label2: "CREST", val2: "4.82" },
    { label: "CENTROID", val: "847", label2: "ZCR", val2: "0.168" },
  ];
  let featureIdx = 0;
  setInterval(() => {
    const feat = features[featureIdx % features.length];
    document.getElementById("page-num").textContent = (featureIdx % features.length) + 1;
    document.getElementById("rms-val").textContent = feat.val;
    document.getElementById("hz-val").textContent = feat.val2;
    featureIdx += 1;
  }, 2000);
}

window.addEventListener("DOMContentLoaded", () => {
  initHeroStatusAnimation();
  initRevealAnimations();
  initCharts();
  initSmoothAnchors();
  initOledSimulations();
});
