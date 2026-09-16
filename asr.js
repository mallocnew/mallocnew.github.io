const ASR_URL = "https://api.siliconflow.cn/v1/audio/transcriptions";
const ASR_API_KEY = "sk-etgsjpdxjawxvzmnvxvozmfqbkwrziagpulsdxuaxiwuukzu";
const ASR_REQUEST_TIMEOUT_MS = 140000;
const LANG_KEY = "asr-lang";
const MODEL_KEY = "asr-model";

const MODELS = {
  general: {
    key: "general",
    id: "XingChenAGI/XingChenASR-V3.2",
    diarize: false,
    labelKey: "modelGeneral",
    hintKey: "hintGeneral",
  },
  ultra: {
    key: "ultra",
    id: "XingChenAGI/XingChenASR-V3.2-Ultra",
    diarize: false,
    labelKey: "modelUltra",
    hintKey: "hintUltra",
  },
  gsr: {
    key: "gsr",
    id: "XingChenAGI/XingChenGSR-V1.0",
    diarize: false,
    labelKey: "modelGsr",
    hintKey: "hintGsr",
  },
  diarize: {
    key: "diarize",
    id: "XingChenAGI/XingChenASR-Diarize-V3.0",
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
    dropTitle: "拖入音频或视频",
    dropHint: "点击即可选择。支持 mp3 / wav / m4a / mp4 等音视频，最大 50MB。",
    record: "开始录音",
    stop: "停止录音",
    copy: "复制全文",
    download: "下载文件",
    chooseFile: "选择文件",
    play: "试听",
    pause: "暂停",
    idle: "等待音视频",
    result: "转写结果",
    placeholder: "全文会显示在这里",
    pageTitle: "语音转写",
    desc: "非流式语音转写：拖入音频、视频或录音，整段识别后返回全文与时间轴。",
    transcribing: "转写中…",
    recording: (sec) => `录音中 ${sec}s`,
    recordingFile: "录音",
    unnamed: "未命名音频",
    done: "转写完成",
    doneSeg: "转写完成，已生成时间轴",
    copied: "已复制全文",
    errEmpty: "音频数据为空",
    errTimeout: "ASR 请求超时",
    errNetwork: "网络错误",
    errMic: "无法打开麦克风",
    errRecorder: "当前浏览器不支持录音",
    errNoFile: "没有识别到可用的音视频文件",
    errCopy: "复制失败",
    errPlay: "当前文件无法试听，可下载后用系统播放器打开",
    errGeneric: "语音识别失败",
    modelGeneral: "通用",
    modelUltra: "Ultra",
    modelGsr: "生成",
    modelDiarize: "发言人",
    hintGeneral: "按原话转写，保留口语和方言用词。",
    hintUltra: "精简口语、理顺语句；粤语、上海话可转成普通话。",
    hintGsr: "结合语义理解润色，输出更贴近书面表达的文稿（普通话）。",
    hintDiarize: "适合已录好的会议，自动标出发言人。",
    reuseHint: "同一段音视频可切换模型再次转写。",
    speaker: (n) => `说话人${n}`,
    rawText: "原文",
    refinedText: "润色",
    httpTime: "HTTP 耗时",
    requestIdCopied: "已复制 x-request-id",
  },
  en: {
    brand: "Speech to Text",
    badge: "Batch · non-streaming",
    source: "Source",
    dropTitle: "Drop audio or video",
    dropHint: "Tap to choose. mp3 / wav / m4a / mp4 and other media, up to 50MB.",
    record: "Start recording",
    stop: "Stop recording",
    copy: "Copy text",
    download: "Download",
    chooseFile: "Choose file",
    play: "Play",
    pause: "Pause",
    idle: "Waiting for media",
    result: "Transcript",
    placeholder: "Full text will appear here",
    pageTitle: "Speech to Text",
    desc: "Non-streaming speech to text. Drop audio or video, or record, then get the full transcript.",
    transcribing: "Transcribing…",
    recording: (sec) => `Recording ${sec}s`,
    recordingFile: "Recording",
    unnamed: "Untitled audio",
    done: "Transcription complete",
    doneSeg: "Done. Timeline generated",
    copied: "Copied",
    errEmpty: "Audio is empty",
    errTimeout: "ASR request timed out",
    errNetwork: "Network error",
    errMic: "Microphone permission denied",
    errRecorder: "This browser cannot record audio",
    errNoFile: "No usable audio or video file found",
    errCopy: "Copy failed",
    errPlay: "This file cannot be previewed. Download it and open in a system player.",
    errGeneric: "Speech recognition failed",
    modelGeneral: "General",
    modelUltra: "Ultra",
    modelGsr: "Polish",
    modelDiarize: "Speakers",
    hintGeneral: "Verbatim transcript. Keeps fillers and dialect wording.",
    hintUltra: "Cleans fillers and smooths sentences. Cantonese and Shanghainese can become Mandarin.",
    hintGsr: "Uses semantic polish for a more written-style draft (Mandarin).",
    hintDiarize: "Best for recorded meetings. Labels speakers automatically.",
    reuseHint: "Switch models to transcribe the same media again.",
    speaker: (n) => `Speaker ${n}`,
    rawText: "Raw",
    refinedText: "Refined",
    httpTime: "HTTP time",
    requestIdCopied: "Copied x-request-id",
  },
};

