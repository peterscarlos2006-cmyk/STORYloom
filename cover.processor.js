"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoverProcessor = void 0;
var bull_1 = require("@nestjs/bull");
var replicate_1 = require("replicate");
var CoverProcessor = function () {
    var _classDecorators = [(0, bull_1.Processor)('cover-queue')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _handleCoverGeneration_decorators;
    var CoverProcessor = _classThis = /** @class */ (function () {
        function CoverProcessor_1(prisma) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.replicate = new replicate_1.default({
                auth: process.env.REPLICATE_API_TOKEN,
            });
        }
        CoverProcessor_1.prototype.handleCoverGeneration = function (job) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, coverAssetId, prompt, model, input, output, imageUrl, s3Url, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = job.data, coverAssetId = _a.coverAssetId, prompt = _a.prompt;
                            return [4 /*yield*/, job.updateProgress(10)];
                        case 1:
                            _b.sent();
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 9, , 10]);
                            model = 'stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4';
                            input = { prompt: prompt, num_outputs: 1 };
                            return [4 /*yield*/, this.replicate.run(model, { input: input })];
                        case 3:
                            output = (_b.sent());
                            imageUrl = Array.isArray(output) ? output[0] : output;
                            return [4 /*yield*/, job.updateProgress(80)];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, this.uploadToS3(imageUrl)];
                        case 5:
                            s3Url = _b.sent();
                            return [4 /*yield*/, job.updateProgress(90)];
                        case 6:
                            _b.sent();
                            // 4. Update CoverAsset in DB
                            return [4 /*yield*/, this.prisma.coverAsset.update({
                                    where: { id: coverAssetId },
                                    data: { s3Url: s3Url },
                                })];
                        case 7:
                            // 4. Update CoverAsset in DB
                            _b.sent();
                            return [4 /*yield*/, job.updateProgress(100)];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            error_1 = _b.sent();
                            console.error('Cover generation failed:', error_1);
                            return [3 /*break*/, 10];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        CoverProcessor_1.prototype.uploadToS3 = function (imageUrl) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Placeholder for S3 upload logic.
                    // You would fetch the image from imageUrl, then upload it to your S3 bucket.
                    // For now, return the original URL.
                    console.log("Uploading ".concat(imageUrl, " to S3..."));
                    return [2 /*return*/, imageUrl];
                });
            });
        };
        return CoverProcessor_1;
    }());
    __setFunctionName(_classThis, "CoverProcessor");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _handleCoverGeneration_decorators = [(0, bull_1.Process)('generate-cover')];
        __esDecorate(_classThis, null, _handleCoverGeneration_decorators, { kind: "method", name: "handleCoverGeneration", static: false, private: false, access: { has: function (obj) { return "handleCoverGeneration" in obj; }, get: function (obj) { return obj.handleCoverGeneration; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CoverProcessor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CoverProcessor = _classThis;
}();
exports.CoverProcessor = CoverProcessor;
