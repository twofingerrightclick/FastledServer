var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var LedRemote = /** @class */ (function () {
    function LedRemote() {
        var _this = this;
        this.brightness = ko.observable();
        this.speed = ko.observable(50);
        this.NUM_LEDS = ko.observable(50);
        this.numLedsInput = ko.observable("50");
        this.numbersOfColorsToUseFromPaletteIndex = ko.observable(0);
        this.numbersOfColorsToUseFromPalette = ko.observable(256);
        this.numberOfLedsPerPaletteColor = ko.observable(5);
        this.palette = ko.observable(new Palette(function (c) { return _this.setGradient(); }, function (c) { return _this.setSolidColor(); }));
        this.serverAddress = ko.observable("10.42.0.144");
        this.setStopAnimations = (_.debounce(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(Pattern.none_, {})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 50));
        this.setBrightness = (_.debounce(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(Pattern.brightness_, { data: this.brightness() })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 100));
        this.setGradientStep = (_.debounce(function () { return __awaiter(_this, void 0, void 0, function () {
            var gradientStep;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gradientStep = Math.ceil(this.palette().NUM_COLORS_FASTLED_PALETTE /
                            this.validNumbersOfColorsToUseFromPalette[this.numbersOfColorsToUseFromPaletteIndex()]);
                        console.log(gradientStep);
                        return [4 /*yield*/, this.post(Pattern.gradientStep_, { data: gradientStep })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 100));
        this.setSpeed = (_.debounce(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(Pattern.speed_, { data: this.speed() })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 200));
        this.setNumberOfLedsPerPaletteColor = (_.debounce(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(Pattern.numLedsPerPaletteColor_, { data: this.numberOfLedsPerPaletteColor() })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 200));
        this.setSolidColor = (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(Pattern.solidColor_, { data: this.palette().solidColor().rgb() })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.setGradient = (function () { return __awaiter(_this, void 0, void 0, function () {
            var colors, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        colors = this.palette().getPaletteRgbArray();
                        payload = { data: colors, length: colors.length };
                        return [4 /*yield*/, this.post(Pattern.gradient_, payload)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.setRainbow = (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(Pattern.rainbow_, {})];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.flowPalette = (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.post(Pattern.flowPalette_, { data: this.speed() })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        this.getValidNumberOfColorsPerPalette = function () {
            var prev = Number.MAX_SAFE_INTEGER;
            var arr = [];
            for (var i = _this.palette().NUM_COLORS_FASTLED_PALETTE; i >= 1; i--) {
                var num = Math.ceil(256 / i);
                if (num != prev) {
                    arr.push(num);
                    prev = num;
                }
            }
            return arr;
        };
        this.post = function (pattern, data) { return __awaiter(_this, void 0, void 0, function () {
            var rawResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = __assign({ type: pattern }, data);
                        return [4 /*yield*/, fetch("http://".concat(this.serverAddress(), "/post"), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data)
                            })];
                    case 1:
                        rawResponse = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.brightness.subscribe(this.setBrightness);
        this.numLedsInput.subscribe(function () { _this.NUM_LEDS(Number.parseInt(_this.numLedsInput())); console.log("numLeds: ".concat(_this.NUM_LEDS())); });
        this.speed.subscribe(this.setSpeed);
        this.numberOfLedsPerPaletteColor.subscribe(this.setNumberOfLedsPerPaletteColor);
        this.validNumbersOfColorsToUseFromPalette = this.getValidNumberOfColorsPerPalette();
        this.numbersOfColorsToUseFromPaletteIndex(this.validNumbersOfColorsToUseFromPalette.length - 1);
        this.numbersOfColorsToUseFromPalette(this.validNumbersOfColorsToUseFromPalette[this.validNumbersOfColorsToUseFromPalette.length - 1]);
        this.numbersOfColorsToUseFromPaletteIndex.subscribe(this.setGradientStep);
        this.numbersOfColorsToUseFromPaletteIndex.subscribe(function (value) { return _this.numbersOfColorsToUseFromPalette(_this.validNumbersOfColorsToUseFromPalette[value]); });
    }
    return LedRemote;
}());
var Pattern;
(function (Pattern) {
    Pattern[Pattern["none_"] = 0] = "none_";
    Pattern[Pattern["solidColor_"] = 1] = "solidColor_";
    Pattern[Pattern["brightness_"] = 2] = "brightness_";
    Pattern[Pattern["gradient_"] = 3] = "gradient_";
    Pattern[Pattern["rainbow_"] = 4] = "rainbow_";
    Pattern[Pattern["flowPalette_"] = 5] = "flowPalette_";
    Pattern[Pattern["breathePalette_"] = 6] = "breathePalette_";
    Pattern[Pattern["speed_"] = 7] = "speed_";
    Pattern[Pattern["gradientStep_"] = 8] = "gradientStep_";
    Pattern[Pattern["numLedsPerPaletteColor_"] = 9] = "numLedsPerPaletteColor_";
})(Pattern || (Pattern = {}));
var Color = /** @class */ (function () {
    function Color(hex) {
        var _this = this;
        if (hex === void 0) { hex = "#000000"; }
        this.hex = ko.observable();
        this.hsv = function () { return (_this.hex2hsv(_this.hex())); };
        this.rgb = function () {
            return _this.hex2Rgb(_this.hex());
        };
        this.hex2Rgb = function (hex) {
            var hexSans = hex.substring(1, 7);
            var r = parseInt((hexSans).substring(0, 2), 16);
            var g = parseInt((hexSans).substring(2, 4), 16);
            var b = parseInt((hexSans).substring(4, 6), 16);
            return [r, g, b];
        };
        this.hex2hsv = function (hex) {
            var hexSans = hex.substring(1, 7);
            var r = parseInt((hexSans).substring(0, 2), 16);
            var g = parseInt((hexSans).substring(2, 4), 16);
            var b = parseInt((hexSans).substring(4, 6), 16);
            var computedH = 0;
            var computedS = 0;
            var computedV = 0;
            /* remove spaces from input RGB values, convert to int */
            r = parseInt(('' + r).replace(/\s/g, ''), 10);
            g = parseInt(('' + g).replace(/\s/g, ''), 10);
            b = parseInt(('' + b).replace(/\s/g, ''), 10);
            if (r == null || g == null || b == null ||
                isNaN(r) || isNaN(g) || isNaN(b)) {
                alert('Please enter numeric RGB values!');
                return;
            }
            if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
                alert('RGB values must be in the range 0 to 255.');
                return;
            }
            r = r / 255;
            g = g / 255;
            b = b / 255;
            var minRGB = Math.min(r, Math.min(g, b));
            var maxRGB = Math.max(r, Math.max(g, b));
            /* Black-gray-white */
            if (minRGB == maxRGB) {
                computedV = minRGB;
                return { h: 0, s: 0, v: computedV };
            }
            /* Colors other than black-gray-white: */
            var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
            var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
            computedH = 60 * (h - d / (maxRGB - minRGB));
            computedS = (maxRGB - minRGB) / maxRGB;
            computedV = maxRGB;
            return { h: computedH, s: computedS, v: computedV };
        };
        this.hex(hex);
    }
    return Color;
}());
var PaletteColor = /** @class */ (function (_super) {
    __extends(PaletteColor, _super);
    function PaletteColor(index, hex, onHexChanges) {
        if (onHexChanges === void 0) { onHexChanges = undefined; }
        var _this = _super.call(this, hex) || this;
        _this.getAnchorPoint = function () { return parseInt(_this.anchorPoint()); };
        _this.anchorPoint = ko.observable(0);
        _this.index = ko.observable();
        _this.onHexChange = ko.observable(function (newValue) { });
        _this.index(index);
        if (onHexChanges) {
            _this.onHexChange(onHexChanges);
            _this.hex.subscribe(_this.onHexChange());
        }
        return _this;
    }
    return PaletteColor;
}(Color));
var Palette = /** @class */ (function () {
    function Palette(onPaletteColorChange, onSolidColorColorChange) {
        var _this = this;
        this.colors = ko.observableArray();
        this.solidColor = ko.observable();
        this.NUM_COLORS_FASTLED_PALETTE = 256;
        this.newColor = function () { return ko.observable(new PaletteColor(_this.colors().length, "#000000", _this.onPaletteColorChange)); };
        this.addColor = function () { if (_this.colors().length < 8) {
            _this.colors.push(_this.newColor());
            _this.adjustAnchorPoints();
        } };
        this.removeColor = function (color) {
            if (_this.colors().length > 1) {
                if (color.index != undefined) {
                    _this.colors.remove(function (c) { return c().index == color.index; });
                }
                else {
                    _this.colors.pop();
                }
                _this.adjustAnchorPoints();
            }
        };
        this.setSolidColor = function (color) {
            color.onHexChange(_this.onSolidColorChange);
            _this.solidColor(color);
        };
        this.adjustIndexes = function () {
            for (var index = 0; index < _this.colors().length; index++) {
                _this.colors()[index]().index(index);
                //always make the first color the solid color
                if (index == 0) {
                    _this.setSolidColor(_this.colors()[index]());
                }
            }
        };
        this.adjustAnchorPoints = function () {
            _this.adjustIndexes();
            var interval = Math.floor(255 / (_this.colors().length - 1));
            _this.colors().forEach(function (color) {
                var adjustedPaletteColor = color();
                var newAnchorPoint = adjustedPaletteColor.index() == 0 ? 0 : adjustedPaletteColor.index() == _this.colors().length - 1 ?
                    255 : adjustedPaletteColor.index() * interval;
                adjustedPaletteColor.anchorPoint(newAnchorPoint);
                color(adjustedPaletteColor);
            });
        };
        this.getHsvArray = function () {
            {
                num: _this.colors().length;
                colors: _this.colors().map(function (color) { return color().hsv; });
            }
        };
        this.getPaletteRgbArray = function () {
            return (function () {
                var fastLedPalette = new Array();
                _this.colors().forEach(function (color) { return fastLedPalette.push.apply(fastLedPalette, __spreadArray([color().getAnchorPoint()], color().rgb(), false)); });
                return fastLedPalette;
            })();
        };
        this.solidColor = ko.observable(new PaletteColor(0, "#000000", onSolidColorColorChange));
        //always have atleast one color in the palette
        this.colors.push(this.solidColor);
        this.onPaletteColorChange = onPaletteColorChange;
        this.onSolidColorChange = onSolidColorColorChange;
    }
    return Palette;
}());
var applyViewModel = function () { return ko.applyBindings(new LedRemote()); };
//apply only once knockout and lodash are loaded
var waitToApplyViewModel = function () {
    try {
        if (_ != undefined && ko != undefined) {
            try {
                applyViewModel();
            }
            catch (error) {
                console.error(error);
            }
        }
    }
    catch (_a) {
        setTimeout(waitToApplyViewModel, 200);
    }
};
waitToApplyViewModel();
//# sourceMappingURL=index.js.map