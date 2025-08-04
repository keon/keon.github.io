# Keon's Blog

A personal blog about deep learning, reinforcement learning, distributed computing and web technologies.

## About

This repository contains the generated static site for [keon.io](http://keon.io), built with [Hexo 4.2.0](https://hexo.io/) and the [hexo-theme-apollo](https://github.com/pinggod/hexo-theme-apollo) theme.

## Repository Structure

This is the **deployed version** of the blog containing compiled HTML, CSS, and static assets. The source files and build process exist elsewhere.

### Content Organization

- **Blog Posts**: Individual directories for each post (`deep-q-learning/`, `mlpack-on-windows/`, `mongodb-schema-design/`)
- **Categories**: Three main categories - `db` (database), `mlpack` (machine learning), `rl` (reinforcement learning)
- **Images**: Organized in `/images/{post-name}/` directories matching blog post names
- **Styling**: SCSS source in `/scss/apollo.scss`, compiled CSS in `/css/apollo.css`

### Key Features

- RSS feed (`atom.xml`)
- Sitemap (`sitemap.xml`)
- Google Analytics integration
- Disqus comments system
- Responsive design with custom fonts

## Development

For development guidelines and contribution instructions, see [AGENTS.md](./AGENTS.md).

**Note**: This repository contains generated files. To make content changes, locate the source Hexo project repository.

## License

© 2016 - 2019 [Keon Kim](http://keon.io)
