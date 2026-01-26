import { inject } from "@angular/core";
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthGuardData, createAuthGuard } from "keycloak-angular";

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {
  const { authenticated, grantedRoles } = authData;

  if (!authenticated) return inject(Router).parseUrl('/login');

  const requiredRole = route.data['role'] as string;

  if (!requiredRole) return true;

  const hasRole = Object.values(grantedRoles.resourceRoles)
    .some(roles => roles.includes(requiredRole));

  return hasRole ? true : inject(Router).parseUrl('/login');
};

export const canActivateAuth = createAuthGuard(isAccessAllowed);