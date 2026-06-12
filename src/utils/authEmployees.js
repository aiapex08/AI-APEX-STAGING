export const TA_EMP_KEY = 'ta_v6_emp';

const MASTER_ADMIN = {
  id: 'master', name: 'Master Admin', designation: 'Administrator',
  team: 'Admin', level: 1, accessCode: '9993', status: 'Active',
};

// Source of truth for auth — matches the official employee code table
const AUTH_SEED = [
  // ── Admins / Directors (L1) ──────────────────────────────────────────────
  { id:'u001', name:'Ganesh Shetty',                    designation:'Cost Artist Lead',     team:'Estimation',  level:1, accessCode:'EST-ADM', status:'Active' },
  { id:'u002', name:'Emelaine Jane',                    designation:'Cost Artist',          team:'Estimation',  level:1, accessCode:'STAR',    status:'Active' },
  { id:'u023', name:'Nour Alyazji',                     designation:"Director's Hub",       team:'Admin',       level:1, accessCode:'7STAR',   status:'Active' },

  // ── Estimation Engineers (L2) ─────────────────────────────────────────────
  { id:'u003', name:'Sachin Poojary',                   designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX552',   status:'Active' },
  { id:'u004', name:'Mohammad Samee Hamid Khan',         designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX719',   status:'Active' },
  { id:'u005', name:'Moazzam Ali',                      designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX638',   status:'Active' },
  { id:'u006', name:'Benson Benjamine',                 designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX904',   status:'Active' },
  { id:'u007', name:'Pranav Manjalam Kandiyil',         designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX471',   status:'Active' },
  { id:'u008', name:'Saeem Sajid Gadkari',              designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX856',   status:'Active' },
  { id:'u009', name:'Jaffar Shaik',                     designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX392',   status:'Active' },
  { id:'u021', name:'Muzafar Khasab Abdul',             designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX681',   status:'Active' },
  { id:'u017', name:'Afridi Miyan Basheer',             designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX547',   status:'Active' },
  { id:'u022', name:'Alfaj Muhammad',                   designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX903',   status:'Active' },
  { id:'u018', name:'Vimal Vencent',                    designation:'Estimation Engineer',  team:'Estimation',  level:2, accessCode:'EX764',   status:'Active' },
  { id:'u025', name:'Armela Ebalde Arboleda',           designation:'Estimation Coordinator',     team:'Estimation',  level:2, accessCode:'NA762',   status:'Active' },
  { id:'u024', name:'Aswin Raj Kuzhipurath Mannil Rajeev', designation:'Estimation Engineer',     team:'Estimation',  level:2, accessCode:'NF11846', status:'Active' },
  { id:'u026', name:'Elangovan Sivaraj',                designation:'Senior Estimation Engineer', team:'Estimation',  level:2, accessCode:'NF11125', status:'Active' },

  // ── Sales (L2) ────────────────────────────────────────────────────────────
  { id:'u010', name:'Ammar Khaldoun',                   designation:'Sales Engineer',       team:'Sales',       level:2, accessCode:'SX985',   status:'Active' },
  { id:'u011', name:'Ashik Bin Shams',                  designation:'Sales Engineer',       team:'Sales',       level:2, accessCode:'SX417',   status:'Active' },
  { id:'u012', name:'Mohammad Hindawi',                 designation:'Sales Executive',      team:'Sales',       level:2, accessCode:'SE628',   status:'Active' },
  { id:'u013', name:'Ibrahim Odeh',                     designation:'Sales Executive',      team:'Sales',       level:2, accessCode:'SE842',   status:'Active' },
  { id:'u014', name:'Yazan Al Agha',                    designation:'Sales Executive',      team:'Sales',       level:2, accessCode:'SE519',   status:'Active' },
  { id:'u016', name:'Almira Abogado',                   designation:'Sales Executive',      team:'Sales',       level:2, accessCode:'SE421',   status:'Active' },
  { id:'u015', name:'Ali Hussnain',                     designation:'Sales Account Manager',team:'Sales',       level:2, accessCode:'SM386',   status:'Active' },
  { id:'u027', name:'Fe Marie Cuyos',                   designation:'Customer Service Coordinator', team:'Sales', level:2, accessCode:'NF11785', status:'Active' },

  // ── Engineering (L2) ─────────────────────────────────────────────────────
  { id:'u019', name:'Mohammad Adnan Khan',              designation:'Technical Engineer',   team:'Engineering', level:2, accessCode:'NF14341', status:'Active' },
  { id:'u020', name:'Motasem Khalifah Hamdan Nawafleh', designation:'Project Engineer',     team:'Engineering', level:2, accessCode:'NF12188', status:'Active' },
];

/**
 * Find an active employee by access code.
 * Reads from localStorage first (populated by TeamAccess page), falls back to AUTH_SEED.
 */
export function findEmployeeByCode(code) {
  const upper = (code || '').trim().toUpperCase();
  if (!upper) return null;
  if (upper === '9993') return MASTER_ADMIN;
  try {
    const s = localStorage.getItem(TA_EMP_KEY);
    const list = s ? JSON.parse(s) : AUTH_SEED;
    return list.find(e => (e.accessCode || '').toUpperCase() === upper && e.status !== 'Resigned') || null;
  } catch {
    return AUTH_SEED.find(e => (e.accessCode || '').toUpperCase() === upper && e.status !== 'Resigned') || null;
  }
}

/**
 * Return the set of EstimationHub card IDs the user may see.
 * null = show all cards (L1 admins/directors or unauthenticated).
 */
export function getAllowedCardIds(user) {
  if (!user || user.level === 1) return null;
  const d = (user.designation || '').toLowerCase();
  if (d.includes('cost artist')) {
    return new Set(['quotations', 'team', 'costing', 'projects', 'competitors', 'ai-estimation']);
  }
  if (d.includes('estimation engineer') || d.includes('estimator')) {
    return new Set(['quotations', 'projects', 'ai-estimation']);
  }
  // Default L2 (engineering, other)
  return new Set(['quotations', 'projects', 'ai-estimation']);
}
