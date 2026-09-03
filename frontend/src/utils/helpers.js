// ── Time Formatting ──────────────────────────────────────────
export function timeAgo(dateString) {
  if (!dateString) return "Recently";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 5) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1d ago";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

// ── Title Cleaning ───────────────────────────────────────────
export function cleanJobTitle(rawTitle) {
  if (!rawTitle) return "Software Engineer";
  return rawTitle.replace(/[\uFFFD]/g, "e").replace(/\s+/g, " ").trim();
}

// ── Experience Formatting ────────────────────────────────────
export function formatExperience(job) {
  if (typeof job.experience === 'number') {
    return job.experience === 0 ? "0 Yrs (Fresher)" : `${job.experience}+ Yrs`;
  }
  if (job.experience) return `${job.experience} Yrs`;
  const title = (job.title || "").toLowerCase();
  if (title.includes("intern") || title.includes("praktik")) return "0 - 1 Yrs";
  if (title.includes("junior") || title.includes("assoc") || title.includes("entry")) return "0 - 2 Yrs";
  if (title.includes("senior") || title.includes("sr") || title.includes("lead") || title.includes("manager")) return "5+ Yrs";
  if (title.includes("staff") || title.includes("principal") || title.includes("director")) return "8+ Yrs";
  if (title.includes("ii") || title.includes("2")) return "3 - 5 Yrs";
  return "Not Specified";
}

// ── Salary Formatting ────────────────────────────────────────
export function formatSalaryDisplay(job) {
  if (job.salary_summary) return job.salary_summary;

  const min = job.salary_min;
  const max = job.salary_max;
  const currency = job.salary_currency;

  if (min != null || max != null) {
    if (currency === "INR" || (!currency && (min >= 100000 || max >= 100000))) {
      const minL = min ? (min >= 100000 ? (min / 100000).toFixed(0) : min) : null;
      const maxL = max ? (max >= 100000 ? (max / 100000).toFixed(0) : max) : null;
      if (minL && maxL) return `₹${minL} – ${maxL} LPA`;
      if (minL) return `₹${minL}+ LPA`;
      if (maxL) return `Up to ₹${maxL} LPA`;
    } else if (currency === "USD" || currency === "EUR" || currency === "GBP") {
      const fmt = (n) => (n >= 1000 ? `${Math.round(n / 1000)}k` : n);
      const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
      if (min && max) return `${symbol}${fmt(min)} – ${symbol}${fmt(max)}`;
      if (min) return `From ${symbol}${fmt(min)}`;
      return `Up to ${symbol}${fmt(max)}`;
    }
  }

  return "Not Specified";
}

// ── Location Formatting ──────────────────────────────────────
export function formatLocation(job) {
  if (job.location) {
    let loc = job.location.trim();
    if (!loc || loc === "nan" || loc === "null") {
      return job.is_remote ? "Remote" : "Not Provided";
    }
    const l = loc.toLowerCase();
    if (l.includes("bengaluru") || l.includes("bangalore")) return "Bangalore, India";
    if (l.includes("hyderabad")) return "Hyderabad, India";
    if (l.includes("pune")) return "Pune, India";
    if (l.includes("gurgaon") || l.includes("gurugram")) return "Gurgaon, India";
    if (l.includes("noida") || l.includes("delhi")) return "Delhi NCR, India";
    if (l.includes("mumbai")) return "Mumbai, India";
    if (l.includes("chennai")) return "Chennai, India";
    if (l.includes("remote")) return "Remote";
    if (job.is_remote) return "Remote";
    return loc;
  }
  if (job.is_remote) return "Remote";
  return "Not Provided";
}

