"use strict";
exports.__esModule = true;
var react_1 = require("react");
var Clear_1 = require("@mui/icons-material/Clear");
var CloudUpload_1 = require("@mui/icons-material/CloudUpload");
var Components_module_css_1 = require("../../../theme/cssmodule/Components.module.css");
var material_1 = require("@mui/material");
function isString(myString) {
    return myString.length !== undefined; // ArrayBuffer has byteLength property not length
}
function isBlob(blob) {
    return blob !== undefined;
}
var AddImage = function (_a) {
    var textContent = _a.textContent, _b = _a.onImageChange, onImageChange = _b === void 0 ? function () { } : _b, children = _a.children, id = _a.id, formik = _a.formik;
    var _c = react_1["default"].useState(null), selectedFile = _c[0], setSelectedFile = _c[1];
    var _d = react_1["default"].useState(null), myImageSrc = _d[0], setMyImageSrc = _d[1];
    var _e = react_1["default"].useState(''), nftName = _e[0], setNftName = _e[1];
    var handleCapture = function (_a) {
        var target = _a.target;
        setSelectedFile(target.files[0]);
        getDataUrlFromBlob(target.files[0]).then(function (imageDataUrl) {
            setMyImageSrc(imageDataUrl);
            onImageChange(imageDataUrl, target.files[0]);
        }, console.error);
    };
    var getDataUrlFromBlob = function (blob) {
        console.log(blob);
        var _isBlob = isBlob(blob);
        if (!_isBlob) {
            return Promise.reject('Image is not a Blob');
        }
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function () {
                if (isString(reader.result)) {
                    resolve(reader.result);
                }
                else {
                    reject('Error: could not get data url from image');
                }
            };
        });
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        myImageSrc && selectedFile ? (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("img", { src: myImageSrc, className: Components_module_css_1["default"]['form-image-preview-box-img'] }),
            react_1["default"].createElement(Clear_1["default"], { color: "inherit", className: Components_module_css_1["default"]['clear-icon'], onClick: function () {
                    formik.setFieldValue('image', '');
                    setMyImageSrc(null);
                } }),
            react_1["default"].createElement(material_1.Box, { className: Components_module_css_1["default"]['info-label-image-upload'] },
                react_1["default"].createElement(material_1.Typography, { variant: "caption" }, selectedFile.name)))) : (react_1["default"].createElement(material_1.Stack, { className: Components_module_css_1["default"]['info-upload-overlay'], justifyContent: "center", alignItems: "center" },
            react_1["default"].createElement(CloudUpload_1["default"], { fontSize: "large", color: "inherit" }),
            react_1["default"].createElement(material_1.Typography, { variant: "caption" }, "Click here to upload"))),
        react_1["default"].createElement("input", { id: "image", name: "image", type: "file", hidden: true, accept: "image/*", onChange: handleCapture })));
};
exports["default"] = AddImage;
