import {animate} from "motion";
import {gsap} from "gsap";

export function fadeOut(node: HTMLElement, { duration = 1 } = {}, callback?: () => void) {
    gsap.to(node, {
        opacity: 0,
        duration: duration,
        ease: "power1.out",
        onComplete: callback
    });
}

export function fadeIn(node: HTMLElement, { duration = 1 } = {}, callback?: () => void) {
    gsap.fromTo(node, {
        opacity: 0
    }, {
        opacity: 1,
        duration: duration,
        ease: "power1.in",
        onComplete: callback
    });
}