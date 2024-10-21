from langchain.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader

loaders = [PyPDFLoader('./GAMES - Retrospective Practice.pdf')] # add more pdfs

docs = []

for file in loaders:
    docs.extend(file.load())

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
docs = text_splitter.split_documents(docs)
embeddings_function = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': 'cpu'})

vectorstore = Chroma.from_documents(docs, embeddings_function, persist_directory="./chroma_db_nccn")

print(vectorstore._collection.count()) # prints the number of embeddings