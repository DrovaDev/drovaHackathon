import { SvgIconProps } from "@mui/material/SvgIcon";


export type SideNavMenuProps = {
    icon: React.FC<SvgIconProps>;
    title: string;
    isAvailable: boolean;
    url: string | null;
    onclick?: () => void;
}

export type SideNavProps = {
    list: SideNavMenuProps[],
    closeNav: () => void
}

export type NavOptionProps = {
    optionData: SideNavMenuProps,
    index: number,
    clickHandler: (func?:()=>void)=>void
}