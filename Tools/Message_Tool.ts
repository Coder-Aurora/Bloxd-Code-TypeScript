import type { PlayerId, StyledText, StyledIcon } from "@bloxd";

type Send = (playerId: PlayerId, ...msg: string[]) => void;
type Broadcast = (...msg: string[]) => void;

type TextStyle = StyledIcon | StyledText;

const MakeStyledMessage = (icon: string, tagText: string, tagColor: string, contentColor: string, ...msg: string[]): TextStyle[] => [
    { icon, style: { color: "#ff99cc", fontSize: "9px" } },
    { str: " [ ", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
    { str: tagText, style: { color: tagColor, fontWeight: "600", fontStyle: "italic" } },
    { str: " ]", style: { color: "#74b1ff", fontWeight: "400", fontStyle: "normal" } },
    { str: ": ", style: { color: "#4facfe", fontWeight: "400", fontStyle: "normal" } },
    { str: msg.join(", "), style: { color: contentColor, fontWeight: "500", fontStyle: "italic" } },
];

export const txt = {
    local: ((playerId, ...msg) => {
        api.sendMessage(playerId, MakeStyledMessage("fa-solid fa-gear", "PRIVATE", "#6c5ce7", "#9d8cff", ...msg));
    }) as Send,

    global: ((...msg) => {
        api.broadcastMessage(MakeStyledMessage("fa-solid fa-user-astronaut", "GLOBAL", "#b19cd9", "#9d8cff", ...msg));
    }) as Broadcast,

    local_warn: ((playerId, ...msg) => {
        api.sendMessage(playerId, MakeStyledMessage("fa-solid fa-triangle-exclamation", "PRIVATE_WARN", "#ff6eb4", "#ed5f5f", ...msg));
    }) as Send,

    global_warn: ((...msg) => {
        api.broadcastMessage(MakeStyledMessage("fa-solid fa-user-unlock", "GLOBAL_ALERT", "#ff6eb4", "#ed5f5f", ...msg));
    }) as Broadcast,
};
