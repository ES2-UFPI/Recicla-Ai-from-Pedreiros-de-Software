import { Offer } from '@/types/offer';
import { PackageComponent } from '@/types/packageComponent';

type BackendOffer = {
  id?: number;
  package_id?: number;
  package?: any;
  status?: string;
  created_at?: string;
  date?: string;
  user_id?: number;
  creator?: string;
  address_collection_point?: string | null;
  collection_point?: string | null;
  [key: string]: any;
};

/**
 * Normaliza um array de objetos vindos do backend para o formato `Offer` usado no front-end.
 * - Converte strings de data para `Date`
 * - Normaliza status para: 'pending' | 'accepted' | 'rejected'
 * - Cria um `PackageComponent` básico quando necessário (usa `Pacote #<id>` quando não houver nome)
 * - Preenche `creator` a partir de `creator` ou `user_id` quando disponível
 */
export function mapBackendOffers(data: BackendOffer[] = []): Offer[] {
  return data.map((b) => {
    // Data
    const rawDate = b.created_at ?? b.date ?? null;
    const date = rawDate ? new Date(String(rawDate)) : new Date();

    // Status normalization
    const statusRaw = String(b.status ?? '').toLowerCase();
    let status: Offer['status'] = 'pending';
    if (statusRaw === 'accepted' || statusRaw === 'aceita' || statusRaw === 'accept') status = 'accepted';
    else if (statusRaw === 'rejected' || statusRaw === 'rejeitada' || statusRaw === 'reject') status = 'rejected';

    // Creator fallback
    const creator = b.creator ?? (b.user_id ? `Usuário ${b.user_id}` : 'Remetente desconhecido');

    // Collection point
    const collection_point = (b.address_collection_point ?? b.collection_point) ?? undefined;

    // Package: try to reuse information; create a minimal PackageComponent when needed
    const pkgObj = b.package ?? null;
    const pkgId = pkgObj?.id ?? b.package_id ?? undefined;
    const pkgName = pkgObj?.name ?? pkgObj?.nome ?? (pkgId ? `Pacote #${pkgId}` : `Pacote`);
    const pkgComp = new PackageComponent(String(pkgName));
    if (pkgId !== undefined) {
      // PackageComponent expects numeric id
      const idNum = Number(pkgId);
      if (!Number.isNaN(idNum)) pkgComp.setId(idNum);
    }

    return {
      creator: String(creator),
      date,
      status,
      package: pkgComp,
      collection_point,
    } as Offer;
  });
}

export default mapBackendOffers;
