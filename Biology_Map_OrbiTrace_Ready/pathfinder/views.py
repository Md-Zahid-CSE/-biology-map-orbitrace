import json
from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from .graph import NODES, build_graph
from .algorithms import run_algorithm

def home(request):
    return render(request, "pathfinder/index.html", {
        "google_maps_key": settings.GOOGLE_MAPS_API_KEY,
        "nodes_json": json.dumps(NODES),
    })

@require_POST
def compare_paths(request):
    try:
        body=json.loads(request.body or "{}")
        start,goal=body.get("start"),body.get("goal")
        if start not in NODES or goal not in NODES:
            return JsonResponse({"error":"Choose valid source and destination nodes."},status=400)
        graph=build_graph()
        results=[run_algorithm(a,graph,NODES,start,goal) for a in ("BFS","DFS","Dijkstra","A*")]
        selected=body.get("algorithm","BFS")
        if selected not in ("BFS","DFS","Dijkstra","A*"):
            return JsonResponse({"error":"Choose a valid algorithm."},status=400)
        return JsonResponse({"start":start,"goal":goal,"nodes":NODES,"selected":selected,"results":results})
    except (json.JSONDecodeError,TypeError):
        return JsonResponse({"error":"Invalid request."},status=400)
