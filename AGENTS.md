<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Demo state (cart, orders, products, passport, user) lives in localStorage stores in src/lib/store.ts, seeded from src/lib/data.ts — swap these for server calls when a backend is added, so UI code stays unchanged.
- NFC verification is a client-side simulation (`simulateVerify`); real authenticity must be checked server-side later.
