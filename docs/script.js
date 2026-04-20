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

window.addEventListener("DOMContentLoaded", () => {
  initHeroStatusAnimation();
  initRevealAnimations();
  initCharts();
  initSmoothAnchors();
});