import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    columns_to_add = [
        ("donor_request", "is_manual", "BOOLEAN DEFAULT TRUE"),
        ("users", "dob", "VARCHAR(255)"),
        ("users", "gender", "VARCHAR(255)"),
        ("users", "weight", "VARCHAR(255)"),
        ("users", "address", "VARCHAR(255)"),
        ("users", "email_notify", "BOOLEAN DEFAULT TRUE"),
        ("users", "wa_notify", "BOOLEAN DEFAULT FALSE"),
        ("users", "public_profile", "BOOLEAN DEFAULT TRUE")
    ]

    for table_name, column_name, definition in columns_to_add:
        with engine.begin() as transaction:
            try:
                transaction.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {column_name} {definition};"))
                print(f"Successfully added {column_name} to {table_name}.")
            except Exception as e:
                print(f"Skipped {table_name}.{column_name} or error occurred:", e)
