/* TrustArc Cookie Consent Audit Tool */

const AUDIT_SECTIONS = [
  {
    id: "california",
    title: "California Check (CCPA + CIPA)",
    subtitle: "VPN to California. CCPA = opt-out + GPC. CIPA = pre-consent tracking risks wiretap claims.",
    findings: [
      {
        id: "do_not_sell_missing",
        label: "\"Do Not Sell or Share My Personal Information\" link missing or wrong wording",
        severity: "REQUIRED",
        regulations: ["CCPA"],
        explanation: "CCPA requires this exact wording in the footer or banner if the site sells/shares PI. \"Privacy Choices\" or \"Opt Out\" is not sufficient."
      },
      {
        id: "button_asymmetry",
        label: "Button color/visual weight mismatch favoring Accept over Reject",
        severity: "REQUIRED",
        regulations: ["CCPA"],
        explanation: "Accept and Reject must have equal visual prominence — same size, color saturation, position. CCPA's Jan 2026 rules treat asymmetry as a dark pattern. Greyed-out Reject = violation."
      },
      {
        id: "vendors_not_named",
        label: "Privacy policy doesn't name specific tracking vendors actually running",
        severity: "REQUIRED",
        regulations: ["CIPA"],
        explanation: "Vague language (\"we use analytics partners\") undermines the consent defense under CIPA. Recent CIPA cases turn on this gap. List every vendor by name."
      },
      {
        id: "gpc_not_detected",
        label: "Site does not detect navigator.globalPrivacyControl signal",
        severity: "REQUIRED",
        regulations: ["CCPA"],
        explanation: "Use Firefox with GPC enabled (about:config → privacy.globalprivacycontrol.enabled = true) or Brave. Console: navigator.globalPrivacyControl should return true. Check that the site reads this on page load."
      },
      {
        id: "gpc_ignored",
        label: "Sec-GPC: 1 header sent but trackers still fire (Sephora/Honda/Disney pattern)",
        severity: "REQUIRED",
        regulations: ["CCPA"],
        explanation: "This is what Sephora ($1.2M), Honda ($632K), and Disney ($2.75M Feb 2026) were fined for. GPC must be auto-honored as an opt-out. No additional banner click should be required."
      },
      {
        id: "cookies_before_consent",
        label: "Non-essential cookies set before user interaction (Application → Cookies)",
        severity: "REQUIRED",
        regulations: ["CIPA"],
        explanation: "Under CIPA, any tracking before prior consent risks wiretap claims. Open Application tab → Cookies before clicking the banner — anything beyond essential session/auth is a violation."
      },
      {
        id: "pixels_before_consent",
        label: "Tracking pixels firing before consent (facebook.com/tr, google-analytics, doubleclick, tiktok)",
        severity: "REQUIRED",
        regulations: ["CIPA"],
        explanation: "Open DevTools Network on first load, don't click banner, watch for third-party tracker calls. Any hit = CIPA exposure."
      },
      {
        id: "session_replay_before_consent",
        label: "Session replay tools loading before consent (Hotjar, Clarity, FullStory, LogRocket)",
        severity: "REQUIRED",
        regulations: ["CIPA"],
        explanation: "Session replay is the single highest CIPA exposure category. These tools capture keystrokes and form input — they must be gated behind consent."
      },
      {
        id: "search_bar_forwarding",
        label: "Search bar query forwarded to third parties",
        severity: "REQUIRED",
        regulations: ["CIPA"],
        explanation: "Type \"test123xyz\" in site search, submit, then Ctrl+F Network tab for \"test123xyz\". If your search term shows up in a request to Meta/Google/TikTok, that's the exact pattern recent CIPA cases target."
      },
      {
        id: "hardcoded_pixels_head",
        label: "Hard-coded pixels in <head> bypassing tag manager",
        severity: "BEST PRACTICE",
        regulations: ["CIPA"],
        explanation: "View Source (Ctrl+U), search for fbq(, gtag(, ttq.. Pixels in raw HTML head can't be gated by GTM consent triggers. Best practice is to move all to a consent-gated tag manager."
      },
      {
        id: "network_calls_after_reject",
        label: "Network calls to ad/marketing endpoints continue firing after Reject/opt-out",
        severity: "REQUIRED",
        regulations: ["CCPA", "CIPA"],
        explanation: "After clicking Reject (or invoking GPC), navigate to another page. Watch Network tab. Any third-party tracker call = leaky banner. Most common implementation bug."
      },
      {
        id: "consent_signal_not_updated",
        label: "Consent signal cookie not updated after opt-out (usprivacy ≠ 1YYN, GPP/OptanonConsent unchanged)",
        severity: "REQUIRED",
        regulations: ["CCPA"],
        explanation: "Even if cookies persist, the consent signal (usprivacy, GPP string, OneTrust's OptanonConsent) must reflect the opt-out. Otherwise downstream systems won't know to stop sharing."
      }
    ]
  },
  {
    id: "eu",
    title: "EU Check (GDPR)",
    subtitle: "VPN to EU (Paris/Frankfurt/Dublin). GDPR is opt-in — nothing tracks before explicit consent.",
    findings: [
      {
        id: "no_reject_first_layer",
        label: "No \"Reject All\" / \"Decline\" button on first layer of banner",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "GDPR requires a Reject option on the first layer with equal prominence to Accept. Hiding it behind \"Manage Preferences\" is a regulator-confirmed dark pattern (EDPB Cookie Banner Taskforce 2023)."
      },
      {
        id: "button_asymmetry",
        label: "Button color/visual weight mismatch favoring Accept over Reject",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "Accept and Reject must have equal visual prominence — same size, color saturation, position. EDPB guidance treats asymmetry as a dark pattern."
      },
      {
        id: "no_granular_toggles",
        label: "No granular per-category toggles (Necessary, Analytics, Marketing, etc.)",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "Bundled all-or-nothing consent is invalid under GDPR. Users must be able to consent per purpose."
      },
      {
        id: "pre_checked_toggles",
        label: "Non-essential cookie toggles pre-checked by default",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "Pre-ticked boxes do not constitute valid consent (CJEU Planet49 ruling). Only Strictly Necessary should be on by default."
      },
      {
        id: "no_withdrawal_mechanism",
        label: "No way to withdraw consent after accepting (no floating icon or footer link)",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "GDPR Article 7(3): withdrawal must be as easy as giving consent. Site needs a persistent UI element to reopen the CMP."
      },
      {
        id: "vendors_not_named",
        label: "Privacy policy doesn't name specific tracking vendors actually running",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "GDPR Articles 13/14 require transparency about who receives the data. Vague language like \"we use analytics partners\" fails this test."
      },
      {
        id: "essential_misclassified",
        label: "\"Strictly Necessary\" cookies miscategorized (analytics labeled essential)",
        severity: "BEST PRACTICE",
        regulations: ["GDPR"],
        explanation: "Analytics and tracking cookies don't qualify as essential even if anonymized in most EU member states. Customer should reclassify."
      },
      {
        id: "cookies_before_consent",
        label: "Non-essential cookies set before user interaction (Application → Cookies)",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "Under GDPR, only essential cookies can be set before consent. Open Application → Cookies before clicking the banner — anything else is a violation."
      },
      {
        id: "pixels_before_consent",
        label: "Tracking pixels firing before consent (facebook.com/tr, google-analytics, doubleclick, tiktok)",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "Open DevTools Network on first load, don't click banner, watch for third-party tracker calls. Any hit = violation."
      },
      {
        id: "session_replay_before_consent",
        label: "Session replay tools loading before consent (Hotjar, Clarity, FullStory, LogRocket)",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "Session replay captures keystrokes and form input — under GDPR it's high-risk processing and must be consent-gated."
      },
      {
        id: "network_calls_after_reject",
        label: "Network calls to ad/marketing endpoints continue firing after Reject",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "After clicking Reject, navigate to another page. Watch Network tab. Any third-party tracker call = leaky banner. Most common implementation bug."
      },
      {
        id: "cookies_persist_optin",
        label: "Tracking cookies persist after Reject",
        severity: "REQUIRED",
        regulations: ["GDPR"],
        explanation: "Under GDPR opt-in, tracking cookies should never have existed if the user rejected. They must be cleared immediately on Reject."
      }
    ]
  },
  {
    id: "canada",
    title: "Canada Check (Quebec Law 25 + PIPEDA)",
    subtitle: "VPN to Montreal for Quebec (opt-in + French). Toronto for rest-of-Canada PIPEDA. Quebec is the strictest.",
    findings: [
      {
        id: "banner_not_french_qc",
        label: "Banner not in French (or French not at equal prominence) for Quebec users",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Quebec's Charter of the French Language (Bill 96) layered with Law 25 requires French-first or fully bilingual banners. Test from a Montreal IP."
      },
      {
        id: "no_reject_first_layer",
        label: "No \"Reject All\" / \"Decline\" button on first layer of banner",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Quebec Law 25 requires a Reject option on the first layer with equal prominence to Accept."
      },
      {
        id: "button_asymmetry",
        label: "Button color/visual weight mismatch favoring Accept over Reject",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Buttons must have equal visual prominence — same size, color saturation, position. Asymmetry is a dark pattern under Law 25."
      },
      {
        id: "no_granular_toggles",
        label: "No granular per-category toggles (Necessary, Analytics, Marketing, etc.)",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Bundled all-or-nothing consent is invalid under Law 25. Users must be able to consent per purpose."
      },
      {
        id: "pre_checked_toggles",
        label: "Non-essential cookie toggles pre-checked by default",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Pre-ticked boxes do not constitute valid consent under Law 25. Only Strictly Necessary should be on by default."
      },
      {
        id: "no_withdrawal_mechanism",
        label: "No way to withdraw consent after accepting (no floating icon or footer link)",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Law 25 requires withdrawal to be as easy as giving consent. Site needs a persistent UI element to reopen the CMP."
      },
      {
        id: "essential_misclassified",
        label: "\"Strictly Necessary\" cookies miscategorized (analytics labeled essential)",
        severity: "BEST PRACTICE",
        regulations: ["Law 25"],
        explanation: "Analytics and tracking cookies don't qualify as essential even if anonymized. Customer should reclassify."
      },
      {
        id: "privacy_officer_missing",
        label: "Privacy Officer name + contact email not published in privacy policy",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Law 25 requires a designated privacy officer with name and contact info publicly available. Generic mailboxes (privacy@company.com) without a named individual are insufficient."
      },
      {
        id: "no_crossborder_disclosure",
        label: "Cross-border data transfer disclosure missing (data leaving Quebec)",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Law 25 requires explicit disclosure when personal data leaves Quebec, including the destination country and safeguards in place. Most US-hosted sites trigger this."
      },
      {
        id: "no_geo_detection",
        label: "Same banner served to all regions (no geo-targeting)",
        severity: "BEST PRACTICE",
        regulations: ["Law 25", "PIPEDA"],
        explanation: "A compliant CMP shows different banners per region. Identical banner across all regions usually indicates the customer is over-applying (acceptable but suboptimal UX) or under-applying (violation in stricter regions)."
      },
      {
        id: "cookies_before_consent",
        label: "Non-essential cookies set before user interaction (Application → Cookies)",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Under Law 25 opt-in, only essential cookies can be set before consent. Open Application → Cookies before clicking the banner."
      },
      {
        id: "pixels_before_consent",
        label: "Tracking pixels firing before consent (facebook.com/tr, google-analytics, doubleclick, tiktok)",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Open DevTools Network on first load, don't click banner, watch for third-party tracker calls. Any hit = violation."
      },
      {
        id: "session_replay_before_consent",
        label: "Session replay tools loading before consent (Hotjar, Clarity, FullStory, LogRocket)",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Session replay captures keystrokes and form input — under Law 25 it's high-risk processing and must be consent-gated."
      },
      {
        id: "network_calls_after_reject",
        label: "Network calls to ad/marketing endpoints continue firing after Reject",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "After clicking Reject, navigate to another page. Watch Network tab. Any third-party tracker call = leaky banner."
      },
      {
        id: "cookies_persist_optin",
        label: "Tracking cookies persist after Reject",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Under Law 25 opt-in, tracking cookies should never have existed if the user rejected. They must be cleared immediately."
      }
    ]
  }
];

