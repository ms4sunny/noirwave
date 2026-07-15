// ========================================================
// 📟 NOIR-AMP INTERACTIVE MEDIA ENGINE (REAL LOCAL AUDIO)
// ========================================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎵 Noir-Amp Engine Active");

  // --- GRAB HTML ELEMENTS ---
  const musicIcon = document.getElementById("musicApp");
  const musicPopup = document.getElementById("musicPopup");
  const closeMusic = document.getElementById("closeMusic");
  const toggleMiniBtn = document.getElementById("toggleMiniMode");
  const ampContainer = document.getElementById("ampContainer");

  // Track Display Controls
  const playBtn = document.getElementById("ampPlay");
  const stopBtn = document.getElementById("ampStop");
  const prevBtn = document.getElementById("ampPrev");
  const nextBtn = document.getElementById("ampNext");
  const miniPlayBtn = document.getElementById("miniPlayBtn");
  
  const trackNameDisplay = document.getElementById("ampTrackName");
  const miniTrackNameDisplay = document.getElementById("ampMiniTrackName");
  const timeDisplay = document.getElementById("ampTimeDisplay");
  
  // Progress bars
  const timeline = document.getElementById("ampTimeline");
  const miniTimeline = document.getElementById("ampMiniTimeline");
  
  const volumeSlider = document.getElementById("ampVolume");
  const fileInput = document.getElementById("ampFileInput");
  const waveBars = document.querySelectorAll(".amp-wave-bar");

  // --- THE NATIVE AUDIO OBJECT ---
  const audio = new Audio();

  // --- PLAYLIST DATA ENGINE ---
  const defaultPlaylist = [
    { title: "Midnight Drive", artist: "NoirWave Lofi", url: "" },
    { title: "Neon Reflections", artist: "Cyber Sonic", url: "" }
  ];
  let currentPlaylist = [...defaultPlaylist];
  let trackIndex = 0;
  let isMiniMode = false;
  let isDraggingTimeline = false;

  // --- TRACK LOADER ---
  function loadTrack(index) {
    if (currentPlaylist.length === 0) return;
    const track = currentPlaylist[index];
    
    const displayString = `${index + 1}. ${track.title} - ${track.artist}`;
    if (trackNameDisplay) trackNameDisplay.textContent = displayString;
    if (miniTrackNameDisplay) miniTrackNameDisplay.textContent = `${track.title}.mp3`;

    if (track.url) {
      audio.src = track.url;
    } else {
      audio.src = "";
    }
    
    resetPlaybackUI();
  }

  function resetPlaybackUI() {
    if (timeline) timeline.value = 0;
    if (miniTimeline) miniTimeline.value = 0;
    if (timeDisplay) timeDisplay.textContent = "00:00";
  }

  // --- REAL-TIME PLAYER STATUS OPERATIONS ---
  function playAudio() {
    if (!audio.src) {
      alert("Please load a local MP3 file using the '📁 LOAD MP3' button first!");
      return;
    }
    audio.play();
    if (playBtn) playBtn.textContent = "⏸";
    if (miniPlayBtn) miniPlayBtn.textContent = "⏸";
    startVisualizer();
  }

  function pauseAudio() {
    audio.pause();
    if (playBtn) playBtn.textContent = "▶";
    if (miniPlayBtn) miniPlayBtn.textContent = "▶";
    stopVisualizer();
  }

  function stopAudio() {
    audio.pause();
    audio.currentTime = 0;
    if (playBtn) playBtn.textContent = "▶";
    if (miniPlayBtn) miniPlayBtn.textContent = "▶";
    resetPlaybackUI();
    stopVisualizer();
  }

  // --- LOCAL DEVICE FILE LOADING DOCK ---
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const files = e.target.files;
      if (files.length === 0) return;

      const file = files[0];
      const fileURL = URL.createObjectURL(file);

      const userTrack = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Local File",
        url: fileURL
      };

      currentPlaylist.push(userTrack);
      trackIndex = currentPlaylist.length - 1;
      loadTrack(trackIndex);
      
      setTimeout(playAudio, 100);
    });
  }

  // --- UPDATE TIMELINE POSITIONS ---
  function updateTimelines(progress) {
    if (timeline && !isDraggingTimeline) {
      timeline.value = progress;
    }
    if (miniTimeline && !isDraggingTimeline) {
      miniTimeline.value = progress;
    }
  }

  // --- AUDIO PROGRESS TIME TRACKERS ---
  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const progressPercent = (audio.currentTime / audio.duration) * 100;
    updateTimelines(progressPercent);

    let mins = Math.floor(audio.currentTime / 60);
    let secs = Math.floor(audio.currentTime % 60);
    if (mins < 10) mins = "0" + mins;
    if (secs < 10) secs = "0" + secs;
    
    if (timeDisplay) timeDisplay.textContent = `${mins}:${secs}`;
  });

  // --- MAIN TIMELINE EVENT LISTENERS ---
  if (timeline) {
    // When user starts dragging
    timeline.addEventListener("mousedown", () => {
      isDraggingTimeline = true;
    });
    
    timeline.addEventListener("touchstart", () => {
      isDraggingTimeline = true;
    });

    // When user drags the slider
    timeline.addEventListener("input", () => {
      if (!audio.duration) return;
      const newTime = (timeline.value / 100) * audio.duration;
      audio.currentTime = newTime;
      
      // Sync mini timeline
      if (miniTimeline) {
        miniTimeline.value = timeline.value;
      }
    });

    // When user releases the slider
    timeline.addEventListener("mouseup", () => {
      isDraggingTimeline = false;
    });
    
    timeline.addEventListener("touchend", () => {
      isDraggingTimeline = false;
    });
  }

  // --- MINI TIMELINE EVENT LISTENERS ---
  if (miniTimeline) {
    // When user starts dragging
    miniTimeline.addEventListener("mousedown", () => {
      isDraggingTimeline = true;
    });
    
    miniTimeline.addEventListener("touchstart", () => {
      isDraggingTimeline = true;
    });

    // When user drags the slider
    miniTimeline.addEventListener("input", () => {
      if (!audio.duration) return;
      const newTime = (miniTimeline.value / 100) * audio.duration;
      audio.currentTime = newTime;
      
      // Sync main timeline
      if (timeline) {
        timeline.value = miniTimeline.value;
      }
    });

    // When user releases the slider
    miniTimeline.addEventListener("mouseup", () => {
      isDraggingTimeline = false;
    });
    
    miniTimeline.addEventListener("touchend", () => {
      isDraggingTimeline = false;
    });
  }

  // --- VOLUME CONTROL ---
  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      audio.volume = volumeSlider.value / 100;
    });
  }

  // --- MOCK ANIMATION VISUALIZER DANCE ---
  let vizTimer = null;
  function startVisualizer() {
    clearInterval(vizTimer);
    vizTimer = setInterval(() => {
      waveBars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 35) + 5;
        bar.style.height = randomHeight + "px";
      });
    }, 120);
  }

  function stopVisualizer() {
    clearInterval(vizTimer);
    waveBars.forEach(bar => bar.style.height = "4px");
  }

  // --- MINI-VIEW TOGGLE ENGINE WITH localStorage ---
  function loadMiniModeState() {
    const savedState = localStorage.getItem("noiramp-mini-mode");
    if (savedState === "true") {
      ampContainer.classList.add("mini-view");
      if (toggleMiniBtn) toggleMiniBtn.classList.add("active");
      isMiniMode = true;
    } else {
      ampContainer.classList.remove("mini-view");
      if (toggleMiniBtn) toggleMiniBtn.classList.remove("active");
      isMiniMode = false;
    }
  }

  function toggleMiniMode() {
    isMiniMode = !isMiniMode;
    
    if (isMiniMode) {
      ampContainer.classList.add("mini-view");
      if (toggleMiniBtn) toggleMiniBtn.classList.add("active");
      localStorage.setItem("noiramp-mini-mode", "true");
    } else {
      ampContainer.classList.remove("mini-view");
      if (toggleMiniBtn) toggleMiniBtn.classList.remove("active");
      localStorage.setItem("noiramp-mini-mode", "false");
    }
    
    window.dispatchEvent(new CustomEvent('miniModeToggled', { 
      detail: { isMiniMode: isMiniMode }
    }));
  }

  if (toggleMiniBtn) {
    toggleMiniBtn.addEventListener("click", toggleMiniMode);
  }

  // Keyboard shortcut: M key
  window.addEventListener("keydown", (e) => {
    if ((e.key === "m" || e.key === "M") && 
        e.target.tagName !== "INPUT" && 
        e.target.tagName !== "TEXTAREA") {
      toggleMiniMode();
    }
  });

  // --- TRACK SELECTION CAROUSEL NAVIGATION ---
  function navigatePlaylist(direction) {
    trackIndex += direction;
    if (trackIndex < 0) trackIndex = currentPlaylist.length - 1;
    if (trackIndex >= currentPlaylist.length) trackIndex = 0;
    
    loadTrack(trackIndex);
    playAudio();
  }

  // --- CORE WINDOW UI CLICKS ---
  if (musicIcon) {
    musicIcon.addEventListener("click", () => {
      musicPopup.classList.remove("hidden");
      if (window.showBlur) window.showBlur();
    });
  }

  if (closeMusic) {
    closeMusic.addEventListener("click", () => {
      stopAudio();
      musicPopup.classList.add("hidden");
      if (window.hideBlur) window.hideBlur();
    });
  }

  // --- DRAG ENGINE FOR NOIR-AMP ---
  const ampHeader = document.getElementById("ampHeader");

  if (ampContainer && ampHeader) {
    let isDragging = false;
    let initialX = 0;
    let initialY = 0;

    ampHeader.style.cursor = "move";

    function dragStart(e) {
      if (e.target.closest('button')) return;

      let clientX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
      let clientY = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

      initialX = clientX - musicPopup.offsetLeft;
      initialY = clientY - musicPopup.offsetTop;
      isDragging = true;
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();

      let clientX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      let clientY = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      musicPopup.style.left = `${clientX - initialX}px`;
      musicPopup.style.top = `${clientY - initialY}px`;
    }

    function dragEnd() {
      isDragging = false;
    }

    ampHeader.addEventListener("mousedown", dragStart);
    window.addEventListener("mousemove", drag, { passive: false });
    window.addEventListener("mouseup", dragEnd);

    ampHeader.addEventListener("touchstart", dragStart, { passive: true });
    window.addEventListener("touchmove", drag, { passive: false });
    window.addEventListener("touchend", dragEnd);
  }

  // --- ACTION CLICK BINDINGS ---
  if (playBtn) {
    playBtn.addEventListener("click", () => {
      if (audio.paused) playAudio(); else pauseAudio();
    });
  }

  if (miniPlayBtn) {
    miniPlayBtn.addEventListener("click", () => {
      if (audio.paused) playAudio(); else pauseAudio();
    });
  }
  
  if (stopBtn) stopBtn.addEventListener("click", stopAudio);
  if (prevBtn) prevBtn.addEventListener("click", () => navigatePlaylist(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => navigatePlaylist(1));

  // --- SKIN ROTATION STATE SYSTEM ---
  const NOIR_SKINS = [
    "cyber-knob",
    "led-glass",
    "liquid-mercury",
    "solid-carbon",
    "neon-overdrive",
    "horizon-strip"
  ];

  function syncAmpSkin() {
    if (!ampContainer) return;

    ampContainer.classList.remove(
      "skin-cyber-knob", 
      "skin-led-glass", 
      "skin-liquid-mercury", 
      "skin-solid-carbon", 
      "skin-neon-overdrive", 
      "skin-horizon-strip"
    );

    const currentSkin = localStorage.getItem("noiramp-active-skin") || "cyber-knob";
    ampContainer.classList.add(`skin-${currentSkin}`);
    
    // Re-apply mini-mode state after skin change
    if (isMiniMode) {
      ampContainer.classList.add("mini-view");
    }
  }

  // Arrow key skin switcher
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const currentSkin = localStorage.getItem("noiramp-active-skin") || "cyber-knob";
      let currentIndex = NOIR_SKINS.indexOf(currentSkin);
      if (currentIndex === -1) currentIndex = 0;

      if (e.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % NOIR_SKINS.length;
      } else if (e.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + NOIR_SKINS.length) % NOIR_SKINS.length;
      }

      const newSkinSelected = NOIR_SKINS[currentIndex];
      localStorage.setItem("noiramp-active-skin", newSkinSelected);
      syncAmpSkin();
      
      console.log(`🔌 Hardware Skin Morphed To: ${newSkinSelected.toUpperCase()}`);
    }
  });

  // --- INITIALIZE ---
  loadMiniModeState();
  loadTrack(trackIndex);
  syncAmpSkin();

  console.log("✅ Noir-Amp initialized successfully");
});