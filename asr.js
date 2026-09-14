const ASR_URL = "https://api.siliconflow.cn/v1/audio/transcriptions";
const ASR_API_KEY = "sk-etgsjpdxjawxvzmnvxvozmfqbkwrziagpulsdxuaxiwuukzu";
const ASR_REQUEST_TIMEOUT_MS = 140000;
const FILE_MAX_BYTES = 50 * 1024 * 1024;
const LANG_KEY = "asr-lang";
const MODEL_KEY = "asr-model";

const MODELS = {
  general: {
    key: "general",
    id: "XingChenAGI/XingChenASR-V3.2",
    short: "XingChenASR-V3.2",
    diarize: false,
    labelKey: "modelGeneral",
    hintKey: "hintGeneral",
  },
  ultra: {
    key: "ultra",
    id: "XingChenAGI/XingChenASR-V3.2-Ultra",
    short: "XingChenASR-V3.2-Ultra",
    diarize: false,
    labelKey: "modelUltra",
    hintKey: "hintUltra",
  },
  gsr: {
    key: "gsr",
    id: "XingChenAGI/XingChenGSR-V1.0",
    short: "XingChenGSR-V1.0",
    diarize: false,
    labelKey: "modelGsr",
    hintKey: "hintGsr",
  },
  diarize: {
    key: "diarize",
    id: "XingChenAGI/XingChenASR-Diarize-V3.0",
    short: "XingChenASR-Diarize-V3.0",
    diarize: true,
    labelKey: "modelDiarize",
    hintKey: "hintDiarize",
  },
};

const I18N = {
  zh: {
    brand: "语音转写",
    badge: "批处理 · 非流式",
    source: "音源",
    dropTitle: "拖入音频文件",
    dropHint: "点击选择。支持 mp3 / wav / m4a / webm 等，最大 50MB。",
    record: "开始录音",
    stop: "停止录音",
    copy: "复制全文",
    download: "下载音频",
    idle: "等待音频",
    result: "转写结果",
    placeholder: "全文会显示在这里",
    pageTitle: "语音转写",
    desc: "非流式语音转写：拖入音频或录音，整段识别后返回全文与时间轴。",
    transcribing: "转写中…",
    recording: (sec) => `录音中 ${sec}s`,
    recordingFile: "录音",
    unnamed: "未命名音频",
    done: "转写完成",
    doneSeg: "转写完成，已生成时间轴",
    copied: "已复制全文",
    errEmpty: "音频数据为空",
    errTooLarge: "音频过大（上限 50MB）",
    errTimeout: "ASR 请求超时",
    errNoContent: "未识别到有效内容",
    errFail: (status) => `ASR 请求失败 (${status})`,
    errMic: "无法打开麦克风",
    errRecorder: "当前浏览器不支持录音",
    errNoFile: "没有识别到可用的音频文件",
    errCopy: "复制失败",
    errGeneric: "语音识别失败",
    modelGeneral: "通用",
    modelUltra: "Ultra",
    modelGsr: "生成",
    modelDiarize: "发言人",
    hintGeneral: "按原话转写，保留口语和方言用词。",
    hintUltra: "精简口语、理顺语句；粤语、上海话可转成普通话。",
    hintGsr: "结合语义理解润色，输出更贴近书面表达的文稿。",
    hintDiarize: "适合已录好的会议，自动标出发言人。",
    speaker: (n) => `说话人${n}`,
  },
  en: {
    brand: "Speech to Text",
    badge: "Batch · non-streaming",
    source: "Source",
    dropTitle: "Drop a file here",
    dropHint: "Click to browse. mp3 / wav / m4a / webm, up to 50MB.",
    record: "Start recording",
    stop: "Stop recording",
    copy: "Copy text",
    download: "Download audio",
    idle: "Waiting for audio",
    result: "Transcript",
    placeholder: "Full text will appear here",
    pageTitle: "Speech to Text",
    desc: "Non-streaming speech to text. Drop an audio file or record, then get the full transcript.",
    transcribing: "Transcribing…",
    recording: (sec) => `Recording ${sec}s`,
    recordingFile: "Recording",
    unnamed: "Untitled audio",
    done: "Transcription complete",
    doneSeg: "Done. Timeline generated",
    copied: "Copied",
    errEmpty: "Audio is empty",
    errTooLarge: "Audio is too large (50MB max)",
    errTimeout: "ASR request timed out",
    errNoContent: "No speech detected",
    errFail: (status) => `ASR request failed (${status})`,
    errMic: "Microphone permission denied",
    errRecorder: "This browser cannot record audio",
    errNoFile: "No usable audio file found",
    errCopy: "Copy failed",
    errGeneric: "Speech recognition failed",
    modelGeneral: "General",
    modelUltra: "Ultra",
    modelGsr: "Polish",
    modelDiarize: "Speakers",
    hintGeneral: "Verbatim transcript. Keeps fillers and dialect wording.",
    hintUltra: "Cleans fillers and smooths sentences. Cantonese and Shanghainese can become Mandarin.",
    hintGsr: "Uses semantic polish for a more written-style draft.",
    hintDiarize: "Best for recorded meetings. Labels speakers automatically.",
    speaker: (n) => `Speaker ${n}`,
  },
};

