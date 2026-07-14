const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.querySelector("#year");
const pixelHeadline = document.querySelector(".pixel-headline");
const carlSprite = document.querySelector("#carl-sprite");
const questTabs = document.querySelectorAll(".quest-tab");
const questTitle = document.querySelector("#quest-title");
const questCopy = document.querySelector("#quest-copy");
const xpButton = document.querySelector(".mini-game-button");
const xpPop = document.querySelector(".xp-pop");
const projectCards = document.querySelectorAll(".project-card");
const raviaActiveScreen = document.querySelector("#ravia-active-screen");
const raviaMissionCopy = document.querySelector("#ravia-mission-copy");
const raviaScreenControls = document.querySelectorAll("[data-ravia-screen]");
const raviaActivePhone = document.querySelector(".active-phone");
const dashboardActiveScreen = document.querySelector("#dashboard-active-screen");
const dashboardCardCopy = document.querySelector("#dashboard-card-copy");
const dashboardControls = document.querySelectorAll("[data-dashboard-screen]");
const dashboardMonitor = document.querySelector(".dashboard-monitor");
const imagePreview = document.querySelector(".image-preview");
const imagePreviewImage = document.querySelector(".image-preview img");
const skillNodes = document.querySelectorAll("[data-skill]");
const skillTitle = document.querySelector("#skill-title");
const skillCopy = document.querySelector("#skill-copy");
const skillProof = document.querySelector("#skill-proof");
const loadoutGrid = document.querySelector(".loadout-grid");
const skillBars = document.querySelectorAll(".skill-meter i");
const heroXpBars = document.querySelectorAll(".xp-meter span");
const loadoutDetail = document.querySelector(".loadout-detail");
const archetypeCards = document.querySelectorAll("[data-archetype]");
const archetypeTitle = document.querySelector("#archetype-title");
const archetypeCopy = document.querySelector("#archetype-copy");
const archetypeTags = document.querySelector(".archetype-tags");
const archetypeReveal = document.querySelector(".archetype-reveal");

