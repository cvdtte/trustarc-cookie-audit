/* TrustArc Cookie Consent Health Checker */

const AUDIT_SECTIONS = [
  {
    id: "california",
    title: "United States — California Check (CCPA + CIPA)",
    subtitle: "VPN to California. Tick any box that applies — checked = non-compliant. CCPA = opt-out + GPC. CIPA = pre-consent tracking risks wiretap claims.",
    categories: [
      {
        id: "visual",
        title: "Visual Check",
        findings: [
          {
            id: "no_banner",
            descriptor: "No Banner",
            label: "No cookie consent banner displayed at all",
            severity: "REQUIRED",
            regulations: ["CCPA", "CIPA"],
            explanation: "If the site loads any non-essential cookies, pixels, or trackers but never shows a consent banner, the consent framework has failed completely. CCPA requires a notice at collection; CIPA wiretap claims trigger automatically if any tracking happens without prior consent.",
            howToCheck: "Open the site in a fresh Incognito window with California VPN active. Wait 5-10 seconds. Look for any cookie banner — top, bottom, modal overlay, or corner widget. If no banner appears, check DevTools → Application → Cookies and DevTools → Network. If trackers are firing or non-essential cookies are being set with no consent UI = automatic violation.",
            legalText: [
              {
                source: "Cal. Civ. Code § 1798.100(a) — Notice at collection",
                text: "A consumer shall have the right to request that a business that collects a consumer's personal information disclose to that consumer the categories and specific pieces of personal information the business has collected... A business that controls the collection of a consumer's personal information shall, at or before the point of collection, inform consumers of the categories of personal information to be collected and the purposes for which the categories of personal information are collected or used and whether that information is sold or shared."
              },
              {
                source: "Cal. Penal Code § 631(a) — CIPA",
                text: "Any person who... willfully and without the consent of all parties to the communication... reads, or attempts to read, or to learn the contents or meaning of any message, report, or communication while the same is in transit or passing over any wire, line, or cable... [is liable]."
              }
            ]
          },
          {
            id: "button_asymmetry",
            descriptor: "Button Symmetry",
            label: "Button color/visual weight mismatch favoring Accept over Reject",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "Accept and Reject must have equal visual prominence — same size, color saturation, position. CCPA's Jan 2026 rules treat asymmetry as a dark pattern. Greyed-out Reject = violation.",
            howToCheck: "Open the cookie banner. Compare Accept and Reject side-by-side. Right-click each → Inspect → check computed CSS for background-color, font-weight, padding, dimensions. If Reject is text-only, greyed out, smaller, or in a less-prominent position than Accept = violation. Squint test: if your eye is drawn instantly to Accept, it fails.",
            legalText: [
              {
                source: "CCPA Regulations § 7004(a)(2) — Symmetry in Choice",
                text: "Symmetry in choice. The path for a consumer to exercise a more privacy-protective option shall not be longer than the path to exercise a less privacy-protective option. Examples of methods that fail to give consumers symmetrical choices include, but are not limited to: (A) Using a more prominent button or text for the more privacy-invasive option..."
              },
              {
                source: "CCPA Regulations § 7004(c) — Dark Patterns",
                text: "A business's user interface shall be designed and implemented in a way that does not subvert or impair user autonomy, decisionmaking, or choice... Any user interface that has the effect of substantially subverting or impairing user autonomy, decisionmaking, or choice, regardless of a business's intent, is a dark pattern."
              }
            ]
          },
          {
            id: "no_reject_first_layer",
            descriptor: "Reject Button",
            label: "No \"Reject All\" / \"Decline\" button on first layer of banner",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "CCPA's Jan 2026 symmetry-of-choice rules require a clear opt-out option on the first layer with equal prominence to Accept. Hiding Reject behind \"Manage Preferences\" / \"Settings\" is a dark pattern.",
            howToCheck: "Visit the site fresh in Incognito with California VPN. Look at the first banner that appears. Count visible buttons on the first layer. Is there a \"Reject All\" / \"Decline\" / \"Refuse\" button on the same layer as \"Accept All\"? If Reject is hidden behind \"Manage Preferences\" / \"Settings\" / \"Customize\" and requires extra clicks = violation.",
            legalText: [
              {
                source: "CCPA Regulations § 7004(a)(2) — Symmetry in Choice",
                text: "Symmetry in choice. The path for a consumer to exercise a more privacy-protective option shall not be longer than the path to exercise a less privacy-protective option."
              },
              {
                source: "CCPA Regulations § 7004(c) — Dark Patterns",
                text: "A business's user interface shall be designed and implemented in a way that does not subvert or impair user autonomy, decisionmaking, or choice... Any user interface that has the effect of substantially subverting or impairing user autonomy, decisionmaking, or choice, regardless of a business's intent, is a dark pattern."
              }
            ]
          },
          {
            id: "do_not_sell_missing",
            descriptor: "DNSMPI Link",
            label: "\"Do Not Sell or Share My Personal Information\" link missing or wrong wording",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "CCPA requires this exact wording in the footer or banner if the site sells/shares PI. \"Privacy Choices\" or \"Opt Out\" is not sufficient.",
            howToCheck: "Scroll to the footer of the homepage. Use Ctrl+F to search for \"Do Not Sell.\" Confirm the link reads exactly \"Do Not Sell or Share My Personal Information.\" Variants like \"Privacy Choices,\" \"Opt Out,\" or \"Your California Privacy Rights\" are insufficient.",
            legalText: [
              {
                source: "Cal. Civ. Code § 1798.135(a)(1)",
                text: "A business that sells consumers' personal information to third parties, or shares consumers' personal information with third parties... shall... Provide a clear and conspicuous link on the business's internet homepages, titled \"Do Not Sell or Share My Personal Information,\" to an internet web page that enables a consumer, or a person authorized by the consumer, to opt out of the sale or sharing of the consumer's personal information."
              }
            ]
          }
        ]
      },
      {
        id: "organizational",
        title: "Organizational Check",
        findings: [
          {
            id: "vendors_not_named",
            descriptor: "Vendor Disclosure",
            label: "Privacy policy doesn't name specific tracking vendors actually running",
            severity: "REQUIRED",
            regulations: ["CIPA"],
            explanation: "Vague language (\"we use analytics partners\") undermines the consent defense under CIPA. Recent CIPA cases turn on this gap. List every vendor by name.",
            howToCheck: "Open the privacy policy from the footer. Use Ctrl+F to search for tracker names you saw firing in the Network tab (e.g., \"Meta\", \"TikTok\", \"DoubleClick\", \"Adobe\"). Cross-reference against actual third-party calls. If pixels are firing for vendors not named in the policy, the consent defense fails.",
            legalText: [
              {
                source: "Cal. Penal Code § 631(a) — California Invasion of Privacy Act",
                text: "Any person who... willfully and without the consent of all parties to the communication, or in any unauthorized manner, reads, or attempts to read, or to learn the contents or meaning of any message, report, or communication while the same is in transit or passing over any wire, line, or cable, or is being sent from, or received at any place within this state... is punishable by a fine not exceeding two thousand five hundred dollars ($2,500) per violation, or by imprisonment in the county jail not exceeding one year, or by imprisonment pursuant to subdivision (h) of Section 1170, or by both a fine and imprisonment."
              }
            ]
          }
        ]
      },
      {
        id: "functional",
        title: "Functional Check",
        findings: [
          {
            id: "gpc_not_detected",
            descriptor: "GPC Detection",
            label: "Site does not detect navigator.globalPrivacyControl signal",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "Use Firefox with GPC enabled (about:config → privacy.globalprivacycontrol.enabled = true) or Brave. Console: navigator.globalPrivacyControl should return true. Check that the site reads this on page load.",
            howToCheck: "Enable GPC in Firefox (about:config → privacy.globalprivacycontrol.enabled = true) or use Brave (GPC on by default). Visit the site. Open Console: navigator.globalPrivacyControl should return true. Check Network tab → any request → Request Headers → Sec-GPC: 1 should be sent. Then check that the site has any indication it received GPC (e.g., banner state changes, OptanonConsent cookie reflects opt-out).",
            legalText: [
              {
                source: "CCPA Regulations § 7025(b)",
                text: "A business that collects personal information from consumers online shall process any opt-out preference signal that meets the requirements of subsection (b) as a valid request to opt-out of sale/sharing for that browser or device, and, if known, for the consumer."
              }
            ]
          },
          {
            id: "gpc_ignored",
            descriptor: "GPC Honored",
            label: "Sec-GPC: 1 header sent but trackers still fire (Sephora/Honda/Disney pattern)",
            severity: "REQUIRED",
            regulations: ["CCPA"],
            explanation: "This is what Sephora ($1.2M), Honda ($632K), and Disney ($2.75M Feb 2026) were fined for. GPC must be auto-honored as an opt-out. No additional banner click should be required.",
            howToCheck: "With GPC enabled (Firefox or Brave), open the site. DevTools → Network → click any request → Headers → confirm Sec-GPC: 1 is in Request Headers. Then DO NOT click anything on the banner. Watch the Network tab as you browse: do tracking pixels still fire? Check Application → Cookies → does the consent signal cookie (OptanonConsent, usprivacy, GPP string) reflect opt-out automatically? If GPC is sent but ignored = the Sephora/Honda/Disney pattern.",
            legalText: [
              {
                source: "CCPA Regulations § 7025(c)",
                text: "When a business that collects personal information from consumers online receives or detects an opt-out preference signal: (1) The business shall treat the opt-out preference signal as a valid request to opt-out of sale/sharing... for any consumer profile, including pseudonymous profiles, that is associated with that browser or device..."
              },
              {
                source: "Cal. Civ. Code § 1798.135(b)(1)",
                text: "A business that complies with subdivision (a) is not required to comply with subdivision (b)... However, a business that responds to opt-out preference signals... in a frictionless manner... shall provide... a means by which the consumer can confirm that their request has been processed by the business."
              }
            ]
          },
          {
            id: "pre_consent_tracking",
            descriptor: "Pre-Consent Tracking",
            label: "Cookies, pixels, or session replay tools loading before user consents",
            severity: "REQUIRED",
            regulations: ["CIPA"],
            explanation: "Under CIPA, any tracking before prior consent risks wiretap claims. This covers three things: (1) non-essential cookies set automatically, (2) tracking pixels firing on page load, and (3) session replay tools recording keystrokes. All three must be gated behind explicit consent.",
            howToCheck: "Incognito + California VPN. Open the site. BEFORE clicking the banner, run three checks: (1) DevTools → Application → Cookies → look for non-essential cookies (_ga, _gid, _fbp, _gcl_*, _hjSession*, NID, IDE, _rdt_uuid). (2) DevTools → Network → look for third-party tracker calls (facebook.com/tr, connect.facebook.net, google-analytics.com/collect, doubleclick.net, tiktok.com analytics, linkedin.com/li/track). (3) Look for session replay endpoints (script.hotjar.com, www.clarity.ms, fullstory.com, edge.fullstory.com, logrocket.io, smartlook.com). Any of these = pre-consent tracking violation.",
            legalText: [
              {
                source: "Cal. Penal Code § 631(a) — CIPA",
                text: "Any person who... willfully and without the consent of all parties to the communication, or in any unauthorized manner, reads, or attempts to read, or to learn the contents or meaning of any message, report, or communication while the same is in transit or passing over any wire, line, or cable, or is being sent from, or received at any place within this state... [is liable]."
              },
              {
                source: "Cal. Penal Code § 632(a) — Eavesdropping on confidential communications (relevant for session replay)",
                text: "A person who, intentionally and without the consent of all parties to a confidential communication, uses an electronic amplifying or recording device to eavesdrop upon or record the confidential communication... shall be punished by a fine not exceeding two thousand five hundred dollars ($2,500) per violation..."
              },
              {
                source: "Javier v. Assurance IQ, LLC, 64 F.4th 1083 (9th Cir. 2022)",
                text: "Although written in terms of wiretapping, Section 631(a) applies to Internet communications... [W]e hold that consent to be wiretapped or eavesdropped under Section 631(a) must be obtained prior to the wiretapping or eavesdropping; consent given after the fact is not effective."
              }
            ]
          },
          {
            id: "post_reject_tracking",
            descriptor: "Post-Reject Tracking",
            label: "Tracking continues after Reject — calls fire and/or cookies persist",
            severity: "REQUIRED",
            regulations: ["CCPA", "CIPA"],
            explanation: "After clicking Reject (or invoking GPC), all non-essential tracking should stop. Test by clicking Reject, navigating to another page, and watching both the Network tab and Application → Cookies. (Note: under CCPA opt-out, cookie persistence is acceptable as long as the consent signal cookie like usprivacy or GPP reflects the opt-out.)",
            howToCheck: "Click Reject on the banner (or, if testing GPC, just enable GPC and reload). Navigate to another page on the site (e.g., /about, /contact). (1) DevTools → Network → reload → watch for third-party tracker calls (facebook.com/tr, google-analytics, doubleclick, tiktok, hotjar). (2) DevTools → Application → Cookies → check that the consent signal cookie (OptanonConsent, usprivacy = \"1YYN\", or GPP string) reflects the opt-out. Either tracker calls firing post-reject OR an unchanged consent signal = leaky banner.",
            legalText: [
              {
                source: "Cal. Civ. Code § 1798.120(a) — Right to opt out",
                text: "A consumer shall have the right, at any time, to direct a business that sells or shares personal information about the consumer to third parties not to sell or share the consumer's personal information. This right may be referred to as the right to opt-out of sale or sharing."
              },
              {
                source: "Cal. Civ. Code § 1798.135(c)(2)",
                text: "A business shall comply with a consumer's request to opt-out of sale or sharing as soon as feasibly possible, but no later than 15 business days from the date the business receives the request."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "eu",
    title: "Europe — GDPR Check",
    subtitle: "VPN to EU (Paris/Frankfurt/Dublin). Tick any box that applies — checked = non-compliant. GDPR is opt-in — nothing tracks before explicit consent.",
    categories: [
      {
        id: "visual",
        title: "Visual Check",
        findings: [
          {
            id: "no_banner",
            descriptor: "No Banner",
            label: "No cookie consent banner displayed at all",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Under GDPR, no non-essential cookie or tracker can be set without prior consent. If there is no banner asking for consent, the only legal state is for nothing non-essential to load. The presence of any tracker without a banner = automatic violation.",
            howToCheck: "Open the site in fresh Incognito with EU VPN active. Wait 5-10 seconds. Look for any cookie banner — top, bottom, modal overlay, or corner widget. If no banner appears, check DevTools → Application → Cookies (anything beyond session/auth) and DevTools → Network (any third-party tracker call). With no consent UI and any non-essential tracking happening = automatic violation.",
            legalText: [
              {
                source: "ePrivacy Directive 2002/58/EC, Art. 5(3)",
                text: "Member States shall ensure that the storing of information, or the gaining of access to information already stored, in the terminal equipment of a subscriber or user is only allowed on condition that the subscriber or user concerned has given his or her consent, having been provided with clear and comprehensive information... in accordance with Directive 95/46/EC, inter alia, about the purposes of the processing."
              },
              {
                source: "GDPR Art. 4(11)",
                text: "'consent' of the data subject means any freely given, specific, informed and unambiguous indication of the data subject's wishes by which he or she, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her."
              }
            ]
          },
          {
            id: "no_reject_first_layer",
            descriptor: "Reject Button",
            label: "No \"Reject All\" / \"Decline\" button on first layer of banner",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "GDPR requires a Reject option on the first layer with equal prominence to Accept. Hiding it behind \"Manage Preferences\" is a regulator-confirmed dark pattern (EDPB Cookie Banner Taskforce 2023).",
            howToCheck: "Visit the site from a fresh Incognito window with EU VPN active. Look at the first banner that appears. Count visible buttons on the first layer. Is there a \"Reject All\" / \"Decline\" / \"Refuse\" button on the same layer as \"Accept All\"? If Reject is hidden behind \"Manage Preferences\" / \"Settings\" / \"Customize\" and requires extra clicks = violation.",
            legalText: [
              {
                source: "GDPR Art. 4(11)",
                text: "'consent' of the data subject means any freely given, specific, informed and unambiguous indication of the data subject's wishes by which he or she, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her."
              },
              {
                source: "GDPR Art. 7(3)",
                text: "The data subject shall have the right to withdraw his or her consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal. Prior to giving consent, the data subject shall be informed thereof. It shall be as easy to withdraw as to give consent."
              },
              {
                source: "EDPB Cookie Banner Taskforce Report (17 Jan 2023), § 3.2",
                text: "The Taskforce... considers that, where the only options offered to users are between accepting all or going to a second layer of the banner to refuse, this is a misleading practice... A reject all button on the first layer of the banner should be made available in order to give effect to a freely given consent."
              }
            ]
          },
          {
            id: "button_asymmetry",
            descriptor: "Button Symmetry",
            label: "Button color/visual weight mismatch favoring Accept over Reject",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Accept and Reject must have equal visual prominence — same size, color saturation, position. EDPB guidance treats asymmetry as a dark pattern.",
            howToCheck: "Open the cookie banner. Right-click Accept → Inspect → note background-color, padding, font-weight, dimensions. Repeat for Reject. Compare: same RGB? same dimensions? same position importance? Take a screenshot. The squint test: if your eye is drawn instantly to Accept, it fails the symmetry test.",
            legalText: [
              {
                source: "GDPR Art. 4(11)",
                text: "'consent' of the data subject means any freely given, specific, informed and unambiguous indication of the data subject's wishes by which he or she, by a statement or by a clear affirmative action, signifies agreement to the processing of personal data relating to him or her."
              },
              {
                source: "EDPB Guidelines 03/2022 on Dark Patterns, §§ 41-43",
                text: "Where the controller offers users a binary choice between two equally-sized buttons of equal colour intensity to either accept or reject the processing... users may freely make their choice. However, this is not the case if the 'accept' button is highlighted compared to the 'reject' button (e.g., size, colour, or contrast)... Such designs influence users towards the option preferred by the controller and constitute a dark pattern."
              }
            ]
          },
          {
            id: "no_granular_toggles",
            descriptor: "Granular Consent",
            label: "No granular per-category toggles (Necessary, Analytics, Marketing, etc.)",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Bundled all-or-nothing consent is invalid under GDPR. Users must be able to consent per purpose.",
            howToCheck: "On the banner, click \"Manage Preferences\" / \"Settings\" / \"Customize.\" Look for separate toggles for at least: Strictly Necessary (always on, can't be turned off), Functional, Performance/Analytics, Targeting/Marketing/Advertising. If only one master toggle, or if categories aren't separable = violation.",
            legalText: [
              {
                source: "GDPR Art. 6(1)(a)",
                text: "Processing shall be lawful only if and to the extent that at least one of the following applies: (a) the data subject has given consent to the processing of his or her personal data for one or more specific purposes."
              },
              {
                source: "GDPR Art. 7(2)",
                text: "If the data subject's consent is given in the context of a written declaration which also concerns other matters, the request for consent shall be presented in a manner which is clearly distinguishable from the other matters, in an intelligible and easily accessible form, using clear and plain language."
              }
            ]
          },
          {
            id: "pre_checked_toggles",
            descriptor: "Pre-Checked Toggles",
            label: "Non-essential cookie toggles pre-checked by default",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Pre-ticked boxes do not constitute valid consent (CJEU Planet49 ruling). Only Strictly Necessary should be on by default.",
            howToCheck: "From the banner, open \"Manage Preferences\" / \"Settings.\" For each non-Strictly-Necessary toggle (Analytics, Marketing, Targeting, Functional), check whether it's set to ON before the user has clicked anything. Take a screenshot. Any non-Necessary toggle pre-set to ON = invalid consent under Planet49.",
            legalText: [
              {
                source: "GDPR Recital 32",
                text: "Consent should be given by a clear affirmative act establishing a freely given, specific, informed and unambiguous indication of the data subject's agreement to the processing of personal data relating to him or her... Silence, pre-ticked boxes or inactivity should not therefore constitute consent."
              },
              {
                source: "CJEU Planet49 GmbH (Case C-673/17, 1 Oct 2019), Operative Part",
                text: "Article 2(f) and Article 5(3) of Directive 2002/58/EC... read in conjunction with Article 4(11) and Article 6(1)(a) of Regulation 2016/679, must be interpreted as meaning that the consent referred to in those provisions is not validly constituted if, in the form of cookies, the storage of information or access to information already stored in a website user's terminal equipment is permitted by way of a pre-checked checkbox which the user must deselect to refuse his or her consent."
              }
            ]
          },
          {
            id: "no_withdrawal_mechanism",
            descriptor: "Withdrawal Mechanism",
            label: "No way to withdraw consent after accepting (no floating icon or footer link)",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "GDPR Article 7(3): withdrawal must be as easy as giving consent. Site needs a persistent UI element to reopen the CMP.",
            howToCheck: "After accepting cookies (or rejecting), look for a persistent way to reopen the CMP: a floating cookie icon in a corner overlay, or a footer link labeled \"Cookie Settings\" / \"Manage Cookies\" / \"Privacy Choices\" / \"Cookie Preferences.\" Click it — does it reopen the CMP? If you can't easily reopen the consent UI from any page, the customer fails Art. 7(3).",
            legalText: [
              {
                source: "GDPR Art. 7(3)",
                text: "The data subject shall have the right to withdraw his or her consent at any time. The withdrawal of consent shall not affect the lawfulness of processing based on consent before its withdrawal. Prior to giving consent, the data subject shall be informed thereof. It shall be as easy to withdraw as to give consent."
              }
            ]
          }
        ]
      },
      {
        id: "organizational",
        title: "Organizational Check",
        findings: [
          {
            id: "vendors_not_named",
            descriptor: "Vendor Disclosure",
            label: "Privacy policy doesn't name specific tracking vendors actually running",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "GDPR Articles 13/14 require transparency about who receives the data. Vague language like \"we use analytics partners\" fails this test.",
            howToCheck: "Open the privacy policy and any separate cookie policy. Use Ctrl+F to search for specific vendor names you observed firing in Network tab: \"Meta\" / \"Facebook\", \"Google\", \"TikTok\", \"Adobe\", \"Salesforce\", \"Mixpanel\", \"Hotjar.\" Vague phrases like \"we work with selected partners\" or \"third-party analytics\" without naming them = violation. Compare named vendors against actual third-party calls in the Network tab — should match 1:1.",
            legalText: [
              {
                source: "GDPR Art. 13(1)(e)",
                text: "Where personal data relating to a data subject are collected from the data subject, the controller shall, at the time when personal data are obtained, provide the data subject with all of the following information:... (e) the recipients or categories of recipients of the personal data, if any."
              },
              {
                source: "GDPR Art. 14(1)(e)",
                text: "Where personal data have not been obtained from the data subject, the controller shall provide the data subject with the following information:... (e) the recipients or categories of recipients of the personal data, if any."
              }
            ]
          },
          {
            id: "essential_misclassified",
            descriptor: "Cookie Categorization",
            label: "\"Strictly Necessary\" cookies miscategorized (analytics labeled essential)",
            severity: "BEST PRACTICE",
            regulations: ["GDPR"],
            explanation: "Analytics and tracking cookies don't qualify as essential even if anonymized in most EU member states. Customer should reclassify.",
            howToCheck: "Open \"Manage Preferences\" on the banner. Click into \"Strictly Necessary\" / \"Essential\" to see the cookie list. Check the actual cookies/scripts there: anything related to Google Analytics (_ga, _gid), Hotjar (_hjSession*), Adobe (s_cc, AMCV_*), Facebook (_fbp, fr), advertising IDs = miscategorized. Strictly necessary = session, auth, CSRF, load balancer, locale, security cookies only.",
            legalText: [
              {
                source: "ePrivacy Directive 2002/58/EC, Art. 5(3)",
                text: "Member States shall ensure that the storing of information, or the gaining of access to information already stored, in the terminal equipment of a subscriber or user is only allowed on condition that the subscriber or user concerned has given his or her consent... This shall not prevent any technical storage or access for the sole purpose of carrying out the transmission of a communication over an electronic communications network, or as strictly necessary in order for the provider of an information society service explicitly requested by the subscriber or user to provide the service."
              }
            ]
          }
        ]
      },
      {
        id: "functional",
        title: "Functional Check",
        findings: [
          {
            id: "pre_consent_tracking",
            descriptor: "Pre-Consent Tracking",
            label: "Cookies, pixels, or session replay tools loading before user consents",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "Under GDPR opt-in, no non-essential tracking can occur before explicit consent. This covers three things: (1) non-essential cookies set automatically, (2) tracking pixels firing on page load, and (3) session replay tools recording keystrokes. All three must be gated behind consent.",
            howToCheck: "Incognito + EU VPN. Open the site. BEFORE clicking the banner, run three checks: (1) DevTools → Application → Cookies → look for non-essential cookies (_ga, _gid, _fbp, _gcl_*, _hjSession*, NID, IDE, _rdt_uuid). (2) DevTools → Network → look for third-party tracker calls (facebook.com/tr, connect.facebook.net, google-analytics.com/collect, doubleclick.net, tiktok.com analytics, linkedin.com/li/track). (3) Look for session replay endpoints (script.hotjar.com, www.clarity.ms, fullstory.com, edge.fullstory.com, logrocket.io). Any of these = pre-consent tracking violation.",
            legalText: [
              {
                source: "ePrivacy Directive 2002/58/EC, Art. 5(3)",
                text: "Member States shall ensure that the storing of information, or the gaining of access to information already stored, in the terminal equipment of a subscriber or user is only allowed on condition that the subscriber or user concerned has given his or her consent... This shall not prevent any technical storage or access for the sole purpose of carrying out the transmission of a communication over an electronic communications network, or as strictly necessary in order for the provider of an information society service explicitly requested by the subscriber or user to provide the service."
              },
              {
                source: "GDPR Art. 6(1)(a)",
                text: "Processing shall be lawful only if and to the extent that at least one of the following applies: (a) the data subject has given consent to the processing of his or her personal data for one or more specific purposes."
              },
              {
                source: "GDPR Art. 9(1) — Special categories of personal data (relevant for session replay)",
                text: "Processing of personal data revealing racial or ethnic origin, political opinions, religious or philosophical beliefs, or trade union membership, and the processing of genetic data, biometric data for the purpose of uniquely identifying a natural person, data concerning health or data concerning a natural person's sex life or sexual orientation shall be prohibited."
              }
            ]
          },
          {
            id: "post_reject_tracking",
            descriptor: "Post-Reject Tracking",
            label: "Tracking continues after Reject — calls fire and/or cookies persist",
            severity: "REQUIRED",
            regulations: ["GDPR"],
            explanation: "After clicking Reject, all non-essential tracking must stop and any tracking cookies must be cleared. Test by clicking Reject, then navigating to another page and watching both the Network tab and Application → Cookies.",
            howToCheck: "Click Reject All. Navigate to another page on the site (e.g., /about, /contact). (1) DevTools → Network → reload that page → watch for any third-party tracker call (facebook.com/tr, google-analytics, doubleclick, tiktok, hotjar). Even one call after Reject = leaky banner. (2) DevTools → Application → Cookies → look for tracking cookies that should not exist post-reject (_ga, _gid, _fbp, _gcl_*, _hjSession*, IDE, NID). Under GDPR opt-in these should never have been set or must be cleared on Reject.",
            legalText: [
              {
                source: "GDPR Art. 7(3)",
                text: "The data subject shall have the right to withdraw his or her consent at any time... It shall be as easy to withdraw as to give consent."
              },
              {
                source: "GDPR Art. 17(1)(b) — Right to erasure",
                text: "The data subject shall have the right to obtain from the controller the erasure of personal data concerning him or her without undue delay and the controller shall have the obligation to erase personal data without undue delay where one of the following grounds applies:... (b) the data subject withdraws consent on which the processing is based according to point (a) of Article 6(1) or point (a) of Article 9(2), and where there is no other legal ground for the processing."
              },
              {
                source: "ePrivacy Directive 2002/58/EC, Art. 5(3)",
                text: "Member States shall ensure that the storing of information, or the gaining of access to information already stored, in the terminal equipment of a subscriber or user is only allowed on condition that the subscriber or user concerned has given his or her consent..."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "canada",
    title: "Canada — Quebec Law 25 + PIPEDA Check",
    subtitle: "VPN to Montreal for Quebec (opt-in + French). Toronto for rest-of-Canada PIPEDA. Tick any box that applies — checked = non-compliant.",
    categories: [
      {
        id: "visual",
        title: "Visual Check",
        findings: [
          {
            id: "no_banner",
            descriptor: "No Banner",
            label: "No cookie consent banner displayed at all",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Quebec Law 25 requires informed, manifest, free consent before any personal-information-collecting technology is used. No banner = no consent UI = automatic violation if any tracking happens.",
            howToCheck: "VPN to Montreal. Open the site in fresh Incognito. Wait 5-10 seconds. Look for any cookie banner. If no banner appears, check DevTools → Application → Cookies (anything beyond session/auth) and DevTools → Network (any third-party tracker call). With no consent UI and any non-essential tracking happening = automatic violation.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 8.1 (as added by Law 25)",
                text: "Any person carrying on an enterprise who collects personal information from the person concerned using technology that includes functions allowing the person concerned to be identified, located or profiled must first inform the person of (1) the use of such technology; and (2) the means available to activate the functions that allow a person to be identified, located or profiled."
              },
              {
                source: "Act respecting the protection of personal information in the private sector, s. 14",
                text: "Consent must be manifest, free, and enlightened, and must be given for specific purposes. It must be requested for each such purpose, in clear and simple language."
              }
            ]
          },
          {
            id: "banner_not_french_qc",
            descriptor: "French Language",
            label: "Banner not in French (or French not at equal prominence) for Quebec users",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Quebec's Charter of the French Language (Bill 96) layered with Law 25 requires French-first or fully bilingual banners. Test from a Montreal IP.",
            howToCheck: "VPN to Montreal. Open the site fresh in Incognito. Look at the banner: button labels, body text, link text. The first language displayed must be French, or the banner must be fully bilingual with French markedly predominant. Compliant button labels: \"Accepter\" / \"Refuser\" / \"Gérer mes préférences.\" If everything is English-only or English is more prominent than French = violation.",
            legalText: [
              {
                source: "Charter of the French Language (RLRQ c C-11), Art. 52",
                text: "Catalogues, brochures, folders, commercial directories and any similar publications must be drawn up in French."
              },
              {
                source: "Charter of the French Language, Art. 52.1 (as amended by Bill 96, 2022)",
                text: "Commercial advertising disseminated by signs and posters visible from a public highway, or in or on any means of public transportation, must be drawn up in French. The same applies to commercial advertising disseminated on websites and on social media accounts when the website or account is intended for the public in Québec... Where French and another language are both used, French must be markedly predominant."
              }
            ]
          },
          {
            id: "no_reject_first_layer",
            descriptor: "Reject Button",
            label: "No \"Reject All\" / \"Decline\" button on first layer of banner",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Quebec Law 25 requires a Reject option on the first layer with equal prominence to Accept.",
            howToCheck: "VPN to Montreal. Visit the site fresh in Incognito. Count visible buttons on the first banner. Is \"Refuser\" / \"Reject All\" on the same layer as \"Accepter\" / \"Accept All\"? If Reject is buried behind a Settings or Preferences dialog and requires extra clicks = violation.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 14 (as amended by Law 25)",
                text: "Consent must be manifest, free, and enlightened, and must be given for specific purposes. It must be requested for each such purpose, in clear and simple language. If the request for consent is made in writing, it must be presented separately from any other information provided to the person concerned... Consent that is not given in accordance with this Act is without effect."
              }
            ]
          },
          {
            id: "button_asymmetry",
            descriptor: "Button Symmetry",
            label: "Button color/visual weight mismatch favoring Accept over Reject",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Buttons must have equal visual prominence — same size, color saturation, position. Asymmetry is a dark pattern under Law 25.",
            howToCheck: "VPN to Montreal. Open the banner. Right-click each button → Inspect → check computed styles for background-color, dimensions, font-weight, padding. Same RGB? same dimensions? same prominence? Squint test: if your eye is drawn instantly to Accept = fails the symmetry test under s. 14 (\"free\" consent).",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 14",
                text: "Consent must be manifest, free, and enlightened, and must be given for specific purposes. It must be requested for each such purpose, in clear and simple language."
              }
            ]
          },
          {
            id: "no_granular_toggles",
            descriptor: "Granular Consent",
            label: "No granular per-category toggles (Necessary, Analytics, Marketing, etc.)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Bundled all-or-nothing consent is invalid under Law 25. Users must be able to consent per purpose.",
            howToCheck: "From the banner, open Préférences / Customize. Need separate toggles for at least: Nécessaires (always on), Performance/Analytics, Publicité/Marketing. If bundled or only one toggle = violation.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 14",
                text: "Consent must be manifest, free, and enlightened, and must be given for specific purposes. It must be requested for each such purpose, in clear and simple language."
              }
            ]
          },
          {
            id: "pre_checked_toggles",
            descriptor: "Pre-Checked Toggles",
            label: "Non-essential cookie toggles pre-checked by default",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Pre-ticked boxes do not constitute valid consent under Law 25. Only Strictly Necessary should be on by default.",
            howToCheck: "Open Préférences from the banner. Are non-Nécessaires toggles pre-set to ON? Take a screenshot. Any pre-checked toggle = violation under s. 14 (\"manifest, free, and enlightened\").",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 14",
                text: "Consent must be manifest, free, and enlightened... Consent that is not given in accordance with this Act is without effect."
              }
            ]
          },
          {
            id: "no_withdrawal_mechanism",
            descriptor: "Withdrawal Mechanism",
            label: "No way to withdraw consent after accepting (no floating icon or footer link)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Law 25 requires withdrawal to be as easy as giving consent. Site needs a persistent UI element to reopen the CMP.",
            howToCheck: "After accepting, look for a persistent way to reopen the banner: a floating cookie icon in a corner overlay, or a footer link labeled \"Préférences cookies\" / \"Cookie Settings\" / \"Gérer mes cookies.\" Click it — does it reopen the CMP? If absent or hard to find = violation.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 14",
                text: "Consent is valid only for the time necessary to achieve the purposes for which it was requested."
              }
            ]
          }
        ]
      },
      {
        id: "organizational",
        title: "Organizational Check",
        findings: [
          {
            id: "essential_misclassified",
            descriptor: "Cookie Categorization",
            label: "\"Strictly Necessary\" cookies miscategorized (analytics labeled essential)",
            severity: "BEST PRACTICE",
            regulations: ["Law 25"],
            explanation: "Analytics and tracking cookies don't qualify as essential even if anonymized. Customer should reclassify.",
            howToCheck: "Open Préférences → \"Nécessaires\" / \"Strictly Necessary.\" Inspect the cookie list. Anything related to analytics (_ga, _hj*), advertising, session replay, or marketing = miscategorized. Strictly necessary = session, auth, CSRF, locale, security only.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 14",
                text: "Consent must be manifest, free, and enlightened, and must be given for specific purposes. It must be requested for each such purpose."
              }
            ]
          },
          {
            id: "privacy_officer_missing",
            descriptor: "Privacy Officer",
            label: "Privacy Officer name + contact email not published in privacy policy",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Law 25 requires a designated privacy officer with name and contact info publicly available. Generic mailboxes (privacy@company.com) without a named individual are insufficient.",
            howToCheck: "Open the privacy policy / \"Politique de confidentialité.\" Use Ctrl+F to search for \"Privacy Officer\" / \"Responsable de la protection des renseignements personnels\" / \"Personne responsable.\" Verify a named individual (e.g., \"Jane Doe, Privacy Officer\") with contact info. A generic mailbox like privacy@company.com without a named person = violation under s. 3.1.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 3.1 (as amended by Law 25)",
                text: "Within an enterprise, the person exercising the highest authority shall see to ensuring that this Act is implemented and complied with. The person shall exercise the function of person in charge of the protection of personal information; the person may delegate all or part of that function in writing to a member of the personnel. The title and contact information of the person in charge of the protection of personal information must be published on the enterprise's website or, if the enterprise does not have a website, made available by any other appropriate means."
              }
            ]
          },
          {
            id: "no_crossborder_disclosure",
            descriptor: "Cross-Border Transfer",
            label: "Cross-border data transfer disclosure missing (data leaving Quebec)",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Law 25 requires explicit disclosure when personal data leaves Quebec, including the destination country and safeguards in place. Most US-hosted sites trigger this.",
            howToCheck: "Open the privacy policy. Use Ctrl+F to search for: \"United States\" / \"États-Unis\" / \"transfer\" / \"transfert\" / \"cross-border\" / \"hébergement\" / \"hosting.\" Should explicitly state the destination country and what safeguards apply. Vague language or omission = violation under s. 17.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 17 (as amended by Law 25)",
                text: "Before communicating personal information outside Québec, a person carrying on an enterprise must conduct an assessment of the privacy-related factors of the communication. The assessment must take into account, in particular, (1) the sensitivity of the information; (2) the purposes for which it is to be used; (3) the protection measures, including those that are contractual, that would apply to it; and (4) the legal framework applicable in the State in which the information would be communicated, including the personal information protection principles applicable in that State. The information may be communicated if the assessment establishes that it would receive adequate protection..."
              }
            ]
          },
          {
            id: "no_geo_detection",
            descriptor: "Geo-Targeting",
            label: "Same banner served to all regions (no geo-targeting)",
            severity: "BEST PRACTICE",
            regulations: ["Law 25", "PIPEDA"],
            explanation: "A compliant CMP shows different banners per region. Identical banner across all regions usually indicates the customer is over-applying (acceptable but suboptimal UX) or under-applying (violation in stricter regions).",
            howToCheck: "VPN to multiple regions in sequence: California, EU (Paris/Frankfurt), Quebec (Montreal), and rest-of-Canada (Toronto). Visit the site fresh in Incognito from each. Take a screenshot of the banner in each region. Identical banners across all 4 regions = no geo-targeting.",
            legalText: [
              {
                source: "Best practice — derived from multiple regimes",
                text: "Quebec Law 25, GDPR, CCPA, and PIPEDA each define different consent baselines (opt-in vs. opt-out, different language requirements, different disclosure obligations). A single global banner cannot simultaneously satisfy the strictest requirements of each regime without geo-detection."
              }
            ]
          }
        ]
      },
      {
        id: "functional",
        title: "Functional Check",
        findings: [
          {
            id: "pre_consent_tracking",
            descriptor: "Pre-Consent Tracking",
            label: "Cookies, pixels, or session replay tools loading before user consents",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "Under Law 25 opt-in, no non-essential tracking can occur before explicit consent. This covers three things: (1) non-essential cookies set automatically, (2) tracking pixels firing on page load, and (3) session replay tools recording keystrokes. All three must be gated behind consent.",
            howToCheck: "VPN to Montreal. Incognito → load the site → BEFORE clicking the banner, run three checks: (1) DevTools → Application → Cookies → look for non-essential cookies (_ga, _gid, _fbp, _gcl_*, _hjSession*). (2) DevTools → Network → look for third-party tracker calls (facebook.com/tr, google-analytics.com/collect, doubleclick.net, tiktok.com analytics). (3) Look for session replay endpoints (script.hotjar.com, www.clarity.ms, fullstory.com, logrocket.io). Any of these = pre-consent tracking violation.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 8.1 (as added by Law 25)",
                text: "Any person carrying on an enterprise who collects personal information from the person concerned using technology that includes functions allowing the person concerned to be identified, located or profiled must first inform the person of (1) the use of such technology; and (2) the means available to activate the functions that allow a person to be identified, located or profiled."
              },
              {
                source: "Act respecting the protection of personal information in the private sector, s. 12",
                text: "Personal information may not be used within the enterprise for purposes other than those for which it was collected, unless the person concerned consents to such use or unless such use is authorized by this Act."
              }
            ]
          },
          {
            id: "post_reject_tracking",
            descriptor: "Post-Reject Tracking",
            label: "Tracking continues after Reject — calls fire and/or cookies persist",
            severity: "REQUIRED",
            regulations: ["Law 25"],
            explanation: "After clicking Reject, all non-essential tracking must stop and any tracking cookies must be cleared.",
            howToCheck: "VPN to Montreal. Click Refuser / Reject. Navigate to another page on the site. (1) DevTools → Network → reload → watch for any third-party tracker call. Even one call after Reject = leaky banner. (2) DevTools → Application → Cookies → look for tracking cookies that should not exist (_ga, _fbp, _gcl_*, _hjSession*). Should be cleared.",
            legalText: [
              {
                source: "Act respecting the protection of personal information in the private sector, s. 14",
                text: "Consent is valid only for the time necessary to achieve the purposes for which it was requested. Consent that is not given in accordance with this Act is without effect."
              },
              {
                source: "Act respecting the protection of personal information in the private sector, s. 28.1 (right to deletion / de-indexing)",
                text: "Any person carrying on an enterprise that holds personal information about a person concerned must, on the latter's request, cease disseminating that information or de-index any hyperlink attached to his name that provides access to the information by a technological means..."
              }
            ]
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
        const descriptorHtml = f.descriptor
          ? `<strong class="finding-descriptor">${escapeHtml(f.descriptor)}.</strong> `
          : "";
        const legalBlocks = (f.legalText || []).map((lt) => `
          <blockquote class="legal-text">
            <div class="legal-text-source">${escapeHtml(lt.source)}</div>
            <p>${escapeHtml(lt.text)}</p>
          </blockquote>
        `).join("");
        const howToCheckHtml = f.howToCheck
          ? `<div class="how-to-check" id="how_${fieldId}" hidden>
              <div class="how-to-check-label">How to check</div>
              <p>${escapeHtml(f.howToCheck)}</p>
            </div>`
          : "";
        const passNote = PASS_NOTES[f.id] || "";
        return `
          <div class="finding-row">
            <div class="status-checks">
              <input type="checkbox" id="pass_${fieldId}" name="pass_${fieldId}" value="true" class="status-pass-input" data-pass-note="${escapeHtml(passNote)}" aria-label="Mark compliant: ${escapeHtml(f.descriptor || f.label)}" />
              <label for="pass_${fieldId}" class="status-pill pass-button">Pass</label>
              <input type="checkbox" id="finding_${fieldId}" name="finding_${fieldId}" value="true" class="status-fail-input" aria-label="Mark non-compliant: ${escapeHtml(f.descriptor || f.label)}" />
              <label for="finding_${fieldId}" class="status-pill fail-button">Fail</label>
            </div>
            <div class="finding-body">
              <div class="finding-head">
                <label for="finding_${fieldId}" class="finding-label">${descriptorHtml}${escapeHtml(f.label)}</label>
                <span class="pill ${pillClass}">${pillLabel}</span>
                <span class="regs">${regs}</span>
                <button type="button" class="info-toggle how-toggle" aria-label="How to check this" data-target="how_${fieldId}" title="How to check">&#128269;</button>
                <button type="button" class="info-toggle" aria-label="Show explanation and legal text" data-target="exp_${fieldId}" title="Explanation & law">&#9432;</button>
              </div>
              ${howToCheckHtml}
              <div class="explanation" id="exp_${fieldId}" hidden>
                <p class="explanation-summary">${escapeHtml(f.explanation)}</p>
                ${legalBlocks}
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
      if (target) target.hidden = !target.hidden;
    });
  });

  // Mutual exclusion + auto-note for the Pass / Fail pill buttons.
  // Both pills are visually-hidden checkboxes (.status-pass-input,
  // .status-fail-input) driven by adjacent <label class=*-button> siblings.
  container.querySelectorAll(".status-fail-input").forEach((xBox) => {
    const fieldId = xBox.id.replace(/^finding_/, "");
    const passBox = container.querySelector(`#pass_${fieldId}`);
    const noteInput = container.querySelector(`[name="note_${fieldId}"]`);

    xBox.addEventListener("change", () => {
      if (xBox.checked && passBox) passBox.checked = false;
    });

    if (passBox) {
      passBox.addEventListener("change", () => {
        if (passBox.checked) {
          xBox.checked = false;
          const passNote = passBox.dataset.passNote || "";
          // Only auto-fill if the field is empty or carries a previous auto-fill.
          if (passNote && (!noteInput.value.trim() || noteInput.dataset.autoFilled === "true")) {
            noteInput.value = passNote;
            noteInput.dataset.autoFilled = "true";
          }
        } else if (noteInput.dataset.autoFilled === "true") {
          // Clearing Pass clears the auto-filled note (manual edits are kept).
          noteInput.value = "";
          delete noteInput.dataset.autoFilled;
        }
      });
    }

    if (noteInput) {
      // If the SE edits the note manually, stop tracking it as auto-filled.
      noteInput.addEventListener("input", () => {
        if (noteInput.dataset.autoFilled === "true" && noteInput.value !== (passBox && passBox.dataset.passNote)) {
          delete noteInput.dataset.autoFilled;
        }
      });
    }
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

  // Mirror AUDIT_SECTIONS in full and decorate each finding with its
  // auditor-assigned status ("x" / "pass" / "none") and note. The
  // report iterates this whole structure so unevaluated rows still
  // appear with empty Found cells.
  const allSections = AUDIT_SECTIONS.map((sec) => ({
    id: sec.id,
    title: sec.title,
    categories: sec.categories.map((cat) => ({
      id: cat.id,
      title: cat.title,
      findings: cat.findings.map((f) => {
        const fieldId = `${sec.id}_${f.id}`;
        const isX = fd.get(`finding_${fieldId}`) === "true";
        const isPass = fd.get(`pass_${fieldId}`) === "true";
        return {
          ...f,
          status: isX ? "x" : (isPass ? "pass" : "none"),
          note: (fd.get(`note_${fieldId}`) || "").toString().trim()
        };
      })
    }))
  }));

  const cmpVal = fd.get("current_cmp") || "";
  const cmpOther = (fd.get("current_cmp_other") || "").toString().trim();
  const meta = {
    website_url: (fd.get("website_url") || "").toString().trim(),
    audit_date: (fd.get("audit_date") || "").toString().trim(),
    auditor_name: (fd.get("auditor_name") || "").toString().trim(),
    current_cmp: cmpVal === "Other" && cmpOther ? `Other: ${cmpOther}` : cmpVal,
    recommendation: (fd.get("recommendation") || "").toString().trim()
  };

  return { meta, allSections, formData: fd };
}