const CONTENT_TYPES = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  mp4: "audio/mp4",
  aac: "audio/aac",
  ogg: "audio/ogg",
  flac: "audio/flac",
  pcm: "audio/pcm",
  webm: "audio/webm",
};

let currentLang = "en";
let currentModelKey = "general";

function currentModel() {
  return MODELS[currentModelKey] || MODELS.general;
}

function resolveModel(key) {
  if (key === "v32") return MODELS.general;
  return MODELS[key] || MODELS.general;
}

function syncModelUi() {
  const model = currentModel();
  document.querySelectorAll("[data-asr-model]").forEach((btn) => {
    btn.classList.toggle("is-on", btn.getAttribute("data-asr-model") === model.key);
  });
  const hint = document.querySelector("[data-asr-hint]");
  if (hint) hint.textContent = t(model.hintKey);
  const idEl = document.querySelector("[data-asr-model-id]");
  if (idEl) idEl.textContent = model.short;
}

function t(key, arg) {
  const value = I18N[currentLang][key];
  return typeof value === "function" ? value(arg) : value;
}

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "zh" || saved === "en") return saved;
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || "").toLowerCase();
  return nav.startsWith("zh") ? "zh" : "en";
}

function applyLang(lang, opts = {}) {
  currentLang = lang === "zh" ? "zh" : "en";
  try {
    localStorage.setItem(LANG_KEY, currentLang);
  } catch {
    /* ignore */
  }

  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
  document.title = t("pageTitle");
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", t("desc"));

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    if (opts.keepStatus && el.hasAttribute("data-asr-status")) return;
    if (opts.keepRecord && el.hasAttribute("data-asr-record")) return;
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("is-on", btn.getAttribute("data-lang") === currentLang);
  });
  syncModelUi();
}

function resolveFormat(nameOrFormat) {
  const raw = String(nameOrFormat || "mp3").toLowerCase();
  const ext = raw.includes(".") ? raw.split(".").pop() : raw;
  return CONTENT_TYPES[ext] ? ext : "mp3";
}

function rawSpeaker(seg) {
  if (!seg || typeof seg !== "object") return "";
  const value =
    seg.speaker ??
    seg.spk ??
    seg.speaker_id ??
    seg.speakerId ??
    seg.spk_id;
  if (value == null) return "";
  return String(value).trim();
}

function speakerLabel(raw, indexMap) {
  if (!raw) return "";
  if (!indexMap.has(raw)) {
    indexMap.set(raw, t("speaker", indexMap.size + 1));
  }
  return indexMap.get(raw);
}

function pickSegmentList(data) {
  if (Array.isArray(data.segments) && data.segments.length) return data.segments;
  if (Array.isArray(data.utterances) && data.utterances.length) return data.utterances;
  return [];
}