/* ---------- Render ---------- */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[c]);
}

function renderFindings() {
  const container = document.getElementById("findings-container");
  const html = AUDIT_SECTIONS.map((sec) => {
    const rows = sec.findings.map((f) => {
      const fieldId = `${sec.id}_${f.id}`;
      const pillClass = f.severity === "REQUIRED" ? "required" : "best";
      const pillLabel = f.severity === "REQUIRED" ? "REQUIRED" : "BEST PRACTICE";
      const regs = f.regulations.map((r) => `<span class="reg-tag">${escapeHtml(r)}</span>`).join("");
      return `
        <div class="finding-row">
          <input type="checkbox" id="finding_${fieldId}" name="finding_${fieldId}" value="true" />
          <div class="finding-body">
            <div class="finding-head">
              <label for="finding_${fieldId}" class="finding-label">${escapeHtml(f.label)}</label>
              <span class="pill ${pillClass}">${pillLabel}</span>
              <span class="regs">${regs}</span>
              <button type="button" class="info-toggle" aria-label="Show explanation" data-target="exp_${fieldId}">&#9432;</button>
            </div>
            <div class="explanation" id="exp_${fieldId}" hidden>${escapeHtml(f.explanation)}</div>
            <input type="text" class="note-input" name="note_${fieldId}" placeholder="Optional notes..." />
          </div>
        </div>
      `;
    }).join("");
    const subtitle = sec.subtitle
      ? `<p class="section-subtitle">${escapeHtml(sec.subtitle)}</p>`
      : "";
    return `
      <div class="findings-section">
        <h3>${escapeHtml(sec.title)}</h3>
        ${subtitle}
        ${rows}
      </div>
    `;
  }).join("");
  container.innerHTML = html;

  container.querySelectorAll(".info-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      target.hidden = !target.hidden;
    });
  });
}

