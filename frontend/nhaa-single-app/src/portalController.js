// Portal workflow controller

let currentTab = 1;
let isRecording = false;
let voiceRecognition = null;
let voiceTimer = null;
let voiceSeconds = 0;
let voiceFinalTranscript = "";

let maxUnlocked = 1;

let selectedLanguage = null;
let selectedCommMode = null;
let isHandlingBrowserBack = false;

import { API_V1_URL } from "./apiConfig";

const API_BASE_URL = API_V1_URL;
// ============================================================
// AUTH MODE
// ============================================================

function showAuthMode(mode) {
  const loginView = document.getElementById("auth-login-view");
  const signupView = document.getElementById("auth-signup-view");

  if (!loginView || !signupView) return;

  if (mode === "signup") {
    loginView.classList.add("hidden");
    signupView.classList.remove("hidden");
  } else {
    signupView.classList.add("hidden");
    loginView.classList.remove("hidden");
  }

  window.scrollTo({
    top: 120,
    behavior: "smooth",
  });
}


// ============================================================
// NOTIFICATION
// ============================================================

function notify(message) {
  let toast = document.getElementById("lv-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "lv-toast";

    toast.style.cssText =
      "position:fixed;top:16px;left:50%;transform:translateX(-50%);" +
      "z-index:9999;background:#1e293b;color:#fff;padding:12px 18px;" +
      "border-radius:10px;font:600 13px/1.4 system-ui,sans-serif;" +
      "max-width:520px;box-shadow:0 8px 24px rgba(0,0,0,.25);" +
      "display:none;text-align:center";

    document.body.appendChild(toast);
  }

  toast.textContent = String(message);
  toast.style.display = "block";

  clearTimeout(window.__lvToastTimer);

  window.__lvToastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 3200);
}


// ============================================================
// AUTH HELPERS
// ============================================================

function getStoredAuth() {
  try {
    return JSON.parse(
      localStorage.getItem("nhaa_auth") || "{}"
    );
  } catch (error) {
    console.error("Invalid authentication data:", error);
    return {};
  }
}

function getAccessToken() {
  const auth = getStoredAuth();
  return auth?.access_token || null;
}

function getAuthHeaders() {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}


// ============================================================
// NAVIGATION
// ============================================================

function navStep() {
  notify(
    "Steps unlock one at a time. Please complete the current step to continue."
  );
}


function refreshStepVisibility() {
  for (let i = 1; i <= 13; i++) {
    const button = document.getElementById(`step-btn-${i}`);

    if (!button) continue;

    const locked = i > maxUnlocked;

    button.style.display = locked ? "none" : "";

    const separator = button.previousElementSibling;

    if (separator && separator.tagName === "SPAN") {
      separator.style.display = locked ? "none" : "";
    }
  }
}