function parseTranscriptionBody(data, diarize) {
  if (typeof data === "string") {
    return { text: data, segments: [], duration: 0 };
  }
  if (!data || typeof data !== "object") {
    return { text: "", segments: [], duration: 0 };
  }

  const duration = Number(data.duration) || 0;
  const indexMap = new Map();
  const segments = (diarize ? pickSegmentList(data) : Array.isArray(data.segments) ? data.segments : [])
    .map((seg) => ({
      start: Number(seg.start) || 0,
      end: Number(seg.end) || 0,
      text: String(seg.text || "").trim(),
      speaker: diarize ? speakerLabel(rawSpeaker(seg), indexMap) : "",
    }))
    .filter((seg) => seg.text && seg.end > seg.start);

  let text = String(data.text || "");
  if (diarize && segments.some((seg) => seg.speaker)) {
    const turns = [];
    segments.forEach((seg) => {
      const last = turns[turns.length - 1];
      if (last && last.speaker === seg.speaker) {
        last.text += seg.text;
        return;
      }
      turns.push({ speaker: seg.speaker, text: seg.text });
    });
    const sep = currentLang === "zh" ? "：" : ": ";
    text = turns
      .map((turn) => (turn.speaker ? `${turn.speaker}${sep}${turn.text}` : turn.text))
      .join("\n");
  }

  return { text, segments, duration };
}

function extractAsrError(data, status) {
  if (data && typeof data === "object") {
    const msg = data.message || (data.error && data.error.message) || data.error;
    if (typeof msg === "string" && msg) return msg;
  }
  return t("errFail", status);
}

