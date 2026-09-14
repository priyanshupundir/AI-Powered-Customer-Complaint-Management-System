"""
Database initialization script for AI-Powered Customer Complaint Management System
This script creates the database tables and sets up the initial schema.
"""

import sys
import os

# Add the current directory to the path so we can import from app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base, SessionLocal
from app.models.complaint import Complaint, RiskAssessment, ChatHistory, Document


def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")


def drop_tables():
    """Drop all database tables (use with caution!)."""
    print("Warning: This will drop all existing tables!")
    confirm = input("Are you sure you want to drop all tables? (yes/no): ")
    
    if confirm.lower() == 'yes':
        print("Dropping database tables...")
        Base.metadata.drop_all(bind=engine)
        print("✓ Database tables dropped successfully!")
    else:
        print("Operation cancelled.")


def verify_tables():
    """Verify that all tables exist."""
    print("Verifying database tables...")
    db = SessionLocal()
    
    try:
        # Check if tables exist by querying them
        tables_to_check = [
            (Complaint, "complaints"),
            (RiskAssessment, "risk_assessments"),
            (ChatHistory, "chat_history"),
            (Document, "documents")
        ]
        
        all_exist = True
        for model, table_name in tables_to_check:
            try:
                db.query(model).limit(1).all()
                print(f"✓ Table '{table_name}' exists")
            except Exception as e:
                print(f"✗ Table '{table_name}' does not exist or has issues: {e}")
                all_exist = False
        
        if all_exist:
            print("\n✓ All database tables are properly set up!")
        else:
            print("\n✗ Some tables are missing or have issues.")
            return False
        
        return True
    finally:
        db.close()


def main():
    """Main function to run database operations."""
    print("=" * 60)
    print("AI-Powered Customer Complaint Management System")
    print("Database Initialization Script")
    print("=" * 60)
    print()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "create":
            create_tables()
        elif command == "drop":
            drop_tables()
        elif command == "verify":
            verify_tables()
        elif command == "recreate":
            drop_tables()
            create_tables()
            verify_tables()
        else:
            print(f"Unknown command: {command}")
            print("Available commands: create, drop, verify, recreate")
    else:
        print("No command specified.")
        print("Usage: python init_db.py [command]")
        print("Commands:")
        print("  create   - Create all database tables")
        print("  drop     - Drop all database tables (use with caution)")
        print("  verify   - Verify that all tables exist")
        print("  recreate - Drop and recreate all tables")
        print()
        
        # Interactive mode
        print("Running in interactive mode...")
        print()
        
        choice = input("Do you want to create the database tables? (yes/no): ")
        if choice.lower() == 'yes':
            create_tables()
            verify_tables()
        else:
            print("Operation cancelled.")


if __name__ == "__main__":
    main()