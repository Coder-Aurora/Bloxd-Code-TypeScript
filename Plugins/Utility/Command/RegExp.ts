/**
 * Regular expressions for all commands
 * <>: Required Arguments
 * []: Optional Arguments
 */
export const REGEXP = {
    /** Usage: #line [BlockName] */
    line: /^#line(?:\s+([A-Za-z0-9]+(?:_[A-Za-z0-9]+)*))?$/,
    /** Usage: #circle <Radius> [\[number,number,number\] | myPos] [BlockName] [IsHollow] */
    circle: /^#circle\s+([1-9]\d*)(?:\s+(\[-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\]|myPos))?(?:\s+([A-Za-z0-9]+(?:_[A-Za-z0-9]+)*))?(?:\s+(true|false))?$/,
    /** Usage: #sphere <Radius> [\[number,number,number\] | myPos] [BlockName] [IsHollow] */
    sphere: /^#sphere\s+([1-9]\d*)(?:\s+(\[-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*\]|myPos))?(?:\s+([A-Za-z0-9]+(?:_[A-Za-z0-9]+)*))?(?:\s+(true|false))?$/,
    /** Usage: #distress <\[...BlocksToBePlaced\]> <\[...BlocksToBeReplaced\] | null> <density> */
    distress: /^#distress\s+(\[[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*(?:,[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*)*\])\s+(\[[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*(?:,[A-Za-z0-9]+(?:_[A-Za-z0-9]+)*)*\]|null)\s+(1(?:\.0+)?|0\.(?:0*[1-9]\d*))$/,
};

export const USAGE = {
    introduction: `<>: Required Arguments\n[]: Optional Arguments\nmyPos: Your current position with Y decreased by 1\n`,
    pos: `Set selection points:\n Usage: #pos1 | #pos2`,
    line: `Draw a line between two points:\n  Usage: #line [BlockName]\n  e.g.: #line Red_Concrete\n`,
    circle: `Draw a circle:\n  Usage: #circle <Radius> [Centre (defaults to myPos)] [BlockName (defaults to Black_Glass)] [IsHollow (defaults to false)]\n  myPos uses your position with Y decreased by 1.\n  e.g.: #circle 5 [0,0,0] Black_Glass true\n`,
    sphere: `Draw a sphere:\n  Usage: #sphere <Radius> [Centre (defaults to myPos)] [BlockName (defaults to Black_Glass)] [IsHollow (defaults to false)]\n  myPos uses your position with Y decreased by 1.\n  e.g.: #sphere 10 Black_Glass false\n`,
    distress: `Distress an area with specific density:\n  Usage: #distress <[BlocksToBePlaced]> <[BlocksToBeReplaced] | null> <density>\n  e.g.: #distress [Stone,Dirt] null 0.5\n`,
};