/* ---------- Netlify submit ---------- */

async function submitToNetlify(formData, meta, allSections) {
  const body = new URLSearchParams();
  body.append("form-name", "cookie-audit");
  body.append("website_url", meta.website_url);
  body.append("audit_date", meta.audit_date);
  body.append("auditor_name", meta.auditor_name);
  body.append("current_cmp", meta.current_cmp);
  body.append("recommendation", meta.recommendation);
  body.append("bot-field", formData.get("bot-field") || "");

  // Only summarise findings the auditor actually marked (x or pass).
  const summary = allSections.flatMap((s) =>
    s.categories.flatMap((c) =>
      c.findings
        .filter((f) => f.status === "x" || f.status === "pass")
        .map((f) => {
          const tag = f.status === "x" ? "FAIL" : "PASS";
          const desc = f.descriptor ? `${f.descriptor}: ` : "";
          return `[${tag}] ${s.title} > ${c.title} > ${desc}${f.label}${f.note ? ` — note: ${f.note}` : ""}`;
        })
    )
  ).join("\n");
  body.append("findings_summary", summary || "No findings marked.");

  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  if (!res.ok) throw new Error(`Netlify submit failed: ${res.status}`);
}

/* ---------- DOCX generation ---------- */

const REG_COLORS = {
  "GDPR":   "2E6DA4",
  "CCPA":   "7B2D8B",
  "CIPA":   "C0392B",
  "Law 25": "D35400",
  "PIPEDA": "117864"
};

