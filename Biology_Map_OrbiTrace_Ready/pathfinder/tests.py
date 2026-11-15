from django.test import TestCase
from .graph import NODES, build_graph
from .algorithms import run_algorithm
class AlgorithmSmokeTests(TestCase):
    def test_all_algorithms_find_path(self):
        graph=build_graph()
        for algorithm in ("BFS","DFS","Dijkstra","A*"):
            result=run_algorithm(algorithm,graph,NODES,"n1","n15")
            self.assertTrue(result["found"],algorithm)
            self.assertEqual(result["path"][0],"n1")
            self.assertEqual(result["path"][-1],"n15")