async function switchTab(
  tabNumber,
  onSVIResult,
  fromHistory = false
) {
  if (tabNumber < 1 || tabNumber > 13) {
    return;
  }

  if (tabNumber === 2) {
    tabNumber = 1;
  }

  const order = [
    1,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
  ];

  if (
    tabNumber === 3 &&
    localStorage.getItem("nhaa_auth")
  ) {
    maxUnlocked = Math.max(maxUnlocked, 3);
  }

  const currentIndex = order.indexOf(maxUnlocked);
  const targetIndex = order.indexOf(tabNumber);

  if (
    currentIndex === -1 ||
    targetIndex === -1
  ) {
    return;
  }

  const nextAllowed =
    order[
      Math.min(
        currentIndex + 1,
        order.length - 1
      )
    ];

  if (
    targetIndex >
    order.indexOf(nextAllowed)
  ) {
    notify(
      "Please complete the current step first. The next stages unlock one at a time."
    );
    return;
  }

  if (
    !fromHistory &&
    !isHandlingBrowserBack
  ) {
    window.history.pushState(
      { nhaaTab: tabNumber },
      "",
      window.location.href
    );
  }

  currentTab = tabNumber;

  if (tabNumber > maxUnlocked) {
    maxUnlocked = tabNumber;
  }

  sessionStorage.setItem(
    "nhaa_current_tab",
    String(currentTab)
  );

  sessionStorage.setItem(
    "nhaa_max_unlocked",
    String(maxUnlocked)
  );

  if (selectedLanguage) {
    sessionStorage.setItem(
      "nhaa_language",
      selectedLanguage
    );
  }

  if (selectedCommMode) {
    sessionStorage.setItem(
      "nhaa_comm_mode",
      selectedCommMode
    );
  }

  refreshStepVisibility();

  if (tabNumber === 1) {
    showAuthMode("login");
  }

  if (tabNumber === 10) {
    await loadMyComplaints();
  }

  if (tabNumber === 8) {
    const result =
      await analyzeComplaintWithSVI();

    if (result && onSVIResult) {
      onSVIResult(result);
    }
  }

  document
    .querySelectorAll(".tab-panel")
    .forEach((panel) => {
      panel.classList.add("hidden");
    });

  const targetPanel =
    document.getElementById(
      `tab-panel-${tabNumber}`
    );

  if (targetPanel) {
    targetPanel.classList.remove("hidden");
  }

  for (let i = 1; i <= 13; i++) {
    const button =
      document.getElementById(
        `step-btn-${i}`
      );

    if (!button) continue;

    if (i === tabNumber) {
      button.className =
        "step-badge flex items-center space-x-1.5 px-2.5 py-1.5 rounded font-bold text-blue-900 bg-blue-100 border border-blue-400 shadow-xs transition";
    } else if (i < tabNumber) {
      button.className =
        "step-badge flex items-center space-x-1.5 px-2.5 py-1.5 rounded font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 transition";
    } else {
      button.className =
        "step-badge flex items-center space-x-1.5 px-2.5 py-1.5 rounded font-medium text-slate-600 hover:bg-slate-100 transition";
    }
  }

  refreshStepVisibility();

  window.scrollTo({
    top: 120,
    behavior: "smooth",
  });
}


// ============================================================
// TAB 3 — CONSENT
// ============================================================

function validateConsentAndProceed() {
  const consentOne =
    document.getElementById(
      "consent-chk-1"
    );

  const consentTwo =
    document.getElementById(
      "consent-chk-2"
    );

  if (!consentOne || !consentTwo) {
    notify(
      "Consent controls could not be found."
    );
    return;
  }

  if (
    !consentOne.checked ||
    !consentTwo.checked
  ) {
    notify(
      "Please acknowledge both consent items to continue."
    );
    return;
  }

  switchTab(4);
}


// ============================================================
// TAB 4 — LANGUAGE
// ============================================================

function selectLanguage(
  buttonElement,
  languageName
) {
  selectedLanguage = languageName;

  document
    .querySelectorAll(".lang-card")
    .forEach((card) => {
      card.className =
        "lang-card p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white text-left transition hover:shadow-md";
    });

  if (buttonElement) {
    buttonElement.className =
      "lang-card p-4 rounded-xl border-2 border-blue-600 bg-blue-50/50 text-left transition hover:shadow-md shadow-xs";
  }
}


function confirmLanguageAndProceed() {
  if (!selectedLanguage) {
    notify(
      "Please select your preferred language to continue."
    );
    return;
  }

  switchTab(5);
}


// ============================================================
// TAB 5 — COMMUNICATION MODE
// ============================================================

function confirmCommModeAndProceed() {
  if (!selectedCommMode) {
    notify(
      "Please choose how you would like to communicate before continuing."
    );
    return;
  }

  switchTab(6);
}


