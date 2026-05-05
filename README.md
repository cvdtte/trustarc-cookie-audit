# Cookie Consent Audit Tool

A static web app that lets TrustArc Sales Engineers audit a customer website for
privacy compliance and produce a 1-page Word doc report. Every audit is logged
to Netlify Forms so management has a record of every report run.

## What it does

The SE opens the hosted page, fills out audit metadata (website, date, region,
browser, GPC, current CMP), walks the 6-section checklist ticking observed
findings, writes a recommendation, and clicks **Generate Report**. On submit:

1. The form is POSTed to Netlify Forms (internal record)
2. A 1-page `.docx` report is generated client-side with `docx-js` and
   downloaded via FileSaver
3. The SE shares the `.docx` with the customer

## Local development

```
npx serve .
```

This serves the static site at `http://localhost:3000`. The form **will not**
submit to Netlify locally — you'll get a 404 on POST. Use `netlify dev` if you
want to exercise the full flow:

```
npm i -g netlify-cli
netlify dev
```

The DOCX download works locally either way (it's all client-side).

## Deployment

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In the Netlify dashboard: **Add new site → Import an existing project**.
3. Pick the repo, accept defaults (publish dir = `.`, no build command).
4. Deploy.

Netlify auto-detects the `<form name="cookie-audit" data-netlify="true">` stub
in `index.html` at deploy time and provisions the form. After the first
successful submit, the form will appear in the dashboard.

## Viewing submissions

Netlify dashboard → **Forms** → `cookie-audit` → **Submissions**.

You can also configure email or webhook notifications under **Form
notifications** so a Slack channel or shared inbox gets every audit.

## Spam prevention

A honeypot field (`bot-field`) is enabled via
`data-netlify-honeypot="bot-field"`. If you start seeing spam in the
submissions list, enable reCAPTCHA in the Netlify form settings — no code
change needed.

## Updating the audit checklist

Edit the `AUDIT_SECTIONS` array at the top of [app.js](app.js). Each finding
has:

- `id` — unique key, used as the form-field name (`finding_<id>`, `note_<id>`)
- `label` — visible text on the row
- `severity` — `"REQUIRED"` or `"BEST PRACTICE"`
- `regulations` — array of tag strings
- `explanation` — body text revealed by the ℹ️ toggle and not included in the report

After editing, redeploy. No build step is needed.

## Files

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Form markup and Netlify form stub |
| [styles.css](styles.css) | TrustArc branding and layout |
| [app.js](app.js) | Findings data, validation, Netlify POST, DOCX generation |
| [netlify.toml](netlify.toml) | Publish config + security headers |
