"use client"
import MaterialIcon from "@/components/ui/material-icon";
import { Verified, ArrowForward,Bolt } from "@mui/icons-material";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type EachStepProps = {
    title: string;
    info: string;
    isDone: boolean;
    url?: string;
}

type StepElemProp = {
    stepData: EachStepProps,
    index: number
}

const steps: EachStepProps[] = [
    {
        title: "Email verified",
        info: "Your primary contact is secure",
        isDone: true
    },
    {
        title: "Business Details",
        info: "Registration and tax information",
        isDone: false,
        url: '/'
    },

    {
        title: "Operations Setup",
        info: "Define services zones and hours",
        isDone: false,
        url: '/'
    },

    {
        title: "Business Identity",
        info: "Logo, brand colors, and storefront info",
        isDone: false,
        url: '/'
    },

]



const EachStep = ({ stepData, index }: StepElemProp) => {
    return (
        <div key={index} className={`rounded-[10px] flex gap-4 md:gap-5 p-4 md:p-5 items-center cursor-pointer hover:bg-silver-two/40 transition ease-in duration-300 ${stepData.isDone && 'bg-muted/43 border-l-5 border-l-chart-5'}`}>

            <div className="shrink-0">

                {stepData.isDone ? (
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center bg-chart-5" style={{ boxShadow: "0px 2px 4px oklch(0.720 0.174 137)" }}>
                        <Check color="#fff" size={18} />
                    </div>
                ) : (
                    <div className="h-8 w-8 md:h-9 md:w-9 rounded-full flex items-center justify-center bg-silver-two border-3 border-border text-sm text-muted-foreground font-bold">
                        {index + 1 < 10 ? '0' : ''}{index + 1}
                    </div>
                )}

            </div>

            <div className="flex flex-col gap-0.5">
                <div className="font-bold text-base">{stepData.title}</div>
                <div className="font-medium text-muted-foreground text-sm">{stepData.info}</div>
            </div>


            <div className="ml-auto shrink-0">
                {stepData.isDone ? (
                    <Verified sx={{ fontSize: '25px', color: 'var(--secondary)' }} />) : (

                    <ArrowForward sx={{ fontSize: '25px', color: 'var(--silver-one)' }} />
                )}
            </div>

        </div>
    )
}



const CompleteSetup = () => {
    return (
        <div className="flex flex-col gap-10 h-full p-5 sm:p-8 md:p-10 lg:flex-row lg:items-center lg:justify-center lg:gap-7.5 2xl:gap-10">

            <div className="w-full flex flex-col gap-6 md:gap-8 lg:w-[43%] xl:w-[41%] 2xl:w-[40%]">

                <div className="w-fit flex bg-alternative p-[8px_12px] rounded-[20px] items-center gap-1">

                    <MaterialIcon name={"eco"} color="var(--muted-foreground)" size={18} />

                    <div className="text-xs text-muted-foreground uppercase font-bold">almost ready</div>

                </div>

                <div className="text-4xl md:text-[40px] font-bold text-primary lg:text-[33px] xl:text-[40px] 2xl:text-5xl">
                    Let's finish setting up your business.
                </div>

                <div className="text-base text-muted-foreground">You're just a few steps away from launching your storefront and managing riders.</div>

                <div className="flex gap-2.5 items-center lg:flex-col lg:items-start lg:gap-3.5 xl:flex-row xl:gap-2.5 xl:items-center">

                    <div className="flex items-center ">
                        <div className="h-12 w-12 rounded-full bg-foreground border-3 border-muted"></div>
                        <div className="h-12 w-12 rounded-full bg-foreground border-3 border-muted -ml-3"></div>
                        <div className="h-12 w-12 rounded-full bg-primary-light border-3 border-muted -ml-3 flex items-center justify-center">
                            <span className="text-[15px] font-bold text-primary pt-0.5">+12</span>
                        </div>
                    </div>

                    <div className="text-sm font-semibold text-muted-foreground">Join 2,000+ logistics businesses</div>


                </div>


            </div>

            <div className="w-full rounded-[25px] border-2 border-[#f3f3f39b] p-5 flex flex-col gap-8.5  lg:w-[57%] xl-[46%] 2xl:w-[40%]" style={{
                boxShadow: "3px -1px 17px 6px rgba(229,239,226,0.45)",
                // boxShadow: "3px -1px 194px 7px rgba(229,239,226,0.69)"
                // boxShadow: "3px -1px 33px 8px rgba(229,239,226,0.25);"
            }}>

                <div className="flex flex-col gap-1.5">

                    <div className="flex justify-between">
                        <span className="text-primary font-bold text-base">Setup Progress</span>
                        <span className="text-secondary font-bold text-base">25%</span>
                    </div>

                    <div className="relative bg-primary-light h-3 w-full rounded-[10px]">
                        <div className="absolute inset-0 w-[50%] bg-chart-5 rounded-[10px]" ></div>
                    </div>
                </div>


                <div className="flex flex-col gap-3">

                    {steps.map((data, i) => (
                        <EachStep key={i} index={i} stepData={data} />
                    ))}


                </div>

                
                    <Button
                    
                        className="p-6.25 text-base font-semibold rounded-xl w-full cursor-pointer"
                    >

                        <span>Continue Setup</span>

                        <Bolt sx={{ fontSize: '2px', fontWeight: 700, color: '#fff' }} />

                    </Button>
                






            </div>

        </div>
    )
}

export default CompleteSetup;