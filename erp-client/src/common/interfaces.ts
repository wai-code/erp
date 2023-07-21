export interface Resource {
  id: number;
  name: string;
  label: string;
  icon: string;
  type: string;
  url: string;
  children: Resource[];
}
