# RaidForge Codex Arena — Live Twitch Chat Boss Raid & OpenAI Codex Game-Rule Mutator

**RaidForge Codex Arena** (`TwitchConCodexArena`) is a real-time interactive Twitch stream overlay and boss raid game built for the **Codex x TwitchCon Hackathon ($25,000 Cash)**.

- **Live Interactive Broadcast Studio & Overlay**: [https://kevin9327.github.io/TwitchConCodexArena/](https://kevin9327.github.io/TwitchConCodexArena/)
- **Public GitHub Repository (MIT License)**: [https://github.com/kevin9327/TwitchConCodexArena](https://github.com/kevin9327/TwitchConCodexArena)
- **OpenAI Codex Session ID (`/status`)**: `sess_codex_019a1b8e-7c42-7f90-b3d1-98e4c210a6f4`

---

## What It Does
In **RaidForge Codex Arena**, Twitch viewers don't just watch a stream—they actively rewrite the physics and boss AI of a 60fps Cyber-Hydra Boss Raid in real time:
1. **Twitch Chat & EventSub Command Triggers (`!mutate low_gravity`, `!mutate boss_rage`, `!cheer 500`)**:
   - Viewers in Twitch Chat (or via Bits/Channel Points EventSub webhooks) vote on or trigger live arena mutations.
2. **OpenAI Codex Live Physics & Boss-AI Mutator (`backend/codex_arena_engine.py`)**:
   - Translates viewer commands into deterministic game-loop patches (`gravity_scale`, `projectile_speed`, `boss_hp`, `streamer_shield`, `hype_combo`) using **OpenAI Codex (`codex-mini-latest`)**.
3. **Deterministic AST Safety Gate (`validate_mutation_ast`)**:
   - Parses every Codex-generated patch into a Python Abstract Syntax Tree (`ast.parse`) and blocks any `import`, `exec`, `eval`, or file/network access before hot-reloading the live Twitch stream overlay at 60 FPS.

---

## How We Built It with OpenAI Codex
- **OpenAI Codex CLI (`/status` Session ID: `sess_codex_019a1b8e-7c42-7f90-b3d1-98e4c210a6f4`)**:
  - Used OpenAI Codex to scaffold the Twitch EventSub payload handler, write the AST safety verifier (`validate_mutation_ast`), build the 60fps HTML5 Canvas Cyber-Hydra raid renderer, and generate automated unit tests (`tests/test_codex_arena.py` — `2 passed in 0.02s`).

## Quickstart
```bash
pytest -v
```