async function postTranscription(file, filename, options = {}) {
  const form = new FormData();
  form.append("file", file, filename);
  form.append("model", currentModel().id);
  form.append("language", currentLang === "zh" ? "zh" : "en");

  if (options.verbose) {
    form.append("response_format", "verbose_json");
    form.append("timestamp_granularities[]", "segment");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ASR_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(ASR_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ASR_API_KEY}`,
      },
      body: form,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    return { status: response.status, data };
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("TIMEOUT");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function transcribe(file, filename) {
  const verboseResp = await postTranscription(file, filename, { verbose: true });

  if (verboseResp.status === 200) {
    const parsed = parseTranscriptionBody(verboseResp.data, currentModel().diarize);
    if (parsed.text || parsed.segments.length) {
      return parsed;
    }
  }

  const plainResp = await postTranscription(file, filename, { verbose: false });

  if (plainResp.status !== 200) {
    throw new Error(extractAsrError(plainResp.data, plainResp.status));
  }

  const parsed = parseTranscriptionBody(plainResp.data, currentModel().diarize);
  if (!parsed.text && !parsed.segments.length) {
    throw new Error("NO_CONTENT");
  }
  return parsed;
}

function formatBytes(n) {
  const size = Number(n) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(sec) {
  const s = Math.max(0, Number(sec) || 0);
  const m = Math.floor(s / 60);
  const r = (s % 60).toFixed(1).padStart(4, "0");
  return `${String(m).padStart(2, "0")}:${r}`;
}

function pickRecorderMime() {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  if (!window.MediaRecorder) return "";
  return types.find((item) => MediaRecorder.isTypeSupported(item)) || "";
}

function recorderExt(mime) {
  if (mime.includes("mp4")) return "m4a";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

function setStatus(el, text, kind) {
  el.textContent = text;
  el.classList.toggle("is-error", kind === "error");
  el.classList.toggle("is-ok", kind === "ok");
}

function localizeError(err) {
  const code = err && err.message;
  if (code === "TIMEOUT") return t("errTimeout");
  if (code === "NO_CONTENT") return t("errNoContent");
  if (code === "EMPTY") return t("errEmpty");
  if (code === "TOO_LARGE") return t("errTooLarge");
  return (err && err.message) || t("errGeneric");
}

function pickDroppedFile(dt) {
  const files = dt && dt.files ? Array.from(dt.files) : [];
  const audio = files.find((f) => {
    const name = (f.name || "").toLowerCase();
    const type = (f.type || "").toLowerCase();
    return (
      type.startsWith("audio/") ||
      type === "video/webm" ||
      type === "video/mp4" ||
      /\.(mp3|wav|m4a|aac|ogg|flac|pcm|webm|mp4|mpeg|mpga)$/.test(name)
    );
  });
  return audio || files[0] || null;
}

function renderResult(root, parsed) {
  const textEl = root.querySelector("[data-asr-text]");
  const segsEl = root.querySelector("[data-asr-segments]");
  textEl.value = parsed.text || "";
  segsEl.replaceChildren();

  if (!parsed.segments.length) {
    segsEl.hidden = true;
    return;
  }

  segsEl.hidden = false;
  parsed.segments.forEach((seg) => {
    const li = document.createElement("li");
    const time = document.createElement("span");
    time.className = "seg-time";
    time.textContent = `${formatTime(seg.start)} – ${formatTime(seg.end)}`;
    if (seg.speaker) {
      const spk = document.createElement("span");
      spk.className = "seg-spk";
      spk.textContent = seg.speaker;
      time.prepend(spk);
    }
    const body = document.createElement("span");
    body.className = "seg-text";
    body.textContent = seg.text;
    li.dataset.start = String(seg.start);
    li.append(time, body);
    segsEl.append(li);
  });
}

async function recognizeBlob(blob, nameHint, ui) {
  if (!blob || !blob.size) {
    throw new Error("EMPTY");
  }
  if (blob.size > FILE_MAX_BYTES) {
    throw new Error("TOO_LARGE");
  }

  const format = resolveFormat(nameHint || blob.type);
  const filename = `audio.${format}`;
  const contentType = CONTENT_TYPES[format] || blob.type || "audio/mpeg";
  const file =
    blob instanceof File
      ? blob
      : new File([blob], filename, { type: contentType });

  setStatus(ui.status, `${t("transcribing")} · ${t(currentModel().labelKey)}`);
  return transcribe(file, file.name || filename);
}

function initAsrPage() {
  applyLang(detectLang());
  try {
    currentModelKey = resolveModel(localStorage.getItem(MODEL_KEY) || "general").key;
  } catch {
    currentModelKey = "general";
  }
  syncModelUi();

  const root = document.querySelector("[data-asr]");
  if (!root) return;

  const status = root.querySelector("[data-asr-status]");
  const recBtn = root.querySelector("[data-asr-record]");
  const fileInput = root.querySelector("[data-asr-file]");
  const copyBtn = root.querySelector("[data-asr-copy]");
  const downloadBtn = root.querySelector("[data-asr-download]");
  const drop = root.querySelector("[data-asr-drop]");
  const filechip = root.querySelector("[data-asr-filechip]");
  const filesize = root.querySelector("[data-asr-filesize]");
  const media = root.querySelector("[data-asr-media]");
  const player = root.querySelector("[data-asr-player]");
  const modelBtns = root.querySelectorAll("[data-asr-model]");
  const ui = { status };

  let recorder = null;
  let chunks = [];
  let recStart = 0;
  let recTimer = null;
  let busy = false;
  let dragDepth = 0;
  let mediaUrl = "";
  let mediaName = "";

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLang(btn.getAttribute("data-lang"), {
        keepStatus: busy || Boolean(recorder),
        keepRecord: Boolean(recorder),
      });
      if (recorder) recBtn.textContent = t("stop");
      syncModelUi();
    });
  });

  modelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (busy) return;
      const next = resolveModel(btn.getAttribute("data-asr-model"));
      if (next.key === currentModelKey) return;
      currentModelKey = next.key;
      try {
        localStorage.setItem(MODEL_KEY, currentModelKey);
      } catch {
        /* ignore */
      }
      syncModelUi();
    });
  });

  const attachMedia = (blob, name) => {
    if (!player || !blob) return;
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    mediaUrl = URL.createObjectURL(blob);
    mediaName = name || t("unnamed");
    player.src = mediaUrl;
    player.load();
    if (filechip) filechip.textContent = mediaName;
    if (filesize) filesize.textContent = formatBytes(blob.size);
    if (media) media.classList.add("is-on");
    if (downloadBtn) downloadBtn.disabled = false;
  };

  const setBusy = (next) => {
    busy = next;
    recBtn.disabled = next && !recorder;
    fileInput.disabled = next;
    copyBtn.disabled = next;
    modelBtns.forEach((btn) => {
      btn.disabled = next;
    });
    drop.classList.toggle("is-busy", next && !recorder);
  };

  const runFile = async (file) => {
    if (!file || busy) return;
    attachMedia(file, file.name || t("unnamed"));
    setBusy(true);
    try {
      const parsed = await recognizeBlob(file, file.name, ui);
      renderResult(root, parsed);
      setStatus(status, parsed.segments.length ? t("doneSeg") : t("done"), "ok");
    } catch (err) {
      console.error("recognize error", err);
      setStatus(status, localizeError(err), "error");
    } finally {
      setBusy(false);
    }
  };

  recBtn.addEventListener("click", async () => {
    if (busy && !recorder) return;

    if (recorder) {
      recorder.stop();
      return;
    }

    if (!navigator.mediaDevices || !window.MediaRecorder) {
      setStatus(status, t("errRecorder"), "error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickRecorderMime();
      recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      chunks = [];
      recStart = Date.now();

      recorder.addEventListener("dataavailable", (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
      });

      recorder.addEventListener("stop", async () => {
        stream.getTracks().forEach((track) => track.stop());
        clearInterval(recTimer);
        recTimer = null;
        recBtn.textContent = t("record");
        recBtn.classList.remove("live");
        const mimeType = recorder.mimeType || mime || "audio/webm";
        recorder = null;
        const blob = new Blob(chunks, { type: mimeType });
        chunks = [];

        const recName = `${t("recordingFile")}.${recorderExt(mimeType)}`;
        attachMedia(blob, recName);
        setBusy(true);
        try {
          const parsed = await recognizeBlob(blob, recorderExt(mimeType), ui);
          renderResult(root, parsed);
          setStatus(status, parsed.segments.length ? t("doneSeg") : t("done"), "ok");
        } catch (err) {
          console.error("recognize error", err);
          setStatus(status, localizeError(err), "error");
        } finally {
          setBusy(false);
        }
      });

      recorder.start();
      recBtn.textContent = t("stop");
      recBtn.classList.add("live");
      recTimer = setInterval(() => {
        const sec = Math.floor((Date.now() - recStart) / 1000);
        setStatus(status, t("recording", sec));
      }, 200);
      setStatus(status, t("recording", 0));
    } catch (err) {
      console.error("mic error", err);
      setStatus(status, t("errMic"), "error");
    }
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files && fileInput.files[0];
    fileInput.value = "";
    await runFile(file);
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((type) => {
    drop.addEventListener(type, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  drop.addEventListener("dragenter", () => {
    if (busy) return;
    dragDepth += 1;
    drop.classList.add("is-over");
  });

  drop.addEventListener("dragleave", () => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (!dragDepth) drop.classList.remove("is-over");
  });

  drop.addEventListener("drop", async (e) => {
    dragDepth = 0;
    drop.classList.remove("is-over");
    if (busy) return;
    const file = pickDroppedFile(e.dataTransfer);
    if (!file) {
      setStatus(status, t("errNoFile"), "error");
      return;
    }
    await runFile(file);
  });

  ["dragenter", "dragover", "dragleave", "drop"].forEach((type) => {
    document.addEventListener(type, (e) => {
      e.preventDefault();
    });
  });

  document.addEventListener("dragenter", () => {
    if (busy) return;
    drop.classList.add("is-over");
  });
  document.addEventListener("dragleave", (e) => {
    if (e.relatedTarget) return;
    drop.classList.remove("is-over");
  });
  document.addEventListener("drop", async (e) => {
    drop.classList.remove("is-over");
    if (busy || drop.contains(e.target)) return;
    const file = pickDroppedFile(e.dataTransfer);
    if (!file) return;
    await runFile(file);
  });

  downloadBtn.addEventListener("click", () => {
    if (!mediaUrl) return;
    const a = document.createElement("a");
    a.href = mediaUrl;
    a.download = mediaName || `${t("recordingFile")}.webm`;
    document.body.append(a);
    a.click();
    a.remove();
  });

  root.querySelector("[data-asr-segments]").addEventListener("click", (e) => {
    const item = e.target.closest("li");
    if (!item || !player || !player.src) return;
    const start = Number(item.dataset.start);
    if (!Number.isFinite(start)) return;
    player.currentTime = start;
    player.play().catch(() => {});
  });

  copyBtn.addEventListener("click", async () => {
    const text = root.querySelector("[data-asr-text]").value;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setStatus(status, t("copied"), "ok");
    } catch {
      setStatus(status, t("errCopy"), "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", initAsrPage);
