export class EmailParser {
  /**
   * Replace all {{variable}} placeholders in a template.
   */
  static parse(template: string, variables: Record<string, any>): string {
    if (!template) {
      return '';
    }

    return template.replace(/{{\s*([\w.]+)\s*}}/g, (_, key: string) => {
      const value = variables[key];
      return value !== undefined && value !== null ? String(value) : '';
    });
  }

  /**
   * Merge global settings with template-specific variables.
   * Template-specific variables override settings if names collide.
   */
  static buildVariables(
    settings: Record<string, any>,
    data: Record<string, any>,
  ): Record<string, any> {
    return {
      ...settings,
      ...data,
      year: new Date().getFullYear(),
    };
  }
}
