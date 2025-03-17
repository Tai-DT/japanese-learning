(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/components_features_api-key_GoogleApiKeyInput_tsx_4a52fd42._.js", {

"[project]/components/features/api-key/GoogleApiKeyInput.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>GoogleApiKeyInput)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function GoogleApiKeyInput() {
    _s();
    const [userApiKey, setUserApiKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [useUserApiKey, setUseUserApiKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showApiKeyInput, setShowApiKeyInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Kiểm tra xem đã có API key được lưu trong localStorage chưa
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GoogleApiKeyInput.useEffect": ()=>{
            // Đảm bảo chỉ chạy ở phía client
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    const savedApiKey = localStorage.getItem('google_ai_api_key');
                    if (savedApiKey) {
                        setUserApiKey(savedApiKey);
                        setUseUserApiKey(true);
                    }
                } catch (e) {
                    console.error("Lỗi khi đọc từ localStorage:", e);
                }
            }
        }
    }["GoogleApiKeyInput.useEffect"], []);
    // Hàm lưu API key
    const saveApiKey = ()=>{
        if (userApiKey.trim()) {
            try {
                // Lưu API key vào localStorage
                localStorage.setItem('google_ai_api_key', userApiKey.trim());
                // Kích hoạt sự kiện storage để các component khác có thể phát hiện thay đổi
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'google_ai_api_key',
                    newValue: userApiKey.trim(),
                    storageArea: localStorage
                }));
                setUseUserApiKey(true);
                setError(null);
                setSuccess("API key đã được lưu thành công!");
                // Tự động ẩn thông báo thành công sau 3 giây
                setTimeout(()=>{
                    setSuccess(null);
                }, 3000);
            } catch (e) {
                console.error("Lỗi khi lưu vào localStorage:", e);
                setError("Không thể lưu API key. Vui lòng kiểm tra quyền truy cập localStorage.");
            }
        } else {
            setError("Vui lòng nhập API key hợp lệ");
            setSuccess(null);
        }
    };
    // Hàm xóa API key
    const clearApiKey = ()=>{
        try {
            localStorage.removeItem('google_ai_api_key');
            // Kích hoạt sự kiện storage để các component khác có thể phát hiện thay đổi
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'google_ai_api_key',
                newValue: null,
                oldValue: userApiKey,
                storageArea: localStorage
            }));
            setUserApiKey('');
            setUseUserApiKey(false);
            setSuccess("Đã xóa API key");
            // Tự động ẩn thông báo thành công sau 3 giây
            setTimeout(()=>{
                setSuccess(null);
            }, 3000);
        } catch (e) {
            console.error("Lỗi khi xóa từ localStorage:", e);
            setError("Không thể xóa API key. Vui lòng kiểm tra quyền truy cập localStorage.");
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border border-gray-200 rounded-lg p-3 bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm font-medium",
                        children: "Cài đặt Google AI API Key"
                    }, void 0, false, {
                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setShowApiKeyInput(!showApiKeyInput),
                        className: "text-xs text-blue-600",
                        children: showApiKeyInput ? "Ẩn" : "Hiện"
                    }, void 0, false, {
                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            showApiKeyInput && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500 mb-1",
                        children: "Để tránh tình trạng quá tải API khi nhiều người cùng sử dụng, bạn có thể dùng API key riêng của Google AI."
                    }, void 0, false, {
                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: userApiKey,
                                onChange: (e)=>setUserApiKey(e.target.value),
                                placeholder: "Nhập Google AI API key của bạn",
                                className: "flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                            }, void 0, false, {
                                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: saveApiKey,
                                className: "px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700",
                                disabled: !userApiKey.trim(),
                                children: "Lưu"
                            }, void 0, false, {
                                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                lineNumber: 112,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this),
                    useUserApiKey && userApiKey && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-green-600",
                                children: [
                                    "Đang sử dụng API key của bạn: ",
                                    userApiKey.substring(0, 8),
                                    "..."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                lineNumber: 123,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: clearApiKey,
                                className: "text-xs text-red-600 hover:underline",
                                children: "Xóa"
                            }, void 0, false, {
                                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                lineNumber: 126,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                        lineNumber: 122,
                        columnNumber: 13
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                        lineNumber: 136,
                        columnNumber: 13
                    }, this),
                    success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-green-600 bg-green-50 p-2 rounded border border-green-100",
                        children: success
                    }, void 0, false, {
                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                        lineNumber: 142,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs space-y-1 pt-1 border-t border-gray-200 mt-2 pt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-medium",
                                children: "Hướng dẫn lấy API key:"
                            }, void 0, false, {
                                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                                className: "list-decimal pl-5 text-gray-600",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: [
                                            "Truy cập ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://ai.google.dev/",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-blue-600 underline",
                                                children: "Google AI Studio"
                                            }, void 0, false, {
                                                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                                lineNumber: 150,
                                                columnNumber: 28
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Tạo tài khoản Google (nếu chưa có)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: 'Nhấn vào "Get API key" hoặc "Create API key"'
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                        lineNumber: 152,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Làm theo hướng dẫn để tạo key mới"
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                        lineNumber: 153,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: 'Dán API key vào đây và nhấn "Lưu"'
                                    }, void 0, false, {
                                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                        lineNumber: 154,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                lineNumber: 149,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-gray-500",
                                children: "API key được lưu trong trình duyệt của bạn và không được gửi đến máy chủ của chúng tôi."
                            }, void 0, false, {
                                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                        lineNumber: 147,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
                lineNumber: 100,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/features/api-key/GoogleApiKeyInput.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(GoogleApiKeyInput, "qMmd0nWC9hew62Pu1bo0P6Wh2EU=");
_c = GoogleApiKeyInput;
var _c;
__turbopack_context__.k.register(_c, "GoogleApiKeyInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/features/api-key/GoogleApiKeyInput.tsx [app-client] (ecmascript, next/dynamic entry)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/components/features/api-key/GoogleApiKeyInput.tsx [app-client] (ecmascript)"));
}}),
}]);

//# sourceMappingURL=components_features_api-key_GoogleApiKeyInput_tsx_4a52fd42._.js.map