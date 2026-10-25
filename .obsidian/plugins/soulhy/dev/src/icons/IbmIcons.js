/* IbmIcons — IBM Carbon–style SVG icons for Obsidian DOM (no React).
 * Paths adapted from @carbon/icons (Apache-2.0).
 */

const IbmIcons = {
    /** Append an inline SVG into parent. size in px. */
    mount(parent, name, { size = 16, className = '', viewBox } = {}) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
        const def = IbmIcons.PATHS[name];
        svg.setAttribute('viewBox', viewBox || def?.viewBox || '0 0 16 16');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
        if (className) svg.setAttribute('class', className);

        if (!def) return svg;

        if (def.d) {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', def.d);
            svg.appendChild(path);
        }
        if (Array.isArray(def.paths)) {
            def.paths.forEach((d) => {
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', d);
                svg.appendChild(path);
            });
        }
        parent.appendChild(svg);
        return svg;
    },

    PATHS: {
        // carbon: chevron--down
        chevronDown: {
            d: 'M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z'
        },
        // carbon: chevron--up
        chevronUp: {
            d: 'M8 5L13 10 12.3 10.7 8 6.4 3.7 10.7 3 10z'
        },
        // carbon: close
        close: {
            d: 'M12 4.7L11.3 4 8 7.3 4.7 4 4 4.7 7.3 8 4 11.3 4.7 12 8 8.7 11.3 12 12 11.3 8.7 8z'
        },
        // carbon: trash-can (32×32 artboard)
        trashCan: {
            viewBox: '0 0 32 32',
            paths: [
                'M12 12H14V24H12z',
                'M18 12H20V24H18z',
                'M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z',
                'M12 2H20V4H12z'
            ]
        }
    }
};

module.exports = { IbmIcons };
