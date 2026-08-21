import shared from "../../fonts.config.cjs";

/**
 * Pastorly app fonts (same stack as learn2driveng-client).
 *
 * - Inter: TextInput values and sans utility
 * - Space Grotesk: display headlines
 * - Figtree: UI labels, buttons, and body copy
 */
export const fontFamily = shared.fontFamily;

export type FontWeight = keyof typeof fontFamily;
