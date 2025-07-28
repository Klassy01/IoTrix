#!/usr/bin/env python3
"""
Database migration script to add session_id column to chat_messages table.
Run this script to fix the database schema.
"""

import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def migrate_database():
    """Add session_id column to chat_messages table if it doesn't exist."""
    
    # Parse database URL
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL not found in environment variables")
        return False
    
    try:
        # Connect to database
        conn = psycopg2.connect(database_url.replace('postgresql+psycopg2://', 'postgresql://'))
        cursor = conn.cursor()
        
        # Check if session_id column exists
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='chat_messages' AND column_name='session_id';
        """)
        
        if cursor.fetchone():
            print("✅ session_id column already exists")
            return True
        
        # Add session_id column
        cursor.execute("""
            ALTER TABLE chat_messages 
            ADD COLUMN session_id VARCHAR;
        """)
        
        # Update existing records with a default session_id
        cursor.execute("""
            UPDATE chat_messages 
            SET session_id = 'default-session' 
            WHERE session_id IS NULL;
        """)
        
        conn.commit()
        print("✅ Successfully added session_id column to chat_messages table")
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    finally:
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("🔄 Running database migration...")
    if migrate_database():
        print("🎉 Migration completed successfully!")
    else:
        print("💥 Migration failed!")