function setCommMode(mode) {
  selectedCommMode = mode;

  ["text", "voice", "ivrs"].forEach(
    (currentMode) => {
      const option =
        document.getElementById(
          `mode-opt-${currentMode}`
        );

      const status =
        document.getElementById(
          `mode-status-${currentMode}`
        );

      if (option) {
        if (currentMode === mode) {
          option.className =
            "cursor-pointer border-2 border-blue-600 bg-blue-50/50 p-6 rounded-2xl text-center transition hover:shadow-md flex flex-col items-center justify-between";
        } else {
          option.className =
            "cursor-pointer border-2 border-slate-200 hover:border-blue-400 bg-white p-6 rounded-2xl text-center transition hover:shadow-md flex flex-col items-center justify-between";
        }
      }

      if (status) {
        if (currentMode === mode) {
          status.textContent = "Selected";
          status.className =
            "mt-4 text-xs font-bold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-200";
        } else {
          status.textContent = "Available";
          status.className =
            "mt-4 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full";
        }
      }
    }
  );

  const textContainer =
    document.getElementById(
      "input-container-text"
    );

  const voiceContainer =
    document.getElementById(
      "input-container-voice"
    );

  const ivrsContainer =
    document.getElementById(
      "input-container-ivrs"
    );

  const textButton =
    document.getElementById("subnav-text");

  const voiceButton =
    document.getElementById("subnav-voice");

  const ivrsButton =
    document.getElementById("subnav-ivrs");

  if (textContainer) {
    textContainer.classList.add("hidden");
  }

  if (voiceContainer) {
    voiceContainer.classList.add("hidden");
  }

  if (ivrsContainer) {
    ivrsContainer.classList.add("hidden");
  }

  if (textButton) {
    textButton.className =
      "px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900";
  }

  if (voiceButton) {
    voiceButton.className =
      "px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900";
  }

  if (ivrsButton) {
    ivrsButton.className =
      "px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900";
  }

  if (mode === "text") {
    textContainer?.classList.remove(
      "hidden"
    );

    if (textButton) {
      textButton.className =
        "px-3 py-1.5 rounded-md bg-white text-blue-700 shadow-xs";
    }
  }

  if (mode === "voice") {
    voiceContainer?.classList.remove(
      "hidden"
    );

    if (voiceButton) {
      voiceButton.className =
        "px-3 py-1.5 rounded-md bg-white text-blue-700 shadow-xs";
    }
  }

  if (mode === "ivrs") {
    ivrsContainer?.classList.remove(
      "hidden"
    );

    if (ivrsButton) {
      ivrsButton.className =
        "px-3 py-1.5 rounded-md bg-white text-blue-700 shadow-xs";
    }
  }
}


// ============================================================
// TAB 6 — CHARACTER COUNTER
// ============================================================

function updateCharCount(textarea) {
  const counter =
    document.getElementById(
      "char-counter"
    );

  if (!counter || !textarea) {
    return;
  }

  const maxLength = 2000;

  const currentLength =
    textarea.value.length;

  counter.textContent =
    `${currentLength} / ${maxLength} chars`;
}


// ============================================================
// TAB 6 — VOICE RECORDING
// ============================================================

