// Shark definitions
// Each shark offers a loan with different risk/reward

export const SHARKS = [
    {
        id: 'vinnie',
        name: 'Vinnie',
        loanAmount: 50,
        multiplier: 1.5,
        speedBoost: 1.15,
        baseDemand: 20,
        personality: 'patient',
        description: 'Low risk, low reward. Good starter shark.'
    },
    {
        id: 'marco',
        name: 'Marco',
        loanAmount: 80,
        multiplier: 2.0,
        speedBoost: 1.25,
        baseDemand: 35,
        personality: 'volatile',
        description: 'Doubles your earnings, but demands grow fast.'
    },
    {
        id: 'bigtony',
        name: 'Big Tony',
        loanAmount: 120,
        multiplier: 2.5,
        speedBoost: 1.35,
        baseDemand: 55,
        personality: 'heavy',
        description: 'Big money, big problems.'
    },
    {
        id: 'butcher',
        name: 'The Butcher',
        loanAmount: 200,
        multiplier: 3.5,
        speedBoost: 1.5,
        baseDemand: 90,
        personality: 'ruthless',
        description: 'Massive multiplier. Don\'t miss payments.'
    },
    {
        id: 'knuckles',
        name: 'Knuckles',
        loanAmount: 300,
        multiplier: 5.0,
        speedBoost: 1.7,
        baseDemand: 150,
        personality: 'brutal',
        description: '5x earnings. The ring becomes a blur.'
    }
];

export function getSharkById(id) {
    return SHARKS.find(s => s.id === id);
}

export function getAvailableSharks(currentSharks) {
    const borrowed = currentSharks.map(s => s.id);
    return SHARKS.filter(s => !borrowed.includes(s.id));
}

export function getNextAvailableShark(currentSharks) {
    const available = getAvailableSharks(currentSharks);
    return available.length > 0 ? available[0] : null;
}
