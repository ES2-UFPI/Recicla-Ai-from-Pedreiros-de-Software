export interface History {
    id: number;
    date: string;
    collectionPoint: string;
    producer: string;
    collector: string | null;
    receiver: string | null;
    status?: 'Entregue' | 'Pendente' | 'Cancelada';
}