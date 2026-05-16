// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";

contract AegisTreasuryVault is ERC4626, Ownable {
    using SafeERC20 for IERC20;

    mapping(address => bool) public authorizedExecutors;
    bool public defenseMode;

    event ExecutorUpdated(address indexed executor, bool allowed);
    event DefenseModeUpdated(bool enabled);
    event TreasuryRebalance(
        address indexed executor,
        string fromProtocol,
        string toProtocol,
        string fromChain,
        string toChain,
        uint256 amount
    );

    modifier onlyExecutor() {
        require(authorizedExecutors[msg.sender], "Aegis: executor not authorized");
        _;
    }

    constructor(IERC20 asset_)
        ERC4626(asset_)
        ERC20("Aegis Treasury Share", "aTRSY")
        Ownable(msg.sender)
    {}

    function setExecutor(address executor, bool allowed) external onlyOwner {
        authorizedExecutors[executor] = allowed;
        emit ExecutorUpdated(executor, allowed);
    }

    function setDefenseMode(bool enabled) external onlyOwner {
        defenseMode = enabled;
        emit DefenseModeUpdated(enabled);
    }

    function rebalance(
        string calldata fromProtocol,
        string calldata toProtocol,
        string calldata fromChain,
        string calldata toChain,
        uint256 amount
    ) external onlyExecutor {
        require(!defenseMode, "Aegis: defense mode active");
        emit TreasuryRebalance(msg.sender, fromProtocol, toProtocol, fromChain, toChain, amount);
    }

    function emergencyWithdraw(address recipient, uint256 amount) external onlyOwner {
        IERC20(asset()).safeTransfer(recipient, amount);
    }
}

