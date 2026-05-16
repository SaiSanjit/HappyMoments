---
description: Universal execution workflow. Auto-routes tasks.
---

// turbo-all

# ⚡ MADHAN'S UNIVERSAL EXECUTION ENGINE v2.0 (Lite)

**One workflow for EVERY task.** Auto-routes based on user request.
**Static Rules:** See `GEMINI.md` in project root for all engineering standards.

---

## PHASE 0: INTAKE & CLASSIFICATION

1. **Analyze Request**: Read carefully.
2. **Detect Task Type**:
   - `REQUIREMENTS` (analyze, spec) | `UI_DESIGN` (mockup, flow) | `UI_FIX` (polish, spacing)
   - `REFERENCE` (inspired by) | `ARCHITECTURE` (structure, setup) | `FEATURE` (add, build)
   - `BACKEND` (api, db, plsql) | `PERFORMANCE` (optimize, slow) | `DEBUG` (fix, bug)
   - `REFACTOR` (cleanup) | `REVIEW` (audit) | `SECURITY` (vuln) | `TEST` (coverage)
   - `DEPLOY` (ci/cd) | `DOCS` (readme)

3. **Assign Persona**: Apply `GEMINI.md` Section 1 rules.
4. **Proactive Redirection**: IF Chat Window + Heavy Task → Suggest CLI (`/x`).
5. **Set Complexity**:
   - **QUICK**: <30 lines, 1 file → Phase 2.
   - **MEDIUM**: 2-5 files → Phase 1 (Inline) → Phase 2.
   - **LARGE**: 5+ files/Arch → Phase 1 (Full Plan) → Phase 2.

---

## PHASE 1: PLANNING (Skip for QUICK)

6. **Research**: Scan structure, patterns, imports (See `GEMINI.md` Sec 21).
7. **Plan**:
   - **MEDIUM**: State plan inline.
   - **LARGE**: Create `implementation_plan.md`.
     - Goal, Context, Approach, Files, Risks.
     - **MUST** get user approval before Phase 2.

---

## PHASE 2: EXECUTION

8. **Write Code**:
   - **STRICTLY FOLLOW `GEMINI.md` RULES**:
     - **React**: Sec 5 (Structure), Sec 7 (State), Sec 11 (Perf).
     - **Flutter**: Sec 5 (Structure), Sec 7 (State), Sec 11 (Perf).
     - **Backend**: Sec 18 (API/DB), Sec 9 (Security).
     - **Oracle**: Sec 18C (Naming, JSON, Packages) & 18D (No raw DML via MCP).
     - **UI**: Sec 6 (Premium Design).
   - **Universal Standards**:
     - No `any`, handle errors explicitly, strictly typed.
     - Small functions (<20 lines), clear naming.
     - Add inline comments for "WHY", not "WHAT".
9. **Order**: Dependency order (A before B if B imports A).
10. **Breaking Changes**: Call them out explicitly.

---

## PHASE 3: VERIFICATION

11. **Self-Correction**: Trace paths, check imports/types.
12. **Auto-Test**: Run build/lint/test commands (See `GEMINI.md` Sec 10).
13. **Post-Processing (Mandatory)**:
    - **Execute** any specific user verification instructions.
    - **Refactor?** Run comprehensive tests/lints and fix regressions.
14. **Report**: Concise summary, modified files, next steps.

---

## CHEAT SHEET (See GEMINI.md for full details)

- **UI**: Glassmorphism, mobile-first (375px), 44px touch targets.
- **React**: Zustand, TanStack Query, Zod.
- **Flutter**: BLoC, get_it, go_router.
- **Oracle**: `xx<app>_<verb>_<entity>_p`, Packages only, APEX_JSON.
- **Security**: No secrets in code, validate all inputs.

## USAGE
`/x [task description]`
