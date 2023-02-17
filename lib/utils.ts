import short from 'short-uuid';

// Generate a public-facing id from a prefix.
// Adds a 22 character flickrBase58 UUID to prefix.
// Eg. "rept_d8Tdpd90Ucdl32nERfx234"
export function generateId(prefix: string) {
  return prefix + short.generate();
}

/*************************
 * API parameter parsing
 **************************/  
export interface Param {
  name: string,
  required: boolean,
  validate: (value: any) => boolean,
  validationErrMsg: string,
}

export class Param {
  constructor(data: Param) {
    this.name = data.name;
    this.required = data.required;
    this.validate = data.validate;
    this.validationErrMsg = data.validationErrMsg;
  }
}

export interface AdditionalValidation {
  errMsg: string;
  validate: (paramValues: any) => boolean;
}

// Extracts params from bodyObject, validates values.
// Extra key-value pairs in BodyObject are ignored.
export function parseParams(bodyObject, apiParams: Param[], additionalValidations: AdditionalValidation[]) {
  let validatedParams = {};
  let validationErrMsgs = {};
  // Param-wise validation.
  for (let param of apiParams) {
    const value = bodyObject[param.name];
    if (value === undefined) { // Param missing.
      if (param.required) { // Required params not ok to be missing.
        validationErrMsgs[param.name] = "Required parameter missing.";
      }
      continue;
    }
    if (param.validate(value)) {
      validatedParams[param.name] = value
    } else {
      validationErrMsgs[param.name] = param.validationErrMsg
    }
  }
  // Combination validations.
  for (let v of additionalValidations) {
    if (!v.validate(validatedParams)) {
      validationErrMsgs['additional_errors'] = [
        ...(validationErrMsgs['additional_errors'] || []), v.errMsg
      ]
    }
  }
  return {params: validatedParams, errMsgs: validationErrMsgs}
}