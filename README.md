# PRNG School

An interactive learning lab for exploring pseudorandom number generators (PRNGs).

**Live Demo:** [prng-playground.vercel.app](https://prng-playground.vercel.app)

## Disclaimer

**This is a proof of concept.** The implementations and statistical analyses are intended for educational exploration, not production use or cryptographic applications.

**AI-Assisted Development:** This project was developed with the assistance of AI tools.

## Overview

PRNG School is a client-only single-page web application designed for hands-on learning about PRNG algorithms. Users can explore how different generators work, understand state transitions, and experiment with creating custom algorithms using a safe domain-specific language (DSL).

### Features

- **Learn Mode** - Structured lessons with progress tracking and badge collection
- **Workshop** - Create and test custom PRNG algorithms using a constrained DSL
- **Built-in Algorithms** - SFC32, Mulberry32, SplitMix32, Xoshiro128**, XorShift32, LCG, Simple Counter
- **Visualization** - Real-time state inspection and sample output display
- **Internationalization** - English and Spanish language support
- **Theme Support** - Light and dark modes

## Technical Stack

- Vue 3 (Composition API)
- Pinia (state management)
- Tailwind CSS 4
- Vite 7
- TypeScript
- Zod (schema validation)
- Web Workers (isolated DSL execution)

## Architecture

- **No backend** - Entirely client-side
- **No router** - View switching via Pinia store (`activeView`)
- **DSL-based algorithm creation** - Safe, constrained operations without arbitrary JavaScript execution
- **Versioned persistence** - LocalStorage with Zod schema migrations

## Getting Started

### Prerequisites

- Node.js >= 20.0.0

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Project Structure

```
src/
  algorithms/     # Built-in PRNG implementations
  components/     # Vue components (ui/, learn/, workshop/)
  composables/    # Vue composables
  config/         # Lesson configurations
  locales/        # i18n translation files
  stores/         # Pinia stores
  types/          # TypeScript type definitions
  utils/          # Utility functions
  views/          # Page-level components
  workers/        # Web Worker scripts
```

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

See [LICENSE](LICENSE) for details.
