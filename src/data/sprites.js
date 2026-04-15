// Pixel art sprite definitions
// Each sprite is an array of rows, each row is an array of color values
// null = transparent, string = hex color

const C = {
    // Master Chief / Spartan
    green: '#5b8c3e',
    darkGreen: '#3d5e29',
    visor: '#f7a41d',
    visorDark: '#c47a0a',
    armor: '#4a7232',
    armorLight: '#6fa34e',
    black: '#1a1a2e',
    gray: '#666677',
    darkGray: '#444455',

    // Grunt
    gruntBody: '#e85d26',
    gruntDark: '#b34418',
    gruntMask: '#33ccff',
    gruntTank: '#557799',

    // Elite
    eliteBody: '#7733bb',
    eliteDark: '#552288',
    eliteLight: '#9955dd',
    eliteJaw: '#aa66ee',

    // Jackal
    jackalBody: '#bb9933',
    jackalDark: '#887722',
    jackalShield: '#33ddff',
    jackalShieldDark: '#22aacc',

    // Hunter
    hunterBody: '#335577',
    hunterDark: '#223355',
    hunterArmor: '#445588',
    hunterOrange: '#ff6622',

    // Platforms
    platTop: '#6b8f5e',
    platMid: '#4a6741',
    platDark: '#364e30',
    platRivet: '#8aaf7e',
    jumpPadGlow: '#00ccff',
    jumpPadDark: '#0088aa',

    // Items
    orbGreen: '#44ff88',
    orbGreenDark: '#22cc55',
    orbCore: '#aaffcc',
};

// 14x16 Master Chief (facing right)
export const SPARTAN_RIGHT = [
    [null,null,null,null,C.darkGreen,C.darkGreen,C.darkGreen,C.darkGreen,C.darkGreen,C.darkGreen,null,null,null,null],
    [null,null,null,C.darkGreen,C.green,C.green,C.green,C.green,C.green,C.green,C.darkGreen,null,null,null],
    [null,null,C.darkGreen,C.green,C.green,C.visor,C.visor,C.visor,C.visor,C.green,C.green,C.darkGreen,null,null],
    [null,null,C.darkGreen,C.green,C.visor,C.visorDark,C.visor,C.visor,C.visorDark,C.visor,C.green,C.darkGreen,null,null],
    [null,null,null,C.darkGreen,C.darkGreen,C.darkGreen,C.darkGreen,C.darkGreen,C.darkGreen,C.darkGreen,C.darkGreen,null,null,null],
    [null,null,null,C.armor,C.green,C.armorLight,C.green,C.green,C.armorLight,C.green,C.armor,null,null,null],
    [null,null,C.armor,C.green,C.armorLight,C.green,C.green,C.green,C.green,C.armorLight,C.green,C.armor,null,null],
    [null,C.darkGreen,C.green,C.green,C.green,C.green,C.gray,C.gray,C.green,C.green,C.green,C.green,C.darkGreen,null],
    [null,C.darkGreen,C.green,C.green,C.green,C.green,C.gray,C.gray,C.green,C.green,C.green,C.green,C.darkGreen,null],
    [null,null,C.armor,C.green,C.green,C.green,C.green,C.green,C.green,C.green,C.green,C.armor,null,null],
    [null,null,null,C.armor,C.green,C.green,C.green,C.green,C.green,C.green,C.armor,null,null,null],
    [null,null,null,null,C.darkGreen,C.green,null,null,C.green,C.darkGreen,null,null,null,null],
    [null,null,null,null,C.darkGreen,C.green,null,null,C.green,C.darkGreen,null,null,null,null],
    [null,null,null,C.darkGreen,C.green,C.green,null,null,C.green,C.green,C.darkGreen,null,null,null],
    [null,null,null,C.darkGray,C.armor,C.armor,null,null,C.armor,C.armor,C.darkGray,null,null,null],
    [null,null,null,C.darkGray,C.darkGray,C.darkGray,null,null,C.darkGray,C.darkGray,C.darkGray,null,null,null],
];