/* Auto-fill note text used when the SE marks a finding as Pass.
   Keyed by finding id (same id can appear under multiple regions —
   the pass-evidence wording is the same regardless of region). */
const PASS_NOTES = {
  no_banner:                     "Banner visible",
  button_asymmetry:              "Buttons have equal visual weight (same size, color, position)",
  no_reject_first_layer:         "Reject All button present on first layer",
  do_not_sell_missing:           "\"Do Not Sell or Share My Personal Information\" link found in footer",
  vendors_not_named:             "All firing vendors named in privacy policy",
  gpc_not_detected:              "Site detects navigator.globalPrivacyControl",
  gpc_ignored:                   "GPC honored as opt-out (consent signal updates automatically)",
  pre_consent_tracking:          "No non-essential cookies, pixels, or session replay before consent",
  post_reject_tracking:          "All tracking stops after Reject; consent signal reflects opt-out",
  no_granular_toggles:           "Granular per-category toggles present",
  pre_checked_toggles:           "All non-essential toggles off by default",
  no_withdrawal_mechanism:       "Persistent way to withdraw consent (footer link or floating icon)",
  essential_misclassified:       "Strictly Necessary contains only session/auth/CSRF/locale cookies",
  banner_not_french_qc:          "Banner in French (or French markedly predominant)",
  privacy_officer_missing:       "Privacy Officer named with contact info in privacy policy",
  no_crossborder_disclosure:     "Cross-border data transfer disclosed (destination + safeguards)",
  no_geo_detection:              "Different banners served per region (geo-targeting in place)"
};

