export interface NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  // accessControl:string;
  isSelected:boolean;
  children?: NavItem[];
}
