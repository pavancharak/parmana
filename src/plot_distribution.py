"""
Entry point: python plot_distribution.py

Renders metrics_distribution.json (written by analyze_metrics.py) as a
chart, docs/metrics_distribution.png, for the README. Real numbers only,
no styling tricks to make the spread look bigger or smaller than it is.
Each metric gets its own axis range because catch rate lives around 90%
while missed and false positive rate live under 10%, a shared axis would
make two of the three rows invisible.
"""

import json
from pathlib import Path

import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parent.parent
DIST_PATH = ROOT / "metrics_distribution.json"
OUT_PATH = ROOT / "docs" / "metrics_distribution.png"

# (dashboard.json summary key, per-run key, display label, color, x-axis range)
METRICS = [
    ("catch_rate_pct", "catch_pct", "Fraud caught", "#10B981", (80, 100)),
    ("miss_rate_pct", "miss_pct", "Fraud missed", "#EF4444", (0, 20)),
    ("fp_rate_pct", "fp_rate_pct", "False positive rate", "#F59E0B", (0, 20)),
]


def main():
    data = json.loads(DIST_PATH.read_text())
    runs = data["runs"]
    summary = data["summary"]

    fig, axes = plt.subplots(len(METRICS), 1, figsize=(7.5, 4.8), dpi=160)
    fig.patch.set_facecolor("white")
    fig.suptitle(
        f"{len(runs)} independent real runs, dots are individual runs, the line is the mean",
        fontsize=10, color="#6B7280", y=0.99,
    )

    for ax, (summary_key, run_key, label, color, (lo, hi)) in zip(axes, METRICS):
        s = summary[summary_key]
        points = [r[run_key] for r in runs]

        ax.set_facecolor("white")
        ax.hlines(y=0, xmin=s["min"], xmax=s["max"], color=color, linewidth=6, alpha=0.35, zorder=1)
        ax.scatter(points, [0] * len(points), color=color, s=60, zorder=3, edgecolor="white", linewidth=1)
        ax.scatter([s["mean"]], [0], color=color, s=160, marker="|", linewidth=3, zorder=4)

        ax.set_xlim(lo, hi)
        ax.set_ylim(-1, 1)
        ax.set_yticks([])
        ax.set_title(
            f"{label}: {s['min']}% - {s['max']}%  (mean {s['mean']}%, std dev {s['std_dev']}%)",
            fontsize=10, color="#1A1A1A", loc="left", pad=6,
        )
        ax.tick_params(axis="x", labelsize=8, colors="#6B7280")
        for side in ("top", "right", "left"):
            ax.spines[side].set_visible(False)
        ax.spines["bottom"].set_color("#E5E7EB")
        ax.grid(axis="x", color="#E5E7EB", linewidth=0.8, zorder=0)
        ax.set_axisbelow(True)

    axes[-1].set_xlabel("Percent", fontsize=9, color="#6B7280")
    fig.tight_layout(rect=(0, 0, 1, 0.96))
    OUT_PATH.parent.mkdir(exist_ok=True)
    fig.savefig(OUT_PATH, facecolor="white")
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
