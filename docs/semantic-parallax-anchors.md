# Semantic parallax + cross-platform anchors

This example combines four layers without making any one of them own the others:

1. **Kinetrell** owns scroll-linked motion through `useKinetrellScroll()` and `useParallaxStyle()`.
2. **React Native Reanimated 4.7** executes the parallax path.
3. **@expo/html-elements** provides universal layout semantics such as `Main`, `Nav`, `Header`, `Section`, `Article`, `H1`, `P`, `A`, and generic `Div`.
4. **@nandorojo/anchor** provides named target registration and cross-platform imperative section navigation.

The example lives at `examples/parallax-anchors`.

## Why the semantic component wraps the animated component

The Expo HTML Elements components are the document/accessibility shell. Kinetrell animates nested `Animated.View` nodes. This keeps semantic structure stable and avoids depending on custom component ref forwarding for every animation.

```tsx
<Section nativeID="motion">
  <Target name="motion" />
  <Article>
    <H2>Motion</H2>
    <Animated.View style={parallaxStyle} />
  </Article>
</Section>
```

Use `Div` when the container has no stronger meaning. Prefer `Main`, `Nav`, `Header`, `Section`, `Article`, headings, paragraphs, and anchors when they match the content.

## Anchor interoperability

The anchor library supports a custom scrollable through `AnchorProvider` + `useRegisterScroller()`. That lets the example register the same `Animated.ScrollView` that carries Kinetrell's Reanimated scroll handler.

```tsx
const { registerScrollRef } = useRegisterScroller();
const { handler } = useKinetrellScroll();

<Animated.ScrollView
  ref={registerScrollRef}
  onScroll={handler}
  scrollEventThrottle={16}
/>
```

This avoids maintaining two independent scroll positions.

## Dependency boundary

`@nandorojo/anchor` is intentionally an **example dependency**, not a Kinetrell peer or runtime dependency. Its latest published package is 0.4.3 and the upstream repository has not had a new commit since March 2023, so Kinetrell should prove compatibility in the example/CI lane without coupling the core library to it.

For Expo SDK 58, this example pins the current published SDK 58 lane used by the repository and `@expo/html-elements@58.0.2`, the currently published `next` build at the time this example was authored. Re-check npm before future dependency updates.
