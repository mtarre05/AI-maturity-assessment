import React, { useMemo, useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CATEGORIES = [
  {
    id: 'strategy',
    name: 'Strategy & Leadership',
    questions: [
      { id: 'strat1', text: 'We have a documented AI strategy aligned to business goals.' },
      { id: 'strat2', text: 'Executive leadership actively sponsors AI initiatives.' },
      { id: 'strat3', text: 'AI priorities are backed by budget and a clear roadmap.' },
      { id: 'strat4', text: 'There is cross-functional governance for AI decisions.' },
    ],
    actions: [
      'Facilitate an executive workshop to align AI use-cases to OKRs.',
      'Publish a 12–18 month AI roadmap with owners and success metrics.',
      'Create an AI steering committee with Product, Data, Legal, and Security.',
    ],
  },
  {
    id: 'data',
    name: 'Data & Governance',
    questions: [
      { id: 'data1', text: 'Data is accurate, labeled, and accessible for AI projects.' },
      { id: 'data2', text: 'There is a clear data catalog and lineage for critical datasets.' },
      { id: 'data3', text: 'We enforce data governance, retention, and quality SLAs.' },
      { id: 'data4', text: 'We can securely share data across teams with auditability.' },
    ],
    actions: [
      'Implement a data quality dashboard and data contracts for key sources.',
      'Adopt a catalog (e.g., DataHub) and standardize metadata and lineage.',
      'Define PII handling, retention, and access controls with Legal/IT.',
    ],
  },
  {
    id: 'people',
    name: 'People & Skills',
    questions: [
      { id: 'people1', text: 'We have in-house skills for data engineering and ML/AI.' },
      { id: 'people2', text: 'Product and domain experts collaborate closely with AI teams.' },
      { id: 'people3', text: 'We run AI upskilling for business users and engineers.' },
      { id: 'people4', text: 'We have clear roles for AI (e.g., MLE, DS, Prompt Eng, PM).' },
    ],
    actions: [
      'Create guilds/chapters for DS, MLE, and Prompt Engineering.',
      'Launch targeted upskilling paths and pair programming for AI projects.',
      'Define role expectations and a career matrix for AI-related roles.',
    ],
  },
  {
    id: 'tech',
    name: 'Technology & Infrastructure',
    questions: [
      { id: 'tech1', text: 'We have scalable compute and storage (cloud/on-prem) for AI.' },
      { id: 'tech2', text: 'We use version control, CI/CD, and environment isolation.' },
      { id: 'tech3', text: 'We can securely integrate external models/APIs when needed.' },
      { id: 'tech4', text: 'Latency, cost, and reliability are monitored and optimized.' },
    ],
    actions: [
      'Harden CI/CD for ML pipelines and enable feature stores.',
      'Introduce cost monitoring and autoscaling policies for inference.',
      'Standardize secrets management and network isolation for model calls.',
    ],
  },
  {
    id: 'delivery',
    name: 'Use Cases & Delivery',
    questions: [
      { id: 'deliv1', text: 'We maintain a prioritized backlog of AI use cases with ROI.' },
      { id: 'deliv2', text: 'We run pilots with clear success criteria before scaling.' },
      { id: 'deliv3', text: 'Product/UX ensures AI features are usable and valuable.' },
      { id: 'deliv4', text: 'We have a repeatable intake-to-deployment process.' },
    ],
    actions: [
      'Adopt PR/FAQ or Lean Canvas to evaluate AI use cases.',
      'Define pilot exit criteria and handoff to production playbooks.',
      'Embed UX research in AI features to validate usefulness.',
    ],
  },
  {
    id: 'risk',
    name: 'Risk, Ethics & Compliance',
    questions: [
      { id: 'risk1', text: 'We assess AI risks (bias, safety, IP, privacy) before launch.' },
      { id: 'risk2', text: 'There are model cards/impact assessments for sensitive use.' },
      { id: 'risk3', text: 'We comply with relevant regulations and industry standards.' },
      { id: 'risk4', text: 'We have human-in-the-loop and fail-safes for critical flows.' },
    ],
    actions: [
      'Establish an AI risk review with Legal, Security, and Compliance.',
      'Adopt model cards and red-teaming before production releases.',
      'Define human oversight points and escalation paths.',
    ],
  },
  {
    id: 'mlops',
    name: 'MLOps & Monitoring',
    questions: [
      { id: 'mlops1', text: 'We track data/model versions and experiments reproducibly.' },
      { id: 'mlops2', text: 'We monitor drift, quality, and safety post-deployment.' },
      { id: 'mlops3', text: 'Rollbacks and canary releases are standard practice.' },
      { id: 'mlops4', text: 'We log prompts/outputs with privacy-aware retention.' },
    ],
    actions: [
      'Introduce experiment tracking and model registries.',
      'Add drift/safety monitors and alerting; define SLOs for AI.',
      'Automate rollbacks and staged deployments (blue/green, canary).',
    ],
  },
  {
    id: 'adoption',
    name: 'Change Management & Adoption',
    questions: [
      { id: 'adopt1', text: 'We communicate the “why” and value of AI to users.' },
      { id: 'adopt2', text: 'Training and enablement exist for end-users and support.' },
      { id: 'adopt3', text: 'We gather feedback and iterate quickly after launch.' },
      { id: 'adopt4', text: 'Champions/community of practice drive adoption.' },
    ],
    actions: [
      'Run enablement sessions and office hours for AI features.',
      'Establish a champions network and incentives for adoption.',
      'Create a feedback loop and publish a visible roadmap.',
    ],
  },
  {
    id: 'roi',
    name: 'ROI & Measurement',
    questions: [
      { id: 'roi1', text: 'We define KPIs for AI initiatives tied to business value.' },
      { id: 'roi2', text: 'We measure cost-to-serve, efficiency, or revenue impact.' },
      { id: 'roi3', text: 'We compare AI vs. non-AI baselines to attribute impact.' },
      { id: 'roi4', text: 'Results are shared with stakeholders to guide investment.' },
    ],
    actions: [
      'Set KPI trees (leading/lagging) for each AI use case.',
      'Build a baseline and A/B plan before rollout.',
      'Publish a quarterly AI impact report to leadership.',
    ],
  },
  {
    id: 'security',
    name: 'Security & Privacy',
    questions: [
      { id: 'sec1', text: 'We have policies for model/data access and key management.' },
      { id: 'sec2', text: 'PII/PHI masking and DLP controls exist in the AI stack.' },
      { id: 'sec3', text: 'Third-party vendors are security-reviewed (SOC2, ISO, etc.).' },
      { id: 'sec4', text: 'We conduct periodic security testing and incident drills.' },
    ],
    actions: [
      'Centralize secrets, rotate keys, and adopt least-privilege.',
      'Integrate DLP, masking, and audit logs for AI pipelines.',
      'Review vendor posture; add contractual security clauses.',
    ],
  },
];

const LIKERT = [1, 2, 3, 4, 5];

const LEVELS = [
  { label: 'Beginner', range: [0, 20], color: '#ff7a99' },
  { label: 'Developing', range: [21, 40], color: '#ffb86c' },
  { label: 'Advanced', range: [41, 70], color: '#7aa2ff' },
  { label: 'Leading', range: [71, 100], color: '#6cf0c2' },
];

const key = 'ai-maturity-v2';

export default function App() {
  const [orgName, setOrgName] = useState('');
  const [answers, setAnswers] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '{}');
      return saved.answers || {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ answers, orgName }));
  }, [answers, orgName]);

  const { progress, totals, percent, level, strengths, gaps } = useMemo(() => {
    const totalQuestions = CATEGORIES.reduce((s, c) => s + c.questions.length, 0);
    const answered = Object.keys(answers).length;
    const progress = Math.round((answered / totalQuestions) * 100);

    // sum per category
    const totals = CATEGORIES.map(cat => {
      const maxCat = cat.questions.length * 5;
      const sum = cat.questions.reduce((s, q) => s + (Number(answers[q.id]) || 0), 0);
      const pct = Math.round((sum / maxCat) * 100);
      return { id: cat.id, name: cat.name, sum, max: maxCat, pct };
    });

    const overallSum = totals.reduce((s, t) => s + t.sum, 0);
    const overallMax = totals.reduce((s, t) => s + t.max, 0);
    const percent = Math.round((overallSum / overallMax) * 100);

    const level = LEVELS.find(l => percent >= l.range[0] && percent <= l.range[1]) || LEVELS[0];

    const strengths = [...totals].sort((a,b)=>b.pct - a.pct).slice(0,3);
    const gaps = [...totals].sort((a,b)=>a.pct - b.pct).slice(0,3);
    return { progress, totals, percent, level, strengths, gaps };
  }, [answers]);

  const setAnswer = (qid, val) => setAnswers(prev => ({ ...prev, [qid]: val }));

  const reset = () => {
    if (window.confirm('Clear all answers?')) {
      setAnswers({});
      localStorage.removeItem(key);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleString();
    const title = 'AI Maturity Assessment Results';

    doc.setFontSize(16);
    doc.text(title, 14, 16);
    doc.setFontSize(11);
    doc.text(`Organization: ${orgName || '—'}`, 14, 24);
    doc.text(`Date: ${date}`, 14, 30);
    doc.text(`Overall Score: ${percent}% (${level.label})`, 14, 36);

    // Category table
    const tableBody = totals.map(t => [t.name, `${t.pct}%`, `${t.sum}/${t.max}`]);
    doc.autoTable({
      startY: 42,
      head: [['Category', 'Score %', 'Raw']],
      body: tableBody,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [36, 54, 112] },
    });

    // Strengths & Gaps
    let y = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(12);
    doc.text('Top Strengths', 14, y);
    doc.setFontSize(10);
    strengths.forEach((s, i) => {
      y += 6;
      doc.text(`${i+1}. ${s.name} — ${s.pct}%`, 18, y);
    });

    y += 10;
    doc.setFontSize(12);
    doc.text('Top Gaps', 14, y);
    doc.setFontSize(10);
    gaps.forEach((g, i) => {
      y += 6;
      doc.text(`${i+1}. ${g.name} — ${g.pct}%`, 18, y);
    });

    // Action recommendations
    y += 10;
    doc.setFontSize(12);
    doc.text('Recommended Actions', 14, y);
    doc.setFontSize(10);
    y += 4;
    for (const gap of gaps) {
      const cat = CATEGORIES.find(c => c.id === gap.id);
      if (!cat) continue;
      y += 6;
      doc.text(`• ${cat.name}`, 18, y);
      for (const a of cat.actions) {
        y += 6;
        const wrapped = doc.splitTextToSize(`- ${a}`, 178);
        doc.text(wrapped, 22, y);
        y += (wrapped.length - 1) * 6;
      }
      if (y > 270) { doc.addPage(); y = 16; }
    }

    doc.save('AI-Maturity-Assessment.pdf');
  };

  const completed = progress === 100;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Implementation Maturity Assessment</h1>
      <p>Answer all questions (1–5). Progress saves automatically. Export a PDF once complete.</p>

      <input
        placeholder="Organization name (optional)"
        value={orgName}
        onChange={e => setOrgName(e.target.value)}
        style={{ padding: '8px', margin: '10px 0', width: '300px' }}
      />
      <br />
      <button onClick={reset}>Reset</button>
      <button onClick={exportPDF} disabled={!completed} style={{ marginLeft: '10px' }}>
        Export PDF
      </button>

      <p><b>Progress:</b> {progress}% | <b>Overall:</b> {percent}% ({level.label})</p>

      {CATEGORIES.map(cat => (
        <div key={cat.id} style={{ border: '1px solid #ccc', margin: '15px 0', padding: '10px' }}>
          <h3>{cat.name}</h3>
          {cat.questions.map(q => (
            <div key={q.id} style={{ marginBottom: '8px' }}>
              <p>{q.text}</p>
              {LIKERT.map(val => (
                <label key={val} style={{ marginRight: '10px' }}>
                  <input
                    type="radio"
                    name={q.id}
                    checked={Number(answers[q.id]) === val}
                    onChange={() => setAnswer(q.id, val)}
                  />
                  {val}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <h3>Interpretation</h3>
        <p>0–20% Beginner | 21–40% Developing | 41–70% Advanced | 71–100% Leading</p>
        <p><b>Strengths:</b> {strengths.map(s => s.name).join(', ') || '—'}</p>
        <p><b>Gaps:</b> {gaps.map(g => g.name).join(', ') || '—'}</p>
      </div>
    </div>
  );
}
