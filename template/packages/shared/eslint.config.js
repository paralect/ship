import { getNodeConfig } from "eslint-config/node";

export default getNodeConfig({
  ignores: ["src/generated/**", "src/schemas/**"],
});
