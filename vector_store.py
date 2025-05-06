import faiss
import numpy as np
from typing import List, Dict, Tuple
import pickle
from datetime import datetime

class VectorStore:
    def __init__(self):
        self.dimension = 1536  # OpenAI embedding dimension
        self.index = faiss.IndexFlatL2(self.dimension)
        self.documents: Dict[str, Dict] = {}
        
    def add_document(self, doc_id: str, embedding: List[float], metadata: Dict):
        if not self.documents:
            self.documents = {}
            
        vector = np.array([embedding]).astype('float32')
        self.index.add(vector)
        self.documents[doc_id] = {
            'metadata': metadata,
            'index': len(self.documents)
        }
        
    def search(self, query_embedding: List[float], k: int = 3) -> List[Tuple[str, float]]:
        if not self.documents:
            return []
            
        query_vector = np.array([query_embedding]).astype('float32')
        distances, indices = self.index.search(query_vector, k)
        
        results = []
        for idx, distance in zip(indices[0], distances[0]):
            doc_id = [k for k, v in self.documents.items() if v['index'] == idx][0]
            results.append((doc_id, float(distance)))
            
        return results

    def save(self, filepath: str):
        with open(filepath, 'wb') as f:
            pickle.dump({'index': self.index, 'documents': self.documents}, f)
            
    def load(self, filepath: str):
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            self.index = data['index']
            self.documents = data['documents']
