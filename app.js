/* TrustArc Cookie Consent Audit Tool */

const AUDIT_SECTIONS = [
  {
    id: "california",
    title: "United States — California Check (CCPA + CIPA)",
    subtitle: "VPN to California. CCPA = opt-out + GPC. CIPA = pre-consent tracking risks wiretap claims.",
    categories: [
      {
        id: "visual",
        title: "Visual Check",
        findings: [
          {
            id: "do_not_sell_missing",
            label: "\"Do Not Sell or Share My Personal Information\" link missing or wrong wording",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "CCPA requires this exact wording in the footer or banner if the site sells/shares PI. \"Privacy Choices\" or \"Opt Out\" is not sufficient.",
            citation: "Cal. Civ. Code § 1798.135(a)(1); CCPA Regulations § 7026(a)."
          },
          {
            id: "button_asymmetry",
            label: "Button color/visual weight mismatch favoring Accept over Reject",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "Accept and Reject must have equal visual prominence — same size, color saturation, position. CCPA's Jan 2026 rules treat asymmetry as a dark pattern. Greyed-out Reject = violation.",
            citation: "CCPA Regulations § 7004(a)(2) and § 7004(c) — symmetry-of-choice and dark-pattern prohibition."
          }
        ]
      },
      {
        id: "organizational",
        title: "Organizational Check",
        findings: [
          {
            id: "vendors_not_named",
            label: "Privacy policy doesn't name specific tracking vendors actually running",
            severity: "REQUIRED",
            regulations: ["CIPA"],
            explanation: "Vague language (\"we use analytics partners\") undermines the consent defense under CIPA. Recent CIPA cases turn on this gap. List every vendor by name.",
            citation: "Cal. Penal Code § 631(a); see Doe v. Meta Platforms, 690 F.Supp.3d 1064 (N.D. Cal. 2023)."
          }
        ]
      },
      {
        id: "functional",
        title: "Functional Check",
        findings: [
          {
            id: "gpc_not_detected",
            label: "Site does not detect navigator.globalPrivacyControl signal",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "Use Firefox with GPC enabled (about:config → privacy.globalprivacycontrol.enabled = true) or Brave. Console: navigator.globalPrivacyControl should return true. Check that the site reads this on page load.",
            citation: "CCPA Regulations § 7025 — businesses must process opt-out preference signals (GPC) as a valid opt-out of sale/sharing."
          },
          {
            id: "gpc_ignored",
            label: "Sec-GPC: 1 header sent but trackers still fire (Sephora/Honda/Disney pattern)",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "This is what Sephora ($1.2M), Honda ($632K), and Disney ($2.75M Feb 2026) were fined for. GPC must be auto-honored as an opt-out. No additional banner click should be required.",
            citation: "CCPA Regulations § 7025; Cal. Civ. Code § 1798.135. People v. Sephora (Aug 2022); People v. Honda (Mar 2024); In re Tilting Point Media (Jun 2024)."
          },
          {
            id: "cookies_before_consent",
            label: "Non-essential cookies set before user interaction (Application → Cookies)",
            severity: "REQUIRED",
            regulations: ["CIPA"],
            explanation: "Under CIPA, any tracking before prior consent risks wiretap claims. Open Application tab → Cookies before clicking the banner — anything beyond essential session/auth is a violation.",
            citation: "Cal. Penal Code § 631(a) — interception of contents without prior consent."
          },
          {
            id: "pixels_before_consent",
            label: "Tracking pixels firing before consent (facebook.com/tr, google-analytics, doubleclick, tiktok)",
            severity: "REQUIRED",
            regulations: ["CIPA"],
            explanation: "Open DevTools Network on first load, don't click banner, watch for third-party tracker calls. Any hit = CIPA exposure.",
            citation: "Cal. Penal Code § 631(a); Javier v. Assurance IQ, LLC, 64 F.4th 1083 (9th Cir. 2022)."
          },
          {
            id: "session_replay_before_consent",
            label: "Session replay tools loading before consent (Hotjar, Clarity, FullStory, LogRocket)",
            severity: "REQUIRED",
            regulations: ["CIPA"],
            explanation: "Session replay is the single highest CIPA exposure category. These tools capture keystrokes and form input — they must be gated behind consent.",
            citation: "Cal. Penal Code § 631(a) and § 632; Saleh v. Nike (C.D. Cal. 2021); Yoon v. Lululemon (C.D. Cal. 2023)."
          },
          {
            id: "search_bar_forwarding",
            label: "Search bar query forwarded to third parties",
            severity: "REQUIRED",
            regulations: ["CIPA"],
            explanation: "Type \"test123xyz\" in site search, submit, then Ctrl+F Network tab for \"test123xyz\". If your search term shows up in a request to Meta/Google/TikTok, that's the exact pattern recent CIPA cases target.",
            citation: "Cal. Penal Code § 631(a); Doe v. GoodRx Holdings (N.D. Cal. 2023)."
          },
          {
            id: "hardcoded_pixels_head",
            label: "Hard-coded pixels in <head> bypassing tag manager",
            severity: "BEST PRACTICE",
            regulations: ["CIPA"],
            explanation: "View Source (Ctrl+U), search for fbq(, gtag(, ttq.. Pixels in raw HTML head can't be gated by GTM consent triggers. Best practice is to move all to a consent-gated tag manager.",
            citation: "Cal. Penal Code § 631(a) — pixels outside the consent management layer cannot be gated, increasing wiretap risk."
          },
          {
            id: "network_calls_after_reject",
            label: "Network calls to ad/marketing endpoints continue firing after Reject/opt-out",
            severity: "REQUIRED",
            regulations: ["CCPA", "CIPA"],
            explanation: "After clicking Reject (or invoking GPC), navigate to another page. Watch Network tab. Any third-party tracker call = leaky banner. Most common implementation bug.",
            citation: "Cal. Civ. Code § 1798.120 (right to opt out of sale/sharing); § 1798.135 (methods to submit). Cal. Penal Code § 631(a) for the pre/post-consent overlap."
          },
          {
            id: "consent_signal_not_updated",
            label: "Consent signal cookie not updated after opt-out (usprivacy ≠ 1YYN, GPP/OptanonConsent unchanged)",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "Even if cookies persist, the consent signal (usprivacy, GPP string, OneTrust's OptanonConsent) must reflect the opt-out. Otherwise downstream systems won't know to stop sharing.",
            citation: "Cal. Civ. Code § 1798.135(c)(2); IAB GPP / USP framework spec."
          }
        ]
      }
    ]
  },
  {
    id: "eu",
    title: "Europe — GDPR Check",
    subtitle: "VPN to EU (Paris/Frankfurt/Dublin). GDPR is opt-in — nothing tracks before explicit consent.",
    categories: [
      {
        id: "visual",
        title: "Visual Check",
        findings: [
          {
            id: "no_reject_first_layer",
            label: "No \"Reject All\" / \"Decline\" button on first layer of banner",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "GDPR requires a Reject option on the first layer with equal prominence to Accept. Hiding it behind \"Manage Preferences\" is a regulator-confirmed dark pattern (EDPB Cookie Banner Taskforce 2023).",
            citation: "EDPB Cookie Banner Taskforce Report (17 Jan 2023), §§ 3.1–3.2; CNIL Deliberation no. 2020-091 (Sept 2020); GDPR Art. 4(11) and Art. 7."
          },
          {
            id: "button_asymmetry",
            label: "Button color/visual weight mismatch favoring Accept over Reject",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Accept and Reject must have equal visual prominence — same size, color saturation, position. EDPB guidance treats asymmetry as a dark pattern.",
            citation: "EDPB Guidelines 03/2022 on Dark Patterns, §§ 41-43; GDPR Art. 4(11) — consent must be 'freely given.'"
          },
          {
            id: "no_granular_toggles",
            label: "No granular per-category toggles (Necessary, Analytics, Marketing, etc.)",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Bundled all-or-nothing consent is invalid under GDPR. Users must be able to consent per purpose.",
            citation: "GDPR Art. 6(1)(a) and Art. 7(2); EDPB Guidelines 05/2020 on Consent, §§ 42-46."
          },
          {
            id: "pre_checked_toggles",
            label: "Non-essential cookie toggles pre-checked by default",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Pre-ticked boxes do not constitute valid consent (CJEU Planet49 ruling). Only Strictly Necessary should be on by default.",
            citation: "CJEU Planet49 GmbH (Case C-673/17, 1 Oct 2019); GDPR Art. 4(11); Recital 32."
          },
          {
            id: "no_withdrawal_mechanism",
            label: "No way to withdraw consent after accepting (no floating icon or footer link)",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "GDPR Article 7(3): withdrawal must be as easy as giving consent. Site needs a persistent UI element to reopen the CMP.",
            citation: "GDPR Art. 7(3) — \"It shall be as easy to withdraw as to give consent.\""
          }
        ]
      },
      {
        id: "organizational",
        title: "Organizational Check",
        findings: [
          {
            id: "vendors_not_named",
            label: "Privacy policy doesn't name specific tracking vendors actually running",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "GDPR Articles 13/14 require transparency about who receives the data. Vague language like \"we use analytics partners\" fails this test.",
            citation: "GDPR Art. 13(1)(e) and Art. 14(1)(e); EDPB Guidelines 05/2020 on Consent, § 64."
          },
          {
            id: "essential_misclassified",
            label: "\"Strictly Necessary\" cookies miscategorized (analytics labeled essential)",
            severity: "BEST PRACTICE",
            regulations: ["GDPR"],
            explanation: "Analytics and tracking cookies don't qualify as essential even if anonymized in most EU member states. Customer should reclassify.",
            citation: "ePrivacy Directive 2002/58/EC Art. 5(3); WP29 Opinion 4/2012 on cookie consent exemption."
          }
        ]
      },
      {
        id: "functional",
        title: "Functional Check",
        findings: [
          {
            id: "cookies_before_consent",
            label: "Non-essential cookies set before user interaction (Application → Cookies)",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Under GDPR, only essential cookies can be set before consent. Open Application → Cookies before clicking the banner — anything else is a violation.",
            citation: "ePrivacy Directive 2002/58/EC Art. 5(3); GDPR Art. 6(1)(a)."
          },
          {
            id: "pixels_before_consent",
            label: "Tracking pixels firing before consent (facebook.com/tr, google-analytics, doubleclick, tiktok)",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Open DevTools Network on first load, don't click banner, watch for third-party tracker calls. Any hit = violation.",
            citation: "ePrivacy Directive Art. 5(3); GDPR Art. 6(1)(a)."
          },
          {
            id: "session_replay_before_consent",
            label: "Session replay tools loading before consent (Hotjar, Clarity, FullStory, LogRocket)",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Session replay captures keystrokes and form input — under GDPR it's high-risk processing and must be consent-gated.",
            citation: "ePrivacy Directive Art. 5(3); GDPR Art. 6, with Art. 9 implications if forms capture special-category data."
          },
          {
            id: "network_calls_after_reject",
            label: "Network calls to ad/marketing endpoints continue firing after Reject",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "After clicking Reject, navigate to another page. Watch Network tab. Any third-party tracker call = leaky banner. Most common implementation bug.",
            citation: "GDPR Art. 7(3); ePrivacy Directive Art. 5(3); GDPR Art. 17 (right to erasure)."
          },
          {
            id: "cookies_persist_optin",
            label: "Tracking cookies persist after Reject",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Under GDPR opt-in, tracking cookies should never have existed if the user rejected. They must be cleared immediately on Reject.",
            citation: "ePrivacy Directive Art. 5(3); GDPR Art. 17."
          }
        ]
      }
    ]
  },
  {
    id: "canada",
    title: "Canada — Quebec Law 25 + PIPEDA Check",
    subtitle: "VPN to Montreal for Quebec (opt-in + French). Toronto for rest-of-Canada PIPEDA. Quebec is the strictest.",
    categories: [
      {
        id: "visual",
        title: "Visual Check",
        findings: [
          {
            id: "banner_not_french_qc",
            label: "Banner not in French (or French not at equal prominence) for Quebec users",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Quebec's Charter of the French Language (Bill 96) layered with Law 25 requires French-first or fully bilingual banners. Test from a Montreal IP.",
            citation: "Charter of the French Language (RLRQ c C-11), Art. 51-52, as amended by Bill 96 (2022); Law 25 (Act respecting the protection of personal information in the private sector)."
          },
          {
            id: "no_reject_first_layer",
            label: "No \"Reject All\" / \"Decline\" button on first layer of banner",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Quebec Law 25 requires a Reject option on the first layer with equal prominence to Accept.",
            citation: "Quebec Law 25, Act respecting the protection of personal information in the private sector, s. 14 — consent must be free and given for specific purposes."
          },
          {
            id: "button_asymmetry",
            label: "Button color/visual weight mismatch favoring Accept over Reject",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Buttons must have equal visual prominence — same size, color saturation, position. Asymmetry is a dark pattern under Law 25.",
            citation: "Quebec Law 25 s. 14; CAI (Commission d'accès à l'information du Québec) guidance on valid consent."
          },
          {
            id: "no_granular_toggles",
            label: "No granular per-category toggles (Necessary, Analytics, Marketing, etc.)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Bundled all-or-nothing consent is invalid under Law 25. Users must be able to consent per purpose.",
            citation: "Quebec Law 25 s. 14 — consent must be granular and given for each specific purpose."
          },
          {
            id: "pre_checked_toggles",
            label: "Non-essential cookie toggles pre-checked by default",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Pre-ticked boxes do not constitute valid consent under Law 25. Only Strictly Necessary should be on by default.",
            citation: "Quebec Law 25 s. 14 — consent must be express, not implied."
          },
          {
            id: "no_withdrawal_mechanism",
            label: "No way to withdraw consent after accepting (no floating icon or footer link)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Law 25 requires withdrawal to be as easy as giving consent. Site needs a persistent UI element to reopen the CMP.",
            citation: "Quebec Law 25 s. 8 — every individual may withdraw their consent at any time."
          }
        ]
      },
      {
        id: "organizational",
        title: "Organizational Check",
        findings: [
          {
            id: "essential_misclassified",
            label: "\"Strictly Necessary\" cookies miscategorized (analytics labeled essential)",
            severity: "BEST PRACTICE",
            regulations: ["Law 25"],
            explanation: "Analytics and tracking cookies don't qualify as essential even if anonymized. Customer should reclassify.",
            citation: "Quebec Law 25 s. 14; CAI guidance on consent and exempt processing."
          },
          {
            id: "privacy_officer_missing",
            label: "Privacy Officer name + contact email not published in privacy policy",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Law 25 requires a designated privacy officer with name and contact info publicly available. Generic mailboxes (privacy@company.com) without a named individual are insufficient.",
            citation: "Quebec Law 25 s. 3.1 — every enterprise shall designate a person in charge of personal information protection; the title and contact info must be made public."
          },
          {
            id: "no_crossborder_disclosure",
            label: "Cross-border data transfer disclosure missing (data leaving Quebec)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Law 25 requires explicit disclosure when personal data leaves Quebec, including the destination country and safeguards in place. Most US-hosted sites trigger this.",
            citation: "Quebec Law 25 s. 17 — disclosure outside Quebec requires a privacy impact assessment and adequate protection in the destination jurisdiction."
          },
          {
            id: "no_geo_detection",
            label: "Same banner served to all regions (no geo-targeting)",
            severity: "BEST PRACTICE",
            regulations: ["Law 25", "PIPEDA"],
            explanation: "A compliant CMP shows different banners per region. Identical banner across all regions usually indicates the customer is over-applying (acceptable but suboptimal UX) or under-applying (violation in stricter regions).",
            citation: "Best practice. Quebec Law 25 s. 4 (transparency); GDPR Art. 5(1)(a); CCPA § 1798.135."
          }
        ]
      },
      {
        id: "functional",
        title: "Functional Check",
        findings: [
          {
            id: "cookies_before_consent",
            label: "Non-essential cookies set before user interaction (Application → Cookies)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Under Law 25 opt-in, only essential cookies can be set before consent. Open Application → Cookies before clicking the banner.",
            citation: "Quebec Law 25 s. 8.1 — entities collecting personal information through technological means must inform users and obtain consent."
          },
          {
            id: "pixels_before_consent",
            label: "Tracking pixels firing before consent (facebook.com/tr, google-analytics, doubleclick, tiktok)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Open DevTools Network on first load, don't click banner, watch for third-party tracker calls. Any hit = violation.",
            citation: "Quebec Law 25 s. 8.1 and s. 12."
          },
          {
            id: "session_replay_before_consent",
            label: "Session replay tools loading before consent (Hotjar, Clarity, FullStory, LogRocket)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Session replay captures keystrokes and form input — under Law 25 it's high-risk processing and must be consent-gated.",
            citation: "Quebec Law 25 s. 12 (profiling/identification); s. 8.1."
          },
          {
            id: "network_calls_after_reject",
            label: "Network calls to ad/marketing endpoints continue firing after Reject",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "After clicking Reject, navigate to another page. Watch Network tab. Any third-party tracker call = leaky banner.",
            citation: "Quebec Law 25 s. 8 — right to withdraw consent at any time, with the same ease as giving it."
          },
          {
            id: "cookies_persist_optin",
            label: "Tracking cookies persist after Reject",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Under Law 25 opt-in, tracking cookies should never have existed if the user rejected. They must be cleared immediately.",
            citation: "Quebec Law 25 s. 8 and s. 23 (right to deletion / de-indexing)."
          }
        ]
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
    const subtitle = sec.subtitle
      ? `<p class="section-subtitle">${escapeHtml(sec.subtitle)}</p>`
      : "";
    const catsHtml = sec.categories.map((cat) => {
      const rows = cat.findings.map((f) => {
        const fieldId = `${sec.id}_${f.id}`;
        const pillClass = f.severity === "REQUIRED" ? "required" : "best";
        const pillLabel = f.severity === "REQUIRED" ? "REQUIRED" : "BEST PRACTICE";
        const regs = f.regulations.map((r) => `<span class="reg-tag">${escapeHtml(r)}</span>`).join("");
        const citation = f.citation
          ? `<p class="citation"><strong>Reference:</strong> ${escapeHtml(f.citation)}</p>`
          : "";
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
              <div class="explanation" id="exp_${fieldId}" hidden>
                <p>${escapeHtml(f.explanation)}</p>
                ${citation}
              </div>
              <input type="text" class="note-input" name="note_${fieldId}" placeholder="Optional notes..." />
            </div>
          </div>
        `;
      }).join("");
      return `
        <div class="category-block">
          <h4 class="category-heading">${escapeHtml(cat.title)}</h4>
          ${rows}
        </div>
      `;
    }).join("");
    return `
      <div class="findings-section">
        <h3>${escapeHtml(sec.title)}</h3>
        ${subtitle}
        ${catsHtml}
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

  const checkedSections = [];
  for (const sec of AUDIT_SECTIONS) {
    const checkedCategories = [];
    for (const cat of sec.categories) {
      const sectionFindings = [];
      for (const f of cat.findings) {
        const fieldId = `${sec.id}_${f.id}`;
        if (fd.get(`finding_${fieldId}`) === "true") {
          sectionFindings.push({
            ...f,
            note: (fd.get(`note_${fieldId}`) || "").toString().trim()
          });
        }
      }
      if (sectionFindings.length) {
        checkedCategories.push({ id: cat.id, title: cat.title, findings: sectionFindings });
      }
    }
    if (checkedCategories.length) {
      checkedSections.push({ id: sec.id, title: sec.title, categories: checkedCategories });
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

  return { meta, checkedSections, formData: fd };
}

/* ---------- Netlify submit ---------- */

async function submitToNetlify(formData, meta, checkedSections) {
  const body = new URLSearchParams();
  body.append("form-name", "cookie-audit");
  body.append("website_url", meta.website_url);
  body.append("audit_date", meta.audit_date);
  body.append("auditor_name", meta.auditor_name);
  body.append("current_cmp", meta.current_cmp);
  body.append("recommendation", meta.recommendation);
  body.append("bot-field", formData.get("bot-field") || "");

  const summary = checkedSections.flatMap((s) =>
    s.categories.flatMap((c) =>
      c.findings.map((f) => `[${f.severity}] ${s.title} > ${c.title} > ${f.label}${f.note ? ` — note: ${f.note}` : ""}`)
    )
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

function buildDocx(meta, checkedSections) {
  const d = window.docx;
  const {
    Document, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, ShadingType, PageOrientation
  } = d;

  const BRAND = "000239";
  const ACCENT = "3699F1";
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
          plainCell("Cookie Banner", { width: { size: colW[2], type: WidthType.DXA }, bold: true, fill: SOFT }),
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

  if (!checkedSections.length) {
    findingChildren.push(new Paragraph({
      spacing: { before: 80, after: 80 },
      children: [new TextRun({ text: "No issues identified during this audit.", font: "Arial", size: 20, italics: true, color: GREY })]
    }));
  } else {
    for (const sec of checkedSections) {
      findingChildren.push(new Paragraph({
        spacing: { before: 160, after: 40 },
        children: [new TextRun({ text: sec.title, font: "Arial", size: 22, bold: true, color: BRAND })]
      }));

      for (const cat of sec.categories) {
        findingChildren.push(new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [new TextRun({ text: cat.title, font: "Arial", size: 18, bold: true, color: ACCENT })]
        }));

        const findColW = [220, 8400, 2380];
        const rows = [];
        for (const f of cat.findings) {
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

async function generateAndDownload(meta, checkedSections) {
  const doc = buildDocx(meta, checkedSections);
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

    const { meta, checkedSections, formData } = collectFormData();
    btn.disabled = true;
    btn.textContent = "Generating…";
    try {
      try { await submitToNetlify(formData, meta, checkedSections); }
      catch (e) { console.warn("Netlify submit failed (continuing with download):", e); }
      await generateAndDownload(meta, checkedSections);
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
