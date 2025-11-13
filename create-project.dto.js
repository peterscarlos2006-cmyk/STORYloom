"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProjectDto = void 0;
var class_validator_1 = require("class-validator");
var CreateProjectDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _genre_decorators;
    var _genre_initializers = [];
    var _genre_extraInitializers = [];
    var _styleInspiration_decorators;
    var _styleInspiration_initializers = [];
    var _styleInspiration_extraInitializers = [];
    var _journalingPeriod_decorators;
    var _journalingPeriod_initializers = [];
    var _journalingPeriod_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProjectDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.genre = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _genre_initializers, void 0));
                this.styleInspiration = (__runInitializers(this, _genre_extraInitializers), __runInitializers(this, _styleInspiration_initializers, void 0));
                this.journalingPeriod = (__runInitializers(this, _styleInspiration_extraInitializers), __runInitializers(this, _journalingPeriod_initializers, void 0));
                this.startDate = (__runInitializers(this, _journalingPeriod_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                __runInitializers(this, _startDate_extraInitializers);
            }
            return CreateProjectDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _genre_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _styleInspiration_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _journalingPeriod_decorators = [(0, class_validator_1.IsInt)()];
            _startDate_decorators = [(0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _genre_decorators, { kind: "field", name: "genre", static: false, private: false, access: { has: function (obj) { return "genre" in obj; }, get: function (obj) { return obj.genre; }, set: function (obj, value) { obj.genre = value; } }, metadata: _metadata }, _genre_initializers, _genre_extraInitializers);
            __esDecorate(null, null, _styleInspiration_decorators, { kind: "field", name: "styleInspiration", static: false, private: false, access: { has: function (obj) { return "styleInspiration" in obj; }, get: function (obj) { return obj.styleInspiration; }, set: function (obj, value) { obj.styleInspiration = value; } }, metadata: _metadata }, _styleInspiration_initializers, _styleInspiration_extraInitializers);
            __esDecorate(null, null, _journalingPeriod_decorators, { kind: "field", name: "journalingPeriod", static: false, private: false, access: { has: function (obj) { return "journalingPeriod" in obj; }, get: function (obj) { return obj.journalingPeriod; }, set: function (obj, value) { obj.journalingPeriod = value; } }, metadata: _metadata }, _journalingPeriod_initializers, _journalingPeriod_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProjectDto = CreateProjectDto;
