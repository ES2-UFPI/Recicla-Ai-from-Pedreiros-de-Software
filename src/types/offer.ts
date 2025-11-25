import { PackageComponent } from "./packageComponent";

export interface Offer {
    creator: string;
    date: Date;
    status: 'pending' | 'accepted' | 'rejected';
    package: PackageComponent;
    collection_point: string | undefined;
}