const CONTENT_TYPES = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  aac: "audio/aac",
  ogg: "audio/ogg",
  flac: "audio/flac",
  pcm: "audio/pcm",
  webm: "audio/webm",
};

const VIDEO_TYPES = {
  mp4: "video/mp4",
  mov: "video/quicktime",
  m4v: "video/x-m4v",
  webm: "video/webm",
  mkv: "video/x-matroska",
  avi: "video/x-msvideo",
  mpeg: "video/mpeg",
  mpg: "video/mpeg",
  "3gp": "video/3gpp",
  ogv: "video/ogg",
  ts: "video/mp2t",
};

const VIDEO_EXT = /^(mp4|mov|m4v|mkv|avi|mpeg|mpg|3gp|ogv|ts)$/;

function resolveFormat(nameOrFormat) {
  const raw = String(nameOrFormat || "mp3").toLowerCase();
  const ext = raw.includes(".") ? raw.split(".").pop() : raw;
  if (CONTENT_TYPES[ext] || VIDEO_TYPES[ext]) return ext;
  return "mp3";
}

function isVideoAsset(blob, name) {
  const type = ((blob && blob.type) || "").toLowerCase();
  const filename = String(
    name || (blob && blob.name) || ""
  ).toLowerCase();
  if (type.startsWith("video/")) return true;
  if (type.startsWith("audio/")) return false;
  const ext = filename.includes(".") ? filename.split(".").pop() : "";
  return VIDEO_EXT.test(ext);
}

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
    if (opts.keepPlay && el.hasAttribute("data-asr-play")) return;
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

  const indexMap = new Map();
  const segments = (diarize ? pickSegmentList(data) : Array.isArray(data.segments) ? data.segments : [])
    .map((seg) => {
      const text = String(seg.text || "").trim();
      const rawText = String(seg.raw_text || "").trim();
      const refinedText = String(seg.refined_text || "").trim();
      return {
        start: Number(seg.start) || 0,
        end: Number(seg.end) || 0,
        text: text || refinedText || rawText,
        rawText,
        refinedText,
        speaker: diarize ? speakerLabel(rawSpeaker(seg), indexMap) : "",
      };
    })
    .filter((seg) => (seg.text || seg.rawText || seg.refinedText) && seg.end > seg.start);

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

  return { text, segments, duration: Number(data.duration) || 0 };
}

function pickErrorFields(data) {
  if (data == null || data === "") return {};
  if (typeof data === "string") return { message: data };
  if (typeof data !== "object") return { message: String(data) };

  const nested = data.error && typeof data.error === "object" ? data.error : null;
  const code =
    (nested && (nested.code || nested.type || nested.error_code)) ||
    data.code ||
    data.type ||
    data.error_code ||
    data.errno;
  let message =
    (nested && nested.message) ||
    data.message ||
    (typeof data.error === "string" ? data.error : "") ||
    data.msg ||
    data.detail;
  if (message && typeof message === "object") {
    message = message.message || JSON.stringify(message);
  }
  return { code, message };
}

