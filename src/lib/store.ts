export interface User {
  name: string;
  city: string;
  weeklyIncome: number;
  persona: "food" | "ecommerce" | "grocery" | "logistics";
}

export interface Policy {
  active: boolean;
  premium: number;
  coverage: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  aqi: number;
  riskProbability: number;
  activatedAt?: string;
}

export interface Claim {
  id: string;
  event: string;
  rainfall: number;
  payout: number;
  status: "Approved" | "Pending";
  fraudCheck: "Passed" | "Flagged";
  createdAt: string;
}

const KEYS = {
  user: "worksure_user",
  policy: "worksure_policy",
  claims: "worksure_claims",
};

export function getUser(): User | null {
  const raw = localStorage.getItem(KEYS.user);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (!parsed.persona) return null; 
  return parsed;
}

export function saveUser(user: User) {
  localStorage.setItem(KEYS.user, JSON.stringify(user));
}

export function getPolicy(): Policy | null {
  const raw = localStorage.getItem(KEYS.policy);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  // Ensure new fields exist for backward compat during dev
  if (parsed.incomeLossForecast === undefined) parsed.incomeLossForecast = 800;
  if (parsed.trustScore === undefined) parsed.trustScore = 95;
  return parsed;
}

export function savePolicy(policy: Policy) {
  localStorage.setItem(KEYS.policy, JSON.stringify(policy));
}

export interface Policy {
  active: boolean;
  premium: number;
  coverage: number;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  aqi: number;
  riskProbability: number;
  incomeLossForecast: number;
  trustScore: number;
  activatedAt?: string;
}

// ... existing Claim interface remains ...

export function getClaims(): Claim[] {
  const raw = localStorage.getItem(KEYS.claims);
  return raw ? JSON.parse(raw) : [];
}

export function saveClaims(claims: Claim[]) {
  localStorage.setItem(KEYS.claims, JSON.stringify(claims));
}

export function clearAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}

// --- AI Multi-Factor Risk Engine (WorkSure AI) ---

const CITY_RISK: Record<string, number> = {
  mumbai: 85,
  chennai: 78,
  kolkata: 72,
  delhi: 45,
  bangalore: 55,
  hyderabad: 50,
  pune: 60,
  ahmedabad: 40,
  surat: 42,
};

const PERSONA_MULT: Record<string, number> = {
  food: 1.2,
  ecommerce: 1,
  grocery: 1.15,
  logistics: 0.9,
};

export function calculateRisk(city: string, persona: User["persona"] = "food") {
  const key = city.toLowerCase().trim();
  const baseCityRisk = CITY_RISK[key] ?? (30 + Math.floor(Math.random() * 50));
  const mult = PERSONA_MULT[persona] || 1;
  
  const rainfall = (baseCityRisk * mult) + Math.floor(Math.random() * 15) - 5;
  const clamped = Math.max(10, Math.min(100, rainfall));
  const aqi = 50 + Math.floor(Math.random() * 300);
  const riskProbability = Math.floor(clamped * 0.8 + (aqi > 200 ? 15 : 0) + Math.random() * 10);

  let riskLevel: "low" | "medium" | "high";
  let premium: number;
  let coverage: number;

  if (clamped > 65 || aqi > 250) {
    riskLevel = "high";
    premium = Math.floor(30 * mult);
    coverage = 500;
  } else if (clamped > 35 || aqi > 150) {
    riskLevel = "medium";
    premium = Math.floor(20 * mult);
    coverage = 300;
  } else {
    riskLevel = "low";
    premium = Math.floor(10 * mult);
    coverage = 200;
  }

  const incomeLossForecast = Math.floor((clamped / 100) * 1500 + Math.random() * 200);
  const trustScore = 85 + Math.floor(Math.random() * 14);

  return { 
    riskScore: Math.floor(clamped), 
    riskLevel, 
    rainfall: Math.floor(clamped), 
    premium, 
    coverage, 
    aqi, 
    riskProbability: Math.min(99, riskProbability),
    incomeLossForecast,
    trustScore
  };
}

export function checkFraud(): { passed: boolean; reason: string; details: { movement: boolean; location: boolean; patterns: boolean } } {
  const roll = Math.random();
  const details = { movement: true, location: true, patterns: true };
  
  if (roll < 0.10) {
    details.movement = false;
    return { passed: false, reason: "Movement anomaly: Suspicious stationary activity.", details };
  }
  if (roll < 0.18) {
    details.location = false;
    return { passed: false, reason: "Location mismatch: GPS node inconsistency.", details };
  }
  if (roll < 0.25) {
     details.patterns = false;
     return { passed: false, reason: "Pattern alert: Automated claim scripting detected.", details };
  }
  return { passed: true, reason: "Intelligence verification passed. Trust score maintained.", details };
}
