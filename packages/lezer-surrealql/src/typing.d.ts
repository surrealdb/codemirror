import type { NodeProp } from "@lezer/common";
import type { LRParser } from "@lezer/lr";

export const parser: LRParser;
export const sinceProp: NodeProp<string>;
export const untilProp: NodeProp<string>;
