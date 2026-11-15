# Biology Map — OrbiTrace
Academic project: Pathfinding with Django & Google Maps API.

## Features
- Manually defined 15-node weighted graph
- BFS, DFS, Dijkstra and A* in one comparison run
- Start/destination selection from map clicks or dropdowns
- Four result cards: path, cost, visited nodes and execution time
- Four colored paths on Google Maps
- Google DirectionsService renders each graph edge along road geometry (where roads/access permit)

## Setup (Windows PowerShell)
```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:GOOGLE_MAPS_API_KEY="YOUR_API_KEY"
python manage.py runserver
```
Open http://127.0.0.1:8000/

Enable **Maps JavaScript API** and **Directions API** in Google Cloud; attach billing and restrict the key by HTTP referrer. Keep the key out of source control.

## Academic note
Algorithms operate on the manually modeled graph and its edge weights. DirectionsService is used only to draw each chosen graph edge along available roads; it does not replace BFS/DFS/Dijkstra/A*. If a graph edge cannot be routed by road, the interface falls back to a straight segment for that edge.
