import { Notifications, Help } from "@mui/icons-material"
import { muiOpts } from "@/lib/utils"
import { usePathname } from "next/navigation"

const pageTitles: Record<string, string> = {
  "/dashboard/orders/create": "Create Order",
  "/dashboard/orders": "Orders",
  "/dashboard/riders": "Riders",
  "/dashboard/payout": "Payout",
  "/dashboard/storefront/branding": "Identity & Branding",
  "/dashboard/storefront/operations": "Operations",
  "/dashboard/storefront": "Settings",
  "/dashboard/complete-profile": "Complete Profile",
  "/dashboard": "Overview",
}

type HeaderProps ={
    toggleMenu: ()=>void
}

const Header = ({ toggleMenu }: HeaderProps) => {
    const pathname = usePathname()
    const currentTitle = Object.entries(pageTitles).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] || "Overview"

    const isOrderDetail = /^\/dashboard\/orders\/[^/]+$/.test(pathname) && !pathname.includes("/create")
    const orderId = isOrderDetail ? pathname.split("/").pop() : null

    return (
        <div className="w-full p-5 border-b-[0.5px] border-b-border flex items-center justify-between bg-popover lg:p-[15px_40px]">

            <div className="flex gap-2 items-center">
                <div className="h-10 w-20 bg-left bg-contain bg-no-repeat bg-[url('/assets/logo.png')] block lg:hidden" ></div>
                <div className="text-base font-semibold text-muted-foreground hidden lg:flex items-center gap-2">
                  <span className="text-muted-foreground/40">/</span>
                  <span>{currentTitle}</span>
                  {orderId && (
                    <>
                      <span className="text-muted-foreground/40">/</span>
                      <span className="text-foreground font-bold">{orderId}</span>
                    </>
                  )}
                </div>
            </div>


            <div className="flex items-center gap-2.5">


                <div className="relative cursor-pointer hover:opacity-50 transition duration-300 ease-in">
                    <div className="absolute h-1 w-1 rounded-full bg-destructive top-0 right-0"></div>
                    <Notifications sx={muiOpts('var(--muted-foreground)')} />
                </div>

                <div className="cursor-pointer hover:opacity-50 transition duration-300 ease-in hidden lg:block">
                    <Help sx={muiOpts('var(--muted-foreground)')} />
                </div> 



                <div className="flex border-l-border lg:border-l  items-center gap-4 pl-2">

                    <div className="hidden flex-col lg:flex">
                        <div className="text-sm font-semibold">Speedex Couriers</div>
                        <div className="text-muted-foreground text-xs text-right">Business Dashboard</div>
                    </div>

                    {/* <Button size={'sm'} className="hidden lg:block">Complete Profile</Button> */}

                    <div className="h-10 w-10 rounded-full border-border border-2"></div>

                    <div className="flex flex-col gap-1.25 items-end w-6 cursor-pointer transition duration-75 hover:opacity-70 lg:hidden" onClick={toggleMenu}>
                        <div className="w-[70%] h-0.75  bg-secondary rounded-tl-[10px] rounded-bl-[10px]"></div>
                        <div className="w-full h-0.75 bg-secondary rounded-tl-[10px] rounded-bl-[10px]"></div>
                        <div className="w-[70%] h-0.75 bg-secondary rounded-tl-[10px] rounded-bl-[10px]"></div>
                    </div>

                </div>





            </div>



        </div>
    )
}

export default Header