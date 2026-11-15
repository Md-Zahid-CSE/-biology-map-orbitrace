"""Small manually modeled weighted graph for the academic demonstration."""
# Nodes are illustrative points around Dhaka; edges represent simplified road links.
NODES = {
    "n1":  {"name": "Uttara", "lat": 23.8759, "lng": 90.3795},
    "n2":  {"name": "Airport", "lat": 23.8510, "lng": 90.4080},
    "n3":  {"name": "Khilkhet", "lat": 23.8278, "lng": 90.4250},
    "n4":  {"name": "Banani", "lat": 23.7937, "lng": 90.4066},
    "n5":  {"name": "Gulshan", "lat": 23.7925, "lng": 90.4150},
    "n6":  {"name": "Mohakhali", "lat": 23.7806, "lng": 90.4120},
    "n7":  {"name": "Tejgaon", "lat": 23.7639, "lng": 90.4000},
    "n8":  {"name": "Farmgate", "lat": 23.7578, "lng": 90.3890},
    "n9":  {"name": "Shahbag", "lat": 23.7389, "lng": 90.3950},
    "n10": {"name": "Karwan Bazar", "lat": 23.7500, "lng": 90.3960},
    "n11": {"name": "Motijheel", "lat": 23.7330, "lng": 90.4170},
    "n12": {"name": "Paltan", "lat": 23.7360, "lng": 90.4120},
    "n13": {"name": "Lalbagh", "lat": 23.7180, "lng": 90.3880},
    "n14": {"name": "Dhanmondi", "lat": 23.7465, "lng": 90.3760},
    "n15": {"name": "Jatrabari", "lat": 23.7104, "lng": 90.4350},
}
# Undirected links with illustrative distance weights (km-like units).
EDGES = [
    ("n1","n2",4.2),("n2","n3",3.5),("n2","n4",7.0),("n3","n4",4.1),
    ("n3","n5",3.8),("n4","n5",1.4),("n4","n6",2.5),("n5","n6",2.0),
    ("n6","n7",3.0),("n7","n8",1.8),("n8","n9",2.4),("n8","n10",1.5),
    ("n9","n10",1.2),("n9","n11",3.4),("n9","n12",2.6),("n9","n14",2.8),
    ("n10","n12",2.0),("n11","n12",1.0),("n11","n15",4.0),
    ("n12","n13",3.2),("n13","n14",3.0),("n13","n15",4.5),("n14","n8",3.5),
]
def build_graph():
    graph = {node: {} for node in NODES}
    for a,b,w in EDGES:
        graph[a][b] = w
        graph[b][a] = w
    return graph
