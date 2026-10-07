import type { PlayerId, Pos } from "@bloxd";

import { txt } from "../MessageStyler";
import { isAdmin } from "../Admin";
import { REGEXP, USAGE } from "./RegExp";
import { circle } from "../Graphics/Circle";
import { distress } from "../Graphics/Distress";
import { line } from "../Graphics/Line";
import { sphere } from "../Graphics/Sphere";

type CurrentPos = "pos1" | "pos2";

interface PlayerState {
    pos1: Pos | null;
    pos2: Pos | null;
}

const _playerStates = new Map<PlayerId, PlayerState>();

/**
 * Initializes temporary info for a player
 * @param playerId - The Id of the player
 */
export function initializeTempInfo(playerId: PlayerId): void {
    _playerStates.set(playerId, {
        pos1: null,
        pos2: null,
    });
}

/**
 * Removes a player's temporary info
 * @param playerId - The Id of the player
 */
export function removeTempInfo(playerId: PlayerId): void {
    _playerStates.delete(playerId);
}

/*** Check if the message is a command */
export function isCommand(message: string): boolean {
    return message.startsWith("#");
}

/**
 * Selects a position for the player
 * @param playerId - The Id of the player
 * @param currPos - The current position to set
 * @param pos - The position to set
 */
export function selectPos(playerId: PlayerId, currPos: CurrentPos, pos: Pos | null = null): void {
    const state = _playerStates.get(playerId);
    const [x, y, z] = pos ?? api.getPosition(playerId);

    _isPos(pos)
        ? currPos === "pos1"
            ? state.pos1 = pos
            : state.pos2 = pos
        : currPos === "pos1"
            ? state.pos1 = [x, y, z]
            : state.pos2 = [x, y, z];

    txt.local(playerId, `${currPos} set to:\t\n  x:\t${x}\n  y:\t${y}\n  z:\t${z}`);
}

/**
 * Processes a command message from a player
 * @param playerId - The Id of the player sending the command
 * @param message - The command message
 */
export function processCommand(playerId: PlayerId, message: string): void {
    if (!isAdmin(playerId)) {
        txt.local_warn(playerId, "You have no access to use the command!");
        return;
    }

    const command = message.split(/\s+/)[0];

    switch (command) {
        case "#help": {
            txt.local(playerId,
                `All available commands:\n${USAGE.introduction}\n${USAGE.line}\n${USAGE.circle}\n${USAGE.sphere}\n${USAGE.distress}`);
            break;
        }

        case "#pos1": {
            selectPos(playerId, "pos1");
            break;
        }
        case "#pos2": {
            selectPos(playerId, "pos2");
            break;
        }

        case "#line": {
            const match = message.match(REGEXP.line);
            if (!match) {
                txt.local(playerId, `Usage: ${USAGE.line}`);
                return;
            }

            if (!_isPositionSet(playerId)) {
                txt.local_warn(playerId, "Please set pos1 and pos2 first!");
                return;
            }

            const state = _playerStates.get(playerId)!;
            const blockName = _parseBlockName(match[1] || "Black_Glass");

            line(state.pos1!, state.pos2!, blockName);
            txt.local(playerId, `Line generated`);
            break;
        }

        case "#circle": {
            const match = message.match(REGEXP.circle);
            if (!match) {
                txt.local(playerId, `Usage: ${USAGE.circle}`);
                return;
            }

            const radius = Number(match[1]);
            const centre = _parsePosition(match[2], playerId);
            const { blockName, isHollow } = _parseShapeOptions(match[3], match[4]);

            circle(radius, centre, blockName, isHollow);
            txt.local(playerId, `Circle generated`);
            break;
        }

        case "#sphere": {
            const match = message.match(REGEXP.sphere);
            if (!match) {
                txt.local(playerId, `Usage: ${USAGE.sphere}`);
                return;
            }
            const radius = Number(match[1]);
            const centre = _parsePosition(match[2], playerId);
            const { blockName, isHollow } = _parseShapeOptions(match[3], match[4]);

            sphere(radius, centre, blockName, isHollow);
            txt.local(playerId, `Generating...`);
            break;
        }

        case "#distress": {
            const match = message.match(REGEXP.distress);
            if (!match) {
                txt.local(playerId, `Usage: ${USAGE.distress}`);
                return;
            }

            const state = _playerStates.get(playerId);
            if (!_isPositionSet(playerId) || !state?.pos1 || !state.pos2) {
                txt.local_warn(playerId, "Please set pos1 and pos2 first!");
                return;
            }

            const blocksToPlace = _parseBlockList(match[1]);
            const blocksToReplace = _parseBlockList(match[2]);
            const density = Number(match[3]);

            distress(state.pos1, state.pos2, blocksToPlace ?? [], blocksToReplace, 50, density);
            txt.local(playerId, `Distressing...`);
            break;
        }

        default: {
            txt.local_warn(playerId, "Unknown command. Type #help for usage.");
            break;
        }
    }
}

function _isPos(pos: any): boolean {
    return pos && Array.isArray(pos) &&
        pos.length === 3 &&
        pos.every(c => typeof c === "number");
}

function _isPositionSet(playerId: PlayerId): boolean {
    const state = _playerStates.get(playerId);
    if (!state) return false;

    const { pos1, pos2 } = state;
    return _isPos(pos1) && _isPos(pos2);
}

function _parsePosition(value: string | undefined, playerId: PlayerId): Pos {
    if (value === undefined || value === "myPos") {
        const [x, y, z] = api.getPosition(playerId);
        return [x, y - 1, z];
    }

    const coordinates = value.slice(1, -1).split(",").map(Number);
    if (coordinates.length !== 3) {
        throw new Error(`Invalid position: ${value}`);
    }

    const [x, y, z] = coordinates;
    if (![x, y, z].every(Number.isFinite)) {
        throw new Error(`Invalid position: ${value}`);
    }

    return [x, y, z];
}

function _parseBlockName(value: string): string {
    return value.replace(/_/g, " ");
}

function _parseBlockList(value: string): string[] | null {
    if (value === "null") return null;
    return value.slice(1, -1).split(",").map(_parseBlockName);
}

function _parseShapeOptions(
    blockArgument: string | undefined,
    hollowArgument: string | undefined,
): { blockName: string; isHollow: boolean } {
    const blockIsBoolean = blockArgument === "true" || blockArgument === "false";

    return {
        blockName: _parseBlockName(
            blockIsBoolean ? "Black_Glass" : blockArgument || "Black_Glass",
        ),
        isHollow: blockIsBoolean
            ? blockArgument === "true"
            : hollowArgument === "true",
    };
}
