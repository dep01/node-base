import { uuid } from "uuidv4";


export class GlobalUtils {
  generateUUID(): string {
    return uuid();
  }
}
