// Anti-Mute
import { refreshMessagePool, broadcastChatMessage } from "./Utility/AntiMute";
// Lobby Protection
import { startInventoryScan } from "./Utility/PreventDestruction";
// Command process
import {
    initializeTempInfo,
    removeTempInfo,
    isCommand,
    processCommand,
    selectPos
} from "./Utility/Command/GraphicGenerator";

/* import { detectEntities } from "./Utility/EntityDetector";
import { txt } from "./Utility/MessageStyler";
import { circle } from "./Utility/Graphics/Circle";
import { line } from "./Utility/Graphics/Line";
import { sphere } from "./Utility/Graphics/Sphere";
import { distress } from "./Utility/Graphics/Distress"; */

onPlayerJoin = (playerId) => {
    startInventoryScan(playerId);
    initializeTempInfo(playerId);
};

onPlayerLeave = (playerId) => {
    removeTempInfo(playerId);
};

tick = () => {
    broadcastChatMessage();
};

onPlayerChat = (playerId, chatMessage) => {
    if (isCommand(chatMessage)) {
        processCommand(playerId, chatMessage);
    } else {
        refreshMessagePool(playerId, chatMessage);
    }

    return false;
};

onPlayerClick = (playerId, wasAlt, x, y, z, block, targetEId) => {
    const heldItem = api.getHeldItem(playerId);

    if (heldItem && heldItem?.name === "Moonstone Axe" && block !== "Air") {
        wasAlt
            ? selectPos(playerId, "pos2", [x, y, z])
            : selectPos(playerId, "pos1", [x, y, z]);
    }
}
