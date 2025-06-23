ThemeKit v4.0 - The WYSIWYG Web Builder
Project Code: ThemeKit (Evolved into a Visual Builder)
Version: 4.0
Status: Final - Ready for architectural design and development hand-off

Product Philosophy
Visual is the new Code.

We empower creators to build real, efficient, and production-ready web pages using the intuition of design. ThemeKit v4.0 aims to bridge the gap between design and development, allowing visual creativity to be seamlessly translated into standard, usable code.

Core Concepts & User Scenarios
Problem Solved:
For Designers: "I want to design freely, just like in Figma, but the output shouldn't be a static image. It should be a real, functioning web page that I can hand directly to an engineer."
For Developers: "I need a visual tool to quickly build page layouts, test spacing and responsive design, and automatically generate clean, standard HTML and CSS, freeing me from the tedious work of slicing UI mockups."
Core User Journey:
Set Up the Canvas: A designer, Jane, opens ThemeKit and selects "Desktop (1440px)" as her initial canvas frame.
Build the Structure: She drags a "Container" from the component library onto the canvas. In the right-hand Inspector Panel, she sets the container's layout to "Flex," direction to "Column," and alignment to "Center."
Populate with Content: She then drags an "Image" and a "Heading" into the container. The image and heading immediately align vertically centered, following the Flexbox rules she defined.
Fine-tune Adjustments: She selects the heading. In the inspector, she changes its margin-top value from 0 to 24px. The heading on the canvas instantly moves down by 24 pixels.
Real-time Validation: Simultaneously, in the expanded "Code Panel" at the bottom, she can clearly see the corresponding HTML structure and CSS rules (e.g., .container { display: flex; ... } and .title { margin-top: 24px; }) being generated accurately and in real-time.
One-Click Handoff: Once the design is complete, she can easily copy the HTML and CSS files for the entire page and hand them over to a developer, John.
Core Logic of the Visual Canvas
To ensure the visual representation on the canvas is 100% identical to the final code, our canvas must operate based on real front-end layout logic.

A. Positioning Model & Layout Flow
Foundation: All elements on the canvas are based on the standard CSS Box Model.
Default Flow: When a component is dragged inside another container, it enters the container's "Layout Flow." Its position is determined by the container's layout properties (like Flexbox or Grid), not by absolute coordinates.
Future Expansion (Absolute Positioning): An option for position could be added to the inspector. Only when a user explicitly sets an element's position to absolute or fixed would it break out of the layout flow, allowing free-form dragging.
B. Layout Engine: Flexbox at the Core
Core Component: "Container": The Container in our library is essentially a <div>. In the inspector, the user can easily switch its display property to flex.
Intuitive Controls: When a container is set to flex, the inspector reveals a set of visual controls for:
Direction: A dropdown to select row, column, etc.
Align & Justify: Dropdowns to visually select all options for align-items and justify-content.
Gap: An input field to directly set the space between child elements.
Nesting: Users can nest a Flex container inside another Flex container to build infinitely complex layouts that adhere to real-world web development logic.
C. State Management: The Single Source of Truth
This is the technical heart that ensures visuals and code remain in sync. The entire canvas is represented by a tree-like JavaScript object (canvasState). Any user action first updates this object, and then React automatically re-renders both the visual canvas and the code panel based on this single source of data, guaranteeing absolute consistency.

Example canvasState Structure:

JavaScript

const canvasState = {
  id: 'root-container',
  component: 'Container',
  styles: { display: 'flex', flexDirection: 'column', /* ... */ },
  children: [
    {
      id: 'image-123',
      component: 'Image',
      props: { src: '...' },
      styles: { width: '100px', height: '100px', /* ... */ }
    },
    {
      id: 'text-456',
      component: 'Text',
      props: { content: 'Hello World' },
      styles: { marginTop: '24px', color: '#000', /* ... */ }
    }
  ]
};
Features
WYSIWYG: What You See Is What You Get. All actions on the visual canvas are instantly reflected as they would appear on a final webpage.
Component-Based Architecture: Build pages quickly by dragging and dropping basic elements like Containers, Text, Images, and Buttons.
Powerful Inspector: Precisely control the layout (Flexbox), size, spacing (Padding/Margin), typography, and content of every element.
Real-time Code Generation: Automatically generates clean, standards-compliant HTML and CSS, bridging the gap between design and development.
Responsive Design Frames: Switch between Desktop, Tablet, and Mobile canvas sizes to instantly preview responsive behavior.
Dark/Light Mode: Built-in theme switching with corresponding CSS styles generated for dark mode.
Internationalization (i18n): Supports interface language switching between English (en) and Chinese (zh).
Element Manipulation: Easily move elements up, move them down, or delete them from the canvas.
UI Specification Details
Left Panel (Component Library & Canvas Frames):

