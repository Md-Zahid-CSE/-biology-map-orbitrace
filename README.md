# OrbiTrace — Dhaka Network Pathfinding & Route Visualization Engine

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://biomap-wub.onrender.com)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-Backend-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Google Maps API](https://img.shields.io/badge/Google_Maps-JS_API-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)

**Live Application:** [https://biomap-wub.onrender.com](https://biomap-wub.onrender.com)

**OrbiTrace** is an interactive web-based graph-search and route visualization platform engineered with **Django** and **Google Maps JavaScript API**. It models a 15-node urban transportation network across Dhaka, Bangladesh, enabling real-time execution, path rendering, and algorithmic efficiency comparisons across four foundational pathfinding algorithms.

---

## System Architecture & Workflow Flowchart

```mermaid
flowchart TD
    A[User Opens Web Interface] --> B[Load Dhaka 15-Node Graph & Google Maps JS API]
    B --> C{Node Selection Method}
    C -->|Click Map Marker| D[Set Source & Destination Nodes]
    C -->|Dropdown Menu| D
    D --> E[Select Algorithm: BFS / DFS / Dijkstra / A*]
    E --> F[Click 'Run Selected Algorithm']
    F --> G[Send Async POST Request to /api/compare/]
    G --> H[Django Backend Graph Engine]
    H --> I{Algorithm Router}
    I -->|Unweighted| J1[BFS / DFS Traversal]
    I -->|Weighted| J2[Dijkstra / A* Heuristic Search]
    J1 --> K[Compute Optimal Path, Distance & Visited Nodes]
    J2 --> K
    K --> L[Return JSON Payload to Frontend]
    L --> M[Render Polyline Route & Performance Metrics on Map]
