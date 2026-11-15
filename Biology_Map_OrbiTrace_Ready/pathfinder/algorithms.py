from collections import deque
import heapq, math, time

def reconstruct(parent, start, goal):
    if start == goal: return [start]
    if goal not in parent: return []
    path, cur = [goal], goal
    while cur != start:
        cur = parent[cur]
        path.append(cur)
    return path[::-1]

def heuristic(a, b, nodes):
    p, q = nodes[a], nodes[b]
    return math.hypot(p["lat"]-q["lat"], p["lng"]-q["lng"]) * 111

def run_algorithm(name, graph, nodes, start, goal):
    t0 = time.perf_counter()
    visited_order, parent = [], {}
    cost = 0.0
    if name == "BFS":
        q, seen = deque([start]), {start}
        while q:
            u=q.popleft(); visited_order.append(u)
            if u==goal: break
            for v in graph[u]:
                if v not in seen: seen.add(v); parent[v]=u; q.append(v)
    elif name == "DFS":
        stack, seen = [start], {start}
        while stack:
            u=stack.pop()
            if u in visited_order: continue
            visited_order.append(u)
            if u==goal: break
            for v in reversed(list(graph[u])):
                if v not in seen: seen.add(v); parent[v]=u; stack.append(v)
    else:
        dist={start:0.0}; heap=[(heuristic(start,goal,nodes) if name=="A*" else 0,start)]
        closed=set()
        while heap:
            _,u=heapq.heappop(heap)
            if u in closed: continue
            closed.add(u); visited_order.append(u)
            if u==goal: break
            for v,w in graph[u].items():
                nd=dist[u]+w
                if nd<dist.get(v,float("inf")):
                    dist[v]=nd; parent[v]=u
                    priority=nd+(heuristic(v,goal,nodes) if name=="A*" else 0)
                    heapq.heappush(heap,(priority,v))
        cost=dist.get(goal,float("inf"))
    path=reconstruct(parent,start,goal)
    if path and name in ("BFS","DFS"):
        cost=sum(graph[a][b] for a,b in zip(path,path[1:]))
    elapsed=(time.perf_counter()-t0)*1000
    return {"algorithm":name,"path":path,"cost":round(cost,3) if path else None,
            "visited":visited_order,"visited_count":len(visited_order),
            "execution_ms":round(elapsed,4),"found":bool(path)}
