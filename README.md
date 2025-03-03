# Marciblocks Carousel

Marciblocks Carousel is a WordPress Gutenberg block plugin.

It's a simple, lightweight, high-performance image carousel that includes its own "image" block for nested blocks creation.

Internationalization is ready with 2 languages:

- English (base)
- French (traduction)

![Marciblocks Carousel front view](/images/marciblocks-carousel-front.png)

## Features

### Editor

- WYSIWYG rendering
- Multiple images selection
- Image order definition and editing
- Choice of border radius and value, if applicable
- Image adjustment
- Display ratio
- Choice of thumbnail highlight color
- Choice of caption display and color, if applicable
- Choice of description display and color, if applicable

### Front

- Lazy-loading of main images
- Tabbed navigation with images thumbnails
- Navigation with before/after controls
- Responsive display
- WAI-standard accessibility

More to come...

## Licence

This plugin is distributed under the **GNU General Public License v2.0 or later**.
You are free to use, modify and redistribute it under the terms of this license.

## Installation

### Development

This Gutenberg block plugin is built using `@wordpress/create-block` toolkit; It involves Node.js and WebPack, so for development purposes, make sure you have Node.js installed.

Clone this repository, then at the root of the project you can run the following commands using your favorite package manager.

Install dependencies (it will create *node_modules* folder):

```Bash
npm install
```

Start watching files and compiling **JS** ones and transpiling **SCSS** ones:

```Bash
npm start
```

Compile/transpile && prepare `/build/` directory files for deployment (compression and so on)

```Bash
npm run build
```

Happy coding ! 😁

---

### Getting started

You can use the plugin as is. The `/build/` directory is available for this purpose. All you need to do is:

1. Download the zip file of this repository
2. Extract the contents of the zip into your `/plugins/` directory
3. For the sake of efficiency, delete all directories/files except:
   - `/build/` directory
   - `/languages/` directory
   - `/marciblocks-carousel.php` file
4. Activate the Marciblocks Carousel in your wp-admin dashboard
5. Add Carousel blocks in any post/page via the Gutenberg editor

Enjoy! 😉

## Special notes

### Rendering in the editor

The carousel renders **WYSIWYG** in the editor, but without live navigation for performance reasons; As a result, only the first tab sees its data displayed (main image, caption, description) and the control and tab buttons don't work.

![Marciblocks Carousel editor view](/images/marciblocks-carousel-editor.png)

---

### Accessibility

A unique identifier per carousel, among those created in the post/page, is embedded in the container markup, so that each carousel has its own target used as an accessibility scope. You can add as many carousels as you like per post/page without compromising accessibility.

```HTML
<!-- carousel N°1 -->
<section id="marciblocks-carousel-1"...>
    ...
    <!-- Main Images -->
    <div id="marciblocks-carousel-items-1"...>
        ...
    </div>
        <!-- Controls -->
        <div class="marciblocks-carousel-controls">
            <button aria-controls="marciblocks-carousel-items-1"...">
        ...

<!-- carousel N°2 -->
<section id="marciblocks-carousel-2"...>
    ...
    <!-- Main Images -->
    <div id="marciblocks-carousel-items-2"...>
        ...
    </div>
        <!-- Controls -->
        <div class="marciblocks-carousel-controls">
            <button aria-controls="marciblocks-carousel-items-2"...">
        ...
```

In the back-end, a subscription is made to the block-editor store; An array of carousels present in the post/page is kept up to date, so is the props attribute carouselNumber using its index for identification. So that when, for example, the first carousel of the page is deleted, the second one becomes the first... This can be helpful for e.g. automatic numbering in text.
