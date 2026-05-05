/* TrustArc Cookie Consent Audit Tool */

const AUDIT_SECTIONS = [
  {
    id: "visual",
    title: "1. Banner Visual Design & Dark Patterns",
    findings: [
      {
        id: "no_reject_first_layer",
        label: "No \"Reject All\" / \"Decline\" button on first layer of banner",
        severity: "REQUIRED",
        regulations: ["GDPR", "Law 25"],
        explanation: "GDPR and Quebec Law 25 require a Reject option on the first layer with equal prominence to Accept. Hiding it behind \"Manage Preferences\" is a regulator-confirmed dark pattern (EDPB Cookie Banner Taskforce 2023)."
      },
      {
        id: "button_asymmetry",
        label: "Button color/visual weight mismatch favoring Accept over Reject",
        severity: "REQUIRED",
        regulations: ["GDPR", "CCPA", "Law 25"],
        explanation: "Accept and Reject must have equal visual prominence — same size, color saturation, position. CCPA's Jan 2026 rules and EDPB guidance both treat asymmetry as a dark pattern. Greyed-out Reject = violation."
      },
      {
        id: "do_not_sell_missing",
        label: "\"Do Not Sell or Share My Personal Information\" link missing or wrong wording",
        severity: "REQUIRED",
        regulations: ["CCPA"],
        explanation: "CCPA requires this exact wording in the footer or banner if the site sells/shares PI. \"Privacy Choices\" or \"Opt Out\" is not sufficient."
      },
      {
        id: "banner_not_french_qc",
        label: "Banner not in French (or French not at equal prominence) for Quebec users",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Quebec's Charter of the French Language (Bill 96) layered with Law 25 requires French-first or fully bilingual banners. Test from a Montreal IP."
      },
      {
        id: "no_withdrawal_mechanism",
        label: "No way to withdraw consent after accepting (no floating icon or footer link)",
        severity: "REQUIRED",
        regulations: ["GDPR", "Law 25"],
        explanation: "GDPR Article 7(3): withdrawal must be as easy as giving consent. Site needs a persistent UI element to reopen the CMP."
      }
    ]
  },
  {
    id: "transparency",
    title: "2. Cookie Categories & Vendor Transparency",
    findings: [
      {
        id: "no_granular_toggles",
        label: "No granular per-category toggles (Necessary, Analytics, Marketing, etc.)",
        severity: "REQUIRED",
        regulations: ["GDPR", "Law 25"],
        explanation: "Bundled all-or-nothing consent is invalid under GDPR. Users must be able to consent per purpose."
      },
      {
        id: "pre_checked_toggles",
        label: "Non-essential cookie toggles pre-checked by default",
        severity: "REQUIRED",
        regulations: ["GDPR", "Law 25"],
        explanation: "Pre-ticked boxes do not constitute valid consent (CJEU Planet49 ruling). Only Strictly Necessary should be on by default."
      },
      {
        id: "vendors_not_named",
        label: "Privacy policy doesn't name specific tracking vendors actually running",
        severity: "REQUIRED",
        regulations: ["CIPA", "GDPR"],
        explanation: "Vague language (\"we use analytics partners\") undermines the consent defense under CIPA. Recent CIPA cases turn on this gap. List every vendor by name."
      },
      {
        id: "essential_misclassified",
        label: "\"Strictly Necessary\" cookies miscategorized (analytics labeled essential)",
        severity: "BEST PRACTICE",
        regulations: ["GDPR", "Law 25"],
        explanation: "Analytics and tracking cookies don't qualify as essential even if anonymized in most EU member states. Customer should reclassify."
      }
    ]
  },
  {
    id: "preconsent",
    title: "3. Pre-Consent Behavior & CIPA Wiretap Tests",
    findings: [
      {
        id: "cookies_before_consent",
        label: "Non-essential cookies set before user interaction (Application → Cookies)",
        severity: "REQUIRED",
        regulations: ["GDPR", "Law 25", "CIPA"],
        explanation: "Under GDPR/Law 25, only essential cookies can be set before consent. Under CIPA, any tracking before prior consent risks wiretap claims."
      },
      {
        id: "pixels_before_consent",
        label: "Tracking pixels firing before consent (Network: facebook.com/tr, google-analytics, doubleclick, tiktok)",
        severity: "REQUIRED",
        regulations: ["GDPR", "Law 25", "CIPA"],
        explanation: "Open DevTools Network on first load, don't click banner, watch for third-party tracker calls. Any hit = violation."
      },
      {
        id: "session_replay_before_consent",
        label: "Session replay tools loading before consent (Hotjar, Clarity, FullStory, LogRocket)",
        severity: "REQUIRED",
        regulations: ["CIPA", "GDPR", "Law 25"],
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
      }
    ]
  },
  {
    id: "postreject",
    title: "4. Post-Reject Behavior",
    findings: [
      {
        id: "network_calls_after_reject",
        label: "Network calls to ad/marketing endpoints continue firing after Reject",
        severity: "REQUIRED",
        regulations: ["GDPR", "CCPA", "Law 25", "CIPA"],
        explanation: "After clicking Reject, navigate to another page. Watch Network tab. Any third-party tracker call = leaky banner. This is the most common implementation bug."
      },
      {
        id: "cookies_persist_optin",
        label: "Tracking cookies persist after Reject in opt-in regions (EU, Quebec)",
        severity: "REQUIRED",
        regulations: ["GDPR", "Law 25"],
        explanation: "Under opt-in regimes, tracking cookies should never have existed if the user rejected. They must be cleared. (Note: under CCPA opt-out, persistence is acceptable as long as data sharing stops.)"
      },
      {
        id: "consent_signal_not_updated",
        label: "Consent signal cookie not updated after Reject (usprivacy ≠ 1YYN, GPP/OptanonConsent unchanged)",
        severity: "REQUIRED",
        regulations: ["CCPA"],
        explanation: "Even if cookies persist, the consent signal (usprivacy, GPP string, OneTrust's OptanonConsent) must reflect the opt-out. Otherwise downstream systems won't know to stop sharing."
      }
    ]
  },
  {
    id: "gpc",
    title: "5. Global Privacy Control (GPC)",
    findings: [
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
      }
    ]
  },
  {
    id: "law25",
    title: "6. Quebec Law 25 & Geo-Detection",
    findings: [
      {
        id: "privacy_officer_missing",
        label: "Privacy Officer name + contact email not published in privacy policy",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Law 25 requires a designated privacy officer with name and contact info publicly available. Generic mailboxes (privacy@company.com) without a named individual are insufficient."
      },
      {
        id: "no_geo_detection",
        label: "Same banner served to all regions (no geo-targeting)",
        severity: "BEST PRACTICE",
        regulations: ["GDPR", "CCPA", "Law 25"],
        explanation: "A compliant CMP shows different banners to EU, Quebec, California, and rest-of-world. Identical banner across all regions usually indicates the customer is over-applying (acceptable but suboptimal UX) or under-applying (violation in stricter regions)."
      },
      {
        id: "no_crossborder_disclosure",
        label: "Cross-border data transfer disclosure missing (data leaving Quebec)",
        severity: "REQUIRED",
        regulations: ["Law 25"],
        explanation: "Law 25 requires explicit disclosure when personal data leaves Quebec, including the destination country and safeguards in place. Most US-hosted sites trigger this."
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
      const pillClass = f.severity === "REQUIRED" ? "required" : "best";
      const pillLabel = f.severity === "REQUIRED" ? "REQUIRED" : "BEST PRACTICE";
      const regs = f.regulations.map((r) => `<span class="reg-tag">${escapeHtml(r)}</span>`).join("");
      return `
        <div class="finding-row">
          <input type="checkbox" id="finding_${f.id}" name="finding_${f.id}" value="true" />
          <div class="finding-body">
            <div class="finding-head">
              <label for="finding_${f.id}" class="finding-label">${escapeHtml(f.label)}</label>
              <span class="pill ${pillClass}">${pillLabel}</span>
              <span class="regs">${regs}</span>
              <button type="button" class="info-toggle" aria-label="Show explanation" data-target="exp_${f.id}">&#9432;</button>
            </div>
            <div class="explanation" id="exp_${f.id}" hidden>${escapeHtml(f.explanation)}</div>
            <input type="text" class="note-input" name="note_${f.id}" placeholder="Optional notes..." />
          </div>
        </div>
      `;
    }).join("");
    return `
      <div class="findings-section">
        <h3>${escapeHtml(sec.title)}</h3>
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
    const showOther = sel.value === "Other";
    other.hidden = !showOther;
    other.required = showOther;
    if (!showOther) other.value = "";
  });
}

function initRecCount() {
  const ta = document.getElementById("recommendation");
  const out = document.getElementById("rec-count");
  ta.addEventListener("input", () => { out.textContent = ta.value.length; });
}

/* ---------- Validation ---------- */

function clearInvalid() {
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  const errBox = document.getElementById("form-errors");
  errBox.hidden = true;
  errBox.textContent = "";
}

function validate() {
  clearInvalid();
  const errors = [];
  const required = ["website_url", "audit_date", "auditor_name", "current_cmp", "recommendation"];
  for (const name of required) {
    const el = document.querySelector(`[name="${name}"]`);
    if (!el || !el.value.trim()) {
      errors.push(`${labelFor(name)} is required.`);
      if (el) el.classList.add("invalid");
    }
  }

  const cmpSel = document.getElementById("current_cmp");
  const cmpOther = document.getElementById("current_cmp_other");
  if (cmpSel.value === "Other" && !cmpOther.value.trim()) {
    errors.push("Please specify the CMP.");
    cmpOther.classList.add("invalid");
  }

  document.querySelectorAll('fieldset[data-required="true"]').forEach((fs) => {
    const inputs = fs.querySelectorAll("input");
    const checked = [...inputs].some((i) => i.checked);
    if (!checked) {
      errors.push(`${fs.querySelector("legend").textContent.replace("*", "").trim()} must have at least one selection.`);
      fs.classList.add("invalid");
    }
  });

  const rec = document.getElementById("recommendation");
  if (rec.value.trim() && rec.value.trim().length < 50) {
    errors.push("Recommendation must be at least 50 characters.");
    rec.classList.add("invalid");
  }

  const url = document.getElementById("website_url");
  if (url.value.trim()) {
    try { new URL(url.value.trim()); }
    catch {
      errors.push("Website URL is not valid.");
      url.classList.add("invalid");
    }
  }

  if (errors.length) {
    const box = document.getElementById("form-errors");
    box.hidden = false;
    box.innerHTML = "<strong>Please fix the following:</strong><ul>" +
      errors.map((e) => `<li>${escapeHtml(e)}</li>`).join("") +
      "</ul>";
    const firstInvalid = document.querySelector(".invalid");
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  return true;
}

function labelFor(name) {
  const map = {
    website_url: "Website URL",
    audit_date: "Audit Date",
    auditor_name: "Auditor Name",
    current_cmp: "Current CMP",
    recommendation: "Recommendation"
  };
  return map[name] || name;
}

/* ---------- Collect form data ---------- */

function collectFormData() {
  const form = document.getElementById("audit-form");
  const fd = new FormData(form);

  const checkedFindings = [];
  for (const sec of AUDIT_SECTIONS) {
    const sectionFindings = [];
    for (const f of sec.findings) {
      if (fd.get(`finding_${f.id}`) === "true") {
        sectionFindings.push({
          ...f,
          note: (fd.get(`note_${f.id}`) || "").toString().trim()
        });
      }
    }
    if (sectionFindings.length) {
      checkedFindings.push({ id: sec.id, title: sec.title, findings: sectionFindings });
    }
  }

  const meta = {
    website_url: fd.get("website_url") || "",
    audit_date: fd.get("audit_date") || "",
    auditor_name: fd.get("auditor_name") || "",
    vpn_regions: fd.getAll("vpn_regions"),
    browsers: fd.getAll("browsers"),
    gpc_enabled: fd.get("gpc_enabled") || "",
    current_cmp: fd.get("current_cmp") === "Other"
      ? `Other: ${fd.get("current_cmp_other") || ""}`
      : (fd.get("current_cmp") || ""),
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
  body.append("vpn_regions", meta.vpn_regions.join(", "));
  body.append("browsers", meta.browsers.join(", "));
  body.append("gpc_enabled", meta.gpc_enabled);
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
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, HeightRule, ShadingType,
    PageOrientation
  } = d;

  const BRAND = "1F4E79";
  const ACCENT = "2E75B6";
  const REQUIRED = "C00000";
  const BEST = "7F7F7F";
  const GREY = "595959";

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

  /* ---- Title block ---- */
  const title = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 40 },
    children: [new TextRun({ text: "Cookie Consent Audit Report", font: "Arial", size: 44, bold: true, color: BRAND })]
  });
  const subtitle = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 80 },
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
          plainCell("Website", { width: { size: colW[0], type: WidthType.DXA }, bold: true, fill: "DEEBF7" }),
          plainCell(meta.website_url, { width: { size: colW[1], type: WidthType.DXA } }),
          plainCell("Date", { width: { size: colW[2], type: WidthType.DXA }, bold: true, fill: "DEEBF7" }),
          plainCell(meta.audit_date, { width: { size: colW[3], type: WidthType.DXA } })
        ]
      }),
      new TableRow({
        children: [
          plainCell("Auditor", { width: { size: colW[0], type: WidthType.DXA }, bold: true, fill: "DEEBF7" }),
          plainCell(meta.auditor_name, { width: { size: colW[1], type: WidthType.DXA } }),
          plainCell("Current CMP", { width: { size: colW[2], type: WidthType.DXA }, bold: true, fill: "DEEBF7" }),
          plainCell(meta.current_cmp, { width: { size: colW[3], type: WidthType.DXA } })
        ]
      })
    ]
  });

  const metaSummary = new Paragraph({
    spacing: { before: 60, after: 120 },
    children: [
      new TextRun({ text: "VPN: ", font: "Arial", size: 18, bold: true, color: BRAND }),
      new TextRun({ text: (meta.vpn_regions.join(", ") || "—") + "    ", font: "Arial", size: 18 }),
      new TextRun({ text: "Browser: ", font: "Arial", size: 18, bold: true, color: BRAND }),
      new TextRun({ text: (meta.browsers.join(", ") || "—") + "    ", font: "Arial", size: 18 }),
      new TextRun({ text: "GPC: ", font: "Arial", size: 18, bold: true, color: BRAND }),
      new TextRun({ text: meta.gpc_enabled || "—", font: "Arial", size: 18 })
    ]
  });

  /* ---- Findings ---- */
  const findingsHeading = new Paragraph({
    spacing: { before: 80, after: 60 },
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
    children: [new TextRun({ text: meta.recommendation, font: "Arial", size: 20 })]
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
        metaSummary,
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
  return String(s).replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 50);
}

async function generateAndDownload(meta, checkedFindings) {
  const doc = buildDocx(meta, checkedFindings);
  const blob = await window.docx.Packer.toBlob(doc);
  const fname = `Cookie_Audit_${sanitizeForFilename(meta.website_url)}_${meta.audit_date}.docx`;
  window.saveAs(blob, fname);
}

/* ---------- Submit handler ---------- */

function showSuccess() {
  const box = document.getElementById("form-success");
  box.hidden = false;
  box.textContent = "Audit logged and report downloaded. Share the .docx with your customer.";
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

function attachSubmit() {
  const form = document.getElementById("audit-form");
  const btn = document.getElementById("submit-btn");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("form-success").hidden = true;
    if (!validate()) return;

    const { meta, checkedFindings, formData } = collectFormData();
    btn.disabled = true;
    btn.textContent = "Generating…";
    try {
      await submitToNetlify(formData, meta, checkedFindings);
      await generateAndDownload(meta, checkedFindings);
      showSuccess();
    } catch (err) {
      console.error(err);
      const box = document.getElementById("form-errors");
      box.hidden = false;
      box.textContent = `Submission failed: ${err.message}. The Word doc may not have been generated. Please try again.`;
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
