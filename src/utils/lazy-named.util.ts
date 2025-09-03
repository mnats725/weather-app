import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

/**
 * Ленивый импорт именованного экспорта без default.
 * P — тип пропсов ленивого компонента (по умолчанию — пустые пропсы).
 */
export const lazyNamed = <
  P = Record<string, never>,
  TModule extends Record<string, unknown> = Record<string, unknown>,
  TKey extends keyof TModule = keyof TModule
>(
  loader: () => Promise<TModule>,
  name: TKey
): LazyExoticComponent<ComponentType<P>> =>
  lazy(async () => {
    const mod = await loader();
    const Comp = mod[name] as unknown as ComponentType<P>;
    return { default: Comp };
  });
