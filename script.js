/* ===== script.js =====
   - Dark mode toggle (saved in localStorage)
   - Scroll animations using IntersectionObserver
   - Smooth scrolling for navigation links
   - PDF generation (optional)
========================== */

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;

  // Apply theme
  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeToggle) themeToggle.textContent = "☀️";
    } else {
      root.removeAttribute("data-theme");
      if (themeToggle) themeToggle.textContent = "🌙";
    }
    localStorage.setItem("site-theme", theme);
  }

  // Load saved theme
  const savedTheme =
    localStorage.getItem("site-theme") ||
    (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  applyTheme(savedTheme);

  // Theme toggle click
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const currentTheme =
        root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(currentTheme === "dark" ? "light" : "dark");
    });
  }

  // Scroll animations
  const animatedElements = document.querySelectorAll("[data-animate]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    animatedElements.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  // Smooth scrolling
  document
    .querySelectorAll(
      '.nav a[href^="#"], .nav-links a[href^="#"], .hero-buttons a[href^="#"]'
    )
    .forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

  // Optional PDF generation
  const pdfBtn = document.getElementById("pdfBtn");

  if (pdfBtn) {
    pdfBtn.addEventListener("click", function () {
      const pageTitle = document.title || "Portfolio";

      const contentSelectors = [
        ".hero",
        "#objective",
        "#education",
        "#skills",
        "#projects",
        "#certifications",
        "#experience",
        ".socials",
        "#contact",
      ];

      let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${pageTitle} - PDF</title>
<style>
  body {
    font-family: Arial, sans-serif;
    margin: 24px;
    color: #111;
  }
  h1, h2 {
    color: #2b2b5f;
  }
  .hero {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  .hero img {
    width: 120px;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
  }
  .card {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  a {
    color: #1a73e8;
    text-decoration: none;
  }
</style>
</head>
<body>
`;

      contentSelectors.forEach(function (selector) {
        const node = document.querySelector(selector);
        if (node) {
          htmlContent += node.outerHTML;
        }
      });

      htmlContent += `
</body>
</html>
`;

      const printWindow = window.open(
        "",
        "_blank",
        "width=900,height=800,scrollbars=yes"
      );

      if (!printWindow) {
        alert("Please allow popups to generate PDF.");
        return;
      }

      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      setTimeout(function () {
        try {
          printWindow.focus();
          printWindow.print();
        } catch (error) {
          console.error(error);
        }
      }, 700);
    });
  }

  // Navbar logo handling
  // Your HTML already contains:
  // <div class="logo"><img src="kavipriya.jpg" alt="Kavipriya Logo"></div>
  // So no need to dynamically append another image.
});