# AureonAI

Landing page estática com experiência 3D usando Spline Viewer.

## Como rodar

- Abra `index.html` no navegador, ou
- Rode um servidor estático:

```bash
npx --yes http-server -p 4173 .
```

Depois acesse `http://127.0.0.1:4173/`.

## Estrutura

- Home (Hero 3D)
- Prova social
- Recursos
- Showcase
- Planos (com alternância mensal/anual)
- FAQ (acordeão)
- Contato (formulário com validação básica)

## Funções

- Menu hamburger no mobile (clique fora e ESC fecham)
- Scroll suave por âncoras
- Link ativo no menu conforme a seção visível
- Reveal no scroll (respeita `prefers-reduced-motion`)

## Stack

- HTML/CSS/JS
- Spline Viewer (via CDN)

