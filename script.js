/* ===== script.js =====
 - Dark mode toggle (saved in localStorage)
 - Simple AOS-like IntersectionObserver animations
 - PDF generation via print-friendly popup (includes photo if present)
========================== */

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      themeToggle.textContent = "☀️";
    } else {
      root.removeAttribute("data-theme");
      themeToggle.textContent = "🌙";
    }
    localStorage.setItem("site-theme", theme);
  }

  const saved = localStorage.getItem("site-theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  themeToggle && themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(current === "dark" ? "light" : "dark");
  });

  const animated = document.querySelectorAll("[data-animate]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  }, { threshold: 0.15 });

  animated.forEach(el => observer.observe(el));

  document.querySelectorAll('.nav a[href^="#"], .nav-links a[href^="#"], .hero-buttons a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const pdfBtn = document.getElementById("pdfBtn");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", () => {
      const pageTitle = document.title || "Portfolio";
      const contentSelectors = [
        '.hero',
        '#objective',
        '#education',
        '#skills',
        '#projects',
        '#certifications',
        '#experience',
        '.socials',
        '#contact'
      ];
      let htmlContent = `<!doctype html><html><head><meta charset="utf-8"><title>${pageTitle} - PDF</title>`;
      htmlContent += `<style>
        body{font-family:Arial, Helvetica, sans-serif; margin:24px; color:#111}
        h1,h2{color:#2b2b5f}
        .section{margin-bottom:18px}
        .hero{display:flex; gap:16px; align-items:center}
        .hero img{width:120px; height:140px; object-fit:cover; border-radius:8px}
        .card-grid{display:flex; flex-wrap:wrap; gap:12px}
        .card{border:1px solid #ddd; padding:10px; border-radius:8px; background:#fff; flex:1 1 300px}
        a{color:#1a73e8; text-decoration:none}
        @media print{ a[href]:after { content: " (" attr(href) ")"; font-size:10px } }
      </style>`;
      htmlContent += `</head><body>`;
      contentSelectors.forEach(sel => {
        const node = document.querySelector(sel);
        if (node) {
          htmlContent += node.outerHTML;
        }
      });
      htmlContent += `</body></html>`;

      const w = window.open("", "_blank", "width=900,height=800,scrollbars=yes");
      if (!w) { alert("Please allow popups to generate PDF/Print"); return; }
      w.document.open();
      w.document.write(htmlContent);
      w.document.close();
      setTimeout(() => {
        try { w.focus(); w.print(); } catch (e) { console.warn(e); }
      }, 700);
    });
  }

  const logo = document.querySelector('.logo');
  const heroImg = document.querySelector('.hero-image img');
  if (logo && !logo.querySelector('img') && heroImg && heroImg.getAttribute('src')) {
    const img = document.createElement('img');
    img.src = heroImg.src;
    img.alt = 'profile';
    logo.appendChild(img);
  }
});
