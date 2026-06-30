"use client"
import Header from "@/components/shared/dashboardHeader";
import SideNav from "@/components/shared/dashboardSideNav";
import { SideNavMenuProps } from "@/types/sideNavTypes";
import { Dashboard, LocalShipping, PeopleAlt, AccountBalanceWallet, Store } from '@mui/icons-material';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


const Layout = ({ children }: {
    children: React.ReactNode;
}) => {
    const [toggleNav, setToggleNav] = useState(false)

    const base_url = '/dashboard'

    const SideNavOpts: SideNavMenuProps[] = [
        {
            icon: Dashboard,
            title: "Overview",
            isAvailable: true,
            url: `${base_url}`,
        },
        {
            icon: LocalShipping,
            title: "Orders",
            isAvailable: true,
            url: `${base_url}/orders`,
        },
        {
            icon: PeopleAlt,
            title: "Riders",
            isAvailable: true,
            url: `${base_url}/riders`,
        },
        {
            icon: AccountBalanceWallet,
            title: "Payout",
            isAvailable: true,
            url: `${base_url}/payout`,
        },
        {
            icon: Store,
            title: "Storefront",
            isAvailable: true,
            url: `${base_url}/storefront`,
        }
    ]

    const toggleFunc = (value?: boolean) => {
        if (typeof value === "boolean") {
            setToggleNav(value);
        } else {
            setToggleNav(prev => !prev);
        }
    };

    const closeNav = () => {
        setToggleNav(false)
    }

    return (
        <div className="relative w-screen flex overflow-x-clip lg:grid lg:grid-cols-[230px_calc(100%-230px)] lg:overflow-y-hidden xl:grid-cols-[250px_calc(100%-250px)]">

            {/* Desktop Sidenav */}
            <div className="h-screen sticky top-0 bottom-0 left-0 hidden lg:block">
                <SideNav list={SideNavOpts} closeNav={closeNav} />
            </div>

            {/* Mobile Sidenav */}
            <AnimatePresence>
                {toggleNav && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/40 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => toggleFunc(false)}
                        />
                        <motion.div className="h-screen fixed z-50 shrink-0 top-0 bottom-0 right-0 overflow-y-auto w-70"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.12)" }}
                            transition={{
                                type: "spring",
                                stiffness: 220,
                                damping: 21,
                                mass: 1
                            }}
                        >
                            <SideNav list={SideNavOpts} closeNav={closeNav} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="relative w-full lg:overflow-y-auto lg:h-screen">
                {/* Dashboard header */}
                <section className="fixed w-full z-30 top-0 left-0 right-0 lg:sticky ">
                    <Header toggleMenu={toggleFunc} />
                </section>

                {/* Page Area */}
                <section className="m-[100px_0px] lg:m-[0px_0px]">
                    {children}
                </section>
            </main>
        </div>
    );
}

export default Layout;
