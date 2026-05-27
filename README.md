# Extensio.ai — No-Code Extension Factory

A web-based AI platform that converts plain English descriptions
into fully packaged, ready-to-install browser extensions.

## Project Overview

Extensio.ai is built for developers and non-technical users who
want to create browser extensions without writing code. The user
types a description, selects a browser, and the platform uses
Gemini AI to generate all required extension files — manifest,
content scripts, popup UI, and background worker — then packages
them into a downloadable .zip file.

Built as part of the Zaalima Development Q4 AI Engineering roadmap.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | Component UI and dev server |
| Styling | CSS3 custom properties | Theming and layout |
| Backend | Node.js + Express | REST API server |
| AI | Gemini 2.0 Flash | Extension code generation |
| Packaging | Archiver npm | .zip file creation |
| Version Control | Git + GitHub | Source control |

