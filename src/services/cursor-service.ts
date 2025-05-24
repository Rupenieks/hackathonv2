export class CursorService {
  async createRule(context: string): Promise<any> {
    // TODO: Implement cursor rule creation
    return {
      type: "Always",
      context,
    };
  }
}
