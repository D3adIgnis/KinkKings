import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd

# Load Firebase Key from GitHub Secret
firebase_key_json = os.getenv("FIREBASE_KEY")  # Read from GitHub Secrets
firebase_cred = json.loads(firebase_key_json)

# Initialize Firebase
cred = credentials.Certificate(firebase_cred)
firebase_admin.initialize_app(cred)
db = firestore.client()

# Define CSV file
csv_file = "inventory.csv"

# Read CSV in chunks to prevent memory overload
chunk_size = 500  # Process 500 rows at a time
batch_size = 500  # Upload 500 products at a time

# Required columns (Ensure these exist in the CSV)
required_columns = ["Product Title", "Image 1", "Category", "SKU", "Current Inventory", "Price"]

# Process CSV in chunks
for chunk in pd.read_csv(csv_file, chunksize=chunk_size, usecols=required_columns):
    
    batch = db.batch()  # Create a Firestore batch

    for index, row in chunk.iterrows():
        product_data = {
            "title": row["Product Title"],
            "image": row["Image 1"],
            "category": row["Category"],
            "sku": row["SKU"],
            "stock": int(row["Current Inventory"]),
            "price": str(row["Price"])
        }

        doc_ref = db.collection("products").document(str(row["SKU"]))
        batch.set(doc_ref, product_data)

        # Commit batch every 500 records
        if (index + 1) % batch_size == 0:
            batch.commit()
            batch = db.batch()

    # Commit remaining records in batch
    batch.commit()

print("🔥 Inventory successfully updated in Firebase in chunks!")