// 12x12 Grunt
export const GRUNT = [
    [null,null,null,null,C.gruntTank,C.gruntTank,C.gruntTank,C.gruntTank,null,null,null,null],
    [null,null,null,C.gruntTank,C.gruntTank,C.gruntTank,C.gruntTank,C.gruntTank,C.gruntTank,null,null,null],
    [null,null,C.gruntDark,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntDark,null,null],
    [null,C.gruntDark,C.gruntBody,C.gruntMask,C.gruntMask,C.gruntBody,C.gruntBody,C.gruntMask,C.gruntMask,C.gruntBody,C.gruntDark,null],
    [null,C.gruntDark,C.gruntBody,C.gruntMask,C.black,C.gruntBody,C.gruntBody,C.black,C.gruntMask,C.gruntBody,C.gruntDark,null],
    [null,null,C.gruntDark,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntDark,null,null],
    [null,null,null,C.gruntBody,C.gruntDark,C.gruntDark,C.gruntDark,C.gruntDark,C.gruntBody,null,null,null],
    [null,null,C.gruntDark,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntDark,null,null],
    [null,null,C.gruntDark,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntBody,C.gruntDark,null,null],
    [null,null,null,C.gruntDark,C.gruntBody,null,null,C.gruntBody,C.gruntDark,null,null,null],
    [null,null,null,C.gruntDark,C.gruntBody,null,null,C.gruntBody,C.gruntDark,null,null,null],
    [null,null,null,C.gruntDark,C.gruntDark,null,null,C.gruntDark,C.gruntDark,null,null,null],
];

// 14x14 Elite
export const ELITE = [
    [null,null,null,null,null,C.eliteDark,C.eliteDark,C.eliteDark,C.eliteDark,null,null,null,null,null],
    [null,null,null,null,C.eliteDark,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteDark,null,null,null,null],
    [null,null,null,C.eliteDark,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteDark,null,null,null],
    [null,null,null,C.eliteDark,C.eliteLight,C.black,C.eliteBody,C.eliteBody,C.black,C.eliteLight,C.eliteDark,null,null,null],
    [null,null,null,null,C.eliteDark,C.eliteBody,C.eliteJaw,C.eliteJaw,C.eliteBody,C.eliteDark,null,null,null,null],
    [null,null,null,null,null,C.eliteDark,C.eliteJaw,C.eliteJaw,C.eliteDark,null,null,null,null,null],
    [null,null,null,C.eliteDark,C.eliteBody,C.eliteLight,C.eliteBody,C.eliteBody,C.eliteLight,C.eliteBody,C.eliteDark,null,null,null],
    [null,null,C.eliteDark,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteDark,null,null],
    [null,C.eliteDark,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteLight,C.eliteDark,C.eliteDark,C.eliteLight,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteDark,null],
    [null,null,C.eliteDark,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteDark,null,null],
    [null,null,null,C.eliteDark,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteBody,C.eliteDark,null,null,null],
    [null,null,null,null,C.eliteDark,C.eliteBody,null,null,C.eliteBody,C.eliteDark,null,null,null,null],
    [null,null,null,null,C.eliteDark,C.eliteBody,null,null,C.eliteBody,C.eliteDark,null,null,null,null],
    [null,null,null,C.eliteDark,C.eliteDark,C.eliteDark,null,null,C.eliteDark,C.eliteDark,C.eliteDark,null,null,null],
];

