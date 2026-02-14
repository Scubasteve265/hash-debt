// Difficulty scaling per day

export const BASE_CONFIG = {
    baseSpeed: 0.025,
    maxSpeed: 0.15,
    targetSize: 0.12,       // 12% of circle
    minTargetSize: 0.06,    // 6% minimum
    hitsNeeded: 5,
    maxHitsNeeded: 12,
    hashChance: 0.4,        // 40% chance of valid hash
    minHashChance: 0.2,     // 20% minimum
    baseEarnings: 10,
    interestRate: 1.15      // 15% increase per day for shark demands
};

export function getDifficultyForDay(day) {
    const config = { ...BASE_CONFIG };

    // Speed increases each day
    config.speed = Math.min(
        config.maxSpeed,
        config.baseSpeed + (day - 1) * 0.003
    );

    // Target shrinks each day
    config.targetSize = Math.max(
        config.minTargetSize,
        BASE_CONFIG.targetSize - (day - 1) * 0.005
    );

    // More hits needed per block
    config.hitsNeeded = Math.min(
        config.maxHitsNeeded,
        BASE_CONFIG.hitsNeeded + Math.floor(day / 2)
    );

    // Hash chance decreases
    config.hashChance = Math.max(
        config.minHashChance,
        BASE_CONFIG.hashChance - (day - 1) * 0.015
    );

    return config;
}

export function applySharkModifiers(config, sharks) {
    let speed = config.speed;
    let multiplier = 1;

    sharks.forEach(shark => {
        speed *= shark.speedBoost;
        multiplier *= shark.multiplier;
    });

    return {
        ...config,
        speed: Math.min(speed, BASE_CONFIG.maxSpeed),
        multiplier
    };
}

export function calculateSharkDemand(baseDemand, day) {
    return Math.ceil(baseDemand * Math.pow(BASE_CONFIG.interestRate, day - 1));
}
