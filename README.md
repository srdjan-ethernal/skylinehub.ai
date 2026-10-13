# SkylineHub.ai

The English-language SkylineHub website, focused on AI models, AI infrastructure and multi-agent systems. It also introduces blockchain infrastructure and links to [SkylineBridge](https://skylinebridge.tech/).

Contact: [info@ethernal.tech](mailto:info@ethernal.tech)

## Run locally

This is a static website with no build step or package installation.

From the repository directory, start a static web server:

```sh
python -m http.server 4173
```

Open `http://localhost:4173/` in a browser. Python is only needed for this example preview server; the website itself uses HTML, CSS and JavaScript.

## Files

- `index.html`: page content and metadata.
- `style.css`: responsive layout and styling.
- `app.js`: geometric animation, mobile navigation and illustrative agent workflows.
- `favicon.svg`: site icon.

## Deploy

Serve the repository root with any static website host. Asset paths are relative to the domain root. Connecting `skylinehub.ai` requires configuring the chosen host and the domain's DNS records separately.

The workflow demonstration runs locally in the browser; it does not call AI services. Contact buttons open an email client. Fonts are loaded from Google Fonts with system-font fallbacks.