/* ---------- Init ---------- */

function initDateDefault() {
  const d = new Date();
  const iso = d.toISOString().slice(0, 10);
  document.getElementById("audit_date").value = iso;
}

function initCmpOther() {
  const sel = document.getElementById("current_cmp");
  const other = document.getElementById("current_cmp_other");
  sel.addEventListener("change", () => {
    other.hidden = sel.value !== "Other";
    if (other.hidden) other.value = "";
  });
}

function initRecCount() {
  const ta = document.getElementById("recommendation");
  const out = document.getElementById("rec-count");
  if (!ta || !out) return;
  ta.addEventListener("input", () => { out.textContent = ta.value.length; });
}

/* ---------- Collect form data ---------- */

function collectFormData() {
  const form = document.getElementById("audit-form");
  const fd = new FormData(form);

  const checkedFindings = [];
  for (const sec of AUDIT_SECTIONS) {
    const sectionFindings = [];
    for (const f of sec.findings) {
      const fieldId = `${sec.id}_${f.id}`;
      if (fd.get(`finding_${fieldId}`) === "true") {
        sectionFindings.push({
          ...f,
          note: (fd.get(`note_${fieldId}`) || "").toString().trim()
        });
      }
    }
    if (sectionFindings.length) {
      checkedFindings.push({ id: sec.id, title: sec.title, findings: sectionFindings });
    }
  }

  const cmpVal = fd.get("current_cmp") || "";
  const cmpOther = (fd.get("current_cmp_other") || "").toString().trim();
  const meta = {
    website_url: (fd.get("website_url") || "").toString().trim(),
    audit_date: (fd.get("audit_date") || "").toString().trim(),
    auditor_name: (fd.get("auditor_name") || "").toString().trim(),
    current_cmp: cmpVal === "Other" && cmpOther ? `Other: ${cmpOther}` : cmpVal,
    recommendation: (fd.get("recommendation") || "").toString().trim()
  };

  return { meta, checkedFindings, formData: fd };
}