const questContent = {
  games: {
    title: "Make Playable Worlds",
    copy: "Unity, C#, AR, mobile performance, and gameplay loops for real players.",
  },
  systems: {
    title: "Build The Live Layer",
    copy: "Node APIs, PostgreSQL, Redis, auth, rewards, geofences, and player progression.",
  },
  leadership: {
    title: "Guide The Party",
    copy: "Curriculum, mentorship, project direction, and team habits that keep builds moving.",
  },
};
const raviaScreens = {
  home: {
    src: "assets/images/ar-mobile-game/Home.png",
    alt: "Ravia home screen showing player status and actions",
    scrollable: false,
    copy:
      "Players enter a location-based hub where profile status, progression, and available actions stay readable for younger players.",
  },
  puzzle: {
    src: "assets/images/ar-mobile-game/PuzzleLobby.png",
    alt: "Ravia puzzle lobby screen",
    scrollable: false,
    copy:
      "Puzzle lobbies turn exploration into structured learning moments, giving players a clear next challenge and reward path.",
  },
  inventory: {
    src: "assets/images/ar-mobile-game/Inventory.png",
    alt: "Ravia inventory screen showing collected items",
    scrollable: false,
    copy:
      "Inventory systems make collected tokens and rewards feel owned, trackable, and useful inside the player progression loop.",
  },
  store: {
    src: "assets/images/ar-mobile-game/StoreFeatured.png",
    alt: "Ravia featured store screen",
    scrollable: true,
    copy:
      "The store and cosmetics loop gives rewards a destination, helping progression feel personal without losing parent-supervised guardrails.",
  },
};
const dashboardScreens = {
  overview: {
    src: "assets/images/dashboard-pwa/dashboard.png",
    alt: "Ravia dashboard overview showing child profiles and RAV health",
    copy:
      "A parent command center for monitoring child profiles, RAV health, quest completion, screen time, and active play status at a glance.",
  },
  approvals: {
    src: "assets/images/dashboard-pwa/Approvals.png",
    alt: "Ravia dashboard approvals screen",
    copy:
      "Approval flows give parents a clear checkpoint before sensitive actions continue, keeping gameplay progress tied to supervision.",
  },
  notifications: {
    src: "assets/images/dashboard-pwa/Notifications.png",
    alt: "Ravia dashboard notifications screen",
    copy:
      "Notifications surface important play events, reminders, and account updates so parents can respond without digging through menus.",
  },
  settings: {
    src: "assets/images/dashboard-pwa/Control Settings.png",
    alt: "Ravia dashboard control settings screen",
    copy:
      "Control settings turn safety rules into readable toggles and limits, helping parents tune the experience for each child.",
  },
  profile: {
    src: "assets/images/dashboard-pwa/child profile - 1.png",
    alt: "Ravia dashboard child profile screen",
    copy:
      "Child profile views organize progress, status, and account details into a focused screen for quick parent review.",
  },
};
const archetypes = {
  feel: {
    title: "Game Feel Engineer",
    copy:
      "I care about the invisible parts players feel immediately: input response, readable feedback, rewarding loops, and interfaces that make the next action obvious.",
    tags: ["Input Feel", "Feedback Loops", "Player Clarity"],
  },
  ar: {
    title: "Real-World Playmaker",
    copy:
      "I build experiences that connect digital systems to physical spaces: AR layers, geospatial triggers, safe exploration, and playful learning in real locations.",
    tags: ["AR Layers", "Geospatial Play", "Safe Exploration"],
  },
  fullstack: {
    title: "Systems Builder",
    copy:
      "I like when the magic has a reliable backbone: PWA tools, Flutter surfaces, APIs, databases, rewards, auth, and operations that keep the experience alive.",
    tags: ["PWA Tools", "Backend APIs", "Live Systems"],
  },
};
const skillLoadouts = {
  client: {
    title: "Game Client",
    copy: "Unity, C#, gameplay loops, mobile optimization, Android, iOS, and desktop builds.",
    tools: ["Unity", "C#", "Mobile Performance", "Gameplay Systems"],
    proof: "MotoGP Championship Quest and Ravia mobile gameplay.",
    bars: ["92%", "88%", "84%"],
  },
  ar: {
    title: "AR & Interaction",
    copy: "Augmented reality, Google Geospatial API, motion capture, AI integration, and real-world play patterns.",
    tools: ["AR", "Google Geospatial API", "Motion Capture", "AI Integration"],
    proof: "Ravia, Experience Philippines, iACADEMY App, and stAIled.",
    bars: ["90%", "86%", "82%"],
  },
  web: {
    title: "Web Systems",
    copy: "Flutter surfaces, PWA dashboards, JavaScript, Node.js, Express, PostgreSQL, Redis, and API documentation.",
    tools: ["Flutter", "PWA", "Node.js", "PostgreSQL", "Redis"],
    proof: "Ravia Parent Dashboard and Ravia Backend API.",
    bars: ["86%", "90%", "88%"],
  },
  lead: {
    title: "Leadership",
    copy: "Curriculum development, mentorship, project management, department leadership, and cross-discipline direction.",
    tools: ["Mentorship", "Curriculum", "Project Direction", "Team Systems"],
    proof: "Game Development Chairperson work at iACADEMY.",
    bars: ["94%", "89%", "92%"],
  },
};
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const carlSpriteFrames = [
  "assets/images/sprite/1.png",
  "assets/images/sprite/2.png",
  "assets/images/sprite/3.png",
  "assets/images/sprite/4.png",
  "assets/images/sprite/5.png",
  "assets/images/sprite/6.png",
  "assets/images/sprite/7.png",
  "assets/images/sprite/8.png",
];

year.textContent = new Date().getFullYear();

const minimeSprite = document.querySelector("[data-minime-sprite]");

if ((carlSprite || minimeSprite) && !prefersReducedMotion) {
  let spriteFrame = 0;

  window.setInterval(() => {
    spriteFrame = (spriteFrame + 1) % carlSpriteFrames.length;
    if (carlSprite) carlSprite.src = carlSpriteFrames[spriteFrame];
    if (minimeSprite) minimeSprite.src = carlSpriteFrames[spriteFrame];
  }, 180);
}

