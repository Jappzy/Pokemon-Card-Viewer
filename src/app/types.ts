export interface ApiResponse {
    count?: number;
    data: any[];
    page?: number;
    pageSize?: number;
    totalCount?: number;
}

export interface Card {
    artist?: string;
    attacks?: any[];
    cardmarket: TcgPlayer;
    convertedRetreatCost?: number;
    evolvesFrom: string | null | undefined;
    flavorText?: string;
    hp?: string;
    id: string;
    images: { small: string, large: string };
    legalities?: any;
    level?: string;
    name: string;
    nationalPokedexNumbers?: number[];
    number: string;
    rarity: string;
    resistances?: any[];
    retreatCost?: any[];
    set: Set;
    subtypes?: string[];
    supertype?: string;
    tcgplayer?: TcgPlayer;
    types?: string[];
    weaknesses?: any[];
}

export interface Set {
    id: string;
    images: { symbol: string, logo: string };
    legalities: any;
    name: string;
    printedTotal: number;
    ptcgoCode: string;
    releaseDate: string;
    series: string;
    total: number;
    updatedAt: string;
}

export interface TcgPlayer {
    prices: any;
    updatedAt: string;
    url: string;
}

export interface Theme {
    hex: string;
    rgb: string;
    shade: string;
    tint: string;
    label?: string;
}

export const Themes = {
    Ruby: { label: 'Ruby', hex: '#c43140', rgb: '196,49,64', shade: '#ac2b38', tint: '#ca4653' },
    Sapphire: { label: 'Sapphire', hex: '#3880ff', rgb: '56,128,255', shade: '#3171e0', tint: '#4c8dff' },
    Emerald: { label: 'Emerald', hex: '#125a2d', rgb: '18,90,45', shade: '#104f28', tint: '#2a6b42' },
    Firered: { label: 'Firered', hex: '#ff8533', rgb: '255,133,51', shade: '#e0752d', tint: '#ff9147' },
    Leafgreen: { label: 'Leafgreen', hex: '#43cb5a', rgb: '67,203,90', shade: '#3bb34f', tint: '#56d06b' },
}

export const RaritiesList = [
    'Promo',
    'Common',
    'Uncommon',
    'Rare',
    'Rare Holo',
    'Rare Holo EX',
    'Rare HOlo GX',
    'Rare Holo LV.X',
    'Rare Holo Star',
    'Rare ACE',
    'Rare BREAK',
    'Rare Prime',
    'Rare Prism Star',
    'Rare Holo V',
    'Rare Holo VMAX',
    'Rare Holo VSTAR',
    'Radiant Rare',
    'Rare Shining',
    'Rare Shiny',
    'Rare Shiny GX',
    'Rare Ultra',
    'Amazing Rare',
    'Rare Rainbow',
    'V',
    'VM',
    'Classic Collection',
    'LEGEND',
    'Rare Secret',
];
