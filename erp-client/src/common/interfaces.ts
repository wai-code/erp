export interface Resource {
  id: number;
  name: string;
  label: string;
  icon?: string;
  type: string;
  url: string;
  children: Resource[];
}

export interface Supplier {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  source?: string | null;
  address?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  other?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  operator?: string | null;
}

export interface Product {
  id: number;
  name: string;
  model: string;
  standard: string;
  supplier_name: string;
  purchase_price: number;
  sales_price: number;
  operator?: string | null;
}

