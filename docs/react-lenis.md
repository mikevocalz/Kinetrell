# ReactLenis interoperability

`examples/react-lenis` proves the caller-owned Lenis path.

The host mounts the real `ReactLenis` provider and Kinetrell reads the existing
instance through `useKinetrellLenis()`. The combined bridge uses
`clock: 'external'`, so it does **not** add a second GSAP ticker driver and does
not destroy the caller's Lenis instance.

This is the preferred integration when an application already owns Lenis at
the React root.

```tsx
<ReactLenis root options={{ autoRaf: true }}>
  <Scene />
</ReactLenis>
```

Inside the scene:

```ts
const lenis = useKinetrellLenis();

useEffect(() => {
  if (!lenis) return;
  return connectGsapLenis(lenis, { clock: 'external' });
}, [lenis]);
```
