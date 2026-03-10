import { supabase } from './supabaseClient';

const SESSION_KEY = 'vocacional_session';
const SESSION_CREATED_KEY = 'vocacional_session_created';

const FLUSH_SIZE = 5;
const FLUSH_INTERVAL_MS = 5000;

interface TrackingEvent {
  session_id: string;
  event_name: string;
  page: string;
  step: number;
  metadata: Record<string, unknown>;
}

let eventBuffer: TrackingEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

// ─── Session ID ───

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

// ─── UTM & Click ID helpers ───

function getUrlParam(name: string): string | null {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
}

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

// ─── Create Session ───

export async function createSession(): Promise<void> {
  if (localStorage.getItem(SESSION_CREATED_KEY) === 'true') return;

  const sessionId = getSessionId();

  const { error } = await supabase.from('vocacional_sessions').insert({
    session_id: sessionId,
    landing_page: window.location.pathname,
    device: getDeviceType(),
    user_agent: navigator.userAgent,
    utm_source: getUrlParam('utm_source'),
    utm_medium: getUrlParam('utm_medium'),
    utm_campaign: getUrlParam('utm_campaign'),
    utm_content: getUrlParam('utm_content'),
    utm_term: getUrlParam('utm_term'),
    fbclid: getUrlParam('fbclid'),
    gclid: getUrlParam('gclid'),
  });

  if (error) {
    console.error('[Tracking] Erro ao criar sessão:', error.message);
    return;
  }

  localStorage.setItem(SESSION_CREATED_KEY, 'true');
}

// ─── Event Step Map ───

const STEP_MAP: Record<string, number> = {
  landing_view: 1,
  quiz_start: 2,
  word_selected: 2,
  word_unselected: 2,
  quiz_submit: 2,
  lead_form_view: 3,
  lead_form_submit: 3,
  result_view: 4,
  course_click: 5,
  courses_direct_click: 5,
};

// ─── Track Event ───

export function trackEvent(
  eventName: string,
  metadata: Record<string, unknown> = {},
  stepOverride?: number,
): void {
  const event: TrackingEvent = {
    session_id: getSessionId(),
    event_name: eventName,
    page: window.location.pathname,
    step: stepOverride ?? STEP_MAP[eventName] ?? 0,
    metadata,
  };

  eventBuffer.push(event);

  if (eventBuffer.length >= FLUSH_SIZE) {
    flushEvents();
  }
}

// ─── Flush (batch insert) ───

export async function flushEvents(): Promise<void> {
  if (eventBuffer.length === 0) return;

  const batch = [...eventBuffer];
  eventBuffer = [];

  const { error } = await supabase.from('vocacional_events').insert(batch);

  if (error) {
    console.error('[Tracking] Erro ao enviar eventos:', error.message);
    eventBuffer = [...batch, ...eventBuffer];
  }
}

// ─── Start periodic flush + beforeunload ───

export function startFlushLoop(): void {
  if (flushTimer) return;

  flushTimer = setInterval(flushEvents, FLUSH_INTERVAL_MS);

  window.addEventListener('beforeunload', () => {
    flushEvents();
  });
}

// ─── Save Lead (direct insert, not batched) ───

export async function saveLead(data: {
  name: string;
  phone: string;
  quizProfile?: string | null;
  recommendedCourse?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  const sessionId = getSessionId();

  const { error } = await supabase.from('vocacional_leads').insert({
    session_id: sessionId,
    name: data.name,
    phone: data.phone,
    quiz_profile: data.quizProfile ?? null,
    recommended_course: data.recommendedCourse ?? null,
  });

  if (error) {
    console.error('[Tracking] Erro ao salvar lead:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

// ─── Update Lead (add quiz profile after result) ───

export async function updateLeadProfile(data: {
  quizProfile: string;
  recommendedCourse?: string | null;
}): Promise<void> {
  const sessionId = getSessionId();

  const { error } = await supabase
    .from('vocacional_leads')
    .update({
      quiz_profile: data.quizProfile,
      recommended_course: data.recommendedCourse ?? null,
    })
    .eq('session_id', sessionId);

  if (error) {
    console.error('[Tracking] Erro ao atualizar lead:', error.message);
  }
}

// ─── Init: call once on app mount ───

export async function initTracking(): Promise<void> {
  await createSession();
  startFlushLoop();
}