// 12x14 Jackal
export const JACKAL = [
    [null,null,null,null,C.jackalDark,C.jackalDark,C.jackalDark,C.jackalDark,null,null,null,null],
    [null,null,null,C.jackalDark,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalDark,null,null,null],
    [null,null,C.jackalDark,C.jackalBody,C.black,C.jackalBody,C.jackalBody,C.black,C.jackalBody,C.jackalDark,null,null],
    [null,null,C.jackalDark,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalDark,null,null],
    [null,null,null,C.jackalDark,C.jackalBody,C.jackalDark,C.jackalDark,C.jackalBody,C.jackalDark,null,null,null],
    [C.jackalShield,C.jackalShieldDark,C.jackalDark,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalDark,null,null],
    [C.jackalShield,C.jackalShield,C.jackalShieldDark,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalDark,null,null],
    [C.jackalShield,C.jackalShield,C.jackalShieldDark,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalDark,null,null],
    [C.jackalShield,C.jackalShieldDark,C.jackalDark,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalDark,null,null],
    [null,null,C.jackalDark,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalDark,null,null],
    [null,null,null,C.jackalDark,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalBody,C.jackalDark,null,null,null],
    [null,null,null,null,C.jackalDark,C.jackalBody,C.jackalBody,C.jackalDark,null,null,null,null],
    [null,null,null,null,C.jackalDark,C.jackalBody,C.jackalBody,C.jackalDark,null,null,null,null],
    [null,null,null,C.jackalDark,C.jackalDark,null,null,C.jackalDark,C.jackalDark,null,null,null],
];

// 16x16 Hunter
export const HUNTER = [
    [null,null,null,null,null,C.hunterDark,C.hunterDark,C.hunterDark,C.hunterDark,C.hunterDark,C.hunterDark,null,null,null,null,null],
    [null,null,null,null,C.hunterDark,C.hunterArmor,C.hunterArmor,C.hunterArmor,C.hunterArmor,C.hunterArmor,C.hunterArmor,C.hunterDark,null,null,null,null],
    [null,null,null,C.hunterDark,C.hunterArmor,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterArmor,C.hunterDark,null,null,null],
    [null,null,null,C.hunterDark,C.hunterArmor,C.hunterOrange,C.hunterOrange,C.hunterBody,C.hunterBody,C.hunterOrange,C.hunterOrange,C.hunterArmor,C.hunterDark,null,null,null],
    [null,null,null,C.hunterDark,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterDark,null,null,null],
    [null,null,C.hunterDark,C.hunterArmor,C.hunterArmor,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterArmor,C.hunterArmor,C.hunterDark,null,null],
    [null,C.hunterDark,C.hunterArmor,C.hunterArmor,C.hunterBody,C.hunterBody,C.hunterOrange,C.hunterOrange,C.hunterOrange,C.hunterOrange,C.hunterBody,C.hunterBody,C.hunterArmor,C.hunterArmor,C.hunterDark,null],
    [null,C.hunterDark,C.hunterArmor,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterOrange,C.hunterOrange,C.hunterOrange,C.hunterOrange,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterArmor,C.hunterDark,null],
    [C.hunterDark,C.hunterArmor,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterArmor,C.hunterDark],
    [C.hunterDark,C.hunterArmor,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterArmor,C.hunterDark],
    [null,C.hunterDark,C.hunterArmor,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterArmor,C.hunterDark,null],
    [null,null,C.hunterDark,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterDark,null,null],
    [null,null,null,C.hunterDark,C.hunterBody,C.hunterBody,C.hunterBody,null,null,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterDark,null,null,null],
    [null,null,null,C.hunterDark,C.hunterBody,C.hunterBody,C.hunterBody,null,null,C.hunterBody,C.hunterBody,C.hunterBody,C.hunterDark,null,null,null],
    [null,null,C.hunterDark,C.hunterArmor,C.hunterArmor,C.hunterBody,null,null,null,null,C.hunterBody,C.hunterArmor,C.hunterArmor,C.hunterDark,null,null],
    [null,null,C.hunterDark,C.hunterDark,C.hunterDark,C.hunterDark,null,null,null,null,C.hunterDark,C.hunterDark,C.hunterDark,C.hunterDark,null,null],
];

export const SPRITE_DATA = {
    spartan: SPARTAN_RIGHT,
    grunt: GRUNT,
    elite: ELITE,
    jackal: JACKAL,
    hunter: HUNTER,
};
