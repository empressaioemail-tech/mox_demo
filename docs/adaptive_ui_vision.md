# Adaptive UI vision

> Context for Chris and his agent. This centralizes a vision that until now lived verbally (Nick and Chris describing it to Mox) and inside the mockups. It is synthesized from our own framing, not a pre-existing canonical doc. The demo is built around this. Chris leans heavily here; the build fleet provided the framework and the function, Chris elevates the feel.

## The one idea

The interface is not a fixed dashboard you learn. You express what you want to do, and the interface assembles the right components for that moment from the atom substrate. The data is self-describing, so the UI can compose itself around intent instead of around a preset navigation tree.

## In our own words (from the Mox conversation)

- "If you just go to the interface and say, this is what I want to do today, and it pulls up the appropriate user interface in front of you, that is what adaptive UI is." (Nick)
- "I ask the question, and all these little components change as I ask questions. It knows what pieces of dashboard I need, so it brings them forward." (Nick)
- "It is sort of an agnostic UI that becomes contextual based on how you use it. It is not one thing fits all, it is adaptive. It is all based on what you want it to be." (Chris)
- "You are not having to learn a new piece of software. The software is learning you, and it works with your own workflow. As it gets smarter, the tools you currently use get phased out." (Chris)
- "There might be a home base, but you go in and use the tools as you normally would, and it is just an assistant living there all the time." (Chris)
- "Over time there are enough pre-built components in the adaptive interface that it is easy to spin up. We already have the data, so we pull together the UI components and it surfaces as a function." (Nick)
- "The cost is building the design system. A full system that starts to build those components itself once it knows the guardrails and the rules." (Chris)

That last point is Chris's: the design system is the asset. The component library plus the rules of composition are what let the interface assemble itself.

## Why it is only possible on our substrate

A normal app hardcodes screens because its data is inert. Our data is atomized: every atom carries identity, provenance, reasoning, confidence, a context interface, and (per the atom contract) multiple rendering modes registered at creation. Because each atom can describe and render itself, the interface can ask "given this intent, which atoms matter and how should they show" and compose the answer. The adaptive UI is the visible payoff of the atom treatment. It is not a UI trick bolted on top; it is what self-describing data makes possible.

## The three dimensions of adaptivity

1. Intent-driven assembly. What components appear is chosen per intent, not per a fixed menu. "Show me this deal" assembles a different surface than "why is this flagged."
2. Role and context aware. The same system renders differently for Miguel (portfolio command), Sean (capital and provenance), Andrea (operating and close), Joe (build and code). Our doc set already names a narrow version of this inside Codex (role-aware verbosity, trainee to senior). The Mox vision is the broad version: the whole surface adapts, not just verbosity.
3. Learning over time. The software learns you. Every confirm, edit, or reject (the deposit loop) tunes what it surfaces and how confident it is. It gets less wrong and more tailored with use.

## The component catalog is the design system

The adaptive interface composes from a library of components, each bound to atom shapes. For the demo the catalog includes: KPI card, provenance drill, variance and anomaly card, action inbox, unit-twin viewer, plan-review findings, investor rollup, renderings panel. Chris owns the design language of these components and the choreography of how they assemble, reflow, and recede as intent changes. The richer and more composable the catalog, the more the interface can spin up new functions without a new build.

## What it is not

- Not a preset dashboard you have to learn. The point is the opposite: no new screen to master.
- Not one-size-fits-all. It is contextual to the person and the moment.
- Not a chatbot that only answers. It assembles working UI, not just text. The conversation is one way to express intent; the result is an interface.
- Not a replacement for the tools people use. It rides over them (the Yardi layer) and absorbs their functions over time, never a rip and replace.

## For this demo specifically

The adaptive command is the centerpiece hero surface, the clearest expression of this vision. For the demo it runs on rehearsed hero intents over representative data, genuinely engine-driven (not a hardcoded clickthrough) but rail-guided so it is smooth in the room. The bar is best foot forward, feels and acts like the real thing to a degree. The full production adaptive engine, learning continuously across a tenant's whole operation, is the horizon this demo points at. Keep the honesty framing from `demo_run_sheet.md`: the engine is real, the data is representative.

Design here is Chris's canvas. The framework, the component contracts, the honesty guardrails, and the narrative are fixed (see `chris_coordination_memo.md`); the look, the motion, the assembly choreography, and the feel of intelligence-living-there are his to shape.