function formatHttpError(status, data) {
  const { code, message } = pickErrorFields(data);
  const parts = [`HTTP ${status || "?"}`];
  if (code) parts.push(String(code));
  if (message && String(message) !== String(code)) parts.push(String(message));
  if (parts.length === 1 && data && typeof data === "object") {
    try {
      parts.push(JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }
  return parts.join(" · ");
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
  const onCancel = () => controller.abort();
  if (options.signal) {
    if (options.signal.aborted) {
      clearTimeout(timer);
      throw new Error("CANCELLED");
    }
    options.signal.addEventListener("abort", onCancel, { once: true });
  }

  const started = performance.now();
  const stamp = (err) => {
    const httpMs = performance.now() - started;
    if (err && typeof err === "object") err.httpMs = httpMs;
    return httpMs;
  };

  try {
    const response = await fetch(ASR_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ASR_API_KEY}`,
      },
      body: form,
      signal: controller.signal,
    });
    const raw = await response.text();
    let data = null;
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch {
        data = raw;
      }
    }
    return {
      status: response.status,
      data,
      httpMs: stamp(),
      requestId: pickRequestId(response.headers),
    };
  } catch (err) {
    stamp(err);
    if (err.name === "AbortError") {
      if (options.signal && options.signal.aborted) {
        const cancel = new Error("CANCELLED");
        cancel.httpMs = err.httpMs;
        throw cancel;
      }
      const timeout = new Error("TIMEOUT");
      timeout.httpMs = err.httpMs;
      throw timeout;
    }
    err.network = true;
    throw err;
  } finally {
    clearTimeout(timer);
    if (options.signal) options.signal.removeEventListener("abort", onCancel);
  }
}

function pickRequestId(headers) {
  if (!headers || typeof headers.get !== "function") return "";
  return String(headers.get("x-request-id") || "").trim();
}

function attachHttpMeta(parsed, resp) {
  parsed.httpMs = Number(resp && resp.httpMs) || 0;
  parsed.requestId = String((resp && resp.requestId) || "").trim();
  return parsed;
}

function throwHttp(message, httpMs, requestId) {
  const err = new Error(message);
  err.httpMs = Number(httpMs) || 0;
  err.requestId = String(requestId || "").trim();
  throw err;
}

async function transcribe(file, filename, signal) {
  const verboseResp = await postTranscription(file, filename, {
    verbose: true,
    signal,
  });

  if (verboseResp.status === 200) {
    return attachHttpMeta(
      parseTranscriptionBody(verboseResp.data, currentModel().diarize),
      verboseResp
    );
  }

  const plainResp = await postTranscription(file, filename, {
    verbose: false,
    signal,
  });

  if (plainResp.status !== 200) {
    const last = formatHttpError(plainResp.status, plainResp.data);
    if (verboseResp.status !== plainResp.status) {
      throwHttp(
        `${last} | verbose ${formatHttpError(verboseResp.status, verboseResp.data)}`,
        plainResp.httpMs,
        plainResp.requestId
      );
    }
    throwHttp(last, plainResp.httpMs, plainResp.requestId);
  }

  return attachHttpMeta(
    parseTranscriptionBody(plainResp.data, currentModel().diarize),
    plainResp
  );
}

function formatClock(sec) {
  const s = Math.max(0, Math.floor(Number(sec) || 0));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function formatBytes(n) {
  const size = Number(n) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatHttpMs(ms) {
  const n = Math.max(0, Number(ms) || 0);
  if (n < 1000) return `${Math.round(n)} ms`;
  return `${(n / 1000).toFixed(3)} s`;
}

function formatRtf(httpMs, durationSec) {
  const dur = Number(durationSec) || 0;
  const ms = Number(httpMs) || 0;
  if (dur <= 0 || ms <= 0) return "";
  return `${(ms / 1000 / dur).toFixed(2)}×`;
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
  if (code === "TIMEOUT") {
    return `${t("errTimeout")} · ${Math.round(ASR_REQUEST_TIMEOUT_MS / 1000)}s`;
  }
  if (code === "EMPTY") return t("errEmpty");
  if (code === "CANCELLED") return "";
  if (err && err.network) {
    return `${t("errNetwork")} · ${err.message || t("errGeneric")}`;
  }
  return (err && err.message) || t("errGeneric");
}

function pickDroppedFile(dt) {
  const files = dt && dt.files ? Array.from(dt.files) : [];
  const audio = files.find((f) => {
    const name = (f.name || "").toLowerCase();
    const type = (f.type || "").toLowerCase();
    return (
      type.startsWith("audio/") ||
      type.startsWith("video/") ||
      /\.(mp3|wav|m4a|aac|ogg|flac|pcm|webm|mp4|mpeg|mpga|mov|m4v|mkv|avi|mpg|3gp|ogv|ts)$/.test(name)
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
    const extras = [
      ["rawText", seg.rawText],
      ["refinedText", seg.refinedText],
    ].filter(([, value]) => value);
    if (extras.length) {
      const extra = document.createElement("div");
      extra.className = "seg-extra";
      extras.forEach(([key, value]) => {
        const line = document.createElement("div");
        line.className = `seg-line seg-${key}`;
        const label = document.createElement("span");
        label.className = "seg-k";
        label.setAttribute("data-i18n", key);
        label.textContent = t(key);
        const val = document.createElement("span");
        val.className = "seg-v";
        val.textContent = value;
        line.append(label, val);
        extra.append(line);
      });
      li.append(extra);
    }
    segsEl.append(li);
  });
}

function renderHttpTime(root, httpMs, durationSec, requestId) {
  const wrap = root.querySelector("[data-asr-http]");
  const val = root.querySelector("[data-asr-http-val]");
  const rid = root.querySelector("[data-asr-request-id]");
  if (!wrap || !val) return;
  const ms = Number(httpMs) || 0;
  const id = String(requestId || "").trim();
  if (ms <= 0 && !id) {
    wrap.hidden = true;
    val.textContent = "";
    if (rid) {
      rid.hidden = true;
      rid.textContent = "";
      delete rid.dataset.id;
    }
    wrap.removeAttribute("title");
    return;
  }
  const parts = [];
  if (ms > 0) {
    parts.push(formatHttpMs(ms));
    const rtf = formatRtf(ms, durationSec);
    if (rtf) parts.push(`RTF ${rtf}`);
  }
  val.textContent = parts.join(" · ");
  if (rid) {
    rid.hidden = !id;
    rid.textContent = id ? `x-request-id ${id}` : "";
    if (id) rid.dataset.id = id;
    else delete rid.dataset.id;
  }
  wrap.title = [ms > 0 ? `${Math.round(ms)} ms` : "", id].filter(Boolean).join(" · ");
  wrap.hidden = false;
}

async function recognizeBlob(blob, nameHint, ui, signal) {
  if (!blob || !blob.size) {
    throw new Error("EMPTY");
  }

  const origName = (blob instanceof File && blob.name) || nameHint || "";
  const format = resolveFormat(origName || blob.type);
  const video = isVideoAsset(blob, origName);
  const mime =
    blob.type ||
    (video ? VIDEO_TYPES[format] || "video/mp4" : CONTENT_TYPES[format] || "audio/mpeg");
  const filename = /\.[a-z0-9]+$/i.test(origName)
    ? origName.split(/[/\\]/).pop()
    : `${video ? "video" : "audio"}.${format}`;
  const file =
    blob instanceof File
      ? blob.type
        ? blob
        : new File([blob], filename, { type: mime })
      : new File([blob], filename, { type: mime });

  setStatus(ui.status, `${t("transcribing")} · ${t(currentModel().labelKey)}`);
  return transcribe(file, file.name || filename, signal);
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
  const audioEl = root.querySelector("[data-asr-player]");
  const videoEl = root.querySelector("[data-asr-video]");
  const playBtn = root.querySelector("[data-asr-play]");
  const seek = root.querySelector("[data-asr-seek]");
  const clock = root.querySelector("[data-asr-clock]");
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
  let sourceBlob = null;
  let sourceName = "";
  let transcribeAbort = null;
  let jobId = 0;
  let activePlayer = audioEl;
  let seeking = false;

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLang(btn.getAttribute("data-lang"), {
        keepStatus: busy || Boolean(recorder),
        keepRecord: Boolean(recorder),
        keepPlay: Boolean(activePlayer && !activePlayer.paused && !activePlayer.ended),
      });
      if (recorder) recBtn.textContent = t("stop");
      if (playBtn && activePlayer && !playBtn.disabled) {
        playBtn.textContent = activePlayer.paused ? t("play") : t("pause");
      }
      syncModelUi();
    });
  });

  modelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (recorder) return;
      const next = resolveModel(btn.getAttribute("data-asr-model"));
      if (next.key === currentModelKey) return;
      currentModelKey = next.key;
      try {
        localStorage.setItem(MODEL_KEY, currentModelKey);
      } catch {
        /* ignore */
      }
      syncModelUi();
      if (sourceBlob) runTranscribe();
    });
  });

  const syncClock = () => {
    if (!clock || !activePlayer) return;
    const cur = activePlayer.currentTime || 0;
    const dur = Number.isFinite(activePlayer.duration) ? activePlayer.duration : 0;
    clock.textContent = `${formatClock(cur)} / ${formatClock(dur)}`;
    if (seek && !seeking && dur) {
      seek.max = String(dur);
      seek.value = String(cur);
    }
  };

  const setActivePlayer = (el) => {
    [audioEl, videoEl].forEach((node) => {
      if (!node || node === el) return;
      node.pause();
      node.classList.remove("is-on");
      node.removeAttribute("src");
      node.load();
    });
    if (el) el.classList.add("is-on");
    activePlayer = el;
  };

  const attachMedia = (blob, name) => {
    if (!blob) return;
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    mediaUrl = URL.createObjectURL(blob);
    mediaName = name || t("unnamed");
    const useVideo = isVideoAsset(blob, mediaName);
    const el = useVideo ? videoEl : audioEl;
    if (!el) return;
    setActivePlayer(el);
    el.src = mediaUrl;
    el.load();
    if (filechip) filechip.textContent = mediaName;
    if (filesize) filesize.textContent = formatBytes(blob.size);
    if (media) media.classList.add("is-on");
    if (downloadBtn) downloadBtn.disabled = false;
    if (playBtn) {
      playBtn.disabled = false;
      playBtn.textContent = t("play");
    }
    if (seek) {
      seek.disabled = false;
      seek.value = "0";
      seek.max = "0";
    }
    if (clock) clock.textContent = "00:00 / 00:00";
  };

  const setBusy = (next) => {
    busy = next;
    recBtn.disabled = next && !recorder;
    copyBtn.disabled = next;
  };

  const runTranscribe = async () => {
    if (!sourceBlob || recorder) return;
    const id = ++jobId;
    if (transcribeAbort) transcribeAbort.abort();
    const ac = new AbortController();
    transcribeAbort = ac;
    setBusy(true);
    renderHttpTime(root, 0);
    try {
      const parsed = await recognizeBlob(sourceBlob, sourceName, ui, ac.signal);
      if (id !== jobId) return;
      renderResult(root, parsed);
      const duration =
        parsed.duration ||
        (activePlayer && Number.isFinite(activePlayer.duration) ? activePlayer.duration : 0);
      renderHttpTime(root, parsed.httpMs, duration, parsed.requestId);
      setStatus(status, parsed.segments.length ? t("doneSeg") : t("done"), "ok");
    } catch (err) {
      if (id !== jobId || (err && err.message === "CANCELLED")) return;
      console.error("recognize error", err);
      renderHttpTime(root, err && err.httpMs, 0, err && err.requestId);
      setStatus(status, localizeError(err), "error");
    } finally {
      if (id === jobId) {
        setBusy(false);
        transcribeAbort = null;
      }
    }
  };

  const runFile = async (file) => {
    if (!file || recorder) return;
    sourceBlob = file;
    sourceName = file.name || t("unnamed");
    attachMedia(file, sourceName);
    await runTranscribe();
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
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
        sourceBlob = blob;
        sourceName = recName;
        attachMedia(blob, recName);
        await runTranscribe();
      });

      recorder.start(250);
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

  if (playBtn) {
    playBtn.addEventListener("click", async () => {
      if (!activePlayer || !activePlayer.src) return;
      if (activePlayer.paused) {
        try {
          await activePlayer.play();
        } catch (err) {
          console.error("play error", err);
          setStatus(status, t("errPlay"), "error");
        }
      } else {
        activePlayer.pause();
      }
    });
  }

  if (videoEl) {
    videoEl.addEventListener("click", async () => {
      if (!videoEl.src || activePlayer !== videoEl) return;
      if (videoEl.paused) {
        try {
          await videoEl.play();
        } catch (err) {
          console.error("play error", err);
          setStatus(status, t("errPlay"), "error");
        }
      } else {
        videoEl.pause();
      }
    });
  }

  if (seek) {
    seek.addEventListener("pointerdown", () => {
      seeking = true;
    });
    seek.addEventListener("input", () => {
      if (!activePlayer) return;
      activePlayer.currentTime = Number(seek.value) || 0;
      syncClock();
    });
    seek.addEventListener("change", () => {
      seeking = false;
    });
  }

  [audioEl, videoEl].forEach((el) => {
    if (!el) return;
    el.addEventListener("loadedmetadata", syncClock);
    el.addEventListener("timeupdate", syncClock);
    el.addEventListener("play", () => {
      if (playBtn) playBtn.textContent = t("pause");
    });
    el.addEventListener("pause", () => {
      if (playBtn) playBtn.textContent = t("play");
    });
    el.addEventListener("ended", () => {
      if (playBtn) playBtn.textContent = t("play");
    });
    el.addEventListener("error", () => {
      if (el === audioEl && videoEl && mediaUrl) {
        setActivePlayer(videoEl);
        videoEl.src = mediaUrl;
        videoEl.load();
      }
    });
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
    if (!item || !activePlayer || !activePlayer.src) return;
    const start = Number(item.dataset.start);
    if (!Number.isFinite(start)) return;
    activePlayer.currentTime = start;
    activePlayer.play().catch(() => {});
  });

  const requestIdEl = root.querySelector("[data-asr-request-id]");
  if (requestIdEl) {
    requestIdEl.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = requestIdEl.dataset.id || "";
      if (!id) return;
      try {
        await navigator.clipboard.writeText(id);
        setStatus(status, t("requestIdCopied"), "ok");
      } catch {
        setStatus(status, t("errCopy"), "error");
      }
    });
  }

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
