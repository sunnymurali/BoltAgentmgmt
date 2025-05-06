from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv
import openai
from models import AgentCreate, Agent, ChatRequest, ChatResponse, Document
from vector_store import VectorStore

load_dotenv()

app = FastAPI()
vector_store = VectorStore()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (in production, use a proper database)
agents = {}
chats = {}
documents = {}

def get_openai_client():
    client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return client

@app.post("/agents", response_model=Agent)
async def create_agent(agent: AgentCreate):
    agent_id = str(uuid.uuid4())
    new_agent = Agent(
        id=agent_id,
        created_at=datetime.now(),
        **agent.dict()
    )
    agents[agent_id] = new_agent
    return new_agent

@app.get("/agents", response_model=List[Agent])
async def get_agents():
    return list(agents.values())

@app.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str):
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    del agents[agent_id]
    # Clean up related documents and chats
    documents = {k: v for k, v in documents.items() if v.agent_id != agent_id}
    return {"message": "Agent deleted successfully"}

@app.post("/documents/{agent_id}")
async def upload_document(
    agent_id: str,
    file: UploadFile = File(...),
    openai_client: openai.OpenAI = Depends(get_openai_client)
):
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
        
    content = await file.read()
    content_text = content.decode()
    
    # Get embedding for document
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=content_text
    )
    embedding = response.data[0].embedding
    
    doc_id = str(uuid.uuid4())
    document = Document(
        id=doc_id,
        name=file.filename,
        content=content_text,
        agent_id=agent_id,
        embedding=embedding,
        created_at=datetime.now()
    )
    
    # Store document and its embedding
    documents[doc_id] = document
    vector_store.add_document(
        doc_id=doc_id,
        embedding=embedding,
        metadata={"agent_id": agent_id, "name": file.filename}
    )
    
    return {"message": "Document uploaded and indexed successfully", "document_id": doc_id}

@app.post("/chat/{agent_id}", response_model=ChatResponse)
async def chat_with_agent(
    agent_id: str,
    chat_request: ChatRequest,
    openai_client: openai.OpenAI = Depends(get_openai_client)
):
    if agent_id not in agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = agents[agent_id]
    messages = [{"role": "system", "content": agent.system_prompt}]
    
    if chat_request.use_context:
        # Get embedding for the query
        query_response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=chat_request.message
        )
        query_embedding = query_response.data[0].embedding
        
        # Search for relevant documents
        relevant_docs = vector_store.search(query_embedding)
        context = ""
        for doc_id, _ in relevant_docs:
            if doc_id in documents:
                context += f"\nDocument: {documents[doc_id].content}"
        
        if context:
            messages.append({
                "role": "system",
                "content": f"Here is some relevant context: {context}"
            })
    
    messages.append({"role": "user", "content": chat_request.message})
    
    # Get response from OpenAI
    chat_completion = openai_client.chat.completions.create(
        model=agent.model,
        messages=messages
    )
    
    response = chat_completion.choices[0].message.content
    
    # Store chat history (in production, use a proper database)
    if agent_id not in chats:
        chats[agent_id] = []
    chats[agent_id].append({
        "role": "user",
        "content": chat_request.message,
        "timestamp": datetime.now()
    })
    chats[agent_id].append({
        "role": "assistant",
        "content": response,
        "timestamp": datetime.now()
    })
    
    return ChatResponse(
        message=response,
        agent_id=agent_id,
        timestamp=datetime.now()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
