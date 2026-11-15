# MADARIK — Editorial Publication Standard

Effective 2026-11-15. Applies to **every new or revised fact and quiz question in every section** of MADARIK, not just Europe.

## Definition of done — before merge/publication
1. **Fact-check:** Verify the exact claim against a credible primary or specialist source; record the direct URL, supporting passage/section, date of review, and relevant date of the statistic. Resolve disputed boundaries and ambiguous phrasing explicitly.
2. **Edit:** Ensure precise, clear, concise Arabic. Avoid unsupported superlatives, vague claims, conflating Europe with the European Union, and claims that require further editorial cleanup.
3. **Deduplicate:** Compare against the entire existing published fact bank, including cross-category semantic overlap; keep the more informative and better sourced version.
4. **Quiz:** Generate only from an approved fact. Independently check the correct option, every distractor, the explanation, unambiguous wording, and question duplication across the whole question bank.
5. **Publish:** Mark verified only after all checks are complete, with stable IDs and evidence metadata. Draft/unverified content must not be rendered as approved.
6. **Verify:** Run automated editorial validation and preview mobile/desktop output. Confirm that reading progress and answer feedback still work.

**No publish-now, audit-later workflow.** Source URLs or an automated green check are not themselves proof of factual accuracy or semantic uniqueness. If evidence is missing, retain as draft and do not publish.

Current automated validator: `node scripts/validate-editorial.js`. It checks the Europe JSON and Europe quiz JSON. Additional sections must be connected to the validator before adding content there. Manual source-passage verification and semantic editorial review remain mandatory.
