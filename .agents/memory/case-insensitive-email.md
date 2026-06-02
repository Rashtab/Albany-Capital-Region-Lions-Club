---
name: Case-insensitive email lookup
description: getMemberByEmail uses LOWER() SQL because some emails are stored with mixed case.
---

## Rule
`getMemberByEmail` uses `eq(sql\`LOWER(\${members.email})\`, email.toLowerCase())` instead of a plain `eq()`.

**Why:** The webmaster account was seeded as `WebAdmin@albanylionsclub.org` (mixed case). Plain `eq()` is case-sensitive in PostgreSQL for text columns, so lowercase login attempts would fail.

**How to apply:** Any new code that looks up members by email should normalize both sides to lowercase, or use the existing `getMemberByEmail` DAL function which already handles this.