const introGate = document.querySelector(".intro-gate");
const startPortfolioButton = document.querySelector("[data-start-portfolio]");
const minimeAssistant = document.querySelector(".minime-assistant");
const minimeToggle = document.querySelector(".minime-toggle");
const minimePopout = document.querySelector("#minime-popout");
let introDismissed = false;
let introAnimating = false;

const syncIntroMinimePosition = () => {
  if (!minimeAssistant || !document.body.classList.contains("intro-active")) return;

  const styles = getComputedStyle(minimeAssistant);
  const right = Number.parseFloat(styles.right) || 0;
  const bottom = Number.parseFloat(styles.bottom) || 0;
  const baseCenterX = window.innerWidth - right - minimeAssistant.offsetWidth / 2;
  const baseBottomY = window.innerHeight - bottom;

  document.documentElement.style.setProperty(
    "--minime-intro-x",
    `${window.innerWidth / 2 - baseCenterX}px`,
  );
  document.documentElement.style.setProperty(
    "--minime-intro-y",
    `${window.innerHeight / 2 - baseBottomY + minimeAssistant.offsetHeight * 0.72}px`,
  );
};

const dismissIntro = (event) => {
  if (event?.cancelable) event.preventDefault();
  if (introAnimating || introDismissed || !introGate) return;

  introAnimating = true;
  introDismissed = true;
  document.documentElement.classList.add("intro-scroll-guard");
  document.body.classList.add("intro-revealing", "intro-scroll-guard");
  window.scrollTo({ top: 0, behavior: "auto" });

  const travelDuration = prefersReducedMotion ? 0 : 720;
  window.setTimeout(() => {
    document.body.classList.remove("intro-active", "intro-revealing");
    document.body.classList.add("intro-dismissed");
    introGate.hidden = true;
    document.documentElement.classList.remove("intro-scroll-guard");
    document.body.classList.remove("intro-scroll-guard");
    introAnimating = false;
    window.removeEventListener("wheel", handleIntroIntent);
    window.removeEventListener("touchmove", handleIntroIntent);
  }, travelDuration);
};

const handleIntroIntent = (event) => {
  if (!document.body.classList.contains("intro-active")) return;
  dismissIntro(event);
};

syncIntroMinimePosition();
window.addEventListener("resize", syncIntroMinimePosition);
startPortfolioButton?.addEventListener("click", dismissIntro);
window.addEventListener("wheel", handleIntroIntent, { passive: false });
window.addEventListener("touchmove", handleIntroIntent, { passive: false });
window.addEventListener("keydown", (event) => {
  if (["ArrowDown", "PageDown", " ", "Enter"].includes(event.key)) handleIntroIntent(event);
});

const setMinimeOpen = (isOpen) => {
  if (!minimeAssistant || !minimeToggle || !minimePopout) return;
  minimeAssistant.classList.toggle("is-open", isOpen);
  minimeToggle.setAttribute("aria-expanded", String(isOpen));
  minimePopout.setAttribute("aria-hidden", String(!isOpen));
};

minimeToggle?.addEventListener("click", () => {
  setMinimeOpen(!minimeAssistant?.classList.contains("is-open"));
});

document.addEventListener("click", (event) => {
  if (!minimeAssistant?.classList.contains("is-open")) return;
  if (minimeAssistant.contains(event.target)) return;
  setMinimeOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMinimeOpen(false);
});

const animateMeter = (bar, targetWidth) => {
  if (!bar) {
    return;
  }

  if (prefersReducedMotion) {
    bar.style.width = targetWidth;
    return;
  }

  bar.style.width = "0%";

  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      bar.style.width = targetWidth;
    }, 80);
  });
};

heroXpBars.forEach((bar) => {
  animateMeter(bar, bar.style.width || "86%");
});

skillBars.forEach((bar) => {
  animateMeter(bar, bar.style.width || "80%");
});

