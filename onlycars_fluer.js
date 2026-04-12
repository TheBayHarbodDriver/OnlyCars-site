const flyerCard = document.getElementById("flyer-card");
const particlesContainer = document.getElementById("particles");

function forceStartAtTop() {
	if ("scrollRestoration" in history) {
		history.scrollRestoration = "manual";
	}

	window.scrollTo(0, 0);

	if (window.location.hash) {
		history.replaceState(null, "", window.location.pathname + window.location.search);
	}
}

function runHeroIntroAnimation() {
	const sequence = [
		document.querySelector(".hero-title"),
		document.querySelector(".hero-subtitle"),
		document.querySelector(".hero-actions"),
		document.querySelector(".hero-download"),
		document.querySelector(".phone-back.intro-phone"),
		document.querySelector(".phone-front.intro-phone")
	].filter(Boolean);

	if (sequence.length === 0) {
		return;
	}

	const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	if (prefersReducedMotion) {
		sequence.forEach((element) => element.classList.add("intro-in"));
		return;
	}

	const baseDelay = 120;
	const stepDelay = 170;

	sequence.forEach((element, index) => {
		window.setTimeout(() => {
			element.classList.add("intro-in");
		}, baseDelay + index * stepDelay);
	});
}

function revealElementsOnScroll() {
	const elements = document.querySelectorAll(".scroll-reveal");
	if (elements.length === 0) {
		return;
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) {
					return;
				}

				entry.target.classList.add("revealed");
				observer.unobserve(entry.target);
			});
		},
		{
			threshold: 0.2,
			rootMargin: "0px 0px -8% 0px"
		}
	);

	elements.forEach((element, index) => {
		element.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
		observer.observe(element);
	});
}

function animateCounters() {
	const counters = document.querySelectorAll("[data-count]");
	counters.forEach((counter) => {
		const target = Number(counter.getAttribute("data-count"));
		const duration = 1200;
		const start = performance.now();

		function update(currentTime) {
			const elapsed = currentTime - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			counter.textContent = String(Math.round(target * eased));
			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	});
}

function createParticles() {
	if (!particlesContainer) {
		return;
	}

	const total = 18;
	for (let i = 0; i < total; i += 1) {
		const particle = document.createElement("span");
		particle.className = "particle";
		particle.style.left = `${Math.random() * 100}%`;
		particle.style.bottom = `${Math.random() * 100}px`;
		particle.style.animationDuration = `${3 + Math.random() * 5}s`;
		particle.style.animationDelay = `${Math.random() * 3}s`;
		particle.style.opacity = `${0.35 + Math.random() * 0.5}`;
		particlesContainer.appendChild(particle);
	}
}

function initAnimations() {
	forceStartAtTop();
	runHeroIntroAnimation();
	revealElementsOnScroll();
	createParticles();

	setTimeout(() => {
		animateCounters();
	}, 420);

}

window.addEventListener("DOMContentLoaded", initAnimations);
