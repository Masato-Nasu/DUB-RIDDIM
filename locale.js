"use strict";

const dubLocale = (() => {
  const english = {
    rewindNote: "Tap for a rewind", rewindHint: "Up/down for pitch, left/right for speed and duration. Center plays at the original speed.",
    openChrome: "Open in Chrome on Android", dubNote: "Dub-mix the playing audio with your finger", dubHint: "Play music or a rhythm first. Right: deeper echo. Up/down: brighter/darker. Release to let the tail ring out.",
    grooveUndo: "Undo preset change",
    songHint: "Sections play from top to bottom. Build the arrangement with part mutes and echo sends.",
    songExport: "Export song as WAV", songAdd: "+ Add section",
    songNote: "WAV exports this arrangement. To capture live FIRE performance and imported music too, start recording below, then PLAY SONG.",
    songExporting: "Rendering the full song…", songExported: "WAV ready. Your project remains editable.",
    songExportError: "Could not export. Try a shorter arrangement or use mix recording.",

    grooveHint: "Start the rhythm with PLAY. Tap a part to mute. Play the siren with FIRE.",
    grooveEdit: "Edit rhythm & bass", grooveGridHint: "Toggle drum steps here. Edit pitched notes in the piano roll below.",
    grooveCopy: "Copy bar to all bars", grooveSave: "Save session", grooveLoad: "Load session",
    grooveReady: "4-bar loop · Original synthesized sounds · Edits saved on this device",
    groovePlaying: "Rhythm playing · Hold ECHO to send a part into delay.", grooveStopped: "Rhythm stopped. Echo tails fade naturally.",
    grooveLoaded: "Session loaded.", grooveInvalid: "Choose a valid DUB RIDDIM session JSON file.",
    grooveSaved: "Session saved. Use MUSIC & REC to save audio.", grooveError: "Could not start the rhythm. Please try PLAY again.",
    grooveCopied: "Copied this bar to all four bars.", grooveChanged: "Rhythm changed. Undo preset change restores your previous edits.",

    install: "Install", effects: "Sound effects", chooseTrack: "Choose audio file",
    language: "Language", noTrack: "No file selected",
    play: "▶ Play", pause: "Ⅱ Pause", trackInitial: "Choose an MP3 or WAV saved on your device.",
    fileHelp: "File picker not opening?",
    fileHelpText: "If you opened this page inside another app, open it in Chrome to choose an audio file.",
    seek: "Track position", trackVolume: "Track volume",
    recordStart: "● Start recording", recordStop: "■ Stop recording",
    recordHint: "Record rhythm, music and effects together.", takePreview: "Preview recording",
    takeSave: "Save recording", soundControls: "Sound and delay controls", waveforms: "Waveforms",
    depth: "Mod depth", time: "Delay time", feedback: "Feedback", echo: "Echo level",
    volume: "FX volume", kill: "■ Cut echo",
    audioError: "Could not start audio. Check your connection and press FIRE again.",
    sirenNote: "Hold to play", hornNote: "Tap to fire the air horn", thunderNote: "Hit the spring tank",
    sirenHint: "Up and down for pitch, left and right for modulation speed. Release to let the echo ring out.",
    hornHint: "Tap at different spots for pitch and tone. Tap repeatedly to play a rhythm.",
    thunderHint: "Tap for a spring crash. Up and down for depth, left and right for bite.",
    keyboard: "On a keyboard, press Space to play.",
    trackLoading: "Loading audio file…", trackReady: "Track loaded. Press Play.",
    trackPlayError: "Could not play this file. Try another audio file.",
    trackReadError: "Could not read this file. Choose an MP3 or WAV saved on your device.",
    recordUnavailable: "This browser cannot record audio.", recording: "Recording",
    recordDone: "Recording ready", recordSaveError: "Could not save the recording.",
    recordStartError: "Could not start recording.",
    recoverTitle: "DUB RIDDIM Startup Repair", recoverStatus: "Updating the files needed to start the app.",
    recoverRetry: "Try again", recoverError: "Could not update. Check your connection and try again."
  };

  function initialLanguage() {
    const requested = new URLSearchParams(location.search).get("lang");
    if (requested === "ja" || requested === "en") return requested;
    try {
      const saved = localStorage.getItem("dub-siren-language");
      if (saved === "ja" || saved === "en") return saved;
    } catch {
      // The browser language still works when storage is unavailable.
    }
    return /^ja(?:-|$)/i.test(navigator.language) ? "ja" : "en";
  }

  let language = initialLanguage();
  const japanese = {};
  const translate = (key, fallback) => (language === "en" ? english : japanese)[key] ?? fallback;

  function remember(key, text) {
    if (key && japanese[key] === undefined) japanese[key] = text;
  }

  const entries = Array.from(document.querySelectorAll("[data-i18n], [data-i18n-label]"));
  for (const el of entries) {
    remember(el.dataset.i18n, el.textContent);
    remember(el.dataset.i18nLabel, el.getAttribute("aria-label"));
  }
  const languageButtons = document.querySelectorAll("[data-language]");

  function render() {
    document.documentElement.lang = language;
    for (const el of entries) {
      const { i18n, i18nLabel } = el.dataset;
      if (i18n) el.textContent = translate(i18n, el.textContent);
      if (i18nLabel) el.setAttribute("aria-label", translate(i18nLabel, el.getAttribute("aria-label")));
    }
    for (const button of languageButtons) {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    }
  }

  function set(el, key, fallback) {
    remember(key, fallback);
    el.dataset.i18n = key;
    if (!entries.includes(el)) entries.push(el);
    el.textContent = translate(key, fallback);
  }

  for (const button of languageButtons) {
    button.addEventListener("click", () => {
      language = button.dataset.language;
      try { localStorage.setItem("dub-siren-language", language); } catch {}
      const url = new URL(location.href);
      if (url.searchParams.has("lang")) {
        url.searchParams.set("lang", language);
        history.replaceState(null, "", url);
      }
      render();
      document.dispatchEvent(new Event("dub-language-change"));
    });
  }
  render();
  return { set, text: translate };
})();
