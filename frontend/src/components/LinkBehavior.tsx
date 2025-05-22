import { forwardRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import type { LinkProps as RouterLinkProps } from "react-router-dom";

const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"]; state?: any }
>((props, ref) => {
  const { href, state, ...other } = props;
  return <RouterLink ref={ref} to={href} state={state} {...other} />;
});

export default LinkBehavior;