function buildDocx(meta, allSections) {
  const d = window.docx;
  if (!d) throw new Error("docx library failed to load. Check your internet connection.");

  const {
    Document, Paragraph, TextRun, Table, TableRow, TableCell,
    WidthType, AlignmentType, BorderStyle, ShadingType, PageOrientation, HeightRule
  } = d;

  /* TrustArc template palette (sampled from Cookie_Consent_Report_Copy.docx) */
  const NAVY      = "000579"; // header / titles
  const BAND_BG   = "E8EFF5"; // category band light blue
  const ALT_BG    = "FAFBFC"; // alternating row off-white
  const HDR_TEXT  = "FFFFFF";
  const BODY_TEXT = "1A1A1A";
  const GREY      = "595959";
  const FONT      = "Source Sans Pro";

  const dash = (s) => (s && String(s).trim()) ? s : "—";

  const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

  const noBorder = {
    top:              { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom:           { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left:             { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right:            { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    insideVertical:   { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
  };

  function run(text, opts = {}) {
    return new TextRun({
      text: text,
      font: opts.font || FONT,
      size: opts.size || 22,
      bold: !!opts.bold,
      italics: !!opts.italics,
      color: opts.color || BODY_TEXT
    });
  }

  /* ===========================================================
     SINGLE-SECTION BODY
     Thin navy strip across the top (single-row table standing in
     for the template's gradient header image), then the title,
     metadata, region tables (all regions, all findings, with each
     finding showing X / ✓ / blank in the Found column based on
     auditor status), recommendation, disclaimer.
     =========================================================== */
  const bodyChildren = [];
  const tightCell = { top: 30, bottom: 30, left: 80, right: 80 };

  // Top navy strip with TrustArc wordmark — slimmed to 240 DXA tall
  bodyChildren.push(new Table({
    width: { size: 10800, type: WidthType.DXA },
    columnWidths: [10800],
    borders: noBorder,
    rows: [new TableRow({
      cantSplit: true,
      height: { value: 240, rule: HeightRule.EXACT },
      children: [new TableCell({
        width: { size: 10800, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: NAVY },
        margins: { top: 30, bottom: 30, left: 160, right: 160 },
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [run("TrustArc", { size: 16, bold: true, color: HDR_TEXT })]
        })]
      })]
    })]
  }));

  // Body title — "Cookie Consent Report*"
  bodyChildren.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 120 },
    children: [run("Cookie Consent Report*", { size: 32, bold: true, color: NAVY })]
  }));

  // Metadata block — left aligned key/value pairs
  function metaLine(label, value) {
    return new Paragraph({
      spacing: { before: 20, after: 20 },
      children: [
        run(label, { size: 16, bold: true, color: NAVY }),
        run(dash(value), { size: 16 })
      ]
    });
  }
  bodyChildren.push(metaLine("Website: ",                    meta.website_url));
  bodyChildren.push(metaLine("Date: ",                       meta.audit_date));
  bodyChildren.push(metaLine("Auditor: ",                    meta.auditor_name));
  bodyChildren.push(metaLine("Current Cookie Consent Tech: ", meta.current_cmp));

  /* ---- Findings tables (one per region) ----
     California and EU always render (audited or not). Canada only
     renders if at least one Canada finding is marked X or Pass —
     keeps the report compact for US/EU audits that skip Canada. */
  const colW = [560, 5100, 900, 900, 3340]; // Found | Behavior | Reg1 | Reg2 | Comments — totals 10800
  const tblW = colW.reduce((a, b) => a + b, 0);

  function regCell(regName, width) {
    if (!regName) return null;
    const fill = REG_COLORS[regName] || GREY;
    return new TableCell({
      width: { size: width, type: WidthType.DXA },
      margins: { top: 30, bottom: 30, left: 40, right: 40 },
      shading: { type: ShadingType.CLEAR, color: "auto", fill: fill },
      verticalAlign: "center",
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [run(regName, { size: 12, bold: true, color: HDR_TEXT })]
      })]
    });
  }

  function emptyRegCell(width, rowFill) {
    return new TableCell({
      width: { size: width, type: WidthType.DXA },
      margins: tightCell,
      shading: { type: ShadingType.CLEAR, color: "auto", fill: rowFill },
      children: [new Paragraph({ children: [run(" ", { size: 12 })] })]
    });
  }

  function buildFindingRow(f, isAlt) {
    const reg1 = f.regulations[0] || null;
    const reg2 = f.regulations[1] || null;
    const rowFill = isAlt ? ALT_BG : "FFFFFF";

    let foundGlyph = " ", foundColor = BODY_TEXT;
    if (f.status === "x") { foundGlyph = "X"; foundColor = "C0392B"; }
    const foundCell = new TableCell({
      width: { size: colW[0], type: WidthType.DXA },
      margins: tightCell,
      shading: { type: ShadingType.CLEAR, color: "auto", fill: rowFill },
      verticalAlign: "center",
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [run(foundGlyph, { size: 20, bold: true, color: foundColor })]
      })]
    });

    const labelRuns = [];
    if (f.descriptor) {
      labelRuns.push(run(f.descriptor + ". ", { size: 14, bold: true, color: NAVY }));
    }
    labelRuns.push(run(f.label, { size: 14 }));

    const behaviorCell = new TableCell({
      width: { size: colW[1], type: WidthType.DXA },
      margins: tightCell,
      shading: { type: ShadingType.CLEAR, color: "auto", fill: rowFill },
      children: [new Paragraph({ spacing: { before: 0, after: 0 }, children: labelRuns })]
    });

    const r1 = reg1 ? regCell(reg1, colW[2]) : emptyRegCell(colW[2], rowFill);
    const r2 = reg2 ? regCell(reg2, colW[3]) : emptyRegCell(colW[3], rowFill);

    const commentsCell = new TableCell({
      width: { size: colW[4], type: WidthType.DXA },
      margins: tightCell,
      shading: { type: ShadingType.CLEAR, color: "auto", fill: rowFill },
      children: [new Paragraph({
        children: [run(f.note || "", { size: 12, italics: !!f.note, color: GREY })]
      })]
    });

    return new TableRow({ cantSplit: true, children: [foundCell, behaviorCell, r1, r2, commentsCell] });
  }

  function buildBandRow(title) {
    return new TableRow({
      cantSplit: true,
      children: [new TableCell({
        width: { size: tblW, type: WidthType.DXA },
        columnSpan: 5,
        shading: { type: ShadingType.CLEAR, color: "auto", fill: BAND_BG },
        margins: { top: 40, bottom: 40, left: 100, right: 100 },
        children: [new Paragraph({
          children: [run(title, { size: 14, bold: true, color: NAVY })]
        })]
      })]
    });
  }

  function buildHeaderRow() {
    function hCell(text, width, span) {
      return new TableCell({
        width: { size: width, type: WidthType.DXA },
        columnSpan: span || 1,
        shading: { type: ShadingType.CLEAR, color: "auto", fill: NAVY },
        margins: { top: 40, bottom: 40, left: 80, right: 80 },
        verticalAlign: "center",
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [run(text, { size: 14, bold: true, color: HDR_TEXT })]
        })]
      });
    }
    return new TableRow({
      tableHeader: true,
      children: [
        hCell("Found",             colW[0]),
        hCell("Observed Behavior", colW[1]),
        hCell("Regulation",        colW[2] + colW[3], 2),
        hCell("Comments",          colW[4])
      ]
    });
  }

  // Filter: California and EU always show. Canada only if at least
  // one Canada finding is Fail or Pass.
  const sectionsToShow = allSections.filter((sec) => {
    if (sec.id !== "canada") return true;
    return sec.categories.some((cat) =>
      cat.findings.some((f) => f.status === "x" || f.status === "pass")
    );
  });

  for (const sec of sectionsToShow) {
    bodyChildren.push(new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [run(sec.title, { size: 18, bold: true, color: NAVY })]
    }));

    const rows = [buildHeaderRow()];
    for (const cat of sec.categories) {
      rows.push(buildBandRow(cat.title));
      let alt = false;
      for (const f of cat.findings) {
        rows.push(buildFindingRow(f, alt));
        alt = !alt;
      }
    }

    bodyChildren.push(new Table({
      width: { size: tblW, type: WidthType.DXA },
      columnWidths: colW,
      borders: {
        top:              { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        bottom:           { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        left:             { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        right:            { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" },
        insideVertical:   { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" }
      },
      rows
    }));
  }

  /* ---- Recommendation ---- */
  bodyChildren.push(new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [run("Recommendation:", { size: 18, bold: true, color: NAVY })]
  }));
  bodyChildren.push(new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 20, after: 100 },
    children: [run(meta.recommendation || "—", { size: 14 })]
  }));

  /* ---- Disclaimer ---- */
  bodyChildren.push(new Paragraph({
    spacing: { before: 100, after: 0 },
    children: [run(
      "*This report is informational and is not intended to serve as legal advice. Please carefully consult your privacy and/or legal teams prior to making any legal decisions.",
      { size: 12, italics: true, color: GREY }
    )]
  }));

  /* ===========================================================
     ASSEMBLE TWO-SECTION DOCUMENT
     =========================================================== */
  const doc = new Document({
    creator: "TrustArc Cookie Consent Health Checker",
    title: "Cookie Consent Report",
    background: { color: "FFFFFF" },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840, orientation: PageOrientation.PORTRAIT },
            margin: { top: 540, right: 720, bottom: 540, left: 720, header: 0, footer: 0, gutter: 0 }
          }
        },
        children: bodyChildren
      }
    ]
  });

  return doc;
}

function sanitizeForFilename(s) {
  return String(s || "").replace(/^https?:\/\//, "").replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 50);
}

async function generateAndDownload(meta, allSections) {
  const doc = buildDocx(meta, allSections);
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
  box.textContent = "Audit logged and report downloaded.";
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

    const { meta, allSections, formData } = collectFormData();
    btn.disabled = true;
    btn.textContent = "Generating…";
    try {
      try { await submitToNetlify(formData, meta, allSections); }
      catch (e) { console.warn("Netlify submit failed (continuing with download):", e); }
      await generateAndDownload(meta, allSections);
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
