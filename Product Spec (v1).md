# Portugal D8 Visa — Product Spec (v1)

This covers the full shape of the product: the process it supports, the document checklist bucketed by what your tool does with each item, the exact questionnaire to run, and draft templates for every auto-generated document.

**Scope note:** Portugal's D8 process has two stages — (1) applying for the D8 *visa* at a Portuguese consulate in the applicant's home country, and (2) attending a *residence permit* appointment with AIMA (Portugal's immigration agency) after arrival. Stage 1 is where people are most confused and most likely to pay for help, since it happens remotely with no one to ask in person. **Build for Stage 1 first.** Stage 2 (the AIMA appointment) can be a "part 2" checklist you add later, or an upsell.

---

## 1. Eligibility snapshot (2026 figures — these move every January, treat as config, not constants)

- Age 18+, passport valid for the intended stay
- Monthly income ≥ €3,680 (pegged to 4× Portugal's minimum wage — recompute this every year)
- Consulates increasingly want a 6-month average above the threshold; if any month dips below it, a savings buffer of roughly €11,040 helps
- Income must be foreign-sourced / remote (employed, freelance, or business income earned outside Portugal)
- Comprehensive health insurance covering the stay
- Clean criminal record certificate from home country
- Proof of accommodation in Portugal
- Two visa flavors: **temporary stay** (up to 1 year, simpler, no residency track) vs **residence visa** (leads to a renewable AIMA residence permit). Most of your customers will want the residence visa — ask this up front, it changes several downstream requirements.

---

## 2. The full document checklist, bucketed by what your tool actually does

### Bucket 1 — Documents your tool *writes* (this is where the product earns its price)
| Document | What it needs to contain |
|---|---|
| Motivation letter | Why this person wants to move to Portugal, confirmation their work is location-independent, intended timeline |
| Employer remote-work confirmation letter | Employer name, applicant's role, confirmation that remote work is permitted indefinitely/for the visa period, salary |
| Freelancer/business income narrative | Used instead of the above if self-employed — describes client base, income stability, business structure |
| Income summary cover sheet | A clean one-page table translating messy bank statements/invoices into a clear monthly average vs. the €3,680 threshold |

### Bucket 2 — Official form, pre-filled from the same answers
| Document | Notes |
|---|---|
| National Visa Application Form (Formulário de Pedido de Visto Nacional) | Portugal's standard national visa form — your tool fills it from the questionnaire instead of the user re-entering everything by hand |

### Bucket 3 — User sources these themselves; your tool tells them exactly how
| Document | What your tool provides |
|---|---|
| Passport | Validity-length check against their intended stay, with a warning if it's too short |
| Passport photos | Exact size/format spec |
| Bank statements / contracts / invoices (raw proof) | Guidance on how many months, what to highlight |
| Health insurance policy | Minimum coverage requirements + a short list of providers other applicants have used |
| Criminal record certificate | **Branches by home country** — e.g., US applicants need an FBI background check via an approved channeler; UK applicants need an ACRO check. Then: apostille or consular legalization instructions depending on whether the home country is a Hague Apostille Convention member, translation requirement if not in Portuguese, and the "issued within ~90 days" freshness rule |
| Proof of accommodation | Rental agreement or hotel booking, formatting notes |
| NIF (Portuguese tax number) | Explain what it is, that non-EU applicants typically need a fiscal representative in Portugal to obtain one before arrival, and give 2-3 concrete routes (remote NIF services, a Portuguese accountant, etc.) |
| Visa fee payment proof | Current fee amount, accepted payment methods per consulate |

The country-branching on the criminal record certificate is the single most important piece of "domain knowledge" to get right early — it's genuinely different for a US vs. UK vs. Indian vs. Brazilian applicant. Start with the 3-4 home countries that make up most of your early customers (likely US, UK, Canada) and expand from there rather than trying to cover every nationality on day one.

---

## 3. The questionnaire (exact flow to build)

**Section 0 — Pre-questionnaire qualifier (not part of the paid application, no account needed yet)**

Before anyone signs in or starts the real questionnaire, ask exactly one question: *"Which are you applying for — the Residence Visa (leads to a long-term AIMA residence permit), or the Temporary Stay Visa (up to 1 year, no residency track)?"*

- **Residence Visa** → proceed into Section A below, the full built flow.
- **Temporary Stay** → v1 does not support this path. Show a plain "we don't cover this yet" message and capture their email for a "notify me when this is available" list. Do not create an account, do not start an application record, and never fall through to the residence-visa questionnaire for these users — the generated letters explicitly state residence intent, which would misstate a temporary-stay applicant's situation to a consular officer.

**Section A — Basics** *(only reached after "Residence Visa" is selected above — `visa_type` is implicitly `residence` for every application record in v1, so it does not need to be asked again here)*
1. Full legal name
2. Nationality / home country *(drives the criminal-record branch and apostille logic)*
3. Current country of residence, if different
4. Passport number and expiry date

**Section B — Work & income**
5. Are you: an employee of a company, a freelancer/contractor, or a business owner?
6. Employer name / client names (branches which Bucket-1 letter gets generated)
7. Monthly income (before tax), and currency
8. How long has this income been stable? (feeds the 6-month-average logic)
9. Do you have savings you'd like to include as a buffer, and how much?

**Section C — Family**
10. Are you applying alone or with dependents (spouse, children)? *(changes income thresholds and unlocks family reunification document notes)*

**Section D — Logistics**
11. Do you already have accommodation arranged in Portugal? (rental agreement / hotel booking / not yet)
12. Do you have health insurance already, or need guidance choosing a policy?
13. Intended move date

Everything downstream — the generated letters, the pre-filled form, and which Bucket-3 instructions get shown — is driven entirely by these ~13 answers (plus the Section 0 qualifier, which is asked once, up front, outside the application record).

---

## 4. Draft templates for the auto-generated documents

### Motivation Letter (template)

> To the Consular Section, Embassy/Consulate of Portugal in [HOME COUNTRY],
>
> I, [FULL NAME], a citizen of [NATIONALITY] currently residing in [CURRENT CITY, COUNTRY], am writing to formally express my intention to relocate to Portugal under the D8 [Temporary Stay / Residence] Visa program.
>
> I work as a [JOB TITLE] at [EMPLOYER NAME / "an independent freelancer/contractor serving clients including..."], earning income that is entirely sourced from outside Portugal. My work is fully remote and location-independent, allowing me to continue performing my professional duties without interruption while residing in Portugal.
>
> I intend to relocate to Portugal on or around [INTENDED MOVE DATE] and reside at [ACCOMMODATION ADDRESS, if known]. I have arranged comprehensive health insurance valid in Portugal and can demonstrate a stable monthly income of [INCOME AMOUNT], well in excess of the minimum threshold required for this visa category.
>
> I am drawn to Portugal for [1-2 sentence personalized reason — culture, quality of life, long-term plans — pulled from a free-text field in the questionnaire], and I look forward to contributing to and being part of Portuguese life during my stay.
>
> Sincerely,
> [FULL NAME]
> [DATE]

### Employer Remote-Work Confirmation Letter (template — used when Section B answer = "employee")

> [EMPLOYER LETTERHEAD / COMPANY NAME]
>
> To Whom It May Concern,
>
> This letter confirms that [EMPLOYEE FULL NAME] has been employed by [COMPANY NAME] as a [JOB TITLE] since [START DATE]. [HE/SHE/THEY] is a full-time [remote/hybrid-remote] employee, and [HIS/HER/THEIR] role does not require physical presence at any company location.
>
> [EMPLOYEE NAME]'s current gross monthly salary is [AMOUNT + CURRENCY]. [COMPANY NAME] confirms that [HE/SHE/THEY] is authorized to continue performing [HIS/HER/THEIR] duties remotely from Portugal for the duration of [HIS/HER/THEIR] employment.
>
> Please contact the undersigned with any questions regarding this confirmation.
>
> [MANAGER/HR NAME, TITLE]
> [COMPANY NAME]
> [CONTACT EMAIL/PHONE]
> [DATE]

*(Note: this letter needs to be signed by the actual employer — your tool generates the draft text for the applicant to send to their HR/manager, it doesn't fabricate a signature.)*

### Freelancer/Business Income Narrative (template — used when Section B answer = "freelancer" or "business owner")

> To the Consular Section, Embassy/Consulate of Portugal in [HOME COUNTRY],
>
> I, [FULL NAME], operate as an independent [freelancer/consultant/business owner] in the field of [INDUSTRY/SERVICE]. My income is derived from clients located outside Portugal, including [CLIENT NAMES OR TYPES, if the applicant is comfortable disclosing].
>
> Over the past [X months], my average monthly income has been [AMOUNT], as evidenced by the attached bank statements, invoices, and client contracts. My work is conducted entirely online and does not depend on physical presence in any single location, allowing me to continue serving my clients while residing in Portugal.
>
> [FULL NAME]
> [DATE]

### Income Summary Cover Sheet (template — a simple table your tool renders as a one-page PDF)

| Month | Gross Income Received | Source | Running 6-Month Average |
|---|---|---|---|
| [Month 1] | [amount] | [employer/client] | — |
| [Month 2] | [amount] | | |
| ... | | | |
| **Average** | **[calculated]** | | **vs. €3,680 threshold: [met/not met]** |

This one document alone solves a real pain point — consulates specifically want to see this kind of clear average, and applicants currently have to manually total up months of statements themselves.

---

## 5. Disclaimer language to bake into the product

> This tool assembles documents based on publicly available Portuguese consulate and AIMA requirements as of [DATE]. It does not provide legal advice, and it cannot guarantee visa approval — no service can. Requirements vary by consulate and may change; always confirm current requirements with your nearest Portuguese consulate or an immigration lawyer, particularly if your situation involves a criminal record, prior visa refusals, or unusual income sources.

---

## 6. Suggested build order

0. Build the Section 0 qualifier gate (residence vs. temporary stay) as the very first thing anyone sees — it's what keeps unsupported-path users from ever entering a half-built flow
1. Nail the questionnaire + the 3 Bucket-1 letter templates for the **residence visa** path only, home countries **US, UK, Canada** only
2. Add the pre-filled national visa form
3. Add Bucket-3 guidance content for those same 3 home countries
4. Expand to more home countries based on where signups actually come from
5. Consider the AIMA/Stage-2 checklist as a v2 feature or an upsell for people who've already used Stage 1