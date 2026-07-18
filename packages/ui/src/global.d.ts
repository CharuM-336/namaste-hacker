// Declare CSS module types for TypeScript

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
