# OrbiTrace — Geospatial Graph-Search & Route Visualization Engine

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://biomap-wub.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-Web_Framework-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Google Maps API](https://img.shields.io/badge/Google_Maps-JS_API-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Live Production URL:** [https://biomap-wub.onrender.com](https://biomap-wub.onrender.com)

---

## 1. Project Overview & Problem Statement

### Background
In Computer Science, graph-search algorithms (such as BFS, DFS, Dijkstra, and A*) are typically taught using abstract 2D grids or static textbook diagrams. While effective for basic understanding, abstract grids fail to demonstrate how these algorithms behave when applied to real-world urban road networks with irregular node distributions, varying geographic distances, and directional constraints.

### Solution: OrbiTrace
**OrbiTrace** bridges the gap between theoretical graph algorithms and real-world Geographic Information Systems (GIS). Engineered with **Django** and **Google Maps JavaScript API**, OrbiTrace models a connected **15-node urban network across Dhaka, Bangladesh**. Users can select any source and destination hub, execute different pathfinding algorithms in real time, visualize the computed route geometry directly on the map, and analyze comparative performance metrics such as path distance, hop count, and node exploration efficiency.

### Core Objectives
* **Visual Learning & Experimentation:** Provide an interactive sandbox to observe how informed vs. uninformed search algorithms traverse identical road networks.
* **Geospatial Accuracy:** Map graph vertices to real latitude/longitude coordinates across major Dhaka landmarks (e.g., Uttara, Mirpur, Mohakhali, Tejgaon, Dhanmondi, Motijheel, Jatrabari).
* **Algorithmic Benchmarking:** Quantify trade-offs between execution exploration overhead (visited nodes) and path optimality (total distance in kilometers).

---

## 2. System Architecture & Data Flow

OrbiTrace follows a decoupled **Client-Server Architecture** where the frontend handles geospatial rendering and user interaction, while the Django backend executes graph traversal computations via a RESTful JSON API.

### End-to-End Execution Flowchart

```mermaid
flowchart TD
    A[User Loads Application] --> B[Django Serves HTML/CSS/JS via WhiteNoise]
    B --> C[Initialize Google Maps JS API & Plot 15 Dhaka Nodes]
    C --> D{User Selects Source & Destination}
    D -->|Direct Map Click| E[Update Active Markers & Sync Dropdowns]
    D -->|Dropdown Selection| E
    E --> F[Choose Algorithm: BFS / DFS / Dijkstra / A*]
    F --> G[Trigger 'Run Selected Algorithm']
    G --> H[Frontend Sends POST JSON to /api/compare/]
    H --> I[Django Backend Graph Engine]
    I --> J{Select Traversal Strategy}
    J -->|Uninformed Search| K1[BFS Queue / DFS Stack]
    J -->|Informed & Weighted Search| K2[Dijkstra Priority Queue / A* Heuristic]
    K1 --> L[Reconstruct Path & Compute Metrics]
    K2 --> L
    L --> M[Serialize Result as JSON Response]
    M --> N[Frontend Renders Polyline & Displays Analytics Card]
