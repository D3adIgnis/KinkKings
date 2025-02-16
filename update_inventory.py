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
chunk_size = 500  # Firestore limits, so we upload in chunks

# Define correct column names based on your CSV
expected_columns = [
    "Product Title", "MSRP", "SKU", "Category", "Current Inventory Stock", "Body HTML",
    "Image 1", "Image 2", "Image 3", "Image 4", "Image 5",
    "Image 6", "Image 7", "Image 8", "Image 9", "Image 10"
]

# Check available columns in CSV
df_sample = pd.read_csv(csv_file, nrows=5)
actual_columns = df_sample.columns.tolist()
missing_columns = [col for col in expected_columns if col not in actual_columns]

if missing_columns:
    print(f"⚠️ Warning: Missing columns in CSV - {missing_columns}")
    print("❌ Upload failed! Fix column names in CSV or update script.")
    exit(1)

# Read CSV in chunks and upload to Firestore
for chunk in pd.read_csv(csv_file, chunksize=chunk_size, usecols=expected_columns):
    for _, row in chunk.iterrows():
        # Collect all available image links
        images = [str(row[col]) for col in expected_columns[6:] if pd.notna(row[col])]

        product_data = {
            "title": str(row["Product Title"]),
            "price": float(row["MSRP"]) if pd.notna(row["MSRP"]) else 0.0,
            "sku": str(row["SKU"]),
            "category": str(row["Category"]),
            "stock": int(row["Current Inventory Stock"]) if pd.notna(row["Current Inventory Stock"]) else 0,
            "description": str(row["Body HTML"]) if pd.notna(row["Body HTML"]) else "",
            "images": images  # Store all images in an array
        }

        # Upload product to Firestore
        db.collection("products").add(product_data)

print("✅ Inventory successfully uploaded to Firebase!")
