(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ExternalStyles.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExternalStyles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function ExternalStyles() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ExternalStyles.useEffect": ()=>{
            // Load Font Awesome
            const fontAwesomeLink = document.createElement('link');
            fontAwesomeLink.rel = 'stylesheet';
            fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fontAwesomeLink);
            // Load Google Fonts
            const googleFontsLink = document.createElement('link');
            googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
            googleFontsLink.rel = 'stylesheet';
            document.head.appendChild(googleFontsLink);
            // Add font family style
            const style = document.createElement('style');
            style.textContent = 'body { font-family: \'Inter\', sans-serif; }';
            document.head.appendChild(style);
            // Cleanup function
            return ({
                "ExternalStyles.useEffect": ()=>{
                    if (document.head.contains(fontAwesomeLink)) {
                        document.head.removeChild(fontAwesomeLink);
                    }
                    if (document.head.contains(googleFontsLink)) {
                        document.head.removeChild(googleFontsLink);
                    }
                    if (document.head.contains(style)) {
                        document.head.removeChild(style);
                    }
                }
            })["ExternalStyles.useEffect"];
        }
    }["ExternalStyles.useEffect"], []);
    return null;
}
_s(ExternalStyles, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ExternalStyles;
var _c;
__turbopack_context__.k.register(_c, "ExternalStyles");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_ExternalStyles_tsx_06b73522._.js.map