// ── Skill Tag Extraction ─────────────────────────────────────
export function extractSkillTags(job) {
  const text = ((job.title || "") + " " + (job.description || "")).toLowerCase();
  const allSkills = [
    { name: "Python", regex: /\bpython\b/ },
    { name: "C++", regex: /\bc\+\+\b|\bcpp\b/ },
    { name: "Java", regex: /\bjava\b/ },
    { name: "Spring Boot", regex: /\bspring boot\b|\bspring\b/ },
    { name: "React", regex: /\breact\b|\breactjs\b/ },
    { name: "TypeScript", regex: /\btypescript\b|\bts\b/ },
    { name: "JavaScript", regex: /\bjavascript\b|\bjs\b/ },
    { name: "Tailwind CSS", regex: /\btailwind\b/ },
    { name: "Node.js", regex: /\bnode\b|\bnodejs\b/ },
    { name: "Go", regex: /\bgolang\b|\bgo\b/ },
    { name: "Rust", regex: /\brust\b/ },
    { name: "AWS", regex: /\baws\b/ },
    { name: "Azure", regex: /\bazure\b/ },
    { name: "Docker", regex: /\bdocker\b/ },
    { name: "Kubernetes", regex: /\bkubernetes\b|\bk8s\b/ },
    { name: "Kafka", regex: /\bkafka\b/ },
    { name: "SQL", regex: /\bsql\b|\bpostgres\b|\bmysql\b/ },
    { name: "Machine Learning", regex: /\bmachine learning\b|\bml\b/ },
    { name: "Data Structures", regex: /\bdata structures?\b/ },
    { name: ".NET", regex: /\b\.net\b|\bdotnet\b/ },
    { name: "C#", regex: /\bc#\b|\bcsharp\b/ },
    { name: "Redis", regex: /\bredis\b/ },
    { name: "PostgreSQL", regex: /\bpostgresql\b|\bpostgres\b/ },
    { name: "MySQL", regex: /\bmysql\b/ },
  ];

  const matched = [];
  for (const skill of allSkills) {
    if (skill.regex.test(text)) {
      matched.push(skill.name);
      if (matched.length >= 4) break;
    }
  }

  return matched;
}

// ── Employment Type Formatting ───────────────────────────────
export function formatEmploymentType(type) {
  if (!type) return "Full-time";
  const map = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
    FREELANCE: "Freelance",
  };
  return map[type] || type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

// ── Bookmark Helpers ─────────────────────────────────────────
export function isJobSaved(jobId) {
  try {
    const saved = JSON.parse(localStorage.getItem("jobshive_saved") || localStorage.getItem("easyjobs_saved") || "[]");
    return saved.includes(jobId.toString());
  } catch {
    return false;
  }
}

export function toggleSaveJob(jobId) {
  try {
    let saved = JSON.parse(localStorage.getItem("jobshive_saved") || localStorage.getItem("easyjobs_saved") || "[]");
    const strId = jobId.toString();
    const idx = saved.indexOf(strId);
    if (idx >= 0) {
      saved.splice(idx, 1);
    } else {
      saved.push(strId);
    }
    localStorage.setItem("jobshive_saved", JSON.stringify(saved));
    return idx < 0; // true if now saved
  } catch {
    return false;
  }
}

export function getSavedCount() {
  try {
    return JSON.parse(localStorage.getItem("jobshive_saved") || localStorage.getItem("easyjobs_saved") || "[]").length;
  } catch {
    return 0;
  }
}

// ── Description Section Parser ───────────────────────────────
export function parseDescription(description) {
  if (!description) return { aboutRole: '', whatYoullDo: [], lookingFor: [], preferred: [] };

  const lines = description.split('\n').map(l => l.trim()).filter(Boolean);
  let aboutRole = '';
  let whatYoullDo = [];
  let lookingFor = [];
  let preferred = [];
  let currentSection = 'about';

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith('about the role') || lower.startsWith('about this role')) {
      currentSection = 'about';
      continue;
    }
    if (lower.startsWith("what you'll do") || lower.startsWith('what you will do') || lower.startsWith('key responsibilities') || lower.startsWith('responsibilities')) {
      currentSection = 'do';
      continue;
    }
    if (lower.startsWith("what we're looking") || lower.startsWith('what we are looking') || lower.startsWith('requirements') || lower.startsWith('qualifications') || lower.startsWith('skills required')) {
      currentSection = 'looking';
      continue;
    }
    if (lower.startsWith('preferred') || lower.startsWith('nice to have') || lower.startsWith('bonus')) {
      currentSection = 'preferred';
      continue;
    }

    const bulletText = line.replace(/^[•\-\*]\s*/, '').trim();

    switch (currentSection) {
      case 'about':
        aboutRole += (aboutRole ? ' ' : '') + line;
        break;
      case 'do':
        if (bulletText) whatYoullDo.push(bulletText);
        break;
      case 'looking':
        if (bulletText) lookingFor.push(bulletText);
        break;
      case 'preferred':
        if (bulletText) preferred.push(bulletText);
        break;
    }
  }

  return { aboutRole, whatYoullDo, lookingFor, preferred };
}
