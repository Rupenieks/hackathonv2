"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CursorService = void 0;
class CursorService {
    async createRule(context) {
        // TODO: Implement cursor rule creation
        return {
            type: "Always",
            context,
        };
    }
}
exports.CursorService = CursorService;
