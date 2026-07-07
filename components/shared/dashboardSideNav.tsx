import { cn, muiOpts, generateGradient } from "@/lib/utils";
import {
	LayoutDashboard,
	LucideIcon,
	MessageCircleQuestionMark,
	LogOut,
} from "lucide-react";
import { title } from "process";
import { ReactNode } from "react";
import { NavOptionProps, SideNavProps } from "@/types/sideNavTypes";
import { ContactSupport, Help, Logout } from "@mui/icons-material";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clearAccessTokenCookie } from "@/lib/auth-cookie";
import {
	clearSignupSetupEmail,
	clearSignupSetupTempToken,
} from "@/lib/setup-session";
import { clearUserSession, useUserSession } from "@/lib/user-session";

const isActiveRoute = (pathname: string, path: string) => {
	if (path === "/dashboard") return pathname === "/dashboard";
	return pathname === path || pathname.startsWith(path + "/");
};

const SideNavOption = ({ optionData, clickHandler }: NavOptionProps) => {
	const pathname = usePathname();
	const Icon = optionData.icon;
	const isActive = optionData.url
		? isActiveRoute(pathname, optionData.url ?? "")
		: false;

	return (
		<div onClick={() => clickHandler(optionData.onclick)}>
			<Link
				key={optionData.url}
				href={optionData.url ?? "#"}
				className={`flex gap-2.5 items-center cursor-pointer p-[10px_20px] rounded-2xl  transition duration-300 ease-in. 
        ${!optionData.isAvailable ? "opacity-50" : `hover:bg-muted-alternative ${isActive ? "bg-alternative" : ""} `}
        `}
			>
				<Icon sx={{ color: "var(--muted-foreground)" }} />
				<div className="text-muted-foreground text-[15px] font-medium">
					{optionData.title}
				</div>
			</Link>
		</div>
	);
};

const SideNav = ({ list, closeNav }: SideNavProps) => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const userSession = useUserSession();

	const clickHandler = (clickFunc?: () => void) => {
		if (clickFunc) {
			clickFunc();
		}

		closeNav();
	};

	const handleLogout = () => {
		clearAccessTokenCookie();
		clearSignupSetupEmail();
		clearSignupSetupTempToken();
		clearUserSession();
		queryClient.clear();
		router.push("/login");
	};

	return (
		<div
			className={cn(
				"w-full h-full bg-sidebar-primary-foreground  p-6 flex flex-col border-l-[0.5px] border-l-border lg:border-r-[0.5px] lg:border-r-border",
			)}
		>
			<div className="flex-col gap-0.5 hidden lg:flex">
				<div className="h-10 w-30 bg-left bg-contain bg-no-repeat bg-[url('/assets/logo.png')]"></div>
				<div className="text-sm text-muted-foreground">
					Management portal
				</div>
			</div>

			<div className="flex flex-col gap-4 lg:hidden">
				<div className="flex gap-3 items-center">
					<div
						className="h-10 w-10 rounded-full border-border border-2"
						style={{
							background: generateGradient(
								userSession?.email ||
									userSession?.businessName ||
									"guest",
							),
						}}
					></div>

					<div className="flex-col flex">
						<div className="text-sm font-semibold">
							{userSession?.businessName || "Business Dashboard"}
						</div>
						<div className="text-muted-foreground text-xs text-left">
							Admin Dashboard
						</div>
					</div>

					<div className="cursor-pointer hover:opacity-50 transition duration-300 ease-in ml-auto">
						<Help sx={muiOpts("var(--muted-foreground)")} />
					</div>
				</div>
			</div>

			<div className="mt-14 flex flex-col gap-2.5">
				{list.map((data, id) => (
					<div onClick={() => clickHandler()} key={id}>
						<SideNavOption
							clickHandler={clickHandler}
							index={id}
							optionData={data}
						/>
					</div>
				))}
			</div>

			<div className="border-t border-t-border flex flex-col mt-auto mb-1.5 p-[15px_0]">
				<SideNavOption
					key={list.length + 1}
					index={list.length + 1}
					clickHandler={clickHandler}
					optionData={{
						icon: ContactSupport,
						title: "Support",
						isAvailable: true,
						url: null,
					}}
				/>

				<SideNavOption
					key={list.length + 2}
					index={list.length + 2}
					clickHandler={clickHandler}
					optionData={{
						icon: Logout,
						title: "Log Out",
						isAvailable: true,
						url: null,
						onclick: handleLogout,
					}}
				/>
			</div>
		</div>
	);
};

export default SideNav;