if (pixelHeadline) {
  const headlineText = pixelHeadline.dataset.text || pixelHeadline.textContent.trim();

  pixelHeadline.textContent = "";

  if (prefersReducedMotion) {
    pixelHeadline.textContent = headlineText;
    pixelHeadline.classList.add("is-complete");
  } else {
    let characterIndex = 0;

    const typeHeadline = () => {
      pixelHeadline.textContent = headlineText.slice(0, characterIndex);
      characterIndex += 1;

      if (characterIndex <= headlineText.length) {
        window.setTimeout(typeHeadline, 28);
        return;
      }

      pixelHeadline.classList.add("is-complete");
    };

    window.setTimeout(typeHeadline, 240);
  }
}

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

questTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const questKey = tab.dataset.quest;
    const selectedQuest = questContent[questKey];

    if (!selectedQuest || !questTitle || !questCopy) {
      return;
    }

    questTabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    questTitle.textContent = selectedQuest.title;
    questCopy.textContent = selectedQuest.copy;
  });
});

xpButton?.addEventListener("click", () => {
  if (!xpPop) {
    return;
  }

  xpPop.textContent = `+${Math.floor(Math.random() * 70) + 30} XP`;
  xpPop.classList.remove("is-visible");
  void xpPop.offsetWidth;
  xpPop.classList.add("is-visible");
});

const setRaviaScreen = (screenKey) => {
  const screen = raviaScreens[screenKey];

  if (!screen || !raviaActiveScreen || !raviaMissionCopy) {
    return;
  }

  raviaScreenControls.forEach((control) => {
    control.classList.toggle("is-active", control.dataset.raviaScreen === screenKey);
  });

  raviaActiveScreen.src = screen.src;
  raviaActiveScreen.alt = screen.alt;
  raviaMissionCopy.textContent = screen.copy;

  if (raviaActivePhone) {
    const viewport = raviaActivePhone.querySelector(".phone-viewport");
    raviaActivePhone.classList.toggle("is-scrollable", screen.scrollable);
    viewport?.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  if (!prefersReducedMotion && raviaActivePhone) {
    raviaActivePhone.classList.remove("is-swapping");
    void raviaActivePhone.offsetWidth;
    raviaActivePhone.classList.add("is-swapping");
  }
};

raviaScreenControls.forEach((control) => {
  control.addEventListener("click", () => {
    setRaviaScreen(control.dataset.raviaScreen);
  });
});

const setDashboardScreen = (screenKey) => {
  const screen = dashboardScreens[screenKey];

  if (!screen || !dashboardActiveScreen || !dashboardCardCopy) {
    return;
  }

  dashboardControls.forEach((control) => {
    control.classList.toggle("is-active", control.dataset.dashboardScreen === screenKey);
  });

  dashboardActiveScreen.src = screen.src;
  dashboardActiveScreen.alt = screen.alt;
  dashboardCardCopy.textContent = screen.copy;

  if (imagePreviewImage) {
    imagePreviewImage.src = screen.src;
  }

  if (!prefersReducedMotion && dashboardMonitor) {
    dashboardMonitor.classList.remove("is-swapping");
    void dashboardMonitor.offsetWidth;
    dashboardMonitor.classList.add("is-swapping");
  }
};

dashboardControls.forEach((control) => {
  control.addEventListener("click", () => {
    setDashboardScreen(control.dataset.dashboardScreen);
  });
});

dashboardMonitor?.addEventListener("pointerenter", () => {
  if (!imagePreview || !imagePreviewImage || !dashboardActiveScreen) {
    return;
  }

  imagePreviewImage.src = dashboardActiveScreen.src;
  imagePreview.classList.add("is-visible");
});

dashboardMonitor?.addEventListener("pointerleave", () => {
  imagePreview?.classList.remove("is-visible");
});

const setSkillLoadout = (skillKey) => {
  const loadout = skillLoadouts[skillKey];

  if (!loadout || !skillTitle || !skillCopy || !skillProof || !loadoutGrid) {
    return;
  }

  skillNodes.forEach((node) => {
    node.classList.toggle("is-active", node.dataset.skill === skillKey);
  });

  skillTitle.textContent = loadout.title;
  skillCopy.textContent = loadout.copy;
  skillProof.textContent = loadout.proof;
  loadoutGrid.replaceChildren(
    ...loadout.tools.map((tool) => {
      const item = document.createElement("span");
      item.textContent = tool;
      return item;
    }),
  );

  skillBars.forEach((bar, index) => {
    animateMeter(bar, loadout.bars[index] || "80%");
  });

  if (!prefersReducedMotion && loadoutDetail) {
    loadoutDetail.classList.remove("is-swapping");
    void loadoutDetail.offsetWidth;
    loadoutDetail.classList.add("is-swapping");
  }
};

skillNodes.forEach((node) => {
  node.addEventListener("click", () => {
    setSkillLoadout(node.dataset.skill);
  });
});

const setArchetype = (archetypeKey) => {
  const selected = archetypes[archetypeKey];

  if (!selected || !archetypeTitle || !archetypeCopy || !archetypeTags) {
    return;
  }

  archetypeCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.archetype === archetypeKey);
  });

  archetypeTitle.textContent = selected.title;
  archetypeCopy.textContent = selected.copy;
  archetypeTags.replaceChildren(
    ...selected.tags.map((tag) => {
      const item = document.createElement("span");
      item.textContent = tag;
      return item;
    }),
  );

  if (!prefersReducedMotion && archetypeReveal) {
    archetypeReveal.classList.remove("is-swapping");
    void archetypeReveal.offsetWidth;
    archetypeReveal.classList.add("is-swapping");
  }
};

