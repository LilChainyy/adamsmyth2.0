# How I Vibe Code

Don't write the code yourself — and don't even write the prompts yourself. Have the AI write the prompts for you.

I tell Claude: "Here's what I'm building. Write me a step-by-step build plan with the exact prompts I should paste." It gives me a full doc — each step has the prompt to paste into a fresh session, what to verify, and what to commit.

This is the unlock: Claude catches things you'd miss — OAuth flows, dependency order, edge cases. The build plan forces it to think through the whole chain upfront so nothing gets skipped.

**My workflow is 3 steps:**

1. Context dump — give Claude everything: what the app does, what exists already, your stack, even your user research. More context = better plan.
2. "Write me a build plan with prompts I can paste" — each step self-contained, one commit each, verify before moving on.
3. Paste each prompt into a fresh session, let it generate, verify, commit, next.

This gets you ~80% right on the first pass. Way less back-and-forth than winging it.

**For iterating after:** I use the app like a real user, write down every paper cut, then bucket them — Broken, Ugly, Meh — and fix in that order. The key is describing root causes, not symptoms ("markdown rendering broken in message-bubble.tsx" not "text looks weird"). More precise = fewer rounds.

Then I watch 3-5 real target users use it. Not "what do you think" — I watch where they hesitate. Those moments are your real bugs.
