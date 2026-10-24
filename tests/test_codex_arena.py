"""
Unit tests for RaidForge Codex Arena AST safety gate and Twitch command mutator.
"""

from backend.codex_arena_engine import (
    CODEX_SESSION_ID,
    apply_twitch_codex_command,
    validate_mutation_ast,
)


def test_ast_safety_gate_blocks_imports_and_exec():
    assert validate_mutation_ast("gravity_scale = 0.3\nboss_hp = 5000") is True
    assert validate_mutation_ast("import os\nos.system('calc')") is False
    assert validate_mutation_ast("eval('1+1')") is False


def test_apply_twitch_codex_command():
    res = apply_twitch_codex_command("!cheer 500", username="twitch_viewer_99")
    assert res["codex_patch"]["ast_safety_passed"] is True
    assert res["codex_patch"]["codex_session_id"] == CODEX_SESSION_ID
    assert res["arena_state"]["boss_hp"] == 6950
