// https://stackoverflow.com/questions/54121536/typescript-module-svg-has-no-exported-member-reactcomponent
declare module "*.svg" {
  import { ReactElement, SVGProps } from "react";
  const content: (props: SVGProps<SVGElement>) => ReactElement;
  export default content;
}
// https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module
declare module '*.module.css';
