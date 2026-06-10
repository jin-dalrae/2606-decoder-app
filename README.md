# 🌌 Anthropic Culture Decoder

> **What They Say vs. What They Reward** — An interactive, living diagnostic dashboard built for design leaders to dissect the tension between espoused company values and tacit operating rules at frontier AI labs.

Instead of a static PDF report or standard Figma deck, this microsite acts as a living tool. Viewers can click, hover, toggle layers, drag coordinates, and dynamically adjust maturity vectors to discover internal culture tensions themselves. 

---

## 🚀 Key Interactive Features

### 1. 🧊 Schein's 3D Iceberg Depth Stack
* **Interactive 3D Isometric View**: Floating transparent panes representing *Artifacts*, *Espoused Values*, and *Tacit Assumptions* using CSS 3D perspectives (`rotateX` and `rotateZ`).
* **Interactive Hover Lift**: Layers physically rise on hover and react to clicks to display cards in a split panel.
* **Tension Spotlight**: Toggle a global overlay that turns boundaries red-orange and reveals core conflicts (e.g., *Helpful Honest Harmless* verbatim values vs. *Existential urgency & workaholic burnout*).

### 2. 🎛️ Goffee-Jones 2x2 Grid Canvas
* **Sociability vs. Solidarity**: Plot organizations across these core dimensions (Friendliness vs. Task Consensus).
* **Draggable Coordinate Dot**: Drag the locator dot anywhere inside the SVG grid. The app calculates your exact relative math coordinates on a scale of `[0.0, 10.0]` and updates strengths, risks, and quadrant analysis in real time.
* **Competitor Presets**: Click preset buttons to relocate the marker immediately to Anthropic, OpenAI, Legacy Tech, or Academic labs for direct contrast.

### 3. 🪜 Design Maturity & Dynamic Radar Chart
* **Maturity Ladder**: Click rungs representing the 5 levels of design integration (Ad-hoc up to Strategic) to view specific evidence cards.
* **Dynamic SVG Radar Chart**: Mathematical vertex projection computed on the fly using polar trigonometry:
  $$X = \text{center} + \left(\frac{\text{value}}{5}\right) \times \text{rMax} \times \cos(\text{Angle})$$
  $$Y = \text{center} + \left(\frac{\text{value}}{5}\right) \times \text{rMax} \times \sin(\text{Angle})$$
* **Custom Metric Adjusters**: Use range sliders to modify parameters (UI Polish, Brand Identity, Tool Innovation, Safety Influence, Research Alignment) to see how shifts deform the overall organization signature.

### 4. 🗃️ Raw Qualitative Evidence Hub
* **Structured Quote Feed**: 16 detailed employee quotes and news entries with tags, sentiment scoring, and timestamps.
* **Reactive Filtering**: Filter by keyword search, category, sentiment, and custom tag pills.
* **Dashboard Summary**: Displays live KPI metrics reflecting the size and sentiment breakdown of the active filtered dataset.

### 5. 🖨️ High-Contrast PDF Exporter
* **Print-Optimized Overrides**: Activating `Cmd+P` or clicking the export button swaps the cosmos theme for a high-contrast white layout.
* **Flat Schein Iceberg**: Deactivates 3D transformations to render Schein's iceberg layers flat, readable, and structured for recruiters or team reviews.

---

## 🛠️ Technology Stack & Architecture

* **Framework**: React 19 + Vite 8 (extremely fast Hot Module Replacement).
* **Styling**: Pure Vanilla CSS design tokens and layouts (glassmorphism overlays, custom scrollbars, and grid structures).
* **Backdrop**: HTML5 Canvas particle loop animating a floating cosmos constellation that tracks mouse coordinates.
* **Data Layer**: Flat JSON schema (`cultureData.json`) making the diagnostics easily editable.

---

## 📦 Run & Deploy Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Launch dev environment**:
   ```bash
   npm run dev
   ```
3. **Build production bundle**:
   ```bash
   npm run build
   ```

---

## 👥 Team & Collaboration

### Group 2 (LbD - Learning by Design Class)
* **Rae**
* **Ayushi**
* **Yulin**
* **Karen**

### Agentic Synthesis
This project was compiled in parallel by a team of three autonomous agents:
* 🕵️ **Culture Researcher**: Aggregated reviews and structured `src/data/cultureData.json`.
* 🎨 **UI/UX Designer**: Authored the CSS theme tokens, animations, and mathematical SVG layouts.
* 💻 **Core Developer**: Wrote the React hooks, event listeners for dragging, and verified the build.