/* ---------- Netlify submit ---------- */

async function submitToNetlify(formData, meta, checkedFindings) {
  const body = new URLSearchParams();
  body.append("form-name", "cookie-audit");
  body.append("website_url", meta.website_url);
  body.append("audit_date", meta.audit_date);
  body.append("auditor_name", meta.auditor_name);
  body.append("current_cmp", meta.current_cmp);
  body.append("recommendation", meta.recommendation);
  body.append("bot-field", formData.get("bot-field") || "");

  const summary = checkedFindings.flatMap((s) =>
    s.findings.map((f) => `[${f.severity}] ${s.title} > ${f.label}${f.note ? ` — note: ${f.note}` : ""}`)
  ).join("\n");
  body.append("findings_summary", summary || "No findings checked.");

  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  if (!res.ok) throw new Error(`Netlify submit failed: ${res.status}`);
}

/* ---------- DOCX generation ---------- */

function buildDocx(meta, checkedFindings) {
  const d = window.docx;
  const {
    Document, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, ShadingType, PageOrientation
  } = d;

  const BRAND = "000239";
  const ACCENT = "3699F1";
  const CTA = "E11A77";
  const REQUIRED = "C00000";
  const BEST = "7F7F7F";
  const GREY = "595959";
  const SOFT = "EEF2F4";

  const noBorder = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
  };

  const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

  function p(text, opts = {}) {
    return new Paragraph({
      alignment: opts.alignment,
      spacing: opts.spacing || { before: 0, after: 40 },
      children: [
        new TextRun({
          text: text,
          font: "Arial",
          size: opts.size || 20,
          bold: !!opts.bold,
          italics: !!opts.italics,
          color: opts.color
        })
      ]
    });
  }

  function plainCell(text, opts = {}) {
    return new TableCell({
      width: opts.width,
      margins: cellMargins,
      shading: opts.fill ? { type: ShadingType.CLEAR, color: "auto", fill: opts.fill } : undefined,
      children: [p(text, { size: opts.size || 18, bold: opts.bold, color: opts.color })]
    });
  }

  const dash = (s) => (s && String(s).trim()) ? s : "—";

  /* ---- Title block ---- */
  const title = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 40 },
    children: [new TextRun({ text: "Cookie Consent Audit Report", font: "Arial", size: 44, bold: true, color: BRAND })]
  });
  const subtitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 120 },
    border: { bottom: { color: BRAND, space: 4, style: BorderStyle.SINGLE, size: 8 } },
    children: [new TextRun({ text: "TrustArc", font: "Arial", size: 24, italics: true, color: ACCENT })]
  });

  /* ---- Metadata table ---- */
  const metaTblWidth = 11000;
  const colW = [1500, 4000, 1500, 4000];
  const metaTable = new Table({
    width: { size: metaTblWidth, type: WidthType.DXA },
    columnWidths: colW,
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          plainCell("Website", { width: { size: colW[0], type: WidthType.DXA }, bold: true, fill: SOFT }),
          plainCell(dash(meta.website_url), { width: { size: colW[1], type: WidthType.DXA } }),
          plainCell("Date", { width: { size: colW[2], type: WidthType.DXA }, bold: true, fill: SOFT }),
          plainCell(dash(meta.audit_date), { width: { size: colW[3], type: WidthType.DXA } })
        ]
      }),
      new TableRow({
        children: [
          plainCell("Auditor", { width: { size: colW[0], type: WidthType.DXA }, bold: true, fill: SOFT }),
          plainCell(dash(meta.auditor_name), { width: { size: colW[1], type: WidthType.DXA } }),
          plainCell("Current CMP", { width: { size: colW[2], type: WidthType.DXA }, bold: true, fill: SOFT }),
          plainCell(dash(meta.current_cmp), { width: { size: colW[3], type: WidthType.DXA } })
        ]
      })
    ]
  });

  /* ---- Findings ---- */
  const findingsHeading = new Paragraph({
    spacing: { before: 200, after: 60 },
    border: { bottom: { color: BRAND, space: 2, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text: "Findings", font: "Arial", size: 28, bold: true, color: BRAND })]
  });

  const findingChildren = [];

  if (!checkedFindings.length) {
    findingChildren.push(new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [new TextRun({ text: "No issues identified during this audit.", font: "Arial", size: 20, italics: true, color: GREY })]
    }));
  } else {
    for (const sec of checkedFindings) {
      findingChildren.push(new Paragraph({
        spacing: { before: 100, after: 40 },
        children: [new TextRun({ text: sec.title, font: "Arial", size: 20, bold: true, color: ACCENT })]
      }));

      const findColW = [220, 8400, 2380];
      const rows = [];
      for (const f of sec.findings) {
        const sevColor = f.severity === "REQUIRED" ? REQUIRED : BEST;
        const regsText = f.regulations.join(" · ");

        rows.push(new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              width: { size: findColW[0], type: WidthType.DXA },
              margins: cellMargins,
              shading: { type: ShadingType.CLEAR, color: "auto", fill: sevColor },
              children: [p(" ", { size: 18 })]
            }),
            new TableCell({
              width: { size: findColW[1], type: WidthType.DXA },
              margins: cellMargins,
              children: [p(f.label, { size: 18 })]
            }),
            new TableCell({
              width: { size: findColW[2], type: WidthType.DXA },
              margins: cellMargins,
              children: [p(regsText, { size: 16, bold: true, color: BRAND })]
            })
          ]
        }));

        if (f.note) {
          rows.push(new TableRow({
            cantSplit: true,
            children: [
              new TableCell({
                width: { size: findColW[0], type: WidthType.DXA },
                margins: cellMargins,
                children: [p(" ", { size: 14 })]
              }),
              new TableCell({
                width: { size: findColW[1] + findColW[2], type: WidthType.DXA },
                columnSpan: 2,
                margins: cellMargins,
                children: [p(`Note: ${f.note}`, { size: 16, italics: true, color: GREY })]
              })
            ]
          }));
        }
      }

      findingChildren.push(new Table({
        width: { size: metaTblWidth, type: WidthType.DXA },
        columnWidths: findColW,
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
        },
        rows
      }));
    }
  }

  const legend = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { before: 80, after: 60 },
    children: [
      new TextRun({ text: "■ ", font: "Arial", size: 16, color: REQUIRED, bold: true }),
      new TextRun({ text: "REQUIRED — legal violation    ", font: "Arial", size: 16, color: GREY }),
      new TextRun({ text: "■ ", font: "Arial", size: 16, color: BEST, bold: true }),
      new TextRun({ text: "BEST PRACTICE — recommended fix", font: "Arial", size: 16, color: GREY })
    ]
  });

  /* ---- Recommendation ---- */
  const recHeading = new Paragraph({
    spacing: { before: 120, after: 60 },
    border: { bottom: { color: BRAND, space: 2, style: BorderStyle.SINGLE, size: 6 } },
    children: [new TextRun({ text: "Recommendation", font: "Arial", size: 24, bold: true, color: BRAND })]
  });
  const recBody = new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 40, after: 100 },
    children: [new TextRun({ text: meta.recommendation || "—", font: "Arial", size: 20 })]
  });

  /* ---- Disclaimer + Footer ---- */
  const disclaimer = new Paragraph({
    spacing: { before: 60, after: 40 },
    children: [new TextRun({
      text: "*This report is informational and is not intended to serve as legal advice. Please carefully consult your privacy and/or legal teams prior to making any legal decisions.",
      font: "Arial", size: 16, italics: true, bold: true, color: GREY
    })]
  });
  const footer = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 0 },
    children: [new TextRun({
      text: "© 2026 TrustArc Inc | US 888.878.7830 | EU +44 (0)203.078.6495 | www.trustarc.com",
      font: "Arial", size: 16, color: GREY
    })]
  });

  const doc = new Document({
    creator: "TrustArc Cookie Consent Audit Tool",
    title: "Cookie Consent Audit Report",
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
          margin: { top: 864, right: 864, bottom: 864, left: 864 }
        }
      },
      children: [
        title,
        subtitle,
        metaTable,
        findingsHeading,
        ...findingChildren,
        legend,
        recHeading,
        recBody,
        disclaimer,
        footer
      ]
    }]
  });

  return doc;
}

