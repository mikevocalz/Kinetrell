import { useCallback } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { A, Article, Div, H1, H2, Header, Main, Nav, P, Section } from '@expo/html-elements';
import {
  AnchorProvider,
  Target,
  useRegisterScroller,
  useScrollTo,
} from '@nandorojo/anchor';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useKinetrellScroll, useParallaxStyle } from 'kinetrell/native';

const HERO_HEIGHT = 560;

type AnchorName = 'motion' | 'anchors' | 'semantic';

function AnchorLink({
  target,
  children,
}: {
  target: AnchorName;
  children: string;
}) {
  const { scrollTo } = useScrollTo();

  const onPress = useCallback(
    (event: unknown) => {
      const maybeEvent = event as { preventDefault?: () => void };
      maybeEvent.preventDefault?.();
      void scrollTo(target, { animated: true, offset: -24 });
    },
    [scrollTo, target]
  );

  return (
    <A
      href={Platform.OS === 'web' ? `#${target}` : undefined}
      onPress={onPress}
      style={styles.navLink}
    >
      {children}
    </A>
  );
}

function SemanticSection({
  id,
  title,
  children,
}: {
  id: AnchorName;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Section nativeID={id} style={styles.section}>
      <Target name={id} />
      <Article style={styles.article}>
        <H2 style={styles.h2}>{title}</H2>
        {children}
      </Article>
    </Section>
  );
}

function Demo() {
  const { registerScrollRef } = useRegisterScroller();
  const { offset, velocity, direction, handler } = useKinetrellScroll();
  const setScrollerRef = useCallback(
    (node: Parameters<typeof registerScrollRef>[0] | null) => {
      if (node) registerScrollRef(node);
    },
    [registerScrollRef]
  );

  const backdropStyle = useParallaxStyle(offset, {
    inputRange: [0, HERO_HEIGHT],
    translate: [0, 210],
    scale: [1, 1.16],
    opacity: [1, 0.45],
  });

  const titleStyle = useParallaxStyle(offset, {
    inputRange: [0, HERO_HEIGHT],
    translate: [0, 86],
    scale: [1, 0.94],
    opacity: [1, 0],
  });

  const telemetryStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: Math.max(-18, Math.min(18, velocity.value / 90)) }],
    opacity: direction.value === 0 ? 0.62 : 1,
  }));

  return (
    <Main style={styles.root}>
      <Nav style={styles.nav}>
        <Div style={styles.brandRow}>
          <Text style={styles.brand}>KINETRELL</Text>
          <Text style={styles.badge}>semantic parallax</Text>
        </Div>
        <Div style={styles.navLinks}>
          <AnchorLink target="motion">Motion</AnchorLink>
          <AnchorLink target="anchors">Anchors</AnchorLink>
          <AnchorLink target="semantic">Semantic UI</AnchorLink>
        </Div>
      </Nav>

      <Animated.ScrollView
        ref={setScrollerRef}
        onScroll={handler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header style={styles.hero}>
          <Animated.View style={[styles.heroBackdrop, backdropStyle]} />
          <Animated.View style={[styles.heroCopy, titleStyle]}>
            <Text style={styles.eyebrow}>ONE SCROLL SOURCE · EVERY PLATFORM</Text>
            <H1 style={styles.h1}>Parallax, anchors, and semantic layout.</H1>
            <P style={styles.lede}>
              Kinetrell drives the motion. Reanimated keeps the parallax responsive.
              Expo HTML Elements supplies universal semantic structure, and
              @nandorojo/anchor handles named section navigation.
            </P>
          </Animated.View>

          <Animated.View style={[styles.telemetry, telemetryStyle]}>
            <Text style={styles.telemetryLabel}>Kinetrell scroll velocity</Text>
            <Text style={styles.telemetryValue}>UI-thread linked</Text>
          </Animated.View>
        </Header>

        <Div style={styles.content}>
          <SemanticSection id="motion" title="Kinetrell owns motion">
            <P style={styles.copy}>
              The example uses useKinetrellScroll() as the authoritative scroll
              source and useParallaxStyle() to map that offset into translate,
              scale, and opacity without React renders on every frame.
            </P>
            <Div style={styles.cards}>
              <View style={styles.card}><Text style={styles.cardTitle}>0.35x</Text><Text style={styles.cardBody}>Backdrop depth</Text></View>
              <View style={styles.card}><Text style={styles.cardTitle}>UI</Text><Text style={styles.cardBody}>Reanimated execution</Text></View>
              <View style={styles.card}><Text style={styles.cardTitle}>1 API</Text><Text style={styles.cardBody}>Native + web</Text></View>
            </Div>
          </SemanticSection>

          <SemanticSection id="anchors" title="Named anchors stay cross-platform">
            <P style={styles.copy}>
              @nandorojo/anchor registers this Reanimated ScrollView as a custom
              scroller, so the same named targets work on iOS, Android, and web.
              The anchor package remains an example-level integration rather than
              a Kinetrell runtime dependency.
            </P>
            <Div style={styles.callout}>
              <Text style={styles.calloutTitle}>AnchorProvider + Animated.ScrollView</Text>
              <Text style={styles.calloutBody}>
                This is the key interoperability pattern: anchor measurement and
                imperative navigation coexist with Kinetrell's UI-thread scroll handler.
              </Text>
            </Div>
          </SemanticSection>

          <SemanticSection id="semantic" title="Semantic shell, animated internals">
            <P style={styles.copy}>
              Div is available for generic containers, but the example intentionally
              uses Main, Nav, Header, Section, Article, H1, H2, P, and A where those
              meanings are useful. Animated.View stays inside those semantic wrappers,
              avoiding a custom-component ref boundary for Reanimated.
            </P>
            <Div style={styles.codeLike}>
              <Text style={styles.codeLine}>{'<Main>'}</Text>
              <Text style={styles.codeLine}>{'  <Section>'}</Text>
              <Text style={styles.codeLine}>{'    <Animated.View />'}</Text>
              <Text style={styles.codeLine}>{'  </Section>'}</Text>
              <Text style={styles.codeLine}>{'</Main>'}</Text>
            </Div>
          </SemanticSection>
        </Div>
      </Animated.ScrollView>
    </Main>
  );
}

