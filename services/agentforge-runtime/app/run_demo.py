from __future__ import annotations

import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
MOCK_MARKET_PATH = ROOT / "data" / "mock_market.json"


def load_mock_market() -> dict[str, Any]:
    return json.loads(MOCK_MARKET_PATH.read_text())


def predict_apr(current_apr: float, utilization: float) -> float:
    if utilization > 90:
        return round(current_apr + 1.8, 2)
    if utilization > 80:
        return round(current_apr + 0.7, 2)
    if utilization < 75:
        return round(current_apr + 0.2, 2)
    return round(current_apr + 0.4, 2)


def build_demo_cycle() -> dict[str, Any]:
    payload = load_mock_market()
    borrower = payload["borrower"]
    constraints = payload["constraints"]
    pools = payload["pools"]

    predicted_pools: list[dict[str, Any]] = []
    for pool in pools:
        predicted_apr = predict_apr(pool["currentApr"], pool["utilization"])
        constraint_blockers = []

        if pool["utilization"] > constraints["maxUtilization"]:
            constraint_blockers.append("utilization-too-high")
        if pool["liquidityScore"] < constraints["minLiquidityScore"]:
            constraint_blockers.append("liquidity-too-low")
        if pool["riskScore"] > constraints["maxRiskScore"]:
            constraint_blockers.append("risk-too-high")

        predicted_pools.append(
            {
                **pool,
                "predictedApr": predicted_apr,
                "constraintBlockers": constraint_blockers,
                "eligible": len(constraint_blockers) == 0,
            }
        )

    eligible = [pool for pool in predicted_pools if pool["eligible"]]
    ranked = sorted(eligible, key=lambda pool: (pool["predictedApr"], -pool["liquidityScore"], pool["riskScore"]))
    best = ranked[0] if ranked else sorted(predicted_pools, key=lambda pool: pool["predictedApr"])[0]
    current = next(pool for pool in predicted_pools if pool["protocol"] == borrower["currentProtocol"])

    apr_delta = current["predictedApr"] - best["predictedApr"]
    expected_monthly_savings = round((borrower["borrowAmountUsd"] * (apr_delta / 100)) / 12, 2)

    return {
        "rate_data": predicted_pools,
        "decision": {
            "fromProtocol": current["protocol"],
            "toProtocol": best["protocol"],
            "reason": (
                f"{best['protocol']} offers the best eligible predicted borrow APR. "
                f"{current['protocol']} is more expensive for the current borrower state."
            ),
            "confidence": 0.84,
            "expectedMonthlySavingsUsd": max(expected_monthly_savings, 0),
        },
        "execution": {
            "steps": [
                f"Repay existing {borrower['borrowAsset']} debt on {current['protocol']}.",
                f"Withdraw {borrower['collateralAsset']} collateral from {current['protocol']}.",
                f"Deposit {borrower['collateralAsset']} collateral into {best['protocol']}.",
                f"Borrow {borrower['borrowAmountUsd']} {borrower['borrowAsset']} from {best['protocol']}.",
            ],
            "simulatedTxHash": "0xFAKE_AGENTFORGE_VERUM_BORROW_SWITCH",
            "fallbackMode": "simulation",
            "recommendedWindow": "next low-volatility block window",
        },
    }


def main() -> None:
    result = build_demo_cycle()
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
