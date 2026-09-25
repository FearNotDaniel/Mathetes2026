# Letting a Claude cloud session see images in a private repo's GitHub issues

How to set up a Claude Code cloud session (claude.ai/code, desktop or mobile app) so it can
view screenshots pasted into GitHub issues and comments, including in **private** repositories.

Tested on 2026-09-25:

- public repo: FearNotDaniel/Mathetes2026 issue #15, using the public issue page
- private repo: FearNotDaniel/follow-me-umbraco issue #1, using an API token

## Why it doesn't just work

- Images pasted into an issue are stored as `https://github.com/user-attachments/assets/<id>`.
  That URL returns **403** to anyone who isn't logged in or holding a token.
- The session's built-in GitHub tools (the GitHub MCP server) return the issue's raw markdown.
  That includes the `<img>` tags, but **not** the image data or any link the agent can download.
- When GitHub *renders* an issue for someone allowed to see it, it swaps each attachment for a
  short-lived signed link:
  `https://private-user-images.githubusercontent.com/<user-id>/<n>-<id>.png?jwt=<token>`.
  These links expire after a few minutes.
- So the agent has to get the **rendered** issue as an authorised viewer, collect the signed
  links, and download them straight away.
  - **Public repo:** anyone can view the issue, so fetching the plain issue page
    (`https://github.com/OWNER/REPO/issues/N`) with no login is enough.
  - **Private repo:** the agent needs your credentials. The GitHub REST API with a personal
    access token, asked for rendered HTML, returns `body_html` fields containing the signed links.

## One-time setup per environment / repo

### 1. Claude GitHub App installed on the repo

Install it from <https://claude.ai/connect-github>. The token alone could fetch the images, but
the App is what lets the session clone the repo, read the issue with its built-in tools, and
comment or push.

### 2. Network allowlist

Cloud environment menu in the session title bar → **Edit** → **Network access**. Allow:

| Host | Why |
| --- | --- |
| `private-user-images.githubusercontent.com` | Serves the signed image links. **Blocked by default** (the proxy answered `CONNECT tunnel failed, response 403`) |
| `api.github.com` | REST API calls using the token (private repos) |
| `github.com` | Fetching the public issue page (public repos) |

### 3. Personal access token (private repos only)

1. GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → Generate.
2. **Repository access:** only the repo(s) you need.
3. **Permissions:** Repository → **Issues: Read-only**. Metadata: Read-only is added automatically.
   Nothing else.
4. Set a short expiry.
5. Store it in the cloud environment settings (same **Edit** dialog). Use **API credentials** if
   that section is offered, otherwise an environment variable, named **`GH_TOKEN`**. Both `gh` and
   a plain `curl -H "Authorization: Bearer $GH_TOKEN"` can use that name.
6. Only **new** sessions pick up the variable. Start a fresh session after adding it.

Never paste the token into the chat. Anything running in the container can read it, so keep it
read-only and scoped to one repo.

## The prompt

A new session knows nothing about this procedure, and by default it will:

- read the issue with its built-in tools, which return only image markup
- follow its standing instruction not to call the GitHub API directly
- possibly have a stored-credential API call blocked by the automatic permission check unless you
  have clearly authorised it

So the prompt must name the method and explicitly authorise the token. Copy and adjust
`OWNER`, `REPO` and `N`:

> Look at issue #N in OWNER/REPO and describe the images in it and in its comments.
> The built-in GitHub tools only return image markup, so do this instead. I've stored a
> read-only, repo-scoped GitHub token in the `GH_TOKEN` environment variable, and I authorise you
> to use it for direct GitHub API calls in this session. Fetch the issue and its comments with the
> header `Accept: application/vnd.github.html+json`, using curl or
> `gh api repos/OWNER/REPO/issues/N` and `.../issues/N/comments`. Take the signed
> `private-user-images.githubusercontent.com/...?jwt=` links from the `body_html` fields and
> download them straight away, because they expire within minutes. Then view the images.
> If any step fails, report the exact HTTP status and which step failed, and don't try to work
> around it.

For a **public** repo you don't need a token. Replace the middle of the prompt with: "Fetch the
public issue page `https://github.com/OWNER/REPO/issues/N` with curl (no login), take the signed
`private-user-images.githubusercontent.com/...?jwt=` links from its HTML, decode `&amp;` to `&`,
and download them straight away."

### What the agent does

```bash
# Private repo: rendered issue body and comments with signed links
curl -sS -H "Authorization: Bearer $GH_TOKEN" \
     -H "Accept: application/vnd.github.html+json" \
     https://api.github.com/repos/OWNER/REPO/issues/N          > issue.json
curl -sS -H "Authorization: Bearer $GH_TOKEN" \
     -H "Accept: application/vnd.github.html+json" \
     https://api.github.com/repos/OWNER/REPO/issues/N/comments > comments.json

# Pull out the signed links and download them right away
cat issue.json comments.json \
  | grep -oE 'https://private-user-images\.githubusercontent\.com/[^"\\ ]+' \
  | sed 's/&amp;/\&/g; s/\\u0026/\&/g' | awk '!seen[$0]++' \
  | nl -w1 -s' ' | while read i u; do curl -sS -o "img$i.png" "$u"; done
```

The agent then opens the `.png` files with its file-reading tool, which displays images.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `CONNECT tunnel failed, response 403` on the image download | `private-user-images.githubusercontent.com` isn't on the network allowlist |
| 401 or 403 from `api.github.com` | Token missing or expired, wrong scope, or not reaching GitHub. Check that `GH_TOKEN` is set in a *new* session |
| `body_html` has `<img>` tags but no `?jwt=` links | You asked for the wrong format. Send `Accept: application/vnd.github.html+json` (or `.full+json`) |
| Image download returns 404 or 403 after a delay | The signed link expired. Re-fetch the issue and download at once |
| Agent says it can't see the images and never tried the API | The prompt didn't name the method or authorise the token. Use the prompt above |

## Findings from the private-repo test (follow-me-umbraco #1)

Result: success. The session described the image, a "Follow Me!" testimonial mockup with a
German quote and an embedded video.

**Hitch encountered:** _TODO: fill in. The session that wrote this doc could see only the other
session's summary, not its transcript, so the details of the hitch and how it was fixed still
need adding._
