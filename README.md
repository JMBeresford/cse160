# webGL_template

### Template for basic webGL projects utilizing webpack

To use this template, simply `git clone` this repo to your workstation and run
`npm install`

You can now use the below commands as needed

#### How to Use

- `npm run serve` will start a development server that hosts the template at
  `localhost:9000`
  - Editing core files in the template will auto-reload your browser
  - By default, you will be presented with a black canvas with a red point at
    the origin
- `npm run build` will build out your files into static html/js files
  - These static files can be easily hosted most anywhere that you can host
    webpages

This template utilizes webpack to both provide the capabilities of its dev
server and to allow us to import `.glsl` files directly into our JavaScript
without resorting to ugly template literals. With a proper code editor you can
now write your shaders with syntax highlighting and linting.
