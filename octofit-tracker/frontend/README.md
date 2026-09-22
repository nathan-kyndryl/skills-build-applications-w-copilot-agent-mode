# Octofit Tracker Frontend

This React presentation tier uses Vite and React Router to connect to the Express API.

## Required environment variable

The frontend must define `VITE_CODESPACE_NAME` when running in a GitHub Codespace. For example, set it in `.env.local`:

```bash
VITE_CODESPACE_NAME=my-codespace-name
```

When `VITE_CODESPACE_NAME` is not set, the app falls back to `http://localhost:8000` instead of generating an invalid `https://undefined-8000...` URL.

The app builds API URLs in the form:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/<resource>/
```

and falls back to:

```text
http://localhost:8000/api/<resource>/
```
