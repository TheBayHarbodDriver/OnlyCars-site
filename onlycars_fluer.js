const nav = document.getElementById("nav");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ─── Nav scroll glass effect ─── */
function updateNav() {
	if (!nav) return;
	nav.classList.toggle("scrolled", window.scrollY > 50);
}

/* ─── Force scroll to top on load ─── */
function forceTop() {
	if ("scrollRestoration" in history) history.scrollRestoration = "manual";
	window.scrollTo(0, 0);
	if (window.location.hash) {
		history.replaceState(null, "", window.location.pathname + window.location.search);
	}
}

/* ─── Hero staggered intro ─── */
function runHeroIntro() {
	const items = Array.from(document.querySelectorAll(".intro-el")).filter(Boolean);
	const phones = Array.from(document.querySelectorAll(".intro-phone")).filter(Boolean);
	const badges = Array.from(document.querySelectorAll(".intro-badge")).filter(Boolean);

	if (prefersReducedMotion) {
		[...items, ...phones, ...badges].forEach(el => el.classList.add("in"));
		return;
	}

	const base = 100;
	const step = 150;

	items.forEach((el, i) => {
		setTimeout(() => el.classList.add("in"), base + i * step);
	});

	const phoneDelay = base + items.length * step + 80;
	phones.forEach((el, i) => {
		setTimeout(() => el.classList.add("in"), phoneDelay + i * 120);
	});

	const badgeDelay = phoneDelay + 500;
	badges.forEach((el, i) => {
		setTimeout(() => el.classList.add("in"), badgeDelay + i * 180);
	});
}

/* ─── Scroll reveal ─── */
function initScrollReveal() {
	const elements = document.querySelectorAll(".reveal, .reveal-left");
	if (!elements.length) return;

	if (prefersReducedMotion) {
		elements.forEach(el => el.classList.add("in"));
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const el = entry.target;
			const siblings = Array.from(el.parentElement?.children ?? []).filter(c => c.classList.contains("reveal") || c.classList.contains("reveal-left"));
			const idx = siblings.indexOf(el);
			const delay = Math.min(idx * 90, 360);
			setTimeout(() => el.classList.add("in"), delay);
			observer.unobserve(el);
		});
	}, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

	elements.forEach(el => observer.observe(el));
}

/* ─── Animated counter ─── */
function animateCounter(el, target, duration = 1400) {
	const start = performance.now();
	const update = (now) => {
		const progress = Math.min((now - start) / duration, 1);
		const eased = 1 - Math.pow(1 - progress, 3);
		el.textContent = String(Math.round(target * eased));
		if (progress < 1) requestAnimationFrame(update);
	};
	requestAnimationFrame(update);
}

function initCounters() {
	const counters = document.querySelectorAll("[data-count]");
	if (!counters.length) return;

	if (prefersReducedMotion) {
		counters.forEach(el => { el.textContent = el.getAttribute("data-count"); });
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const target = Number(entry.target.getAttribute("data-count"));
			animateCounter(entry.target, target);
			observer.unobserve(entry.target);
		});
	}, { threshold: 0.5 });

	counters.forEach(el => observer.observe(el));
}

/* ─── Chart bar animation ─── */
function initChartBars() {
	const bars = document.querySelectorAll(".bar[data-h]");
	if (!bars.length) return;

	bars.forEach(b => { b.style.height = "0%"; });

	if (prefersReducedMotion) {
		bars.forEach(b => { b.style.height = b.getAttribute("data-h") + "%"; });
		return;
	}

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const chart = entry.target;
			const allBars = chart.querySelectorAll(".bar[data-h]");
			allBars.forEach((b, i) => {
				setTimeout(() => {
					b.style.height = b.getAttribute("data-h") + "%";
				}, i * 80);
			});
			observer.unobserve(chart);
		});
	}, { threshold: 0.3 });

	const charts = document.querySelectorAll(".mini-chart");
	charts.forEach(c => observer.observe(c));
}

/* ─── Subtle cursor glow on desktop ─── */
function initCursorGlow() {
	if (window.matchMedia("(hover: none)").matches) return;
	if (prefersReducedMotion) return;

	const glow = document.createElement("div");
	glow.style.cssText = `
		position: fixed;
		width: 300px;
		height: 300px;
		border-radius: 50%;
		pointer-events: none;
		z-index: 0;
		background: radial-gradient(circle, rgba(255,107,0,0.06) 0%, transparent 65%);
		transform: translate(-50%, -50%);
		transition: left 0.8s ease, top 0.8s ease;
		filter: blur(20px);
	`;
	document.body.appendChild(glow);

	document.addEventListener("mousemove", (e) => {
		glow.style.left = e.clientX + "px";
		glow.style.top = e.clientY + "px";
	}, { passive: true });
}

/* ─── Bootstrap ─── */
function init() {
	forceTop();
	updateNav();
	runHeroIntro();
	initScrollReveal();
	initCounters();
	initChartBars();
	initCursorGlow();
	window.addEventListener("scroll", updateNav, { passive: true });
}

document.addEventListener("DOMContentLoaded", init);
