import { motion } from 'framer-motion';
import { AppScreen } from './AppScreen';
import { useHeaderAnimation, useBodyAnimation } from '../hooks/useAnimations';
import { CustomAnimationProps } from '../types';

const MotionAppScreenHeader = motion(AppScreen.Header);
const MotionAppScreenBody = motion(AppScreen.Body);

export function InviteScreen({ animated, custom }: { animated?: boolean; custom?: CustomAnimationProps }) {
    const headerAnimation = useHeaderAnimation();
    const bodyAnimation = useBodyAnimation();

    return (
        <AppScreen className="w-full">
            <MotionAppScreenHeader {...(animated ? headerAnimation : {})}>
                <AppScreen.Title>Elegí tu Plan de Financiación</AppScreen.Title>
                <AppScreen.Subtitle>
                    Accedé a tu hogar{' '}
                    <span className="text-white">sin abonar la totalidad</span> del
                    inmueble.
                </AppScreen.Subtitle>
            </MotionAppScreenHeader>
            <MotionAppScreenBody
                {...(animated ? { ...bodyAnimation, custom } : {})}
            >
                {/* ... (rest of the InviteScreen content) ... */}
            </MotionAppScreenBody>
        </AppScreen>
    );
}

export function StocksScreen({ animated, custom }: { animated?: boolean; custom?: CustomAnimationProps }) {
    const headerAnimation = useHeaderAnimation();
    const bodyAnimation = useBodyAnimation();

    return (
        <AppScreen className="w-full">
            <MotionAppScreenHeader {...(animated ? headerAnimation : {})}>
                <AppScreen.Title>Invertí en materiales de Calidad</AppScreen.Title>
                <AppScreen.Subtitle>
                    Garantizamos lo mejor para tu hogar
                </AppScreen.Subtitle>
            </MotionAppScreenHeader>
            <MotionAppScreenBody
                {...(animated ? { ...bodyAnimation, custom } : {})}
            >
                <img src="/images/construccion.webp" alt="Construcción" />
            </MotionAppScreenBody>
        </AppScreen>
    );
}

export function InvestScreen({ animated, custom }: { animated?: boolean; custom?: CustomAnimationProps }) {
    const headerAnimation = useHeaderAnimation();
    const bodyAnimation = useBodyAnimation();

    return (
        <AppScreen className="w-full">
            <MotionAppScreenHeader {...(animated ? headerAnimation : {})}>
                <AppScreen.Title>Comprar metros cuadrados</AppScreen.Title>
                <AppScreen.Subtitle>
                    <span className="text-white">U$S1000</span> por metro
                </AppScreen.Subtitle>
            </MotionAppScreenHeader>
            <MotionAppScreenBody
                {...(animated ? { ...bodyAnimation, custom } : {})}
            >
                {/* ... (rest of the InvestScreen content) ... */}
            </MotionAppScreenBody>
        </AppScreen>
    );
}

