import { useMediaQuery } from "react-responsive";

export const useBreakpoints = () => {
    // Define media queries for PrimeReact breakpoints
    const isXs = useMediaQuery({ query: "(max-width: 575px)" });
    const isSm = useMediaQuery({ query: "(min-width: 576px) and (max-width: 767px)" });
    const isMd = useMediaQuery({ query: "(min-width: 768px) and (max-width: 991px)" });
    const isLg = useMediaQuery({ query: "(min-width: 992px) and (max-width: 1199px)" });
    const isXl = useMediaQuery({ query: "(min-width: 1200px)" });
    const mobile = useMediaQuery({ query: "(max-width: 767px)" });
    const desktop = useMediaQuery({ query: "(min-width: 992px)" });


    return (breakpoint: string) => {
        switch (breakpoint) {
            case "xs":
                return isXs;
            case "sm":
                return isSm;
            case "md":
                return isMd;
            case "lg":
                return isLg;
            case "xl":
                return isXl;
            case "mobile":
                return mobile;
            case "desktop":
                return desktop;
            default:
                return false;
        }
    };
};