function toggleRecordingUI() {
  const button =
    document.getElementById(
      "voice-rec-btn"
    );

  const status =
    document.getElementById(
      "rec-status"
    );

  const timer =
    document.getElementById(
      "rec-timer"
    );

  const preview =
    document.querySelector(
      "#input-container-voice p"
    );

  const complaintText =
    document.getElementById(
      "complaint-text"
    );

  if (!button || !status || !timer) {
    return;
  }

  if (isRecording) {
    isRecording = false;

    clearInterval(voiceTimer);
    voiceTimer = null;

    if (voiceRecognition) {
      try {
        voiceRecognition.stop();
      } catch (error) {
        console.warn(
          "Speech recognition stop failed:",
          error
        );
      }
    }

    button.classList.remove(
      "bg-rose-600",
      "animate-pulse"
    );

    button.classList.add(
      "bg-blue-600"
    );

    status.textContent =
      "Recording stopped.";

    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    notify(
      "Speech recognition is not supported in this browser."
    );
    return;
  }

  isRecording = true;
  voiceSeconds = 0;

  button.classList.remove(
    "bg-blue-600"
  );

  button.classList.add(
    "bg-rose-600",
    "animate-pulse"
  );

  status.textContent =
    "Listening to speech... Speak clearly in your selected language";

  timer.textContent =
    "00:00 / 05:00";

  if (preview) {
    preview.textContent =
      "Listening...";
  }

  clearInterval(voiceTimer);

  voiceTimer = setInterval(() => {
    if (!isRecording) {
      return;
    }

    voiceSeconds++;

    const minutes = String(
      Math.floor(
        voiceSeconds / 60
      )
    ).padStart(2, "0");

    const seconds = String(
      voiceSeconds % 60
    ).padStart(2, "0");

    timer.textContent =
      `${minutes}:${seconds} / 05:00`;

    if (voiceSeconds >= 300) {
      toggleRecordingUI();
    }
  }, 1000);

  voiceRecognition =
    new SpeechRecognition();

  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = true;

  voiceRecognition.lang =
    selectedLanguage === "Tamil"
      ? "ta-IN"
      : selectedLanguage === "Hindi"
        ? "hi-IN"
        : "en-IN";

  voiceRecognition.onresult = (event) => {
  let finalTranscript = "";
  let interimTranscript = "";

  for (
    let index = event.resultIndex;
    index < event.results.length;
    index++
  ) {
    const text =
      event.results[index][0].transcript;

    if (event.results[index].isFinal) {
      finalTranscript += text + " ";
    } else {
      interimTranscript += text;
    }
  }

  finalTranscript =
    finalTranscript.trim();

  interimTranscript =
    interimTranscript.trim();

  const existingText =
    complaintText?.value?.trim() || "";

  let combinedText =
    existingText;

  if (finalTranscript) {
    combinedText = existingText
      ? `${existingText} ${finalTranscript}`
      : finalTranscript;
  }

  if (complaintText && combinedText) {
    complaintText.value =
      combinedText.trim();

    updateCharCount(complaintText);
  }

  if (preview) {
    const displayText =
      combinedText ||
      interimTranscript;

    if (displayText) {
      preview.textContent =
        `"${displayText}"`;
    }
  }
};

  voiceRecognition.onerror =
    (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      if (
        event.error ===
        "not-allowed"
      ) {
        notify(
          "Microphone permission is required for voice input."
        );
      }
    };

  voiceRecognition.onend = () => {
    if (isRecording) {
      try {
        voiceRecognition.start();
      } catch (error) {
        console.warn(
          "Speech recognition restart skipped:",
          error
        );
      }
    }
  };

  try {
    voiceRecognition.start();
  } catch (error) {
    console.error(
      "Unable to start speech recognition:",
      error
    );

    isRecording = false;

    clearInterval(
      voiceTimer
    );

    voiceTimer = null;

    button.classList.remove(
      "bg-rose-600",
      "animate-pulse"
    );

    button.classList.add(
      "bg-blue-600"
    );

    status.textContent =
      "Unable to start voice recording.";
  }
}


// ============================================================
// TAB 6 — COMPLAINT SUBMISSION
// ============================================================

