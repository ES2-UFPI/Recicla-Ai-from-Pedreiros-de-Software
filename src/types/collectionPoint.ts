export interface CollectionPoint {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    createdAt: Date;
    distance?: number; // distância em km da localização atual
}