export interface MenuItem {
  id: number;
  icon: string;
  name: string;
  title: string;
  type: string;
  url: string;
  children: MenuItem[];
}
