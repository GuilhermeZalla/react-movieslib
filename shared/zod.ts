import { z } from 'zod';

// Zod's JIT probe uses new Function, which reports a CSP violation even when
// caught. Use the runtime parser so strict script-src never needs unsafe-eval.
z.config({ jitless: true });

export { z };
