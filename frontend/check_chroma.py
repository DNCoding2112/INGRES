
    # check_chroma.py

import chromadb

print("Attempting to connect to ChromaDB Cloud...")

try:
    # --- Your connection details are correct ---
    client = chromadb.CloudClient(
      tenant="ae422228-180d-485f-bb0b-c0ee70f9d01f",
      database="ingres_database",
      api_key="ck-1FPmSnxdKoQrRYje8CcRKBe5tmTLVNievVqFMBRtjiW"
    )

    # We know this collection ID for Maharashtra is correct now.
    collection_id = "d1e45269-28db-4019-bf84-10e7d8a58001"
    print(f"Successfully connected. Now getting collection: {collection_id}")

    collection = client.get_collection(collection_id)

    # Get the first 5 items from the collection to inspect them
    print("Collection found. Now retrieving the first 5 documents...")
    results = collection.get(
        limit=5,
        include=["documents", "metadatas"] # This will show us the text content
    )

    print("\n--- INSPECTION RESULTS ---")
    print("This is the critical part. Let's see if the 'documents' field has text.")
    print("Content of 'documents':")
    print(results['documents'])
    print("--------------------------\n")

except Exception as e:
    print(f"An error occurred: {e}")