#!/usr/bin/env bash
set -uo pipefail

# ============================================================
#  WorkflowX Deploy — 部署脚本
#  将项目配置分发到各 CLI 的全局配置目录
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
HOME_DIR="$HOME"
BACKUP_BASE="$HOME_DIR/.wfx-backup"

# 平台定义
declare -A PLATFORM_NAME=( [claude]="Claude Code" [codex]="Codex CLI" )
declare -A PLATFORM_SRC=( [claude]="$PROJECT_DIR/.claude" [codex]="$PROJECT_DIR/.codex" )
declare -A PLATFORM_DST=( [claude]="$HOME_DIR/.claude" [codex]="$HOME_DIR/.codex" )

# ── 工具函数 ──────────────────────────────────────────────

info()  { echo -e "\033[36m  →\033[0m $*"; }
ok()    { echo -e "\033[32m  ✓\033[0m $*"; }
warn()  { echo -e "\033[33m  !\033[0m $*"; }
fail()  { echo -e "\033[31m  ✗\033[0m $*"; }
header(){ echo -e "\n\033[1;36m━━━ $* ━━━\033[0m"; }

# ── 复制目录（排除 __pycache__） ──────────────────────────

copy_tree() {
    local src="$1" dst="$2"

    mkdir -p "$dst"

    if command -v rsync &>/dev/null; then
        rsync -a --exclude='__pycache__' --exclude='*.pyc' "$src"/ "$dst"/
    else
        # cp + 清理 pycache
        cp -r "$src"/. "$dst"/
        find "$dst" -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
        find "$dst" -name '*.pyc' -delete 2>/dev/null || true
    fi
}

# ── 备份（仅备份 WorkflowX 管理的子目录） ──────────────────

backup_existing() {
    local platform="$1"
    local dst="${PLATFORM_DST[$platform]}"
    if [ ! -d "$dst" ]; then
        return 0
    fi

    local ts
    ts=$(date +%Y%m%d-%H%M%S)
    local backup_dir="$BACKUP_BASE/$platform/$ts"
    mkdir -p "$backup_dir"

    # 只备份 WorkflowX 会覆盖的子目录和文件
    local items=()
    case "$platform" in
        claude)
            items=(agents skills commands settings.json CLAUDE.local.md)
            ;;
        codex)
            items=(agents skills config.toml)
            ;;
    esac

    local backed=0
    for item in "${items[@]}"; do
        if [ -e "$dst/$item" ]; then
            if [ -d "$dst/$item" ]; then
                cp -r "$dst/$item" "$backup_dir/"
            else
                cp "$dst/$item" "$backup_dir/"
            fi
            ((backed++))
        fi
    done

    if [ "$backed" -gt 0 ]; then
        ok "已备份 $backed 项 → $backup_dir"
    fi
}

# ── 部署 ──────────────────────────────────────────────────

deploy_platform() {
    local platform="$1"
    local src="${PLATFORM_SRC[$platform]}"
    local dst="${PLATFORM_DST[$platform]}"
    local name="${PLATFORM_NAME[$platform]}"

    header "$name"

    # 预校验
    if [ ! -d "$src" ]; then
        fail "源目录不存在: $src"
        return 1
    fi

    # 备份
    backup_existing "$platform"

    # 按子目录/文件逐一复制
    case "$platform" in
        claude)
            for item in agents skills commands settings.json CLAUDE.local.md; do
                if [ -e "$src/$item" ]; then
                    if [ -d "$src/$item" ]; then
                        copy_tree "$src/$item" "$dst/$item"
                    else
                        mkdir -p "$dst"
                        cp "$src/$item" "$dst/$item"
                    fi
                    info "$item"
                fi
            done
            ;;
        codex)
            for item in agents skills config.toml; do
                if [ -e "$src/$item" ]; then
                    if [ -d "$src/$item" ]; then
                        copy_tree "$src/$item" "$dst/$item"
                    else
                        mkdir -p "$dst"
                        cp "$src/$item" "$dst/$item"
                    fi
                    info "$item"
                fi
            done
            ;;
    esac

    echo ""
    verify_deploy "$platform"
}

# ── 验证 ──────────────────────────────────────────────────

verify_deploy() {
    local platform="$1"
    local dst="${PLATFORM_DST[$platform]}"
    local pass=0 fail_count=0

    check() {
        if [ -e "$dst/$1" ]; then
            ok "$1"
            ((pass++))
        else
            fail "$1 缺失"
            ((fail_count++))
        fi
    }

    case "$platform" in
        claude)
            check "settings.json"
            check "agents"
            check "skills"
            check "commands"
            ;;
        codex)
            check "config.toml"
            check "agents"
            check "skills"
            ;;
    esac

    if [ "$fail_count" -eq 0 ]; then
        ok "$pass 项全部就位 ✓"
    else
        warn "$pass 项就位, $fail_count 项缺失"
    fi
}

# ── 主流程 ────────────────────────────────────────────────

main() {
    echo ""
    echo "  WorkflowX Deploy"
    echo "  ─────────────────"
    echo ""

    # CLI 参数模式
    if [ $# -gt 0 ]; then
        for arg in "$@"; do
            case "$arg" in
                --claude)  deploy_platform claude ;;
                --codex)   deploy_platform codex ;;
                --all)     deploy_platform claude; deploy_platform codex ;;
                --help|-h)
                    echo "用法: bash deploy.sh [选项]"
                    echo ""
                    echo "选项:"
                    echo "  --claude    部署到 Claude Code (~/.claude/)"
                    echo "  --codex     部署到 Codex CLI  (~/.codex/)"
                    echo "  --all       部署全部平台"
                    echo "  无参数      进入交互式菜单"
                    ;;
                *) fail "未知参数: $arg" ;;
            esac
        done
        return
    fi

    # 交互式菜单
    while true; do
        echo "  选择部署目标:"
        echo ""
        echo "  [1] Claude Code   → ~/.claude/"
        echo "  [2] Codex CLI     → ~/.codex/"
        echo "  [3] 全部部署"
        echo "  [0] 退出"
        echo ""
        read -rp "  请选择 [0-3]: " choice

        case "$choice" in
            1) deploy_platform claude ;;
            2) deploy_platform codex ;;
            3) deploy_platform claude; deploy_platform codex ;;
            0) echo ""; info "退出"; exit 0 ;;
            *) warn "无效选择: $choice" ;;
        esac

        echo ""
    done
}

main "$@"
