import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export const flyAndScale = (
	node,
	params = { y: -8, x: 0, start: 0.95, duration: 150 }
) => {
	const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;

	const scaleConversion = (valueA, scaleA, scaleB) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style) => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, "");
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function isBright(hex, threshold = 186) {
    // if (hex === '#ff') {
    //   return true
    // }

    // Expand shorthand hex (#abc → #aabbcc)
    let normalized = hex.replace(/^#/, '');
    if (normalized.length === 3) {
      normalized = normalized.split('').map(c => c + c).join('');
    }

    const r = parseInt(normalized.substring(0, 2), 16);
    const g = parseInt(normalized.substring(2, 4), 16);
    const b = parseInt(normalized.substring(4, 6), 16);

    // Perceived brightness formula (ITU-R BT.601)
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

    return brightness > threshold;
}

export function colorVariants(hex) {
    const { h, s, l } = hexToHsl(hex);

    const variants = [
        hslToHex(h, clamp(s - 3, 0, 100), clamp(l - 12, 0, 100)),
        hslToHex(h, s, l),
        hslToHex(h, clamp(s + 3, 0, 100), clamp(l + 12, 0, 100))
    ];

    return variants;
}

function hexToHsl(hex) {
    hex = hex.replace("#", "");

    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h *= 60;
    }

    return {
        h,
        s: s * 100,
        l: l * 100
    };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60)      [r, g, b] = [c, x, 0];
    else if (h < 120)[r, g, b] = [x, c, 0];
    else if (h < 180)[r, g, b] = [0, c, x];
    else if (h < 240)[r, g, b] = [0, x, c];
    else if (h < 300)[r, g, b] = [x, 0, c];
    else             [r, g, b] = [c, 0, x];

    const toHex = v =>
        Math.round((v + m) * 255)
            .toString(16)
            .padStart(2, "0");

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}