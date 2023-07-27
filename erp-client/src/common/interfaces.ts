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

type ProductType = "product" | "accessory"
export interface PurchaseOrderBase {
  id: number;
  order_id: string,
  type: ProductType,
  product_id: number;
  unit_price: number;
  purchase_quantity: number;
  plan_quantity: number;
  order_date: Date;
  plan_arrival_date: Date;

  arrival_quantity: number;
  loss_quantity: number;
  pass_rate: number;
  purchase_cycle: number;
  shipping_method: string
  shipping_cost: number;
  other_cost: number;
  is_completed: boolean
  description: string;
  created_at: Date;
  updated_at: Date;
}

