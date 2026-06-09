Habilitar GitHub Pages para servir a pasta docs/

Opções rápidas:

1) Servir diretamente da branch main (pasta docs):
   - Vá em Settings → Pages
   - Source: Branch: main, folder: /docs
   - Salvar. A URL estará em https://<USERNAME>.github.io/<REPO>/
   - A interface Swagger estará em https://<USERNAME>.github.io/<REPO>/swagger-ui/

2) Usar o workflow de deploy (automático) que cria/atualiza a branch gh-pages:
   - O workflow .github/workflows/deploy-docs.yml publica o conteúdo de docs/ na branch gh-pages quando houver push na branch main.
   - Após o primeiro deploy, vá em Settings → Pages e escolha Source: gh-pages branch / root.

Observações:
- O arquivo docs/openapi.json é referenciado pela página em docs/swagger-ui/index.html.
- Se preferir, habilitar Pages para docs/ evita necessidade do workflow; o workflow é útil para deploy separado (gh-pages).