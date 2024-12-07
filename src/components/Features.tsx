"use client";
import { useState, useRef, useEffect } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDebouncedCallback } from 'use-debounce';
import clsx from 'clsx';

import { CircleBackground } from './CircleBackground';
import { Container } from './Container';
import { PhoneFrame } from './PhoneFrame';
import { features } from '../data/features';

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

function FeaturesDesktop() {
    const [changeCount, setChangeCount] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const prevIndex = usePrevious(selectedIndex);
    const isForwards = prevIndex === undefined ? true : selectedIndex > prevIndex;

    const onChange = useDebouncedCallback(
        (selectedIndex: number) => {
            setSelectedIndex(selectedIndex);
            setChangeCount((changeCount) => changeCount + 1);
        },
        100,
        { leading: true },
    );

    return (
        <TabGroup
            className="grid grid-cols-12 items-center gap-8 lg:gap-16 xl:gap-24"
            selectedIndex={selectedIndex}
            onChange={onChange}
            vertical
        >
            <TabList className="relative z-10 order-last col-span-6 space-y-6">
                {features.map((feature, featureIndex) => (
                    <div
                        key={feature.name}
                        className="relative rounded-2xl transition-colors hover:bg-gray-800/30"
                    >
                        {featureIndex === selectedIndex && (
                            <motion.div
                                layoutId="activeBackground"
                                className="absolute inset-0 bg-gray-800"
                                initial={{ borderRadius: 16 }}
                            />
                        )}
                        <div className="relative z-10 p-8">
                            <feature.icon className="h-8 w-8" />
                            <h3 className="mt-6 text-lg font-semibold text-white">
                                <Tab className="text-left ui-not-focus-visible:outline-none">
                                    <span className="absolute inset-0 rounded-2xl" />
                                    {feature.name}
                                </Tab>
                            </h3>
                            <p className="mt-2 text-sm text-gray-400">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </TabList>
            <div className="relative col-span-6">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <CircleBackground color="#13B5C8" className="animate-spin-slower" />
                </div>
                <PhoneFrame className="z-10 mx-auto w-full max-w-[366px]">
                    <TabPanels>
                        <AnimatePresence
                            initial={false}
                            custom={{ isForwards, changeCount }}
                        >
                            {features.map((feature, featureIndex) =>
                                selectedIndex === featureIndex ? (
                                    <TabPanel
                                        static
                                        key={feature.name + changeCount}
                                        className="col-start-1 row-start-1 flex focus:outline-offset-[32px] ui-not-focus-visible:outline-none"
                                    >
                                        <feature.screen
                                            animated
                                            custom={{ isForwards, changeCount }}
                                        />
                                    </TabPanel>
                                ) : null,
                            )}
                        </AnimatePresence>
                    </TabPanels>
                </PhoneFrame>
            </div>
        </TabGroup>
    );
}

function FeaturesMobile() {
    const [activeIndex, setActiveIndex] = useState(0);
    const slideContainerRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setActiveIndex(slideRefs.current.indexOf(entry.target as HTMLDivElement));
                        break;
                    }
                }
            },
            {
                root: slideContainerRef.current,
                threshold: 0.6,
            },
        );

        for (const slide of slideRefs.current) {
            if (slide) {
                observer.observe(slide);
            }
        }

        return () => {
            observer.disconnect();
        };
    }, [slideContainerRef, slideRefs]);

    return (
        <>
            <div
                ref={slideContainerRef}
                className="-mb-4 flex snap-x snap-mandatory -space-x-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-6 [&::-webkit-scrollbar]:hidden"
            >
                {features.map((feature, featureIndex) => (
                    <div
                        key={featureIndex}
                        ref={(ref) => ref && (slideRefs.current[featureIndex] = ref)}
                        className="w-full flex-none snap-center px-4 sm:px-6"
                    >
                        <div className="relative transform overflow-hidden rounded-2xl bg-gray-800 px-5 py-6">
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <CircleBackground
                                    color="#13B5C8"
                                    className={featureIndex % 2 === 1 ? 'rotate-180' : undefined}
                                />
                            </div>
                            <PhoneFrame className="relative mx-auto w-full max-w-[366px]">
                                <feature.screen />
                            </PhoneFrame>
                            <div className="absolute inset-x-0 bottom-0 bg-gray-800/95 p-6 backdrop-blur sm:p-10">
                                <feature.icon className="h-8 w-8" />
                                <h3 className="mt-6 text-sm font-semibold text-white sm:text-lg">
                                    {feature.name}
                                </h3>
                                <p className="mt-2 text-sm text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-center gap-3">
                {features.map((_, featureIndex) => (
                    <button
                        type="button"
                        key={featureIndex}
                        className={clsx(
                            'relative h-0.5 w-4 rounded-full',
                            featureIndex === activeIndex ? 'bg-gray-300' : 'bg-gray-500',
                        )}
                        aria-label={`Go to slide ${featureIndex + 1}`}
                        onClick={() => {
                            slideRefs.current[featureIndex].scrollIntoView({
                                block: 'nearest',
                                inline: 'nearest',
                            });
                        }}
                    >
                        <span className="absolute -inset-x-1.5 -inset-y-3" />
                    </button>
                ))}
            </div>
        </>
    );
}

export function PrimaryFeatures() {
    return (
        <section
            id="beneficios"
            aria-label="Features for investing all your money"
            className="bg-gray-900 py-20 sm:py-32"
        >
            <Container>
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
                    <h2 className="text-3xl font-medium tracking-tight text-white">
                        <span className="font-bold">Todos los beneficios</span> para tener
                        la vivienda que siempre soñaste.
                    </h2>
                    <p className="mt-2 text-lg text-gray-400">
                        <span className="font-bold">Sembrar</span> trabaja para personas
                        como vos, que buscan calidad y accesibilidad en su nuevo hogar. Te
                        ofrecemos soluciones a medida, nosotros lo hacemos posible.
                    </p>
                </div>
            </Container>
            <div className="mt-16 md:hidden">
                <FeaturesMobile />
            </div>
            <Container className="hidden md:mt-20 md:block">
                <FeaturesDesktop />
            </Container>
        </section>
    );
}

