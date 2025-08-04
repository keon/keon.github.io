# Content Guide for Keon's Blog

This guide provides detailed information about the content structure and organization of this Hexo-generated blog.

## Content Categories

The blog focuses on three main technical areas:

### Database (db)
- MongoDB schema design patterns
- Database optimization techniques
- NoSQL vs SQL considerations
- Data modeling best practices

### Machine Learning with MLPack (mlpack)
- MLPack library installation and setup
- C++ machine learning implementations
- Cross-platform development guides
- Performance optimization for ML algorithms

### Reinforcement Learning (rl)
- Deep Q-Learning implementations
- Keras and Gym integration
- Neural network architectures for RL
- Policy gradient methods
- Real-world RL applications

## Content Structure Analysis

### Existing Posts

1. **Deep Q-Learning with Keras and Gym** (`/deep-q-learning/`)
   - Category: Reinforcement Learning (rl)
   - Focus: Practical implementation in less than 100 lines of code
   - Images: Animation GIFs, neural network diagrams, training results
   - Technical depth: Beginner to intermediate

2. **MongoDB Schema Design** (`/mongodb-schema-design/`)
   - Category: Database (db)
   - Focus: Rules of thumb and best practices
   - Content type: Summary and practical guidelines
   - Technical depth: Intermediate

3. **MLPack on Windows** (`/mlpack-on-windows/`)
   - Category: Machine Learning (mlpack)
   - Focus: Installation and setup guide
   - Images: Step-by-step screenshots, library logos
   - Technical depth: Beginner setup guide

## Image Organization Standards

### Directory Structure
```
/images/{post-name}/
├── main-illustration.{png|jpg|gif}
├── diagrams/
├── screenshots/
└── animations/
```

### Image Types by Category
- **rl**: Neural network diagrams, training animations, performance plots
- **db**: Schema diagrams, data flow charts, performance comparisons
- **mlpack**: Installation screenshots, code examples, library logos

### Image Naming Conventions
- Use descriptive names: `neural-network-architecture.png` vs `image1.png`
- Include dimensions for consistency: `animation.gif`, `diagram-800x600.png`
- Use hyphens for multi-word names: `deep-q-learning.png`

## Content Quality Standards

### Technical Accuracy
- Provide working code examples
- Include prerequisite knowledge requirements
- Test all installation/setup instructions
- Verify external links and references

### Accessibility
- Use descriptive alt text for images
- Maintain consistent heading structure
- Include code syntax highlighting
- Provide clear step-by-step instructions

### SEO and Discoverability
- Use descriptive post titles
- Include relevant technical keywords
- Maintain consistent publication dates
- Cross-reference related posts

## Integration Features

### Analytics and Engagement
- Google Analytics tracking (UA-65209371-1)
- Disqus comments system (keonblog)
- RSS feed generation (`atom.xml`)
- Sitemap generation (`sitemap.xml`)

### Mathematical Content
- MathJax integration for mathematical expressions
- LaTeX syntax support for equations
- Proper rendering of mathematical notation

## Content Maintenance

### Regular Updates
- Verify external links remain active
- Update deprecated code examples
- Refresh installation instructions for new versions
- Monitor comment sections for questions

### Performance Optimization
- Optimize image sizes for web delivery
- Minimize CSS and JavaScript where possible
- Ensure fast loading times across devices
- Test mobile responsiveness

This guide should be referenced when creating new content or maintaining existing posts to ensure consistency and quality across the blog.
