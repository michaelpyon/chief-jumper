// === Canvas / Display ===
export const GAME_WIDTH = 375;

// === Physics ===
export const GRAVITY = 1800;
export const MAX_FALL_SPEED = 900;
export const HORIZONTAL_FRICTION = 0.92;
export const BOUNCE_VELOCITY = -850;
export const JUMPPAD_VELOCITY = -1100;

// === Player ===
export const PLAYER_WIDTH = 28;
export const PLAYER_HEIGHT = 32;
export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_INVULN_TIME = 1.0;
export const SHIELD_RECHARGE_DELAY = 3.0;
export const SHIELD_RECHARGE_RATE = 20;

// === Booster ===
export const BOOSTER_MAX_CHARGE = 1.5;
export const BOOSTER_MIN_IMPULSE_X = 200;
export const BOOSTER_MAX_IMPULSE_X = 800;
export const BOOSTER_VERTICAL_BOOST = -200;

// === Shooting ===
export const FIRE_RATE = 0.15;
export const BULLET_SPEED = 600;
export const BULLET_DAMAGE = 1;
export const BULLET_LIFETIME = 2.0;
export const BULLET_SIZE = 4;

// === Joystick ===
export const JOYSTICK_RADIUS = 60;
export const JOYSTICK_DEAD_ZONE = 10;

// === Platforms ===
export const PLATFORM_WIDTH = 70;
export const PLATFORM_HEIGHT = 12;
export const PLATFORM_MOVE_SPEED = 50;

// === Camera ===
export const CAMERA_LERP_SPEED = 4.0;
export const DEATH_BUFFER = 100;

// === Enemies ===
export const ENEMY_CONFIGS = {
    grunt: { health: 1, damage: 10, speed: 0, pattern: 'stationary', dropRate: 0.3, width: 24, height: 24 },
    elite: { health: 3, damage: 20, speed: 60, pattern: 'horizontal', dropRate: 0.5, width: 28, height: 28 },
    jackal: { health: 2, damage: 15, speed: 0, pattern: 'shooting', shootInterval: 2.0, dropRate: 0.4, width: 24, height: 28 },
    hunter: { health: 5, damage: 30, speed: 40, pattern: 'chasing', dropRate: 0.8, width: 32, height: 32 },
};

// === Health Orb ===
export const ORB_HEAL_AMOUNT = 15;
export const ORB_SIZE = 10;
export const ORB_LIFETIME = 8.0;
export const MAGNET_RADIUS = 120;
export const MAGNET_ACCEL = 800;
export const PICKUP_RADIUS = 20;

// === Level Generation ===
export const CHUNK_HEIGHT = 800;
export const BASE_PLATFORMS_PER_CHUNK = 7;
export const LEVEL_BASE_HEIGHT = 6000;
export const LEVEL_HEIGHT_INCREMENT = 1500;

// === Particles ===
export const MAX_PARTICLES = 200;

// === Corporate Ladder (job titles by level reached) ===
export const JOB_TITLES = [
    'Unpaid Intern',
    'Junior Associate',
    'Associate',
    'Senior Associate',
    'Manager',
    'Senior Manager',
    'Director',
    'VP',
    'SVP',
    'Chief of Staff',
    'Chief Executive Officer',
];

export function titleForLevel(level) {
    const index = Math.min(Math.max(level - 1, 0), JOB_TITLES.length - 1);
    return JOB_TITLES[index];
}

// === Colors ===
export const COLORS = {
    bg: '#0a0a1a',
    player: '#5b8c3e',
    playerVisor: '#f7a41d',
    platform: '#4a6741',
    platformEdge: '#6b8f5e',
    jumpPad: '#00ccff',
    bullet: '#ffcc00',
    enemyBullet: '#ff4444',
    healthOrb: '#44ff88',
    shield: '#3399ff',
    boostCharge: '#ff8800',
    grunt: '#ff6633',
    elite: '#8844cc',
    jackal: '#ccaa33',
    hunter: '#446688',
    star: '#ffffff',
};
