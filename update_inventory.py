import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import json

# Load Firebase Admin SDK credentials
cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load CSV file
csv_file = "Inventory.csv"
chunk_size = 500  # Firestore has a limit, so we upload in chunks

# Define required columns (modify based on CSV structure)
required_columns = ["title", "price", "image", "sku", "stock", "category"]

# Read CSV in chunks and upload to Firestore
for chunk in pd.read_csv(csv_file, chunksize=chunk_size, usecols=required_columns):
    for _, row in chunk.iterrows():
        product_data = {
            "title": str(row["title"]),
            "price": float(row["price"]),
            "image": str(row["image"]),
            "sku": str(row["sku"]),
            "stock": int(row["stock"]),
            "category": str(row["category"])
        }
        # Upload product to Firestore
        db.collection("products").add(product_data)

print("✅ Inventory uploaded to Firebase successfully!")