function sanitizeForFilename(s) {
  return String(s || "").replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 50);
}

async function generateAndDownload(meta, checkedFindings) {
  const doc = buildDocx(meta, checkedFindings);
  const blob = await window.docx.Packer.toBlob(doc);
  const urlPart = sanitizeForFilename(meta.website_url) || "audit";
  const datePart = meta.audit_date || new Date().toISOString().slice(0, 10);
  const fname = `Cookie_Audit_${urlPart}_${datePart}.docx`;
  window.saveAs(blob, fname);
}

/* ---------- Submit handler ---------- */

function showSuccess() {
  const box = document.getElementById("form-success");
  box.hidden = false;
  box.textContent = "Audit logged and report downloaded. Share the .docx with your customer.";
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showError(msg) {
  const box = document.getElementById("form-errors");
  box.hidden = false;
  box.textContent = msg;
}

function attachSubmit() {
  const form = document.getElementById("audit-form");
  const btn = document.getElementById("submit-btn");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("form-success").hidden = true;
    document.getElementById("form-errors").hidden = true;

    const { meta, checkedFindings, formData } = collectFormData();
    btn.disabled = true;
    btn.textContent = "Generating…";
    try {
      try { await submitToNetlify(formData, meta, checkedFindings); }
      catch (e) { console.warn("Netlify submit failed (continuing with download):", e); }
      await generateAndDownload(meta, checkedFindings);
      showSuccess();
    } catch (err) {
      console.error(err);
      showError(`Report generation failed: ${err.message}.`);
    } finally {
      btn.disabled = false;
      btn.textContent = "Generate Report & Submit Audit";
    }
  });
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderFindings();
  initDateDefault();
  initCmpOther();
  initRecCount();
  attachSubmit();
});