async function submitComplaintAndTriggerAI() {
  if (
    selectedCommMode === "text" ||
    !selectedCommMode
  ) {
    const textarea =
      document.getElementById(
        "complaint-text"
      );

    if (
      !textarea ||
      textarea.value.trim()
        .length < 20
    ) {
      notify(
        "Please describe your complaint (at least 20 characters) before submitting."
      );
      return;
    }
  }

  try {
    const token =
      getAccessToken();

    if (!token) {
      notify(
        "Please login again before submitting your complaint."
      );
      return;
    }

    const complaintText =
      document
        .getElementById(
          "complaint-text"
        )
        ?.value
        .trim() || "";

    const language =
      selectedLanguage ||
      "English";

    const communicationMethod =
      selectedCommMode ||
      "text";

    const incidentDistrict =
      document
        .getElementById(
          "incident-dist"
        )
        ?.value
        .trim() || "";

    const incidentDate =
      document
        .getElementById(
          "incident-date"
        )
        ?.value || "";

    const params =
      new URLSearchParams({
        complaint_text:
          complaintText,
        language,
        communication_method:
          communicationMethod,
      });

    const response =
      await fetch(
        `${API_BASE_URL}/complaints/?${params.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "COMPLAINT API ERROR:",
        data
      );

      let message =
        "Complaint submission failed. Please try again.";

      if (
        typeof data.detail ===
        "string"
      ) {
        message =
          data.detail;
      } else if (
        Array.isArray(
          data.detail
        )
      ) {
        message =
          data.detail
            .map((item) =>
              typeof item ===
              "string"
                ? item
                : item?.msg ||
                  "Invalid complaint data."
            )
            .join(" ");
      }

      notify(message);
      return;
    }

    console.log(
      "Complaint submitted:",
      data
    );

    if (data.complaint) {
      const complaint =
        {
          ...data.complaint,
          incident_district:
            incidentDistrict,
          incident_date:
            incidentDate,
        };

      localStorage.setItem(
        "nhaa_last_complaint",
        JSON.stringify(
          complaint
        )
      );

      // Move the newly-created case
      // into the assessment stage.
      const statusParams =
        new URLSearchParams({
          status:
            "under_assessment",
        });

      const statusResponse =
        await fetch(
          `${API_BASE_URL}/complaints/${encodeURIComponent(
            data.complaint
              .complaint_id
          )}/status?${statusParams.toString()}`,
          {
            method: "PATCH",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const statusData =
        await statusResponse.json();

      if (!statusResponse.ok) {
        console.error(
          "STATUS UPDATE ERROR:",
          statusData
        );
      } else {
        // Backend returns:
        // {
        //   message,
        //   complaint: {...}
        // }
        const updatedComplaint =
          statusData.complaint ||
          data.complaint;

        const finalComplaint = {
          ...updatedComplaint,
          incident_district:
            incidentDistrict,
          incident_date:
            incidentDate,
        };

        localStorage.setItem(
          "nhaa_last_complaint",
          JSON.stringify(
            finalComplaint
          )
        );

        data.complaint =
          finalComplaint;
      }
    }

    notify(
      "Complaint submitted successfully."
    );

    await switchTab(7);

  } catch (error) {
    console.error(
      "Complaint submission error:",
      error
    );

    notify(
      "Unable to connect to the NHAA backend."
    );
  }
}


// ============================================================
// LOAD MY COMPLAINTS
// ============================================================

async function loadMyComplaints() {
  try {
    const token =
      getAccessToken();

    if (!token) {
      notify(
        "Please login again to view your complaints."
      );

      return [];
    }

    const response =
      await fetch(
        `${API_BASE_URL}/complaints/`,
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "Complaint tracking error:",
        data
      );

      notify(
        typeof data.detail ===
          "string"
          ? data.detail
          : "Unable to load your complaints."
      );

      return [];
    }

    const complaints =
      Array.isArray(
        data.complaints
      )
        ? data.complaints
        : [];

    localStorage.setItem(
      "nhaa_my_complaints",
      JSON.stringify(
        complaints
      )
    );

    return complaints;

  } catch (error) {
    console.error(
      "Load complaints error:",
      error
    );

    notify(
      "Unable to connect to the NHAA backend."
    );

    return [];
  }
}


// ============================================================
// COMPLAINT STAGE
// ============================================================

export function getComplaintStage(
  status
) {
  const stages = {
    received: 0,
    under_assessment: 1,
    support_recommended: 2,
    under_review: 3,
    action_in_progress: 4,
    resolved: 5,
  };

  return (
    stages[status] ?? 0
  );
}


// ============================================================
// SVI ANALYSIS
// ============================================================

async function analyzeComplaintWithSVI() {
  try {
    const token =
      getAccessToken();

    if (!token) {
      notify(
        "Please login again before running SVI analysis."
      );

      return null;
    }

    const complaint =
      JSON.parse(
        localStorage.getItem(
          "nhaa_last_complaint"
        ) || "{}"
      );

    if (!complaint.complaint_id) {
      notify(
        "No submitted complaint found."
      );

      return null;
    }

    const response =
      await fetch(
        `${API_BASE_URL}/svi/${encodeURIComponent(
          complaint.complaint_id
        )}`,
        {
          method: "POST",
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      console.error(
        "SVI API ERROR:",
        data
      );

      notify(
        typeof data.detail ===
          "string"
          ? data.detail
          : "SVI analysis failed."
      );

      return null;
    }

    console.log(
      "REAL SVI RESULT:",
      data
    );

    localStorage.setItem(
      "nhaa_svi_result",
      JSON.stringify(data)
    );

    return data;

  } catch (error) {
    console.error(
      "SVI analysis error:",
      error
    );

    notify(
      "Unable to connect to the SVI analysis service."
    );

    return null;
  }
}


// ============================================================
// MODALS
// ============================================================

function openModal(modalId) {
  const modal =
    document.getElementById(
      modalId
    );

  if (modal) {
    modal.classList.remove(
      "hidden"
    );
  }
}


function closeModal(modalId) {
  const modal =
    document.getElementById(
      modalId
    );

  if (modal) {
    modal.classList.add(
      "hidden"
    );
  }
}


// ============================================================
// INITIALIZATION
// ============================================================

export function initPortal() {
  const savedTab =
    Number(
      sessionStorage.getItem(
        "nhaa_current_tab"
      )
    );

  const savedMaxUnlocked =
    Number(
      sessionStorage.getItem(
        "nhaa_max_unlocked"
      )
    );

  currentTab =
    savedTab >= 1 &&
    savedTab <= 13
      ? savedTab
      : 1;

  maxUnlocked =
    savedMaxUnlocked >= 1 &&
    savedMaxUnlocked <= 13
      ? savedMaxUnlocked
      : currentTab;

  selectedLanguage =
    sessionStorage.getItem(
      "nhaa_language"
    ) || null;

  selectedCommMode =
    sessionStorage.getItem(
      "nhaa_comm_mode"
    ) || null;

  isRecording = false;

  switchTab(currentTab);

  refreshStepVisibility();
}


// ============================================================
// BACKDROP HANDLING
// ============================================================

export function handleBackdropClick(
  event
) {
  if (
    event.target.id ===
    "howItWorksModal"
  ) {
    closeModal(
      "howItWorksModal"
    );
  }

  if (
    event.target.id ===
    "emergencyModal"
  ) {
    closeModal(
      "emergencyModal"
    );
  }
}


// ============================================================
// BROWSER BACK BUTTON
// ============================================================

window.addEventListener(
  "popstate",
  (event) => {
    const previousTab =
      Number(
        event.state?.nhaaTab
      );

    if (
      previousTab >= 1 &&
      previousTab <= 13
    ) {
      isHandlingBrowserBack =
        true;

      switchTab(
        previousTab,
        undefined,
        true
      ).finally(() => {
        isHandlingBrowserBack =
          false;
      });
    }
  }
);


// ============================================================
// EXPORTS
// ============================================================

export {
  showAuthMode,
  notify,
  navStep,
  refreshStepVisibility,
  switchTab,
  validateConsentAndProceed,
  selectLanguage,
  confirmLanguageAndProceed,
  confirmCommModeAndProceed,
  setCommMode,
  updateCharCount,
  toggleRecordingUI,
  analyzeComplaintWithSVI,
  submitComplaintAndTriggerAI,
  loadMyComplaints,
  openModal,
  closeModal,
};