archetypeCards.forEach((card) => {
  card.addEventListener("click", () => {
    setArchetype(card.dataset.archetype);
  });
});

projectCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateY = ((x / bounds.width) - 0.5) * 4;
    const rotateX = ((y / bounds.height) - 0.5) * -4;

    card.classList.add("is-tilting");
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-tilting");
    card.style.transform = "";
  });
});

/* === Life & effects pass === */

// Scroll progress bar (global XP strip).
const scrollProgressFill = document.querySelector(".scroll-progress span");

if (scrollProgressFill) {
  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    scrollProgressFill.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();
}

// Ambient pixel-dust particles drifting up behind the page.
const fxCanvas = document.querySelector("#fx-canvas");

if (fxCanvas && !prefersReducedMotion) {
  const fxContext = fxCanvas.getContext("2d");
  const particleColors = ["rgba(34, 211, 238, ", "rgba(244, 114, 182, ", "rgba(250, 204, 21, "];
  let fxWidth = 0;
  let fxHeight = 0;
  let particles = [];

  const resizeFxCanvas = () => {
    fxWidth = fxCanvas.width = window.innerWidth;
    fxHeight = fxCanvas.height = window.innerHeight;
    const count = Math.min(70, Math.floor((fxWidth * fxHeight) / 22000));

    particles = Array.from({ length: count }, () => ({
      x: Math.random() * fxWidth,
      y: Math.random() * fxHeight,
      size: Math.random() < 0.75 ? 2 : 4,
      speed: 0.15 + Math.random() * 0.4,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.004 + Math.random() * 0.008,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      alpha: 0.2 + Math.random() * 0.45,
    }));
  };

  const drawFxFrame = () => {
    fxContext.clearRect(0, 0, fxWidth, fxHeight);

    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.sway += particle.swaySpeed;

      if (particle.y < -6) {
        particle.y = fxHeight + 6;
        particle.x = Math.random() * fxWidth;
      }

      const drawX = particle.x + Math.sin(particle.sway) * 14;
      const twinkle = 0.6 + Math.sin(particle.sway * 3) * 0.4;

      fxContext.fillStyle = `${particle.color}${(particle.alpha * twinkle).toFixed(3)})`;
      fxContext.fillRect(Math.round(drawX), Math.round(particle.y), particle.size, particle.size);
    });

    window.requestAnimationFrame(drawFxFrame);
  };

  resizeFxCanvas();
  window.addEventListener("resize", resizeFxCanvas);
  window.requestAnimationFrame(drawFxFrame);
}

