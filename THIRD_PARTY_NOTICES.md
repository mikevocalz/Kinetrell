# Third-party notices

Kinetrell does not vendor GSAP, Lenis, React Native Reanimated, React Native
Worklets, or React Native Gesture Handler.

## GSAP

Kinetrell's browser adapters integrate the separately installed `gsap` and
`@gsap/react` packages. As of October 2, 2026, npm publishes GSAP 3.15.0 under
GreenSock/Webflow's Standard "No Charge" License.

The current license permits implementation/use on websites, web applications,
and digital interfaces, including commercial projects. It also restricts use of
GSAP Products in visual animation builders that materially compete with
Webflow's visual animation-building capabilities and prohibits removing
proprietary notices.

Kinetrell is a code-first motion library and does not ship a visual/no-code
animation builder. This repository does not relicense, copy, or vendor GSAP.
Consumers remain responsible for the license terms that apply to the GSAP
version they install.

Current license source:
https://gsap.com/community/standard-license/

## Lenis

Lenis is a separately installed browser dependency. Kinetrell does not vendor
its implementation.

## Software Mansion

React Native Reanimated and React Native Worklets are separately installed
Software Mansion packages. Kinetrell does not vendor either implementation.

## React Native Gesture Handler

Gesture Handler is an optional peer used by the native gesture adapter. It is
not bundled into Kinetrell.
