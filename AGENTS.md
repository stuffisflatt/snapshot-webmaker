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

- Define the clinic's shared palette and section hierarchy through semantic tokens in `src/styles.css`; lower sections inherit the same dark-surface theme so presentation stays consistent without changing content or interactions.
- Keep video-frame keyframes in pure scroll-progress helpers and apply them without elapsed-time smoothing; this makes forward and reverse scrolling deterministic and testable.
- Position scene-01 copy from the rendered video bounds on each scroll update, and pass the page booking callback into the story so its CTA uses the existing booking sheet.
- Keep all six service accordions in one CSS grid with a shared active state so the two columns preserve existing single-panel behavior.