// Scroll-reveal choreography with per-sibling stagger.
const revealTargets = document.querySelectorAll(
  ".section-heading, .featured-project, .project-card, .archetype-card, .archetype-reveal, .skill-node, .loadout-detail, .about-copy, .timeline > div, .contact-section > div, .skill-ticker",
);

if ("IntersectionObserver" in window && !prefersReducedMotion && revealTargets.length) {
  const siblingCounts = new Map();

  revealTargets.forEach((element) => {
    element.classList.add("reveal");
    const parent = element.parentElement;
    const index = siblingCounts.get(parent) || 0;
    siblingCounts.set(parent, index + 1);
    element.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 90}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target;
        const scrolledPast = entry.boundingClientRect.bottom < 0;

        if (!entry.isIntersecting && !scrolledPast) return;

        revealObserver.unobserve(element);

        if (scrolledPast) {
          // Jumped over by a fast scroll: show immediately, no animation.
          element.classList.remove("reveal", "is-revealed");
          element.style.removeProperty("--reveal-delay");
          return;
        }

        element.classList.add("is-revealed");

        // Return the element to stylesheet defaults so hover transforms keep working.
        window.setTimeout(() => {
          element.classList.remove("reveal", "is-revealed");
          element.style.removeProperty("--reveal-delay");
        }, 1400);
      });
    },
    // The large top margin keeps fast scrolls from skipping elements entirely:
    // anything at or above the viewport counts as intersecting and gets revealed.
    { threshold: 0, rootMargin: "10000px 0px -40px 0px" },
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}

// Cursor-tracked glow spots inside cards.
const glowHosts = document.querySelectorAll(
  ".project-card, .featured-project, .archetype-card, .loadout-detail, .archetype-reveal",
);

if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
  glowHosts.forEach((host) => {
    host.classList.add("has-glow");

    const spot = document.createElement("span");
    spot.className = "glow-spot";
    host.appendChild(spot);

    host.addEventListener("pointermove", (event) => {
      const bounds = host.getBoundingClientRect();
      spot.style.left = `${event.clientX - bounds.left}px`;
      spot.style.top = `${event.clientY - bounds.top}px`;
    });
  });
}

// Pixel confetti bursts.
const spawnConfetti = (originX, originY, count = 18) => {
  if (prefersReducedMotion) return;

  const palette = ["#22d3ee", "#f472b6", "#facc15", "#f7fbff"];

  for (let i = 0; i < count; i += 1) {
    const pixel = document.createElement("span");
    pixel.className = "confetti-pixel";
    pixel.style.background = palette[Math.floor(Math.random() * palette.length)];
    pixel.style.left = `${originX}px`;
    pixel.style.top = `${originY}px`;
    document.body.appendChild(pixel);

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 130;
    const burst = pixel.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        {
          transform: `translate(${Math.cos(angle) * distance}px, ${
            Math.sin(angle) * distance - 44
          }px) rotate(${Math.random() * 540 - 270}deg)`,
          opacity: 0,
        },
      ],
      { duration: 700 + Math.random() * 500, easing: "cubic-bezier(0.2, 0.8, 0.4, 1)" },
    );

    burst.onfinish = () => pixel.remove();
  }
};

xpButton?.addEventListener("click", () => {
  const bounds = xpButton.getBoundingClientRect();
  spawnConfetti(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, 16);
});

// Konami code easter egg: cheat toast, full XP, confetti storm.
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];
let konamiProgress = 0;

document.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  konamiProgress = key === konamiSequence[konamiProgress]
    ? konamiProgress + 1
    : key === konamiSequence[0]
      ? 1
      : 0;

  if (konamiProgress < konamiSequence.length) return;
  konamiProgress = 0;

  const toast = document.createElement("div");
  toast.className = "cheat-toast";
  toast.textContent = "CHEAT UNLOCKED: +9999 XP";
  document.body.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3100);

  heroXpBars.forEach((bar) => {
    bar.style.width = "100%";
  });

  for (let i = 0; i < 5; i += 1) {
    window.setTimeout(() => {
      spawnConfetti(
        Math.random() * window.innerWidth,
        window.innerHeight * (0.18 + Math.random() * 0.4),
        24,
      );
    }, i * 160);
  }
});
