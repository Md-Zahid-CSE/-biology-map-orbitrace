# OrbiTrace — Dhaka Network Pathfinding Visualizer

**Live Demo:** [https://biomap-wub.onrender.com](https://biomap-wub.onrender.com)

OrbiTrace is an interactive web-based pathfinding and route visualization application built with **Django** and **Google Maps JavaScript API**. It allows users to compare classic graph-search algorithms across a 15-node network in Dhaka, Bangladesh.

---

## Features

* **Interactive Map Visualization:** Built on Google Maps JavaScript API with custom node markers across 15 key locations in Dhaka (e.g., Uttara, Mirpur, Mohakhali, Tejgaon, Dhanmondi, Jatrabari).
* **Four Graph-Search Algorithms:**
  * **BFS (Breadth-First Search):** Explores equally in all directions to find the path with the fewest edges.
  * **DFS (Depth-First Search):** Explores as far as possible along each branch before backtracking.
  * **Dijkstra's Algorithm:** Calculates the shortest weighted path between the source and destination nodes.
  * **A\* (A-Star) Search:** Uses heuristic distance estimation for optimal and fast pathfinding.
* **Algorithm Comparison:** Displays execution results, path geometry, and performance metrics for the selected route.
* **Dual Node Selection:** Select source and destination points either by clicking directly on map markers or using the dropdown menus.

---

## Tech Stack

* **Backend:** Python 3.13, Django
* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Mapping & API:** Google Maps JavaScript API
* **Deployment & Static Files:** Render, Gunicorn, WhiteNoise

---

## Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Md-Zahid-CSE/-biology-map-orbitrace.git](https://github.com/Md-Zahid-CSE/-biology-map-orbitrace.git)
   cd -biology-map-orbitrace/Biology_Map_OrbiTrace_Ready
