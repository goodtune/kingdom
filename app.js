// ============================================
// Animal Kingdom Game - Main Application
// ============================================

(function () {
  "use strict";

  // --- Constants ---
  const LIKES_PER_ROUND = 10;
  const STORAGE_KEY = "animal-kingdom-state";
  const SWIPE_THRESHOLD = 80; // px to trigger swipe

  // --- DOM Elements ---
  const screens = {
    welcome: document.getElementById("screen-welcome"),
    selection: document.getElementById("screen-selection"),
    ranking: document.getElementById("screen-ranking"),
    bracket: document.getElementById("screen-bracket"),
    winner: document.getElementById("screen-winner"),
  };

  const els = {
    btnStart: document.getElementById("btn-start"),
    btnContinue: document.getElementById("btn-continue"),
    btnReset: document.getElementById("btn-reset"),
    likedCount: document.getElementById("liked-count"),
    likedTarget: document.getElementById("liked-target"),
    roundNumber: document.getElementById("round-number"),
    card: document.getElementById("animal-card"),
    cardEmoji: document.getElementById("card-emoji"),
    cardName: document.getElementById("card-name"),
    cardFact: document.getElementById("card-fact"),
    cardCategory: document.getElementById("card-category"),
    hintLeft: document.getElementById("swipe-hint-left"),
    hintRight: document.getElementById("swipe-hint-right"),
    rankingList: document.getElementById("ranking-list"),
    btnConfirmRanking: document.getElementById("btn-confirm-ranking"),
    bracketTitle: document.getElementById("bracket-title"),
    bracketSubtitle: document.getElementById("bracket-subtitle"),
    bracketLeft: document.getElementById("bracket-left"),
    bracketRight: document.getElementById("bracket-right"),
    bracketProgress: document.getElementById("bracket-progress"),
    winnerEmoji: document.getElementById("winner-emoji"),
    winnerName: document.getElementById("winner-name"),
    winnerFact: document.getElementById("winner-fact"),
    btnPlayAgain: document.getElementById("btn-play-again"),
  };

  // --- Game State ---
  let state = {
    phase: "welcome",       // welcome | selection | ranking | bracket | winner
    round: 1,
    currentAnimalIndex: 0,
    roundAnimals: [],        // animals to show this round
    likedAnimals: [],        // animals liked this round
    allLikedAnimals: [],     // animals liked across all rounds (with rankings)
    bracketAnimals: [],      // animals in current bracket
    bracketRound: 0,
    bracketMatchIndex: 0,
    bracketWinners: [],
    seenAnimalIds: [],       // track which animals have been shown
    preferences: {},         // tag -> score for preference tracking
    winner: null,
  };

  // --- Utility Functions ---

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
    state.phase = name;
    saveState();
  }

  // --- Preference Tracking ---

  function updatePreferences(animal, liked) {
    const weight = liked ? 1 : -0.5;
    animal.tags.forEach((tag) => {
      state.preferences[tag] = (state.preferences[tag] || 0) + weight;
    });
    // Also track category preference
    state.preferences[animal.category] =
      (state.preferences[animal.category] || 0) + weight * 1.5;
  }

  function scoreAnimal(animal) {
    let score = 0;
    animal.tags.forEach((tag) => {
      score += state.preferences[tag] || 0;
    });
    score += (state.preferences[animal.category] || 0) * 1.5;
    // Add randomness to prevent monotony
    score += Math.random() * 3;
    return score;
  }

  // --- Animal Selection ---

  function selectRoundAnimals() {
    // Filter out already-seen animals
    let available = ANIMALS.filter(
      (a) => !state.seenAnimalIds.includes(a.id)
    );

    // If we've seen most animals, reset the seen list but keep preferences
    if (available.length < LIKES_PER_ROUND * 2) {
      state.seenAnimalIds = state.allLikedAnimals.map((a) => a.id);
      available = ANIMALS.filter(
        (a) => !state.seenAnimalIds.includes(a.id)
      );
    }

    // If still too few, allow all
    if (available.length < LIKES_PER_ROUND * 2) {
      state.seenAnimalIds = [];
      available = [...ANIMALS];
    }

    // Score animals by preference and sort, take top candidates with variety
    const scored = available.map((a) => ({
      animal: a,
      score: scoreAnimal(a),
    }));
    scored.sort((a, b) => b.score - a.score);

    // Take a mix: top 60% preference-based + 40% random for variety
    const prefCount = Math.ceil(scored.length * 0.6);
    const prefAnimals = scored.slice(0, prefCount).map((s) => s.animal);
    const restAnimals = scored.slice(prefCount).map((s) => s.animal);

    const selected = [
      ...shuffle(prefAnimals).slice(0, Math.ceil(LIKES_PER_ROUND * 1.5)),
      ...shuffle(restAnimals).slice(0, Math.ceil(LIKES_PER_ROUND * 0.8)),
    ];

    state.roundAnimals = shuffle(selected);
    state.currentAnimalIndex = 0;
    state.likedAnimals = [];
  }

  // --- Selection Phase ---

  function showCurrentAnimal() {
    if (state.currentAnimalIndex >= state.roundAnimals.length) {
      // Ran out of animals in this batch, get more
      if (state.likedAnimals.length >= LIKES_PER_ROUND) {
        startRanking();
        return;
      }
      // Need more animals
      selectRoundAnimals();
    }

    const animal = state.roundAnimals[state.currentAnimalIndex];
    if (!animal) return;

    const cat = CATEGORIES[animal.category] || CATEGORIES.other;

    els.cardEmoji.textContent = animal.emoji;
    els.cardName.textContent = animal.name;
    els.cardFact.textContent = animal.fact;
    els.cardCategory.textContent = cat.name;
    els.cardCategory.style.background = cat.color;
    els.likedCount.textContent = state.likedAnimals.length;

    // Reset card position
    els.card.style.transform = "";
    els.card.style.opacity = "";
    els.card.classList.remove("animating", "swiping");
  }

  function handleSwipe(direction) {
    const animal = state.roundAnimals[state.currentAnimalIndex];
    if (!animal) return;

    const liked = direction === "right";
    updatePreferences(animal, liked);
    state.seenAnimalIds.push(animal.id);

    if (liked) {
      state.likedAnimals.push(animal);
    }

    // Animate card exit
    els.card.classList.add("animating");
    const exitX = direction === "right" ? 500 : -500;
    els.card.style.transform = `translateX(${exitX}px) rotate(${direction === "right" ? 20 : -20}deg)`;
    els.card.style.opacity = "0";

    setTimeout(() => {
      state.currentAnimalIndex++;

      if (state.likedAnimals.length >= LIKES_PER_ROUND) {
        startRanking();
      } else {
        showCurrentAnimal();
      }
    }, 350);
  }

  // --- Touch / Mouse Swipe Handling ---

  let dragState = null;

  function onPointerDown(e) {
    if (state.phase !== "selection") return;
    // Only handle primary pointer
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragState = {
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      isDragging: false,
    };

    els.card.classList.add("swiping");
    els.card.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    if (!dragState || state.phase !== "selection") return;

    dragState.currentX = e.clientX;
    const dx = dragState.currentX - dragState.startX;

    if (Math.abs(dx) > 10) {
      dragState.isDragging = true;
    }

    if (dragState.isDragging) {
      const rotation = dx * 0.08;
      els.card.style.transform = `translateX(${dx}px) rotate(${rotation}deg)`;

      // Show hints
      if (dx > SWIPE_THRESHOLD / 2) {
        els.hintRight.classList.add("visible");
        els.hintLeft.classList.remove("visible");
      } else if (dx < -SWIPE_THRESHOLD / 2) {
        els.hintLeft.classList.add("visible");
        els.hintRight.classList.remove("visible");
      } else {
        els.hintLeft.classList.remove("visible");
        els.hintRight.classList.remove("visible");
      }
    }
  }

  function onPointerUp(e) {
    if (!dragState || state.phase !== "selection") return;

    els.card.classList.remove("swiping");
    els.hintLeft.classList.remove("visible");
    els.hintRight.classList.remove("visible");

    const dx = dragState.currentX - dragState.startX;

    if (dragState.isDragging && Math.abs(dx) > SWIPE_THRESHOLD) {
      handleSwipe(dx > 0 ? "right" : "left");
    } else {
      // Snap back
      els.card.classList.add("animating");
      els.card.style.transform = "";
      setTimeout(() => els.card.classList.remove("animating"), 300);
    }

    dragState = null;
  }

  // --- Keyboard Handling ---

  function onKeyDown(e) {
    if (state.phase === "selection") {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleSwipe("right");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleSwipe("left");
      }
    }
  }

  // --- Ranking Phase ---

  function startRanking() {
    showScreen("ranking");
    renderRankingList();
  }

  function renderRankingList() {
    els.rankingList.innerHTML = "";

    state.likedAnimals.forEach((animal, index) => {
      const item = document.createElement("div");
      item.className = "ranking-item";
      item.draggable = true;
      item.dataset.index = index;

      item.innerHTML = `
        <span class="ranking-number">${index + 1}</span>
        <span class="ranking-emoji">${animal.emoji}</span>
        <span class="ranking-name">${animal.name}</span>
        <span class="ranking-handle">\u2630</span>
      `;

      // Drag events (desktop)
      item.addEventListener("dragstart", onDragStart);
      item.addEventListener("dragover", onDragOver);
      item.addEventListener("dragleave", onDragLeave);
      item.addEventListener("drop", onDrop);
      item.addEventListener("dragend", onDragEnd);

      // Touch drag events (mobile)
      item.addEventListener("touchstart", onTouchDragStart, { passive: false });
      item.addEventListener("touchmove", onTouchDragMove, { passive: false });
      item.addEventListener("touchend", onTouchDragEnd);

      els.rankingList.appendChild(item);
    });
  }

  // Desktop drag-and-drop
  let dragSourceIndex = null;

  function onDragStart(e) {
    dragSourceIndex = parseInt(e.currentTarget.dataset.index);
    e.currentTarget.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  }

  function onDragLeave(e) {
    e.currentTarget.classList.remove("drag-over");
  }

  function onDrop(e) {
    e.preventDefault();
    const targetIndex = parseInt(e.currentTarget.dataset.index);
    e.currentTarget.classList.remove("drag-over");

    if (dragSourceIndex !== null && dragSourceIndex !== targetIndex) {
      const moved = state.likedAnimals.splice(dragSourceIndex, 1)[0];
      state.likedAnimals.splice(targetIndex, 0, moved);
      renderRankingList();
    }
  }

  function onDragEnd(e) {
    e.currentTarget.classList.remove("dragging");
    dragSourceIndex = null;
  }

  // Mobile touch drag-and-drop
  let touchDragState = null;

  function onTouchDragStart(e) {
    const item = e.currentTarget;
    const touch = e.touches[0];

    touchDragState = {
      sourceIndex: parseInt(item.dataset.index),
      startY: touch.clientY,
      currentY: touch.clientY,
      item: item,
      clone: null,
    };

    // Create visual clone
    const clone = item.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = item.getBoundingClientRect().left + "px";
    clone.style.top = item.getBoundingClientRect().top + "px";
    clone.style.width = item.getBoundingClientRect().width + "px";
    clone.style.zIndex = "1000";
    clone.style.opacity = "0.9";
    clone.style.pointerEvents = "none";
    clone.style.boxShadow = "0 8px 25px rgba(0,0,0,0.3)";
    clone.style.transform = "scale(1.05)";
    document.body.appendChild(clone);
    touchDragState.clone = clone;

    item.style.opacity = "0.3";

    e.preventDefault();
  }

  function onTouchDragMove(e) {
    if (!touchDragState) return;
    e.preventDefault();

    const touch = e.touches[0];
    touchDragState.currentY = touch.clientY;

    // Move clone
    if (touchDragState.clone) {
      const dy = touch.clientY - touchDragState.startY;
      const origTop = touchDragState.item.getBoundingClientRect().top;
      touchDragState.clone.style.top = origTop + dy + "px";
    }

    // Highlight target
    const items = els.rankingList.querySelectorAll(".ranking-item");
    items.forEach((item) => {
      item.classList.remove("drag-over");
      const rect = item.getBoundingClientRect();
      if (
        touch.clientY > rect.top &&
        touch.clientY < rect.bottom &&
        parseInt(item.dataset.index) !== touchDragState.sourceIndex
      ) {
        item.classList.add("drag-over");
      }
    });
  }

  function onTouchDragEnd(e) {
    if (!touchDragState) return;

    // Find drop target
    const items = els.rankingList.querySelectorAll(".ranking-item");
    let targetIndex = null;

    items.forEach((item) => {
      if (item.classList.contains("drag-over")) {
        targetIndex = parseInt(item.dataset.index);
      }
      item.classList.remove("drag-over");
    });

    // Remove clone
    if (touchDragState.clone) {
      touchDragState.clone.remove();
    }

    touchDragState.item.style.opacity = "";

    // Reorder
    if (targetIndex !== null && targetIndex !== touchDragState.sourceIndex) {
      const moved = state.likedAnimals.splice(touchDragState.sourceIndex, 1)[0];
      state.likedAnimals.splice(targetIndex, 0, moved);
      renderRankingList();
    }

    touchDragState = null;
  }

  function confirmRanking() {
    // Add ranked animals to all-liked list with their ranking
    state.likedAnimals.forEach((animal, index) => {
      const existing = state.allLikedAnimals.find((a) => a.id === animal.id);
      if (!existing) {
        state.allLikedAnimals.push({
          ...animal,
          roundRank: index + 1,
          round: state.round,
        });
      }
    });

    // Check if we have enough animals for brackets
    if (state.allLikedAnimals.length >= 8 && state.round >= 2) {
      startBracket();
    } else {
      // Start another selection round
      state.round++;
      selectRoundAnimals();
      els.roundNumber.textContent = state.round;
      showScreen("selection");
      showCurrentAnimal();
    }
  }

  // --- Bracket Phase ---

  function startBracket() {
    // Take the top-ranked animals from each round
    // Sort by round rank, take the best
    const sorted = [...state.allLikedAnimals].sort(
      (a, b) => a.roundRank - b.roundRank
    );

    // Take top 8 (or closest power of 2)
    let count = 8;
    if (sorted.length >= 16) count = 16;
    if (sorted.length < 8) count = sorted.length;

    // Ensure power of 2
    count = Math.pow(2, Math.floor(Math.log2(count)));
    if (count < 2) count = 2;

    state.bracketAnimals = sorted.slice(0, count);
    state.bracketRound = 0;
    state.bracketMatchIndex = 0;
    state.bracketWinners = [];

    showScreen("bracket");
    showBracketMatch();
  }

  function showBracketMatch() {
    const animals = state.bracketAnimals;
    const matchIndex = state.bracketMatchIndex;
    const totalMatches = Math.floor(animals.length / 2);

    // Title based on remaining count
    const remaining = animals.length;
    if (remaining === 2) {
      els.bracketTitle.textContent = "\u{1F3C6} The Final!";
      els.bracketSubtitle.textContent = "Pick the ultimate winner!";
    } else if (remaining === 4) {
      els.bracketTitle.textContent = "\u{1F525} Semi-Finals!";
      els.bracketSubtitle.textContent = `Match ${matchIndex + 1} of ${totalMatches}`;
    } else if (remaining === 8) {
      els.bracketTitle.textContent = "\u{2B50} Quarter-Finals!";
      els.bracketSubtitle.textContent = `Match ${matchIndex + 1} of ${totalMatches}`;
    } else {
      els.bracketTitle.textContent = "\u{1F3C6} Championship!";
      els.bracketSubtitle.textContent = `Match ${matchIndex + 1} of ${totalMatches}`;
    }

    const leftAnimal = animals[matchIndex * 2];
    const rightAnimal = animals[matchIndex * 2 + 1];

    els.bracketLeft.querySelector(".bracket-emoji").textContent =
      leftAnimal.emoji;
    els.bracketLeft.querySelector(".bracket-name").textContent =
      leftAnimal.name;

    els.bracketRight.querySelector(".bracket-emoji").textContent =
      rightAnimal.emoji;
    els.bracketRight.querySelector(".bracket-name").textContent =
      rightAnimal.name;

    // Show progress dots
    els.bracketProgress.innerHTML = "";
    for (let i = 0; i < totalMatches; i++) {
      const dot = document.createElement("div");
      dot.className = "bracket-dot";
      if (i < matchIndex) dot.classList.add("done");
      if (i === matchIndex) dot.classList.add("current");
      els.bracketProgress.appendChild(dot);
    }
  }

  function handleBracketChoice(side) {
    const matchIndex = state.bracketMatchIndex;
    const winner =
      side === "left"
        ? state.bracketAnimals[matchIndex * 2]
        : state.bracketAnimals[matchIndex * 2 + 1];

    state.bracketWinners.push(winner);
    state.bracketMatchIndex++;

    const totalMatches = Math.floor(state.bracketAnimals.length / 2);

    if (state.bracketMatchIndex >= totalMatches) {
      // This round of bracket is done
      if (state.bracketWinners.length === 1) {
        // We have a winner!
        state.winner = state.bracketWinners[0];
        showWinner();
      } else {
        // Next bracket round
        state.bracketAnimals = [...state.bracketWinners];
        state.bracketWinners = [];
        state.bracketMatchIndex = 0;
        state.bracketRound++;
        showBracketMatch();
      }
    } else {
      showBracketMatch();
    }
  }

  // --- Winner Screen ---

  function showWinner() {
    const animal = state.winner;
    els.winnerEmoji.textContent = animal.emoji;
    els.winnerName.textContent = animal.name;
    els.winnerFact.textContent = animal.fact;

    showScreen("winner");
    spawnConfetti();
    saveState();
  }

  function spawnConfetti() {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFE66D",
      "#95E1D3",
      "#F38181",
      "#AA96DA",
      "#FCBAD3",
      "#A8D8EA",
    ];

    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.background =
          colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = 2 + Math.random() * 3 + "s";
        piece.style.animationDelay = Math.random() * 0.5 + "s";
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
        piece.style.width = 6 + Math.random() * 10 + "px";
        piece.style.height = 6 + Math.random() * 10 + "px";
        document.body.appendChild(piece);

        setTimeout(() => piece.remove(), 5500);
      }, i * 60);
    }
  }

  // --- Local Storage ---

  function saveState() {
    try {
      const toSave = {
        phase: state.phase,
        round: state.round,
        currentAnimalIndex: state.currentAnimalIndex,
        roundAnimals: state.roundAnimals.map((a) => a.id),
        likedAnimals: state.likedAnimals.map((a) => a.id),
        allLikedAnimals: state.allLikedAnimals.map((a) => ({
          id: a.id,
          roundRank: a.roundRank,
          round: a.round,
        })),
        bracketAnimals: state.bracketAnimals.map((a) => a.id),
        bracketRound: state.bracketRound,
        bracketMatchIndex: state.bracketMatchIndex,
        bracketWinners: state.bracketWinners.map((a) => a.id),
        seenAnimalIds: state.seenAnimalIds,
        preferences: state.preferences,
        winner: state.winner ? state.winner.id : null,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      // localStorage might be unavailable
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;

      const saved = JSON.parse(raw);

      const findAnimal = (id) => ANIMALS.find((a) => a.id === id);
      const findAnimals = (ids) =>
        ids.map(findAnimal).filter(Boolean);

      state.phase = saved.phase || "welcome";
      state.round = saved.round || 1;
      state.currentAnimalIndex = saved.currentAnimalIndex || 0;
      state.roundAnimals = findAnimals(saved.roundAnimals || []);
      state.likedAnimals = findAnimals(saved.likedAnimals || []);
      state.allLikedAnimals = (saved.allLikedAnimals || [])
        .map((s) => {
          const animal = findAnimal(s.id);
          if (!animal) return null;
          return { ...animal, roundRank: s.roundRank, round: s.round };
        })
        .filter(Boolean);
      state.bracketAnimals = findAnimals(saved.bracketAnimals || []);
      state.bracketRound = saved.bracketRound || 0;
      state.bracketMatchIndex = saved.bracketMatchIndex || 0;
      state.bracketWinners = findAnimals(saved.bracketWinners || []);
      state.seenAnimalIds = saved.seenAnimalIds || [];
      state.preferences = saved.preferences || {};
      state.winner = saved.winner ? findAnimal(saved.winner) : null;

      return true;
    } catch (e) {
      return false;
    }
  }

  function resetState() {
    state = {
      phase: "welcome",
      round: 1,
      currentAnimalIndex: 0,
      roundAnimals: [],
      likedAnimals: [],
      allLikedAnimals: [],
      bracketAnimals: [],
      bracketRound: 0,
      bracketMatchIndex: 0,
      bracketWinners: [],
      seenAnimalIds: [],
      preferences: {},
      winner: null,
    };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  }

  // --- Game Flow ---

  function startNewGame() {
    resetState();
    state.round = 1;
    els.roundNumber.textContent = state.round;
    selectRoundAnimals();
    showScreen("selection");
    showCurrentAnimal();
  }

  function resumeGame() {
    switch (state.phase) {
      case "selection":
        els.roundNumber.textContent = state.round;
        showScreen("selection");
        showCurrentAnimal();
        break;
      case "ranking":
        showScreen("ranking");
        renderRankingList();
        break;
      case "bracket":
        showScreen("bracket");
        showBracketMatch();
        break;
      case "winner":
        if (state.winner) {
          showWinner();
        } else {
          startNewGame();
        }
        break;
      default:
        showScreen("welcome");
    }
  }

  // --- Initialization ---

  function init() {
    // Check for saved game
    const hasSaved = loadState();

    if (hasSaved && state.phase !== "welcome") {
      els.btnContinue.style.display = "";
      els.btnReset.style.display = "";
    }

    // Event listeners
    els.btnStart.addEventListener("click", startNewGame);
    els.btnContinue.addEventListener("click", resumeGame);
    els.btnReset.addEventListener("click", () => {
      resetState();
      els.btnContinue.style.display = "none";
      els.btnReset.style.display = "none";
    });

    els.btnConfirmRanking.addEventListener("click", confirmRanking);

    els.bracketLeft.addEventListener("click", () =>
      handleBracketChoice("left")
    );
    els.bracketRight.addEventListener("click", () =>
      handleBracketChoice("right")
    );

    els.btnPlayAgain.addEventListener("click", startNewGame);

    // Swipe handling on card
    els.card.addEventListener("pointerdown", onPointerDown);
    els.card.addEventListener("pointermove", onPointerMove);
    els.card.addEventListener("pointerup", onPointerUp);
    els.card.addEventListener("pointercancel", onPointerUp);

    // Keyboard handling
    document.addEventListener("keydown", onKeyDown);
  }

  init();
})();
