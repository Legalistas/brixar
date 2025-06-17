"use client";

import { useState, useEffect } from "react";
import Image from "next/image"
import useResize from "@/hooks/useResize";
import Link from "next/link";

interface HomeData {
    id: number
    title: string
    description: string
    image: string
    alt: string
    href: string
    linkTitle: string
}

export const InfoCard = ({ data }: { data: HomeData }) => {
    const { isMobile } = useResize();

    if (isMobile) {
        return (
            <div className="w-full max-w-[591px] bg-[#FB6107]/15 rounded-[30px] p-5 md:p-0 md:h-[286px] relative">
                <div className="flex flex-col md:flex-row bg-white rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden">
                    <div className="w-full md:w-[300px] h-[226px] relative">
                        <Image
                            src={data.image || "/placeholder.svg"}
                            alt={data.alt}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-[20px] md:rounded-[20px]"
                        />
                    </div>
                    <div className="p-5 md:w-[231px] flex flex-col justify-center items-center gap-2.5">
                        <div className="w-full max-w-[250px] text-center">
                            <h2
                                className="text-[#2f2b3d]/90 text-lg font-bold leading-7"
                                dangerouslySetInnerHTML={{ __html: data.title }}
                            />
                        </div>
                        <div
                            className="text-center text-[#2f2b3d] text-sm font-normal leading-tight"
                            dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                        {data.href && (
                            <Link
                                href={data.href}
                                className='w-[180px] h-[56px] flex items-center justify-center text-[18px] font-[300] bg-[#FB6107] text-white rounded-lg cursor-pointer hover:bg-[#09A4B5] mt-2'>
                                {data.linkTitle}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-[591px] h-[286px] relative">
            <div className="w-[290px] h-[286px] left-0 top-0 absolute bg-[#FB6107]/15 rounded-[30px]"></div>
            <div className="h-[246px] p-2.5 left-[20px] top-[19px] absolute bg-white rounded-[30px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] justify-start items-center gap-5 inline-flex">

                <img
                    className="w-[300px] h-[220px] relative rounded-[30px]"
                    src={data.image || "/placeholder.svg"}
                    alt={data.alt}
                />

                <div className="w-[231px] flex-col justify-start items-center gap-2.5 inline-flex">

                    <div className="self-stretch h-auto flex-col justify-start items-center gap-2.5 flex">
                        <div className={`w-[240px] justify-center items-center gap-2.5 inline-flex`}>
                            <div className="grow shrink basis-0 text-center text-[#2f2b3d]/90 text-md font-bold leading-7" dangerouslySetInnerHTML={{ __html: data.title }} />
                        </div>
                        <div
                            className="self-stretch text-center text-[#2f2b3d] text-[13px] font-normal leading-tight"
                            dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                    </div>

                    {data.href && (
                        <Link
                            href={data.href}
                            className='w-[180px] h-[35px] flex items-center justify-center text-[14px] font-[500] bg-[#FB6107] text-white rounded-lg cursor-pointer shadow-lg hover:bg-[#FB6107] mt-2 capitalize'>
                            {data.linkTitle}
                        </Link>
                    )}

                </div>
            </div>
        </div>
    )
}