Component Library: Displays all available components as cards, which users can drag onto the middle canvas.
Canvas Frames: Buttons for Desktop, Tablet, and Mobile that switch the preview width of the canvas with one click.
Middle Panel (Visual Canvas):

The core interactive area where users drag, drop, select, and arrange components.
Selected elements are highlighted with a purple outline for easy identification.
Right Panel (Inspector):

The main control hub. When an element is selected, this panel displays all its editable properties, dynamically showing different sections based on the element's type.
Layout: Core controls for CSS properties like display, flex-direction, and justify-content.
Size & Spacing: Figma-like input fields for setting width, height, padding, and margin.
Bottom Panel (Code Panel):

HTML Tab: Generates clean, nested HTML by recursively traversing the canvasState object.
CSS Tab: Generates a unique class for each element (e.g., .el-image-123) and converts its styles object into corresponding CSS rules.
Tech Stack
Core Framework: React (v18+)
State Management: React Hooks (useState, useEffect, useCallback, useMemo, useReducer)
Icons: Lucide React
Styling: Tailwind CSS (for the builder's UI)
Internationalization (i18n): Custom translations object
Installation and Startup
Clone the repository:

Bash

git clone https://your-repository-url.git
cd themekit-v4
Install dependencies:

Bash

npm install
Start the development server:

Bash

npm start
The application will be running at http://localhost:3000.

Part 2: Detailed Project Architecture (For Jules)
Alright, Jules!

To give you a complete command of the ThemeKit v4.0 project architecture and get you developing quickly, here is a full breakdown. This includes a clear folder structure, explanations of file responsibilities, and, most importantly, the data flow logic.

The goal of this architecture is: High Cohesion, Low Coupling, and Easy Scalability.

1. Core Architectural Principles
Before diving into the folders, please understand these three core concepts:

UI as State: The entire visual representation of the canvas is determined by a single JavaScript object named canvasState. We don't manipulate the DOM directly; we only manipulate this state object.
Single Source of Truth: canvasState is the one and only "truth." The visual canvas, the property inspector, and the code panel all read from this single source to render themselves.
Separation of Concerns: UI presentation (Components), business logic (Hooks/Utils), application configuration (Config), and global state (Contexts) are clearly separated into different directories.
2. Recommended Folder Structure
This structure is based on modular, feature-driven principles and React best practices. It breaks down the original single App.js file into a clean and maintainable project.

Bash

themekit-v4/
├── .gitignore
├── package.json
├── README.md
├── public/
│   └── index.html         # The HTML entry point for the app
└── src/
    ├── assets/              # Static assets like images, fonts, etc.
    │   └── logo.svg
    ├── components/          # CORE: All UI components
    │   ├── canvas/
    │   │   ├── Canvas.js        # The main canvas, responsible for rendering canvasState
    │   │   └── CanvasComponent.js # Recursively renders a single element (Container, Text...)
    │   ├── code/
    │   │   └── CodePanel.js     # The bottom code panel (HTML/CSS)
    │   ├── inspector/
    │   │   ├── InspectorPanel.js# The main inspector panel on the right
    │   │   └── sections/        # Different sections within the inspector
    │   │       ├── ActionsSection.js
    │   │       ├── LayoutSection.js
    │   │       ├── SizeSection.js
    │   │       └── TypographySection.js
    │   ├── layout/              # The overall layout of the application
    │   │   ├── LeftPanel.js     # Left panel (Component Library + Canvas Frames)
    │   │   ├── MiddlePanel.js   # Main central workspace (Canvas + CodePanel)
    │   │   └── TopBar.js        # The top navigation bar
    │   └── shared/              # Reusable basic components
    │       ├── DraggableItem.js # A draggable component item
    │       └── ThemedButton.js  # A button with theme-aware styles
    ├── config/              # Static application configuration
    │   ├── i18n.js            # Internationalization (EN/ZH) translation strings
    │   └── componentLibrary.js# Definitions for the component library on the left
    ├── contexts/            # React Contexts for providing global state
    │   ├── AppContext.js      # A provider that combines all other contexts
    │   ├── CanvasContext.js   # Provides canvasState and its update function
    │   ├── LanguageContext.js # Provides the current language and switcher function
    │   └── ThemeContext.js    # Provides the current theme and toggle function
    ├── core/                # Core business logic and state
    │   ├── state/
    │   │   ├── initialState.js  # The initial structure of canvasState
    │   │   └── canvasReducer.js # The HEART of the app! Manages all changes to canvasState
    │   └── utils/
    │       ├── generator.js     # Functions to generate HTML and CSS
    │       ├── nodeFinders.js   # Helper functions for traversing the state tree (find, update, delete...)
    │       └── uniqueId.js      # Function to generate a unique ID
    ├── hooks/               # Custom React Hooks
    │   ├── useCanvas.js       # Simplifies the use of CanvasContext
    │   ├── useLanguage.js     # Simplifies the use of LanguageContext
    │   └── useTheme.js        # Simplifies the use of ThemeContext
    ├── styles/              # Global styles
    │   └── index.css          # Base TailwindCSS styles and global classes
    ├── App.js               # The main application component; assembles layouts and contexts
    └── index.js             # The application's entry point; renders the App component
3. File Responsibilities Explained
src/core/: This is the "brain" of the application.

state/canvasReducer.js: This is the most important file. It contains a reducer function that replaces the large switch statement from the original updateCanvasState function. It takes the current state and an action (e.g., { type: 'STYLE', payload: { ... } }) and returns a completely new state object. This makes state changes centralized, predictable, and easy to test.
utils/: Contains all pure functions, such as findAndUpdateNode, generateHTML, etc.
src/contexts/: Solves the "prop drilling" problem.

CanvasContext.js is key. It provides the canvasState and the dispatch function (from the reducer) to deeply nested components like InspectorPanel. This allows them to directly access and request state updates without App.js having to pass props down through many layers.
src/components/: Your primary working directory.

layout/: Breaks the three-column interface into LeftPanel, MiddlePanel, etc., to keep App.js clean.
canvas/: Canvas.js receives canvasState and starts the recursive rendering. CanvasComponent.js is the recursive unit, deciding whether to render a <div> or an <h1> based on the data.component type.
inspector/: InspectorPanel.js uses the selected element's ID to find its data in canvasState and passes that data to its child sections/ to display the various input controls.
App.js: Acts as the "conductor."

It uses the useReducer hook with the canvasReducer to manage canvasState.
It assembles the main layout components (TopBar, LeftPanel, MiddlePanel).
It wraps everything in the AppContextProvider so all child components can access global state.
4. Data Flow & Interaction Logic
This diagram explains what happens internally when a user performs an action:

+--------------------------------+      +-----------------------------+
|    USER ACTION                 |      |    1. Dispatch an Action    |
|  (e.g., changes color in      |----->|  dispatch({                |
|       the Inspector)           |      |    type: 'STYLE',           |
+--------------------------------+      |    payload: { ... }        |
                                        |  })                        |
                                        +-------------^---------------+
                                                      |
                                                      |
+--------------------------------+                    |
| 5. React detects state change  |      +-------------v---------------+
|    and re-renders components   |<-----|    2. canvasReducer.js      |
|                                |      |  receives state and action, |
|  - CanvasComponent updates style|      |  and returns a *NEW* state  |
|  - CodePanel updates CSS view  |      +-------------^---------------+
+--------------------------------+                    |
                                                      |
                                        +-------------v---------------+
                                        |    3. setCanvasState in App.js |
                                        |       is called, updating the |
                                        |       'single source of truth'|
                                        +-------------^---------------+
                                                      |
+--------------------------------+                    |
| 4. Components read the *NEW* |                    |
|    canvasState from Context    |--------------------+
+--------------------------------+
Flow Summary:

User Action: A user picks a new color in the InspectorPanel.
Dispatch Action: The InspectorPanel does not modify anything directly. It calls the dispatch function (obtained from CanvasContext) and passes an object describing the user's intent, e.g., dispatch({ type: 'STYLE', payload: { nodeId: 'text-456', style: { color: '#FF0000' } } }).
Reducer Processes: The canvasReducer receives this action. Based on action.type ('STYLE'), it runs the corresponding logic (using findAndUpdateNode to find element text-456 and update its color) and returns a brand new canvasState object.
State Update: The useReducer hook in App.js receives the new canvasState and updates the application's top-level state.
Re-render: React detects the state change and automatically re-renders all components that depend on canvasState. The CanvasComponent will show the new text color, and the CodePanel will generate the updated CSS code.
