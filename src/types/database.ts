// Revisar as regras do update depois de pensar sobre as regras de negocio melhor
//request_item: {
  //package_id: number,
// request : {
  //package_id: number,

export interface Database {
  public: {
    Tables: {
      users: {
        row: {
          id: number;
          name: string;
          email: string;
          cpf: string;
          sex: 'M' | 'F' | null;
          account_type: 'producer' | 'receptor' | 'collector';
          excluded: number | null;
          created_at: string;
        };
        insert: {
          auth_user_id?: string | null;
          name: string;
          email: string;
          cpf: string;
          sex: 'M' | 'F' | null;
          account_type: 'producer' | 'receptor' | 'collector';
          excluded: number | null;
        };
        update: {
          auth_user_id?: string | null;
          name?: string;
          email?: string;
          cpf?: string;
          sex?: 'M' | 'F' | null;
          account_type?: 'producer' | 'receptor' | 'collector';
          excluded?: number | null;
        };
      };
      collect_point: {
        row: {
          id: number;
          owner_id: number;
          name: string;
          description: string;
          residue_type: string | null;
          cordinates: string;
          is_open: boolean;
          excluded: number | null;
          created_at: string;
        };
        insert: {
          owner_id: number;
          name: string;
          description: string;
          residue_type: string | null;
          cordinates: string;
          is_open: boolean;
          excluded: number | null;
        };
        update: {
          owner_id?: number;
          name?: string;
          description?: string;
          residue_type?: string | null;
          cordinates?: string;
          is_open?: boolean;
          excluded: number | null;
        };
      };
      delivery: {
        row: {
          id: number;
          collect_point_id: number;
          owner_id: number;
          receptor_id: number;
          courier_id: number;
          message: string;
          status: string;
          excluded: number | null;
          request_id: number;
          created_at: string;
        };
        insert: {
          collect_point_id: number;
          owner_id: number;
          receptor_id: number;
          courier_id: number;
          message: string;
          status: string;
          excluded: number | null;
          request_id: number;
        };
        update: {
          collect_point_id?: number;
          owner_id?: number;
          receptor_id?: number;
          courier_id?: number;
          message?: string;
          status?: string;
          excluded?: number | null;
          request_id?: number;
        };
      };
      item: {
        row: {
          id: number;
          name: string;
          value: number;
          weight: number;
          excluded: number | null;
          created_at: string;
        };
        insert: {
          name: string;
          value: number;
          weight: number;
          excluded: number | null;
        };
        update: {
          name?: string;
          value?: number;
          weight?: number;
          excluded?: number | null;
        };
      };
      request: {
        row: {
          id: number;
          owner_id: number;
          collect_point_id: number;
          item_request_id: number;
          courier_id: number;
          created_at: string;
        };
        insert: {
          owner_id: number;
          collect_point_id: number;
          item_request_id: number;
          courier_id: number;
          excluded: number | null;
        };
        update: {
          owner_id?: number;
          collect_point_id?: number;
          item_request_id?: number;
          courier_id?: number;
          excluded?: number | null;
        };
      };
      request_item: {
        row: {
          id: number;
          item_id: number;
          request_id: number;
          excluded: number | null;
          created_at: string;
        };
        insert: {
          item_id: number;
          request_id: number;
          excluded: number | null;
        };
        update: {
          item_id?: number;
          request_id?: number;
          excluded?: number | null;
        };
      };
      user_item: {
        row: {
          id: number;
          user_id: number;
          item_id: number;
          quantity: number;
          created_at: string;
          excluded: number | null;
        };
        insert: {
          user_id: number;
          item_id: number;
          quantity: number;
          excluded: number | null;
        };
        update: {
          user_id?: number;
          item_id?: number;
          quantity?: number;
          excluded?: number | null;
        };
      };
    };
    package: {
      row: {
        id: number;
        user_id: number
        created_at: string;
        excluded: number | null;
      };
      insert: {
        excluded: number | null;
      };
      update: {
        excluded?: number | null;
      };
    }
    package_items: {
      row: {
        id: number,
        item_id: number,
        package_id: number,
        excluded: number,
        created_at: string
      }
      insert: { 
        item_id: number,
        package_id: number,
        excluded: number,
      }
      update: {
        item_id?: number,
        package_id?: number,
        excluded?: number,
      }
    }

  };
}
