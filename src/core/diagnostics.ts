export const KINETRELL_DIAGNOSTIC_CODES = Object.freeze({
  UNSUPPORTED_NATIVE_PROPERTY: 'KINETRELL_UNSUPPORTED_NATIVE_PROPERTY',
  UNRESOLVED_TARGET: 'KINETRELL_UNRESOLVED_TARGET',
  INVALID_POSITION: 'KINETRELL_INVALID_POSITION',
  CONFLICTING_OWNER: 'KINETRELL_CONFLICTING_OWNER',
  MISSING_OPTIONAL_PEER: 'KINETRELL_MISSING_OPTIONAL_PEER',
  UNSUPPORTED_RUNTIME: 'KINETRELL_UNSUPPORTED_RUNTIME',
} as const);

export type KinetrellDiagnosticCode =
  (typeof KINETRELL_DIAGNOSTIC_CODES)[keyof typeof KINETRELL_DIAGNOSTIC_CODES];

export type KinetrellDiagnostic = Readonly<{
  code: KinetrellDiagnosticCode;
  message: string;
  sceneId?: string;
  target?: string;
  property?: string;
  correctiveAction?: string;
}>;

export class KinetrellDiagnosticError extends Error {
  readonly diagnostic: KinetrellDiagnostic;

  constructor(diagnostic: KinetrellDiagnostic) {
    super(`${diagnostic.code}: ${diagnostic.message}`);
    this.name = 'KinetrellDiagnosticError';
    this.diagnostic = Object.freeze({ ...diagnostic });
  }
}

export function createDiagnostic(
  code: KinetrellDiagnosticCode,
  message: string,
  context: Omit<KinetrellDiagnostic, 'code' | 'message'> = {},
): KinetrellDiagnostic {
  return Object.freeze({ code, message, ...context });
}

export function throwDiagnostic(
  code: KinetrellDiagnosticCode,
  message: string,
  context: Omit<KinetrellDiagnostic, 'code' | 'message'> = {},
): never {
  throw new KinetrellDiagnosticError(createDiagnostic(code, message, context));
}
