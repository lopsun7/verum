// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IAegisTreasuryVault {
    function rebalance(
        string calldata fromProtocol,
        string calldata toProtocol,
        string calldata fromChain,
        string calldata toChain,
        uint256 amount
    ) external;
}

contract AegisExecutionModule is Ownable {
    IAegisTreasuryVault public immutable vault;
    bool public paused;

    event ExecutionPlanned(
        string indexed moveId,
        string fromProtocol,
        string toProtocol,
        string fromChain,
        string toChain,
        uint256 amount
    );
    event PauseUpdated(bool paused);

    constructor(address vaultAddress) Ownable(msg.sender) {
        vault = IAegisTreasuryVault(vaultAddress);
    }

    function setPaused(bool nextPaused) external onlyOwner {
        paused = nextPaused;
        emit PauseUpdated(nextPaused);
    }

    function executeTreasuryMove(
        string calldata moveId,
        string calldata fromProtocol,
        string calldata toProtocol,
        string calldata fromChain,
        string calldata toChain,
        uint256 amount
    ) external onlyOwner {
        require(!paused, "Aegis: module paused");
        emit ExecutionPlanned(moveId, fromProtocol, toProtocol, fromChain, toChain, amount);
        vault.rebalance(fromProtocol, toProtocol, fromChain, toChain, amount);
    }
}

