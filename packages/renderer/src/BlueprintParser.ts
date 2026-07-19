// src/BlueprintParser.ts
import Ajv, { JSONSchemaType } from "ajv";
import type { Blueprint } from "./types";
import schema from "./blueprintSchema.json"; // use local schema

const ajv = new Ajv({ allErrors: true, strict: false });

/**
 * Parse and validate a raw JSON object against the Website Blueprint schema.
 * Throws a descriptive error if validation fails.
 */
export function parseBlueprint(raw: unknown): Blueprint {
  const validate = ajv.compile(schema as unknown as JSONSchemaType<Blueprint>);
  if (!validate(raw)) {
    const errors = (validate.errors || [])
      .map((e) => `${e.instancePath} ${e.message}`)
      .join("; ");
    throw new Error(`Invalid Blueprint: ${errors}`);
  }
  // Type assertion safe after validation
  return raw as Blueprint;
}
