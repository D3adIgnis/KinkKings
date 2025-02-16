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

# Define correct column names based on your CSV
required_columns = [
    "Product Title", "MSRP", "Image 1", "SKU", "Current Inventory Stock", "Category", "Body HTML",
    "Image 1", "Image 2", "Image 3", "Image 4", "Image 5", "Image 6", "Image 7", "Image 8", "Image 9", "Image 10"
]

# Read CSV in chunks and upload to Firestore
for chunk in pd.read_csv(csv_file, chunksize=chunk_size, usecols=required_columns):
    for _, row in chunk.iterrows():
        # Collect all image links (if they exist)
        images = [str(row[col]) for col in ["Image 1", "Image 2", "Image 3", "Image 4", "Image 5",
                                            "Image 6", "Image 7", "Image 8", "Image 9", "Image 10"]
                  if pd.notna(row[col])]

        product_data = {
            "title": str(row["Product Title"]),
            "price": float(row["MSRP"]) if pd.notna(row["MSRP"]) else 0.0,
            "images": images,  # Store all images in an array
            "sku": str(row["SKU"]),
            "stock": int(row["Current Inventory Stock"]) if pd.notna(row["Current Inventory Stock"]) else 0,
            "category": str(row["Category"]),
            "description": str(row["Body HTML"]) if pd.notna(row["Body HTML"]) else ""
        }

        # Upload product to Firestore
        db.collection("products").add(product_data)

print("✅ Inventory uploaded to Firebase successfully!")
