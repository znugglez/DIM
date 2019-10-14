import { ReactStateDeclaration } from '@uirouter/react';
import BungieAccount from './BungieAccount';

// Root state for views that require account info
export const states: ReactStateDeclaration[] = [
  {
    name: 'bungieAccount',
    url: '/:membershipId',
    component: BungieAccount
  }
];
