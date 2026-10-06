import type { PlayerId, StyledText } from "@bloxd";

const _messagePool: StyledText[][] = [];

function _generateStyledMessage(playerId: PlayerId, chatMessage: string): StyledText[] {
    const playerName = api.getEntityName(playerId);

    if (playerName === "Coder_Aurora") {
        return [
            { str: "✈️", style: { color: "#a78bfa", fontSize: "13px", fontWeight: "700" } },
            { str: " [AirBus] ", style: { color: "#60a5fa", fontSize: "13px", fontWeight: "700" } },
            { str: "[Linkin Park] ", style: { color: "#c084fc", fontSize: "13px", fontWeight: "700" } },
            {
                str: "Coder_Aurora: ",
                style: { color: "#93c5fd", fontSize: "13px", fontStyle: "italic", fontWeight: "600" },
            },
            { str: chatMessage, style: { color: "#ede9fe", fontSize: "13px", fontWeight: "500" } },
        ]
    } else {
        return [
            {
                str: `${playerName}: `,
                style: { color: "#9c9b9b", fontSize: "13px", fontStyle: "italic", fontWeight: "600" },
            },
            {
                str: `${chatMessage}`,
                style: { color: "#f0f0f0", fontSize: "13px", fontStyle: "normal", fontWeight: "500" },
            },
        ]
    }
}

/**
 * Adds a new message to the pool with custom styling
 */
export function refreshMessagePool(playerId: PlayerId, chatMessage: string): void {
    _messagePool.push(_generateStyledMessage(playerId, chatMessage));
}

/**
 * Broadcasts every buffered message with custom styling
 * Called from the tick callback on every frame
 */
export function broadcastChatMessage(): void {
    while (_messagePool.length > 0) {
        const msg = _messagePool.shift();
        if (msg) {
            api.broadcastMessage(msg);
        }
    }
}
