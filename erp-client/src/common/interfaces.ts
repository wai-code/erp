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
  address?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  other?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  operator?: string | null;
}

export interface Customer {
  id: number;
  name: string;
  address?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
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
  type?: ProductType,
  product_id?: number;
  unit_price?: number;
  purchase_quantity?: number;
  plan_quantity?: number;
  arrival_quantity?: number;
  loss_quantity?: number;
  pass_rate?: number;
  order_date?: Date;
  plan_arrival_date?: Date;
  last_arrival_date?: Date;
  purchase_cycle?: number;
  shipping_method?: string
  shipping_cost?: number;
  other_cost?: number;
  is_completed?: boolean
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  operator?: string;
  arrivalPlans: PurchaseArrivalPlan[];
}

export interface PurchaseArrivalPlan {
  id?: number;
  purchase_id?: number;
  plan_quantity: number;
  plan_date: Date | null;
  is_completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
  operator?: string;
}

export interface Stock {
  id: number;
  product_id: number;
  stock_quantity: number;
  updated_at: string | null;
}