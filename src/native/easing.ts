import { Easing } from 'react-native-reanimated';
import type { EaseName } from '../core/types.js';

export function toReanimatedEasing(name: EaseName) {
  switch (name) {
    case 'linear': return Easing.linear;
    case 'quad.in':
    case 'power2.in': return Easing.in(Easing.quad);
    case 'quad.out':
    case 'power2.out': return Easing.out(Easing.quad);
    case 'quad.inOut':
    case 'power2.inOut': return Easing.inOut(Easing.quad);
    case 'cubic.in': return Easing.in(Easing.cubic);
    case 'cubic.out': return Easing.out(Easing.cubic);
    case 'cubic.inOut': return Easing.inOut(Easing.cubic);
  }
}
