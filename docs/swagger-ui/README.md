Swagger UI static wrapper

This folder contains a small static page that loads the exported OpenAPI JSON located at ../openapi.json using the Swagger UI distribution from a CDN. When GitHub Pages is configured to serve the docs/ folder, the UI will be available at:

https://<USERNAME>.github.io/<REPO>/swagger-ui/

Note: the index.html references ../openapi.json — keep that file at docs/openapi.json (already committed).