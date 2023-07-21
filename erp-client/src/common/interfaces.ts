export interface Resource {
  id: number;
  name: string;
  title: string;
  icon: string;
  type: string;
  url: string;
  children: Resource[];
}
