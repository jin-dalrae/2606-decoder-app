# Product Requirements Document (PRD)

## Project Name: Anthropic Culture Decoder
**Version**: 1.0.0  
**Author**: Antigravity  
**Status**: Approved & Implemented  

---

## 1. Vision & Goals

### 1.1 Executive Summary
Most candidates, recruiters, and design leaders evaluate companies using polished homepages and sanitized marketing content. The **Culture Decoder** is an interactive diagnostic microsite that uncovers the *real operating system* of tech organizations, using Anthropic PBC as its primary case study. 

By turning cultural frameworks (Schein's Iceberg, Goffee-Jones Grid, and Design Maturity models) into interactive web components, the tool allows users to click, hover, drag, and toggle layers to discover organizational tensions themselves.

### 1.2 Core Objectives
* **Living Diagnostic Tool**: Shift from static PDF decks to an interactive, stateful web portal.
* **Tension Disclosure**: Highlight structural mismatches between espoused values (what companies say) and tacit assumptions (what actually gets rewarded).
* **Framework Grounding**: Provide design leaders with concrete methodologies to evaluate talent density, operational alignment, and design leverage.

---

## 2. Target Personas

* **Design Leaders**: Looking to evaluate a target company's design maturity, decision-making pipelines, and alignment before joining or partnering.
* **Candidates / Engineers**: Seeking honest, unstructured feedback on work-life balance, commercial pressure, and internal chaos before accepting offers.
* **Recruiters & HR Specialists**: Evaluating the candidate's alignment with values while seeking high-level diagnostic summaries for company improvement.

---

## 3. Core Frameworks Mapped

### 3.1 Schein’s 3 Levels of Culture
* **Level 1: Artifacts & Behaviors**: The visible physical and digital outcomes (Claude.ai interface, hybrid setups, Project Deal/Vend, plant-heavy SF office).
* **Level 2: Espoused Values**: The official, declared operating rules (Anthropic's 7 verbatim company values).
* **Level 3: Shared Tacit Assumptions**: The taken-for-granted unwritten rules ("Safety is a science", "Extreme hours are the price of existential alignment", "Talent density over process").

### 3.2 Goffee & Jones Double-S Grid
* **Sociability**: Emotional warmth, friendships, and empathy between workers.
* **Solidarity**: Operational agreement around shared targets, mission focus, and execution.
* **Communal Archetype**: High sociability + high solidarity. (Anthropic's current designation: high peer warmth mixed with extreme mission focus).

### 3.3 Design Maturity Ladder
* **Ladders Evaluated**: Ad-hoc, Focused, Positioned, Integrated, and Strategic.
* **Radar Dimensions**: UI Polish, Brand Identity, Tool Innovation (e.g. Claude Design), Safety Influence, and Research Alignment.

---

## 4. Functional Requirements

### 4.1 Global Controls (Header)
* **Typewriter Title**: The navbar must feature a typewriter animation writing "Anthropic Culture Decoder" on mount to establish a premium brand feel.
* **Tension Spotlight Toggle**: A global switch that changes the state of the dashboard to show cultural conflicts.
* **Export PDF Button**: Triggers `window.print()` to generate vector outputs of the diagnostic report.

### 4.2 Schein's 3D Iceberg Stack (`01 / Depth Stack`)
* **3D Perspective**: Stack three translucent cards along the Z-axis in an isometric orientation (`rotateX` and `rotateZ`).
* **Hover State**: Hovering over a card translates its Z position outward (lifts the layer).
* **Click Selection**: Clicking a layer displays its definition and lists associated cards (from `cultureData.json`) in the sidebar.
* **Tension Spotlights**: When Tension Mode is enabled:
  * The iceberg cards glow warning-red.
  * A central vertical pulse connector represents energy flow.
  * Specific friction cards (e.g., capability vs. safety race) show up prominently.

### 4.3 Goffee-Jones Interactive Matrix (`02 / Cultural Typology Matrix`)
* **Interactive SVG Space**: 2x2 coordinate space mapping Sociability ($X$) and Solidarity ($Y$) from 0 to 10.
* **Draggable Dot**: Users can drag the indicator dot to see how coordinates translate to different quadrants (Mercenary, Communal, Fragmented, Networked).
* **Live Sidebar Updates**: The sidebar updates instantly on coordinate change, detailing strengths and risks.
* **Organization Benchmarks**: Clicking static markers (Anthropic, OpenAI, Legacy Tech, Academia) jumps the dot to default coordinates.

### 4.4 Design Maturity & SVG Radar Chart (`03 / Design Integration`)
* **Maturity Rungs**: Vertical progression ladder from Level 1 to 5.
* **Dynamic Polygon Radar Chart**: Renders overlapping SVG polygons for "Anthropic" and "Industry Average."
* **Stateful Sliders**: Five range inputs (0.5 to 5.0) that redraw the Anthropic polygon coordinates in real time.

### 4.5 Qualitative Evidence Hub (`04 / Raw Source Feed`)
* **Live Search**: Users can type keywords to match contents, tags, or sources.
* **Multi-Filters**: Filter quote feed by Category, Sentiment, and Tag pills.
* **Live Stats**: Displays active card count and a positive vs. critical sentiment balance bar.

### 4.6 Print Layout Requirement
* **No-Background Formatting**: Hide floating cosmos particles, navbar triggers, and scrollbars on print.
* **3D Flattening**: Unset perspective properties to stack Schein's Iceberg layers vertically as simple, readable paper cards.

---

## 5. Non-Functional Requirements

* **Performance**: Maintain 60fps on canvas animations by optimizing particle recalculations and using hardware-accelerated transforms.
* **Responsiveness**: Support fluid grid collapsing down to mobile viewports ($<600\text{px}$).
* **Theme Styling**: Glassmorphic panels with cosmos dark backdrops (`#0B0F19`) and warm Claude-style text colors (`#F5EBE6`, `#D97706`).

---

## 6. Future Roadmap

* **Multi-Company Mappings**: Expand from a single case study to compare multiple frontier Labs (OpenAI, DeepMind, Meta AI) in the Goffee-Jones grid.
* **Interactive Assessments**: Integrate a 10-question questionnaire for design leaders to input their team ratings and auto-generate their company signature.
* **Live Glassdoor API integration**: Fetch real-time anonymized review feeds contextually.
