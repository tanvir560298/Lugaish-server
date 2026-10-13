import { quizContentKey, validReviewedQuiz } from "./personalizedLearning.js";
export function analyticsOptions(query = {}, now = new Date()) {
  const range = query.range || "7",
    zone = query.zone || "UTC",
    page = Number(query.page ?? 1);
  if (
    typeof range !== "string" ||
    typeof zone !== "string" ||
    zone.length > 100 ||
    (query.page !== undefined &&
      !["string", "number"].includes(typeof query.page)) ||
    !["7", "30", "all"].includes(range) ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > 500
  )
    throw Error("Invalid range or activity page.");
  try {
    new Intl.DateTimeFormat("en", { timeZone: zone }).format(now);
  } catch {
    throw Error("Invalid time zone.");
  }
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const day = (value) => {
    const d = new Date(value);
    if (!value || !Number.isFinite(d.getTime()) || d > now) return null;
    const p = Object.fromEntries(
      formatter.formatToParts(d).map((p) => [p.type, p.value]),
    );
    return `${p.year}-${p.month}-${p.day}`;
  };
  const today = day(now),
    start =
      range === "all"
        ? null
        : new Date(
            Date.parse(today + "T12:00:00Z") - (Number(range) - 1) * 86400000,
          )
            .toISOString()
            .slice(0, 10);
  return {
    range,
    zone,
    page,
    today,
    start,
    day,
    inRange: (value) => {
      const key = day(value);
      return !!key && (!start || key >= start);
    },
  };
}
export function calculateAnalytics({
  lessons = [],
  quizzes = [],
  reviews = [],
  progress = [],
  options,
  partial = false,
}) {
  const byDay = new Map(lessons.map((l) => [l.day, l]));
  const seen = new Set(),
    valid = [];
  let omitted = 0;
  for (const q of quizzes) {
    if (seen.has(String(q._id))) continue;
    seen.add(String(q._id));
    const l = byDay.get(q.day);
    if (
      !l ||
      !validReviewedQuiz(l.quiz) ||
      q.contentKey !== quizContentKey(l.quiz) ||
      !Array.isArray(q.responses) ||
      q.responses.length !== l.quiz.length ||
      !options.day(q.completedAt) ||
      q.responses.some(
        (r, i) =>
          r.questionIndex !== i ||
          !Number.isInteger(r.selectedAnswer) ||
          r.selectedAnswer < 0 ||
          r.selectedAnswer >= l.quiz[i].options.length ||
          r.isCorrect !== (r.selectedAnswer === l.quiz[i].correctAnswer),
      )
    ) {
      omitted++;
      continue;
    }
    valid.push(q);
  }
  valid.sort(
    (a, b) =>
      new Date(a.completedAt) - new Date(b.completedAt) ||
      String(a._id).localeCompare(String(b._id)),
  );
  const first = new Map(),
    latest = new Map(),
    completion = new Map(),
    events = [],
    groups = {
      first: { correct: 0, evaluated: 0, sessions: 0 },
      repeat: { correct: 0, evaluated: 0, sessions: 0 },
      review: { correct: 0, evaluated: 0, sessions: 0 },
    };
  for (const q of valid) {
    const initial = !first.has(q.day);
    if (initial) first.set(q.day, q);
    latest.set(q.day, q);
    if (!completion.has(q.day)) completion.set(q.day, q.completedAt);
    if (options.inRange(q.completedAt)) {
      const g = initial ? groups.first : groups.repeat;
      g.sessions++;
      g.evaluated += q.responses.length;
      g.correct += q.responses.filter((r) => r.isCorrect).length;
      events.push({
        id: "practice:" + q._id,
        kind: "practice",
        title: byDay.get(q.day).title,
        at: q.completedAt,
        correct: q.responses.filter((r) => r.isCorrect).length,
        evaluated: q.responses.length,
        initial,
      });
    }
  }
  for (const p of progress)
    for (const c of p.completedDays || []) {
      const l = byDay.get(c.day);
      if (!l || l.quiz?.length || !options.day(c.completedAt)) continue;
      const old = completion.get(c.day);
      if (!old || new Date(c.completedAt) < new Date(old))
        completion.set(c.day, c.completedAt);
    }
  for (const [day, at] of completion) {
    if (!byDay.get(day).quiz?.length && options.inRange(at))
      events.push({
        id: "lesson:" + day,
        kind: "lesson",
        title: byDay.get(day).title,
        at,
      });
  }
  const sources = new Map(valid.map((q) => [String(q._id), q])),
    retryKeys = new Set(),
    resolved = new Set(),
    current = new Map();
  for (const q of latest.values())
    for (const r of q.responses)
      if (!r.isCorrect)
        current.set(String(q._id) + ":" + r.questionIndex, {
          sourceQuiz: String(q._id),
          questionIndex: r.questionIndex,
          day: q.day,
        });
  for (const r of reviews) {
    const key = String(r.sourceQuiz) + ":" + r.questionIndex,
      source = sources.get(String(r.sourceQuiz)),
      question = source && byDay.get(source.day)?.quiz[r.questionIndex],
      id = r.requestId || String(r._id);
    if (retryKeys.has(id)) continue;
    retryKeys.add(id);
    if (
      !question ||
      source.responses[r.questionIndex]?.isCorrect !== false ||
      !options.day(r.completedAt) ||
      new Date(r.completedAt) < new Date(source.completedAt) ||
      !Number.isInteger(r.selectedAnswer) ||
      r.selectedAnswer < 0 ||
      r.selectedAnswer >= question.options.length ||
      r.isCorrect !== (r.selectedAnswer === question.correctAnswer)
    ) {
      omitted++;
      continue;
    }
    if (r.isCorrect) resolved.add(key);
    if (options.inRange(r.completedAt)) {
      groups.review.sessions++;
      groups.review.evaluated++;
      if (r.isCorrect) groups.review.correct++;
      events.push({
        id: "review:" + r._id,
        kind: "review",
        title: byDay.get(source.day).title,
        at: r.completedAt,
        correct: r.isCorrect ? 1 : 0,
        evaluated: 1,
      });
    }
  }
  const resolvedCurrent = [...current.keys()].filter((k) =>
    resolved.has(k),
  ).length;
  events.sort(
    (a, b) => new Date(b.at) - new Date(a.at) || a.id.localeCompare(b.id),
  );
  const days = new Map();
  for (const e of events) {
    const day = options.day(e.at);
    days.set(day, (days.get(day) || 0) + 1);
  }
  const selectedCompleted = [...completion.values()].filter((at) =>
    options.inRange(at),
  ).length;
  const today = {
    lessons: [...completion.values()].filter(
      (at) => options.day(at) === options.today,
    ).length,
    practice: valid.filter((q) => options.day(q.completedAt) === options.today)
      .length,
    reviews: events.filter(
      (e) =>
        e.kind === "review" &&
        e.correct === 1 &&
        options.day(e.at) === options.today,
    ).length,
  };
  return {
    coverage: { partial, omitted },
    metrics: partial
      ? null
      : {
          completedLessons: selectedCompleted,
          practiceSessions: groups.first.sessions + groups.repeat.sessions,
          questionsAttempted: groups.first.evaluated + groups.repeat.evaluated,
          correctAnswers: groups.first.correct + groups.repeat.correct,
        },
    accuracy: partial ? null : groups,
    review: partial
      ? null
      : {
          pending: current.size - resolvedCurrent,
          successful: resolvedCurrent,
          total: current.size,
          retries: groups.review.sessions,
        },
    today: partial ? null : today,
    focus: {
      available: false,
      reason: "Focus sessions are browser-local and not server-verified.",
    },
    activity: {
      items: events.slice((options.page - 1) * 10, options.page * 10),
      page: options.page,
      hasMore: events.length > options.page * 10,
    },
    timelineTruncated: days.size > 90,
    timeline: [...days]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-90)
      .map(([day, count]) => ({ day, count })),
  };
}
