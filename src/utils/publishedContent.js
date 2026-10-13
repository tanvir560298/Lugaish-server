export function validPublishedQuiz(quiz) {
  return (
    Array.isArray(quiz) &&
    quiz.length <= 100 &&
    quiz.every(
      (q) =>
        q &&
        typeof q.question === "string" &&
        q.question.trim().length > 0 &&
        q.question.length <= 2000 &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        q.options.length <= 4 &&
        q.options.every(
          (o) =>
            typeof o === "string" && o.trim().length > 0 && o.length <= 1000,
        ) &&
        Number.isInteger(q.correctAnswer) &&
        q.correctAnswer >= 0 &&
        q.correctAnswer < q.options.length &&
        (q.explanation === undefined ||
          (typeof q.explanation === "string" && q.explanation.length <= 2000)),
    )
  );
}
export function cleanMaterials(items) {
  if (!Array.isArray(items) || items.length > 50) return null;
  const out = [];
  for (const r of items) {
    if (
      !r ||
      typeof r.id !== "string" ||
      !r.id.trim() ||
      r.id.length > 100 ||
      typeof r.title !== "string" ||
      !r.title.trim() ||
      r.title.length > 160 ||
      typeof r.url !== "string" ||
      r.url.length > 2048
    )
      return null;
    try {
      const u = new URL(r.url);
      if (u.protocol !== "https:" || u.username || u.password) return null;
    } catch {
      return null;
    }
    out.push({
      id: r.id,
      title: r.title,
      url: r.url,
      type: r.type === "PDF" ? "PDF" : "link",
    });
  }
  return new Set(out.map((r) => r.id)).size === out.length ? out : null;
}