export default function App() {
  return (
    <AnchorProvider horizontal={false}>
      <Demo />
    </AnchorProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#07090f' },
  nav: {
    minHeight: 68,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#2a2f3d',
    backgroundColor: '#0a0d15',
    gap: 12,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brand: { color: '#f5f7ff', fontWeight: '900', letterSpacing: 2 },
  badge: {
    color: '#8f9ab8',
    borderWidth: 1,
    borderColor: '#30374a',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 11,
  },
  navLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  navLink: { color: '#a9c7ff', fontWeight: '700', textDecorationLine: 'none' },
  scrollContent: { paddingBottom: 120 },
  hero: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#252b3a',
  },
  heroBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundImage:
      'linear-gradient(135deg, #10162b 0%, #254fd8 43%, #8b3de8 72%, #16c7d9 100%)',
  },
  heroCopy: { padding: 28, maxWidth: 840, zIndex: 2 },
  eyebrow: { color: '#cbd7ff', fontSize: 12, fontWeight: '800', letterSpacing: 1.8 },
  h1: {
    color: '#ffffff',
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '900',
    letterSpacing: -2.2,
    marginTop: 14,
    marginBottom: 14,
  },
  lede: { color: '#e7ebff', fontSize: 18, lineHeight: 28, maxWidth: 720 },
  telemetry: {
    position: 'absolute',
    right: 24,
    top: 24,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff33',
    backgroundColor: '#05070aaa',
  },
  telemetryLabel: { color: '#a8b1c8', fontSize: 11 },
  telemetryValue: { color: '#fff', marginTop: 3, fontWeight: '700' },
  content: { width: '100%', maxWidth: 980, alignSelf: 'center', paddingHorizontal: 24 },
  section: { paddingTop: 92 },
  article: {
    borderRadius: 28,
    padding: 24,
    backgroundColor: '#0d111c',
    borderWidth: 1,
    borderColor: '#20283b',
  },
  h2: { color: '#fff', fontSize: 34, lineHeight: 40, fontWeight: '800', marginBottom: 16 },
  copy: { color: '#aeb8cf', fontSize: 17, lineHeight: 27 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 24 },
  card: {
    minWidth: 170,
    flexGrow: 1,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#12192a',
    borderWidth: 1,
    borderColor: '#26304a',
  },
  cardTitle: { color: '#fff', fontSize: 25, fontWeight: '900' },
  cardBody: { color: '#8f9ab8', marginTop: 6 },
  callout: {
    marginTop: 24,
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#171222',
    borderWidth: 1,
    borderColor: '#4c3269',
  },
  calloutTitle: { color: '#f6e9ff', fontWeight: '800', fontSize: 18 },
  calloutBody: { color: '#c8b6d6', lineHeight: 22, marginTop: 8 },
  codeLike: {
    marginTop: 24,
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#06080d',
    borderWidth: 1,
    borderColor: '#252b38',
  },
  codeLine: { color: '#93b4ff', fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }) },
});
